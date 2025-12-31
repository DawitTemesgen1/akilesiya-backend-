const express = require('express');
const router = express.Router();
const { protect, superiorAdmin } = require('../middleware/authMiddleware');
const {
    getAllScreens,
    getAllUsersSimple,
    getRolePermissions,
    updateRolePermissions,
    getUserPermissions,
    updateUserPermissions
} = require('../controllers/permissionController');

// All permission management requires Superior Admin
router.use(protect, superiorAdmin);

router.get('/users', getAllUsersSimple);
router.get('/screens', getAllScreens);

// Dummy endpoint for departments to satisfy existing UI
router.get('/departments', (req, res) => res.json({ success: true, data: [] }));

// Role Permissions
router.get('/screen-permissions-for-role/:roleName', getRolePermissions);
router.post('/update-screen-permissions', updateRolePermissions);

// User Permissions (New)
router.get('/screen-permissions-for-user/:userId', getUserPermissions);
router.post('/update-user-screen-permissions', updateUserPermissions);

module.exports = router;
