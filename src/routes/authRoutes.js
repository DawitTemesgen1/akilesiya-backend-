// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    verifyOTP,
    setPassword,
    forgotPassword,
    resetPassword,
    resendOTP
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Note: Removed upload middleware for registration to focus on Phone+OTP flow.
// Profile image can be uploaded after registration via profile updates.

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/set-password', setPassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendOTP);
router.get('/me', protect, getMe);

module.exports = router;