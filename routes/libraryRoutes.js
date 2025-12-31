


// src/routes/libraryRoutes.js

const express = require('express');
const router = express.Router();

// CORRECTLY IMPORT a function named `isAdmin`
const { protect, isAdmin } = require('../middleware/authMiddleware'); 
const { getReaders, getReadingHistory, assignBook } = require('../controllers/libraryController');


// Use the imported middleware. Express will run them in order: `protect` first, then `isAdmin`.
router.use(protect, isAdmin);

// Define the routes
router.get('/readers', getReaders);
router.get('/history/:userId', getReadingHistory);
router.post('/assign', assignBook);

module.exports = router;