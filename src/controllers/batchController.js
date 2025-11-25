const pool = require('../config/db');

// (The getNextSpiritualClass function remains the same)
const getNextSpiritualClass = (currentClass) => {
    const classes = [ '1ኛ ክፍል', '2ኛ ክፍል', '3ኛ ክፍል', '4ኛ ክፍል', '5ኛ ክፍል', '6ኛ ክፍል', '7ኛ ክፍል', '8ኛ ክፍል', '9ኛ ክፍል', '10ኛ ክፍል', '11ኛ ክፍል', '12ኛ ክፍል' ];
    const currentIndex = classes.indexOf(currentClass);
    if (currentIndex === -1 || currentIndex >= classes.length - 1) return null;
    return classes[currentIndex + 1];
};


// ======================= THE FIX =======================
// This query is now corrected. It finds all users in the tenant
// who do NOT have an 'is_active = TRUE' enrollment. This correctly
// includes new users and users who were removed from a batch.
// =======================================================
const getUnregisteredUsers = async (req, res) => {
    const tenantId = req.user.tenant_id;
    try {
        const [users] = await pool.query(`
            SELECT u.id, p.full_name, u.email 
            FROM users u
            JOIN profiles p ON u.id = p.user_id
            WHERE u.tenant_id = ? AND u.id NOT IN (
                SELECT user_id FROM batch_enrollments WHERE tenant_id = ? AND is_active = TRUE
            )
            ORDER BY p.full_name;
        `, [tenantId, tenantId]);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching unregistered users:", error);
        res.status(500).json({ message: "Server error." });
    }
};

// (registerStudentsToBatch and promoteStudents remain the same)
const registerStudentsToBatch = async (req, res) => {
    const { student_ids, class_name, academic_year } = req.body;
    const tenantId = req.user.tenant_id;
    if (!student_ids || !class_name || !academic_year) return res.status(400).json({ message: "Student IDs, class name, and year are required." });
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        for (const userId of student_ids) {
            await connection.query('UPDATE batch_enrollments SET is_active = FALSE WHERE user_id = ? AND tenant_id = ?', [userId, tenantId]);
            await connection.query(`INSERT INTO batch_enrollments (user_id, tenant_id, spiritual_class, academic_year, is_active) VALUES (?, ?, ?, ?, TRUE) ON DUPLICATE KEY UPDATE spiritual_class = VALUES(spiritual_class), academic_year = VALUES(academic_year), is_active = TRUE`, [userId, tenantId, class_name, academic_year]);
            await connection.query('UPDATE profiles SET spiritual_class = ? WHERE user_id = ?', [class_name, userId]);
        }
        await connection.commit();
        res.status(201).json({ message: `${student_ids.length} students registered successfully.` });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: "Server error." });
    } finally {
        connection.release();
    }
};
const promoteStudents = async (req, res) => {
    const { from_class, from_year, passing_score } = req.body;
    const tenantId = req.user.tenant_id;
    const nextClass = getNextSpiritualClass(from_class);
    const nextYear = from_year + 1;
    if (!nextClass) return res.status(400).json({ message: "This is the final class and cannot be promoted." });
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [enrolledStudents] = await connection.query('SELECT user_id FROM batch_enrollments WHERE tenant_id = ? AND spiritual_class = ? AND academic_year = ? AND is_active = TRUE', [tenantId, from_class, from_year]);
        const studentIds = enrolledStudents.map(s => s.user_id);
        if (studentIds.length === 0) {
            await connection.rollback();
            return res.status(200).json({ count: 0, message: "No active students found in the specified class." });
        }
        const passedStudentIds = [];
        for (const userId of studentIds) {
            const [scores] = await connection.query(`SELECT a.max_score, ss.score, c.id as course_id FROM student_scores ss JOIN assessments a ON ss.assessment_id = a.id JOIN courses c ON a.course_id = c.id WHERE ss.user_id = ? AND ss.academic_year = ?`, [userId, from_year]);
            if (scores.length === 0) continue;
            const coursesMap = new Map();
            for (const score of scores) {
                if (!coursesMap.has(score.course_id)) coursesMap.set(score.course_id, { total_score: 0, total_max_score: 0 });
                const courseData = coursesMap.get(score.course_id);
                courseData.total_score += parseFloat(score.score);
                courseData.total_max_score += score.max_score;
            }
            const courseAverages = [];
            for (const course of coursesMap.values()) {
                const percentage = course.total_max_score > 0 ? (course.total_score / course.total_max_score) * 100 : 0;
                courseAverages.push(percentage);
            }
            const overallAverage = courseAverages.length > 0 ? courseAverages.reduce((sum, avg) => sum + avg, 0) / courseAverages.length : 0;
            if (overallAverage >= passing_score) passedStudentIds.push(userId);
        }
        if (passedStudentIds.length === 0) {
            await connection.rollback();
            return res.status(200).json({ count: 0, message: "No students met the passing score criteria." });
        }
        for (const userId of passedStudentIds) {
            await connection.query('UPDATE batch_enrollments SET is_active = FALSE WHERE user_id = ? AND tenant_id = ? AND spiritual_class = ? AND academic_year = ?', [userId, tenantId, from_class, from_year]);
            await connection.query(`INSERT INTO batch_enrollments (user_id, tenant_id, spiritual_class, academic_year, is_active) VALUES (?, ?, ?, ?, TRUE) ON DUPLICATE KEY UPDATE is_active = TRUE`, [userId, tenantId, nextClass, nextYear]);
            await connection.query('UPDATE profiles SET spiritual_class = ? WHERE user_id = ?', [nextClass, userId]);
        }
        await connection.commit();
        res.status(200).json({ count: passedStudentIds.length, message: `${passedStudentIds.length} students promoted successfully to ${nextClass}.` });
    } catch (error) {
        await connection.rollback();
        console.error("Error promoting students:", error);
        res.status(500).json({ message: "Server error during promotion." });
    } finally {
        connection.release();
    }
};

