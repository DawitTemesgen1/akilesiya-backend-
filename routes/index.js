
const express = require('express');
const router = express.Router();

// Import all routers
const authRoutes = require('./authRoutes');
const tenantRoutes = require('./tenantRoutes');
const homepageRoutes = require('./homepageRoutes'); // <-- NEW
const learningRoutes = require('./learningRoutes'); // <-- NEW

// Use the routers
router.use('/auth', authRoutes);
router.use('/tenants', tenantRoutes);
router.use('/homepage', homepageRoutes); // <-- NEW
router.use('/learning', learningRoutes); // <-- NEW

module.exports = router;