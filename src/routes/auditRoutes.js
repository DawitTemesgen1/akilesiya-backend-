const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const { getAuditTrail } = require('../controllers/auditController');

// Protect all routes in this file. Only a superior_admin can access them.
router.use(protect, isAdmin());

// Define the route
router.get('/all', getAuditTrail);

module.exports = router;