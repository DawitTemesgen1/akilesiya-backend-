const express = require('express');
const router = express.Router();

const { protect, isSuperiorAdmin } = require('../middleware/authMiddleware');
const { 
    getAllUsersWithLibraryRoles, 
    updateUserLibraryRoles 
} = require('../controllers/librarianAdminController');

// All routes in this file are protected and require superior admin access
router.use(protect, isSuperiorAdmin);

// Route to get all users and their library roles
router.get('/users', getAllUsersWithLibraryRoles);

// Route to update a specific user's library roles
router.put('/users/:userId/roles', updateUserLibraryRoles);

module.exports = router;