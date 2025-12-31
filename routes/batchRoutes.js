const express = require('express');
const router = express.Router();
const { 
    getUnregisteredUsers, 
    registerStudentsToBatch, 
    promoteStudents,
    getBatchSummary,
    getStudentsInBatch,
    removeStudentsFromBatch
} = require('../controllers/batchController');
const { protect } = require('../middleware/authMiddleware');
// --- THE FIX ---
// Correctly import 'gradeAdmin' as it is exported from the middleware file.
const { gradeAdmin } = require('../middleware/gradeAdminMiddleware');

// Protect all routes with the correct middleware
router.use(protect, gradeAdmin);

router.get('/unregistered-users', getUnregisteredUsers);
router.post('/register', registerStudentsToBatch);
router.post('/promote', promoteStudents);
router.get('/summary', getBatchSummary);
router.get('/students', getStudentsInBatch);
router.post('/remove', removeStudentsFromBatch);

module.exports = router;