// --- NEW FUNCTIONS FOR BATCH MANAGEMENT ---

// @desc    Get a summary of all active batches (class/year and student count)
// @route   GET /api/batch/summary
// @access  Private/Admin
const getBatchSummary = async (req, res) => {
    const tenantId = req.user.tenant_id;
    try {
        const [batches] = await pool.query(`
            SELECT spiritual_class, academic_year, COUNT(id) as student_count
            FROM batch_enrollments
            WHERE tenant_id = ? AND is_active = TRUE
            GROUP BY spiritual_class, academic_year
            ORDER BY academic_year DESC, spiritual_class ASC;
        `, [tenantId]);
        res.status(200).json(batches);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching batch summary." });
    }
};

// @desc    Get all students for a specific batch
// @route   GET /api/batch/students
// @access  Private/Admin
const getStudentsInBatch = async (req, res) => {
    const { spiritual_class, academic_year } = req.query;
    const tenantId = req.user.tenant_id;
    try {
        const [students] = await pool.query(`
            SELECT u.id, p.full_name
            FROM users u
            JOIN profiles p ON u.id = p.user_id
            JOIN batch_enrollments be ON u.id = be.user_id
            WHERE be.tenant_id = ? AND be.spiritual_class = ? AND be.academic_year = ? AND be.is_active = TRUE
            ORDER BY p.full_name;
        `, [tenantId, spiritual_class, academic_year]);
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching students." });
    }
};

// @desc    Remove students from their active batch (de-register)
// @route   POST /api/batch/remove
// @access  Private/Admin
const removeStudentsFromBatch = async (req, res) => {
    const { student_ids } = req.body;
    const tenantId = req.user.tenant_id;

    if (!student_ids || student_ids.length === 0) {
        return res.status(400).json({ message: "Student IDs are required." });
    }
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const placeholders = student_ids.map(() => '?').join(',');
        await connection.query(
            `UPDATE batch_enrollments SET is_active = FALSE WHERE user_id IN (${placeholders}) AND tenant_id = ?`,
            [...student_ids, tenantId]
        );
        await connection.commit();
        res.status(200).json({ message: "Students removed from their active batch successfully." });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: "Server error while removing students." });
    } finally {
        connection.release();
    }
};

module.exports = {
    getUnregisteredUsers,
    registerStudentsToBatch,
    promoteStudents,
    // --- NEW EXPORTS ---
    getBatchSummary,
    getStudentsInBatch,
    removeStudentsFromBatch,
};