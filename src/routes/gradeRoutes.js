const express = require('express');
const router = express.Router();
const { 
    getStudentsWithGrades,
    getCourses, addCourse, deleteCourse,
    getAssessmentsForCourse,
    saveAssessmentsForCourse,
    saveStudentScores
} = require('../controllers/gradeController');
const { protect } = require('../middleware/authMiddleware');

// ======================= THE FIX =======================
// Import the correct 'isAdmin' function from the correct middleware file.
const { isAdmin } = require('../middleware/adminMiddleware');
// =======================================================


// --- Use the correct middleware ---
// This now correctly calls isAdmin() and specifies that a user must have
// the 'grade_admin' role (or be a superior_admin) to access these routes.
router.use(protect, isAdmin('grade_admin'));


// (All routes below are now correctly protected)
router.get('/', getStudentsWithGrades);
router.get('/courses', getCourses);
router.post('/courses', addCourse);
router.delete('/courses/:course_id', deleteCourse);
router.get('/assessments', getAssessmentsForCourse);
router.post('/assessments', saveAssessmentsForCourse);
router.put('/scores', saveStudentScores);

module.exports = router;