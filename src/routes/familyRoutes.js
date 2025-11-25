// src/routes/familyRoutes.js

const express = require('express');
const router = express.Router();
const { protect, superiorAdmin } = require('../middleware/authMiddleware');
const {
    getLinkedStudents,
    getStudentDetails,
    toggleBookStatus,
    getAllFamilyLinks,
    createFamilyLink,
    deleteFamilyLink
} = require('../controllers/familyController');

// All routes require a user to be logged in
router.use(protect);

// --- Routes for family members (parents) ---
router.get('/linked-students', getLinkedStudents);
router.get('/student-details/:studentId', getStudentDetails);
router.patch('/books/:bookId/status', toggleBookStatus);

// --- Routes for superior admins to manage links ---
const adminRouter = express.Router();
adminRouter.use(superiorAdmin); // Secure all sub-routes

adminRouter.route('/')
    .get(getAllFamilyLinks)
    .post(createFamilyLink);

adminRouter.route('/:linkId')
    .delete(deleteFamilyLink);

router.use('/manage', adminRouter);


module.exports = router;