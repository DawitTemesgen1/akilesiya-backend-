const express = require('express');
const router = express.Router();
const { getTenants, createTenant } = require('../controllers/tenantController');

router.get('/', getTenants);
router.post('/', createTenant); // In a real app, you would add admin protection here

module.exports = router;