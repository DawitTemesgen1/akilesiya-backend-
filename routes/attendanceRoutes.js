const express = require('express');
const router = express.Router();
const { 
    // Ensure all functions are imported correctly from the controller
    getStudentsForAttendance, 
    getAttendanceRecords, 
    saveAttendance,
    getDetailedAttendanceSummary,
    getMyAttendanceHistory,
    getAttendanceHistoryForUser
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

// This route is for any logged-in user to see their own history.
router.get('/my-history', protect, getMyAttendanceHistory);

// All routes below this line require admin access.
router.use(protect, isAdmin('attendance_admin'));

router.get('/students', getStudentsForAttendance);
router.get('/', getAttendanceRecords);
router.post('/save', saveAttendance);
router.get('/detailed-summary', getDetailedAttendanceSummary);

// This route allows an admin to get the history for a specific user.
router.get('/history/:userId', getAttendanceHistoryForUser);

module.exports = router;