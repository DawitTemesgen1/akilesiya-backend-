// routes/profileRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const {
    getMyProfile,
    updateMyProfile,
    uploadAvatar,
    getMyAttendance,
    getMyGrades,
    getMyBooks,
    updateBookStatus,
} = require('../controllers/profileController');

router.use(protect);

router.route('/me')
    .get(getMyProfile)
    .put(updateMyProfile);

router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.get('/my-attendance', getMyAttendance);
router.get('/my-grades', getMyGrades);
router.get('/my-books', getMyBooks);
router.put('/my-books/:assignedBookId', updateBookStatus);

module.exports = router;