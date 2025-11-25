const express = require('express');
const router = express.Router();
const { 
    getAllUsers, 
    updateUser, 
    getPlanAdminCandidates, 
    getDevelopmentAdminCandidates,
    updateUserRoles,
    // Import the new functions
    getAllUsersWithLibraryRoles,
    updateUserLibraryRoles,
     getAllUsersWithLearningRoles,
    updateUserLearningRoles,
     getFullUserDetail,
    getDetailedUsers,
    getUserStats,
    
} = require('../controllers/adminController');

// Make sure you are using 'superiorAdmin' as requested
const { protect, isAdmin, superiorAdmin } = require('../middleware/authMiddleware');

// General routes
router.get('/users', protect, isAdmin, getAllUsers);
router.put('/users/:id', protect, isAdmin, updateUser);
router.get('/user-stats', protect, isAdmin, getUserStats);
router.get('/detailed-users', protect, isAdmin, getDetailedUsers);
router.get('/user-detail/:userId', protect, isAdmin, getFullUserDetail);
// Candidate routes for superior_admin
router.get('/plan-admin-candidates', protect, superiorAdmin, getPlanAdminCandidates);
router.get('/development-admin-candidates', protect, superiorAdmin, getDevelopmentAdminCandidates);

// Unified route for updating all roles
router.post('/update-user-roles', protect, superiorAdmin, updateUserRoles);
// Route to get all users and their learning admin status
router.get('/learning-admins/users', protect, superiorAdmin, getAllUsersWithLearningRoles);

// Route to update a specific user's learning admin role
router.put('/learning-admins/users/:userId/roles', protect, superiorAdmin, updateUserLearningRoles);

// Route to get all users and their library roles
router.get('/library-admins/users', protect, superiorAdmin, getAllUsersWithLibraryRoles);

// Route to update a specific user's library roles
router.put('/library-admins/users/:userId/roles', protect, superiorAdmin, updateUserLibraryRoles);


module.exports = router;