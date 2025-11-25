// src/controllers/userController.js

const pool = require('../config/db');

// @desc    Get attendance history for the logged-in user
// @route   GET /api/users/me/attendance
// @access  Private
const getMyAttendance = async (req, res) => {
    try {
        // This query is now correct and matches your schema
        const [records] = await pool.query(
            'SELECT attendance_date as date, status, attendance_type as type FROM attendance WHERE user_id = ? ORDER BY attendance_date DESC',
            [req.user.id]
        );
        res.status(200).json(records);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ message: 'Server error while fetching attendance.' });
    }
};

// @desc    Get grade history for the logged-in user
// @route   GET /api/users/me/grades
// @access  Private
const getMyGrades = async (req, res) => {
    try {
        const [records] = await pool.query(`
            SELECT 
                ss.academic_year,
                c.spiritual_class,
                c.course_name,
                a.assessment_name,
                ss.score
            FROM student_scores ss
            JOIN courses c ON ss.course_id = c.id
            JOIN assessments a ON ss.assessment_id = a.id
            WHERE ss.user_id = ?
            ORDER BY ss.academic_year, c.course_name
        `, [req.user.id]);

        if (records.length === 0) return res.status(200).json([]);

        const gradeHistory = records.reduce((acc, record) => {
            const yearKey = `${record.spiritual_class} - ${record.academic_year}`;
            if (!acc[yearKey]) {
                acc[yearKey] = {
                    spiritualClass: record.spiritual_class,
                    academicYear: record.academic_year,
                    grades: {},
                };
            }
            if (!acc[yearKey].grades[record.course_name]) {
                acc[yearKey].grades[record.course_name] = {
                    courseName: record.course_name,
                    total: 0,
                    assessments: [],
                };
            }
            const scoreValue = record.score || 0;
            acc[yearKey].grades[record.course_name].total += scoreValue;
            acc[yearKey].grades[record.course_name].assessments.push({ name: record.assessment_name, score: scoreValue });
            return acc;
        }, {});
        
        const result = Object.values(gradeHistory).map(yearData => {
            const coursesArray = Object.values(yearData.grades);
            const totalSum = coursesArray.reduce((sum, course) => sum + course.total, 0);
            return {
                ...yearData,
                grades: coursesArray,
                average: coursesArray.length > 0 ? totalSum / coursesArray.length : 0,
            };
        });
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching my grades:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// @desc    Get recommended/assigned books for the logged-in user (CORRECTED)
// @route   GET /api/users/me/books
// @access  Private
const getMyBooks = async (req, res) => {
    try {
        // This query now joins assigned_books with the main books table
        // to get only the books assigned to the current user.
        const [records] = await pool.query(
            `SELECT b.id, ab.id as assignmentId, b.title, ab.deadline, ab.is_read
             FROM assigned_books ab
             JOIN books b ON ab.book_id = b.id
             WHERE ab.user_id = ? 
             ORDER BY ab.deadline`,
            [req.user.id]
        );
        res.status(200).json(records);
    } catch (error) {
        console.error('Error fetching my books:', error);
        res.status(500).json({ message: 'Server error while fetching books.' });
    }
};

module.exports = {
    getMyAttendance,
    getMyGrades,
    getMyBooks,
};