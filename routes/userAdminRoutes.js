// src/routes/userAdminRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); 
const { isAdmin } = require('../middleware/adminMiddleware'); // Correct import
const {
    getAllUsers, 
    getUserDetailsForAdmin, 
    verifyUser, 
    updateUserByAdmin,
    updateUserRoles,
    getUsersWithUnreviewedChanges, 
    getChangeLogForUser, 
    markLogsAsReviewed,
    getProfileSettings,
    updateProfileSettings,
    createServiceSector,
    getServiceSectors,
    deleteServiceSector,
    createServiceUnit,
    getServiceUnitsForSector,
    deleteServiceUnit,
} = require('../controllers/userAdminController');

// --- THE FIX ---
// Protect all routes in this file: User MUST be 'superior_admin'.
// The new middleware automatically handles this.
router.use(protect, isAdmin()); // No arguments means only superior_admin is allowed

// (All routes below are now correctly protected)
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetailsForAdmin);
router.put('/users/:userId/verify', verifyUser);
router.put('/users/:userId', updateUserByAdmin);
router.put('/users/:userId/roles', updateUserRoles); 
router.get('/change-logs/summary', getUsersWithUnreviewedChanges);
router.get('/change-logs/:userId', getChangeLogForUser);
router.put('/change-logs/:userId/review', markLogsAsReviewed);
router.route('/profile-settings').get(getProfileSettings).put(updateProfileSettings);
router.route('/sectors').post(createServiceSector).get(getServiceSectors);
router.delete('/sectors/:sectorId', deleteServiceSector);
router.post('/units', createServiceUnit);
router.get('/units/:sectorId', getServiceUnitsForSector);
router.delete('/units/:unitId', deleteServiceUnit);
router.use(protect, isAdmin());

module.exports = router;