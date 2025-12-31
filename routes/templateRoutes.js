// routes/templateRoutes.js
const express = require('express');
const router = express.Router();
const { protect, superiorAdmin } = require('../middleware/authMiddleware');
const {
    createCustomField, getCustomFields, updateCustomField, deleteCustomField,
    createFieldOption, updateFieldOption, deleteFieldOption
} = require('../controllers/templateController');

// Public/Protected read access for rendering forms
router.get('/fields', protect, getCustomFields);

// Admin only operations
router.use(protect, superiorAdmin); // All template editing requires admin

router.post('/fields', createCustomField);

router.route('/fields/:fieldId')
    .put(updateCustomField)
    .delete(deleteCustomField);

// Routes for managing the Options within a field (e.g., 'Tiwulid 1', 'Level 1')
router.route('/options')
    .post(createFieldOption);

router.route('/options/:optionId')
    .put(updateFieldOption)
    .delete(deleteFieldOption);

module.exports = router;