
const pool = require('../config/db');

// @desc    Get the list of linked students for the logged-in parent
const getLinkedStudents = async (req, res) => {
    try {
        const parentId = req.user.id;
        const [students] = await pool.query(`
            SELECT 
                u.id, p.full_name, p.profile_image_url, p.spiritual_class,
                p.service_status,
                (SELECT COALESCE(AVG(score), 0.0) FROM student_scores WHERE user_id = u.id) AS overallGrade,
                (SELECT 
                    CASE 
                        WHEN COUNT(*) = 0 THEN 100.0 
                        ELSE (COUNT(CASE WHEN status != 'absent' THEN 1 END) * 100.0 / COUNT(*))
                    END
                 FROM attendance 
                 WHERE user_id = u.id) AS attendancePercentage,
                (SELECT COUNT(*) FROM service_assignments sa WHERE sa.user_id = u.id AND sa.is_active = 1 LIMIT 1) AS isSelectedForService,
                (SELECT dt.topic 
                 FROM attendance a 
                 JOIN daily_topics dt ON a.attendance_date = dt.date 
                    AND a.session = dt.session
                 WHERE a.user_id = u.id 
                 ORDER BY a.attendance_date DESC LIMIT 1) as lastTopic
            FROM family_links fl
            JOIN users u ON fl.student_user_id = u.id
            JOIN profiles p ON u.id = p.user_id
            WHERE fl.parent_user_id = ?`, [parentId]);
        res.status(200).json({ success: true, data: students });
    } catch (error) {
        console.error("Error in getLinkedStudents:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Get detailed dashboard data for a specific student
const getStudentDetails = async (req, res) => {
    try {
        const { studentId } = req.params;

        const [profileRows] = await pool.query(
            "SELECT * FROM profiles WHERE user_id = ?",
            [studentId]
        );

        if (profileRows.length === 0) {
            return res.status(404).json({ success: false, message: "Student not found." });
        }
        const studentProfile = profileRows[0];

        // ======================= THE FIX =======================
        // The query for 'gradeHistory' now correctly JOINS student_scores with the courses table.
        const [
            [recommendedBooks],
            [attendanceHistory],
            [gradeHistory]
        ] = await Promise.all([
            pool.query("SELECT id, title, COALESCE(deadline, CURDATE()) as deadline, is_read FROM recommended_books WHERE student_user_id = ? ORDER BY deadline", [studentId]),
            pool.query(`
                SELECT 
                    a.id, a.user_id, COALESCE(a.attendance_date, CURDATE()) as attendance_date, 
                    a.session, a.status, a.attendance_type, a.late_time, 
                    dt.topic
                FROM attendance a
                LEFT JOIN daily_topics dt ON a.attendance_date = dt.date AND a.session = dt.session
                WHERE a.user_id = ? 
                ORDER BY a.attendance_date DESC`, [studentId]),

            // This query now joins the tables to get the course_name
            pool.query(`
                SELECT 
                    ss.academic_year, 
                    p.spiritual_class,
                    c.course_name,
                    SUM(ss.score) as total 
                FROM student_scores ss
                JOIN courses c ON ss.course_id = c.id
                JOIN profiles p ON ss.user_id = p.user_id
                WHERE ss.user_id = ?
                GROUP BY ss.academic_year, p.spiritual_class, c.course_name
                ORDER BY ss.academic_year
            `, [studentId])
        ]);
        // =======================================================

        // Group gradeHistory into the structure expected by the frontend
        const groupedGrades = [];
        const groupMap = {};

        gradeHistory.forEach(row => {
            const key = `${row.spiritual_class} - ${row.academic_year}`;
            if (!groupMap[key]) {
                groupMap[key] = {
                    spiritual_class: row.spiritual_class,
                    academic_year: row.academic_year,
                    grades: [],
                    totalScore: 0,
                    courseCount: 0
                };
                groupedGrades.push(groupMap[key]);
            }
            groupMap[key].grades.push({
                course_name: row.course_name,
                total: row.total
            });
            groupMap[key].totalScore += row.total;
            groupMap[key].courseCount += 1;
        });

        // Calculate averages for each group
        groupedGrades.forEach(group => {
            group.average = group.courseCount > 0 ? (group.totalScore / group.courseCount) : 0;
        });

        const responseData = {
            ...studentProfile,
            recommendedBooks,
            attendanceHistory,
            gradeHistory: groupedGrades
        };

        res.status(200).json({ success: true, data: responseData });

    } catch (error) {
        console.error("Error in getStudentDetails:", error);
        res.status(500).json({ success: false, message: "Server error while fetching student data." });
    }
};

// @desc    Toggle the is_read status of a recommended book
const toggleBookStatus = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { isRead } = req.body;
        await pool.query("UPDATE recommended_books SET is_read = ? WHERE id = ?", [isRead, bookId]);
        res.status(200).json({ success: true, message: "Book status updated." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};


// --- ADMIN FUNCTIONS ---
const getAllFamilyLinks = async (req, res) => {
    try {
        const [links] = await pool.query(`
            SELECT fl.id, p_parent.full_name AS parent_name, p_student.full_name AS student_name
            FROM family_links fl
            JOIN profiles p_parent ON fl.parent_user_id = p_parent.user_id
            JOIN profiles p_student ON fl.student_user_id = p_student.user_id
            ORDER BY parent_name, student_name
        `);
        res.status(200).json({ success: true, data: links });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const createFamilyLink = async (req, res) => {
    try {
        const { parent_user_id, student_user_id } = req.body;
        if (!parent_user_id || !student_user_id) {
            return res.status(400).json({ success: false, message: "Parent and student IDs are required." });
        }
        const [result] = await pool.query("INSERT INTO family_links (parent_user_id, student_user_id) VALUES (?, ?)", [parent_user_id, student_user_id]);
        res.status(201).json({ success: true, message: "Family link created.", data: { id: result.insertId } });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: "This family link already exists." });
        }
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const deleteFamilyLink = async (req, res) => {
    try {
        const { linkId } = req.params;
        const [result] = await pool.query("DELETE FROM family_links WHERE id = ?", [linkId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Link not found." });
        }
        res.status(200).json({ success: true, message: "Family link deleted." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

module.exports = {
    getLinkedStudents,
    getStudentDetails,
    toggleBookStatus,
    getAllFamilyLinks,
    createFamilyLink,
    deleteFamilyLink
};