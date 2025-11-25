
const pool = require('../config/db');

// @desc    Get the list of linked students for the logged-in parent
const getLinkedStudents = async (req, res) => {
    try {
        const parentId = req.user.id;
        const [students] = await pool.query(`
            SELECT 
                u.id, p.full_name, p.profile_image_url, p.spiritual_class,
                88.5 AS overallGrade, 95.0 AS attendancePercentage,
                (SELECT COUNT(*) > 0 FROM service_assignments sa WHERE sa.user_id = u.id AND sa.is_active = 1) AS isSelectedForService
            FROM family_links fl
            JOIN users u ON fl.student_user_id = u.id
            JOIN profiles p ON u.id = p.user_id
            WHERE fl.parent_user_id = ?
        `, [parentId]);
        res.status(200).json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Get detailed dashboard data for a specific student
const getStudentDetails = async (req, res) => {
    try {
        const { studentId } = req.params;

        const [profileRows] = await pool.query(
            "SELECT full_name, profile_image_url, spiritual_class FROM profiles WHERE user_id = ?", 
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
            pool.query("SELECT id, user_id, COALESCE(attendance_date, CURDATE()) as attendance_date, session, status, attendance_type, late_time FROM attendance WHERE user_id = ? ORDER BY attendance_date DESC", [studentId]),
            
            // This query now joins the tables to get the course_name
            pool.query(`
                SELECT 
                    ss.academic_year, 
                    c.course_name,
                    -- Aggregate scores for each course. NOTE: This is a simplified aggregation.
                    -- A more complex query would be needed to sum up individual assessment scores correctly.
                    SUM(ss.score) as total 
                FROM student_scores ss
                JOIN courses c ON ss.course_id = c.id
                WHERE ss.user_id = ?
                GROUP BY ss.academic_year, c.course_name
                ORDER BY ss.academic_year
            `, [studentId])
        ]);
        // =======================================================
        
        const responseData = {
            ...studentProfile,
            recommendedBooks,
            attendanceHistory,
            gradeHistory: gradeHistory 
        };

        res.status(200).json({ success: true, data: responseData });

    } catch (error) {
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