// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// ======================= THE FIX IS HERE =======================
// We now destructure 'upload' from the imported object.
const { upload } = require('../middleware/uploadMiddleware');
// ===============================================================


router.post('/login', loginUser);
router.get('/me', protect, getMe);

// This line will now work because 'upload' is correctly defined.
router.post('/register', upload.single('profile_image'), registerUser);

module.exports = router;