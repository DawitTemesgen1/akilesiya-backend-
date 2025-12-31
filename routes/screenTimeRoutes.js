/**
 * =============================================================================
 * SCREEN TIME ROUTES (src/routes/screenTimeRoutes.js) - CORRECTED
 * =============================================================================
 */

const express = require('express');
const router = express.Router(); // Create the router instance

const { protect, superiorAdmin } = require('../middleware/authMiddleware');

// Import the controller functions that will handle the requests
const {
    recordScreenTime,
    getUsageSummaryForUsers,
    getDetailedUsageForUser,
} = require('../controllers/screenTimeController');


// --- Define the routes ---

// POST /api/screentime/
// This route is for the user's app to send its usage data to the server.
router.post('/', protect, recordScreenTime);

// GET /api/screentime/users
// This route is for the superior admin to get a list of all users and their total usage.
router.get('/users', protect, superiorAdmin, getUsageSummaryForUsers);

// GET /api/screentime/users/:userId
// This route is for the superior admin to get the detailed daily log for one specific user.
router.get('/users/:userId', protect, superiorAdmin, getDetailedUsageForUser);


// --- Export the Router ---
// This is the most important line. It makes the 'router' object available to server.js
module.exports = router;