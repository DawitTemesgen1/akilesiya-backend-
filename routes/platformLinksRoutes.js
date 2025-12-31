// src/routes/platformLinksRoutes.js

const express = require('express');
const router = express.Router();
const { getAllLinks, createLink, updateLink, deleteLink } = require('../controllers/platformLinksController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware'); // Using the flexible isAdmin middleware

// --- Public Route (for all logged-in users of the tenant) ---
// Gets all links for the current school.
router.get('/', protect, getAllLinks);

// --- Admin-Only Routes ---
// The following routes are protected and can only be accessed by a 'superior_admin'.
router.post('/', protect, isAdmin('superior_admin'), createLink);
router.put('/:id', protect, isAdmin('superior_admin'), updateLink);
router.delete('/:id', protect, isAdmin('superior_admin'), deleteLink);

module.exports = router;