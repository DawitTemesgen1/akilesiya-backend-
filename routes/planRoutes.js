// src/routes/planRoutes.js

const express = require('express');
const router = express.Router();
const { protect, superiorAdmin } = require('../middleware/authMiddleware');
const { canAccessPlans } = require('../middleware/planAuthMiddleware'); 
const {
    getPlanData,
    createDepartment,
    updateDepartment,
    updateDepartmentMembers,
    deleteDepartment,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus,
    performAnnualRollover,
    undoAnnualRollover
} = require('../controllers/planController');

// All routes in this file require a user to be logged in.
router.use(protect);

// All routes from this point on require the user to have plan access.
// (Note: Finer-grained checks should happen inside the controllers for non-superior admins)
router.use(canAccessPlans);


// ======================= THE FIX =======================
// The router is already mounted at '/plans', so the base path here should be '/'.
// This corrects the 404 error causing the "unexpected token '<'" crash.

// --- GENERAL PLAN ADMIN ROUTES ---
router.get('/', getPlanData);
router.post('/', createPlan); // Was '/plans'
router.put('/:planId', updatePlan); // Was '/plans/:planId'
router.patch('/:planId/status', togglePlanStatus); // Was '/plans/:planId/status'
// =======================================================


// --- SUPERIOR ADMIN ONLY ROUTES ---
// These routes for a sub-resource ('departments') are correct as they are.
router.post('/departments', superiorAdmin, createDepartment);
router.put('/departments/:deptId', superiorAdmin, updateDepartment);
router.put('/departments/:deptId/members', superiorAdmin, updateDepartmentMembers);
router.delete('/departments/:deptId', superiorAdmin, deleteDepartment);

// This route for a sub-resource ('plans') needs the same fix.
router.delete('/:planId', superiorAdmin, deletePlan); // Was '/plans/:planId'

// These are custom actions and are correct as they are.
router.post('/rollover', superiorAdmin, performAnnualRollover);
router.post('/undo-rollover', superiorAdmin, undoAnnualRollover);


module.exports = router;