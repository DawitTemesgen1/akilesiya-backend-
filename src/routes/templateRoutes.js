// routes/templateRoutes.js
const express = require('express');
const router = express.Router();
const { protect, superiorAdmin } = require('../middleware/authMiddleware'); 
const {
    createCustomField, getCustomFields, updateCustomField, deleteCustomField,
    createFieldOption, updateFieldOption, deleteFieldOption
} = require('../controllers/templateController');

router.use(protect, superiorAdmin); // All template editing requires admin

// Routes for managing the Custom Fields (e.g., 'Tiwulid', 'Member Level')
router.route('/fields')
    .post(createCustomField)
    .get(getCustomFields);

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