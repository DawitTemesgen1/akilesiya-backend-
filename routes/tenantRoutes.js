const express = require('express');
const router = express.Router();
const { getTenants, createTenant, getTenantCustomFields } = require('../controllers/tenantController');

router.get('/', getTenants);
router.get('/:tenantId/custom-fields', getTenantCustomFields);
router.post('/', createTenant); // In a real app, you would add admin protection here

module.exports = router;