// src/controllers/gradeController.js

const pool = require('../config/db');

// =======================================================================
// This is the complete and final version of the gradeController.
// It includes full functionality for managing courses, assessments, and grades.
// The saveStudentScores function is now corrected to properly handle the
// incoming 'student_id' from the request body.
// =======================================================================


/**
 * @desc    Helper function to log audit trails for grade changes.
 */
const logAudit = async (connection, { tenant_id, admin_user_id, affected_user_id, action_type, action_description, previous_value, new_value }) => {
    const sql = `
        INSERT INTO audit_logs 
            (tenant_id, admin_user_id, affected_user_id, action_type, action_description, previous_value, new_value) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.query(sql, [tenant_id, admin_user_id, affected_user_id, action_type, action_description, previous_value, new_value]);
};

// --- Course Management ---
const getCourses = async (req, res) => {
    const { spiritual_class } = req.query;
    const tenantId = req.user.tenant_id;
    try {
        const [courses] = await pool.query(
            'SELECT id, course_name FROM courses WHERE tenant_id = ? AND spiritual_class = ? ORDER BY course_name',
            [tenantId, spiritual_class]
        );
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching courses.' });
    }
};

const addCourse = async (req, res) => {
    const { spiritual_class, course_name } = req.body;
    const tenantId = req.user.tenant_id;
    try {
        const [result] = await pool.query(
            'INSERT INTO courses (tenant_id, spiritual_class, course_name) VALUES (?, ?, ?)',
            [tenantId, spiritual_class, course_name]
        );
        res.status(201).json({ id: result.insertId, course_name: course_name, spiritual_class: spiritual_class });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Course already exists for this class.' });
        res.status(500).json({ message: 'Server error while adding course.' });
    }
};

const deleteCourse = async (req, res) => {
    const { course_id } = req.params;
    const tenantId = req.user.tenant_id;
    try {
        await pool.query('DELETE FROM courses WHERE id = ? AND tenant_id = ?', [course_id, tenantId]);
        res.status(200).json({ message: 'Course deleted successfully.' });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: 'Server error while deleting course.' });
    }
};


// --- Assessment Management ---
const getAssessmentsForCourse = async (req, res) => {
    const { course_id } = req.query;
    try {
        const [assessments] = await pool.query(
            'SELECT id, assessment_name, max_score FROM assessments WHERE course_id = ? ORDER BY id',
            [course_id]
        );
        res.status(200).json(assessments);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching assessments.' });
    }
};

const saveAssessmentsForCourse = async (req, res) => {
    const { course_id, assessments } = req.body;
    const tenantId = req.user.tenant_id;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [courseCheck] = await connection.query('SELECT id FROM courses WHERE id = ? AND tenant_id = ?', [course_id, tenantId]);
        if (courseCheck.length === 0) {
            throw new Error("Permission denied or course not found.");
        }
        
        await connection.query('DELETE FROM assessments WHERE course_id = ?', [course_id]);
        
        for (const asm of assessments) {
            await connection.query(
                'INSERT INTO assessments (tenant_id, course_id, assessment_name, max_score) VALUES (?, ?, ?, ?)',
                [tenantId, course_id, asm.assessment_name, asm.max_score]
            );
        }
        await connection.commit();
        const [newAssessments] = await connection.query(
            'SELECT id, assessment_name, max_score FROM assessments WHERE course_id = ? ORDER BY id',
            [course_id]
        );
        res.status(201).json(newAssessments);
    } catch (error) {
        await connection.rollback();
        console.error("Error saving assessments:", error);
        res.status(500).json({ message: error.message || 'Server error saving assessments.' });
    } finally {
        connection.release();
    }
};

/**
 * @desc    Helper function to calculate a summary of grades for a given student and year.
 */
const calculateStudentGradeSummary = async (student_id, year) => {
    const [scores] = await pool.query(`
        SELECT 
            c.course_name,
            a.assessment_name, 
            a.max_score,
            ss.score
        FROM student_scores ss
        JOIN assessments a ON ss.assessment_id = a.id
        JOIN courses c ON a.course_id = c.id
        WHERE ss.user_id = ? AND ss.academic_year = ?
    `, [student_id, year]);

    const coursesMap = new Map();
    for (const score of scores) {
        if (!coursesMap.has(score.course_name)) {
            coursesMap.set(score.course_name, {
                course_name: score.course_name,
                scores: [],
                total_score: 0,
                total_max_score: 0,
            });
        }
        const courseData = coursesMap.get(score.course_name);
        courseData.scores.push({
            assessment_name: score.assessment_name,
            score: parseFloat(score.score)
        });
        courseData.total_score += parseFloat(score.score);
        courseData.total_max_score += score.max_score;
    }

    const grades = Array.from(coursesMap.values()).map(course => {
        const percentage = course.total_max_score > 0
            ? (course.total_score / course.total_max_score) * 100
            : 0;
        return {
            course_name: course.course_name,
            scores: course.scores,
            total: parseFloat(percentage.toFixed(2))
        };
    });

    const overallAverage = grades.length > 0
        ? grades.reduce((sum, course) => sum + course.total, 0) / grades.length
        : 0;
    
    return {
        grades,
        average_score: parseFloat(overallAverage.toFixed(2))
    };
};


// --- Grade & Score Management ---
const getStudentsWithGrades = async (req, res) => {
    const { spiritual_class, year } = req.query;
    const tenantId = req.user.tenant_id;

    if (!spiritual_class || !year) {
        return res.status(400).json({ message: 'Spiritual class and year are required.' });
    }

    try {
        const [students] = await pool.query(`
            SELECT u.id as student_id, p.full_name
            FROM users u
            JOIN profiles p ON u.id = p.user_id
            JOIN batch_enrollments be ON u.id = be.user_id
            WHERE u.tenant_id = ? AND be.spiritual_class = ? AND be.academic_year = ? AND be.is_active = TRUE
            ORDER BY p.full_name
        `, [tenantId, spiritual_class, year]);

        if (students.length === 0) return res.status(200).json([]);

        const resultPromises = students.map(async (student) => {
            const summary = await calculateStudentGradeSummary(student.student_id, year);
            return {
                student_id: student.student_id,
                full_name: student.full_name,
                grades: summary.grades,
                average_score: summary.average_score,
            };
        });
        
        let fullResults = await Promise.all(resultPromises);
        fullResults.sort((a, b) => b.average_score - a.average_score);
        fullResults.forEach((student, index) => student.rank = index + 1);

        res.status(200).json(fullResults);

    } catch (error) {
        console.error('Error fetching students with grades:', error);
        res.status(500).json({ message: 'Server error while fetching grade data.' });
    }
};

const saveStudentScores = async (req, res) => {
    const { student_id, year, scores } = req.body;
    
    if (!student_id || !year || !Array.isArray(scores)) {
        return res.status(400).json({ success: false, message: 'Invalid data provided.' });
    }

    const adminUserId = req.user.id;
    const tenantId = req.user.tenant_id;
    
    // Defensive check to ensure user info is present
    if (!adminUserId || !tenantId) {
        console.error("CRITICAL: Admin user ID or Tenant ID is missing from the request token.");
        return res.status(500).json({ success: false, message: 'Server authentication error.' });
    }
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Get existing scores to compare against.
        const [currentScores] = await connection.query(
            'SELECT assessment_id, score FROM student_scores WHERE user_id = ? AND academic_year = ?',
            [student_id, year]
        );
        // Create a map where the score is already a string for consistent comparison.
        const existingScoresMap = new Map(currentScores.map(s => [s.assessment_id, s.score.toString()]));

        for (const score of scores) {
            const { course_id, assessment_id, score: newScoreValue } = score;
            
            // Skip any records from the frontend that don't have a score.
            if (newScoreValue === null || typeof newScoreValue === 'undefined') {
                console.warn(`Skipping score for assessment_id ${assessment_id} because its value is null or undefined.`);
                continue;
            }
            
            const newScoreString = newScoreValue.toString();
            const previousScore = existingScoresMap.get(assessment_id) || 'Not Recorded';


            // If a score has actually changed, log it to the audit table.
            if (previousScore !== newScoreString) {
                

                const [[assessmentInfo]] = await connection.query(
                    'SELECT c.course_name, a.assessment_name FROM assessments a JOIN courses c ON a.course_id = c.id WHERE a.id = ?', 
                    [assessment_id]
                );
                
                const description = assessmentInfo 
                    ? `Grade for ${assessmentInfo.course_name} (${assessmentInfo.assessment_name})`
                    : `Grade for assessment ID ${assessment_id}`;

                await logAudit(connection, {
                    tenant_id: tenantId,
                    admin_user_id: adminUserId,
                    affected_user_id: student_id,
                    action_type: 'GRADE_UPDATE',
                    action_description: description,
                    previous_value: previousScore,
                    new_value: newScoreString
                });
            }

            // Insert or update the score in the database.
            await connection.query(
                `INSERT INTO student_scores (user_id, academic_year, course_id, assessment_id, score)
                 VALUES (?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE score = VALUES(score)`,
                [student_id, year, course_id, assessment_id, newScoreValue]
            );
        }

        await connection.commit();

        const updatedSummary = await calculateStudentGradeSummary(student_id, year);
        
        res.status(200).json({ success: true, message: 'Scores saved successfully.', data: updatedSummary });

    } catch (error) {
        await connection.rollback();
        // This will now log the specific error that caused the rollback.
        res.status(500).json({ success: false, message: 'Server error while saving scores.' });
    } finally {
        connection.release();
    }
};

module.exports = {
    getCourses,
    addCourse,
    deleteCourse,
    getAssessmentsForCourse,
    saveAssessmentsForCourse,
    getStudentsWithGrades,
    saveStudentScores,
};