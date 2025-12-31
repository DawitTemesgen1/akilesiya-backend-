const express = require('express');
const router = express.Router();
const { getMyAttendance, getMyGrades, getMyBooks } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All routes in this file are for the currently logged-in user
router.use(protect);

router.get('/me/attendance', getMyAttendance);
router.get('/me/grades', getMyGrades);
router.get('/me/books', getMyBooks);

module.exports = router;