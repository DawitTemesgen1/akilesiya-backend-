const express = require('express');
const router = express.Router();
const { getHomepageContent } = require('../controllers/homepageController');
const { protect } = require('../middleware/authMiddleware');

// This entire route is protected. A user must be logged in to their school
// to see the school's homepage content.
router.get('/', protect, getHomepageContent);

module.exports = router;