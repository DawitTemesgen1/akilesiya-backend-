const express = require('express');
const router = express.Router();
const {
    getSystemDashboard,
    getAllSchools,
    getSchoolDetail,
    createSchool,
    updateSchool,
    toggleSchoolStatus,
    promoteToSuperiorAdmin,
    getSystemAuditLogs,
    searchUsers,
    getUserDetails,
    toggleUserStatus,
    getPlatformAnalytics,
    getSystemSettings,
    updateSystemSettings,removeSuperiorAdmin
} = require('../controllers/systemAdminController');

const { protect } = require('../middleware/authMiddleware');

// System admin middleware
const isSystemAdmin = (req, res, next) => {
    if (req.user && req.user.role && req.user.role.includes('system_admin')) {
        next();
    } else {
        res.status(403).json({ 
            success: false, 
            message: 'Forbidden: This action requires system administrator privileges.' 
        });
    }
};

// All routes require system admin privileges
router.use(protect, isSystemAdmin);

// Dashboard and overview
router.get('/dashboard', getSystemDashboard);

// School management
router.get('/schools', getAllSchools);
router.get('/schools/:schoolId', getSchoolDetail);
router.post('/schools', createSchool);
router.put('/schools/:schoolId', updateSchool);
router.patch('/schools/:schoolId/status', toggleSchoolStatus);
router.post('/schools/:schoolId/promote-admin', promoteToSuperiorAdmin);

// User Management
router.get('/users', searchUsers);
router.get('/users/:userId', getUserDetails);
router.patch('/users/:userId/status', toggleUserStatus);

// Platform Analytics
router.get('/analytics', getPlatformAnalytics);

// System Settings
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);
// Add this route with the other user management routes
router.post('/schools/:schoolId/remove-admin', removeSuperiorAdmin);
// System logs
router.get('/audit-logs', getSystemAuditLogs);

module.exports = router;