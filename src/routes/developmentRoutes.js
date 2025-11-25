// src/routes/developmentRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
// Import our new, specific middleware
const { canAccessDevelopment } = require('../middleware/developmentAuthMiddleware');

const {
    getNotesForUser,
    createNote,
    updateNote,
    updateNoteStatus,
    deleteNote
} = require('../controllers/developmentController');

// All routes in this file require a user to be logged in
router.use(protect);

// From this point on, all routes require specific development permissions
router.use(canAccessDevelopment);

// Routes are structured around the user being evaluated
router.route('/:userId')
    .get(getNotesForUser)
    .post(createNote);

// Routes for acting on a specific note by its own ID
router.route('/notes/:noteId')
    .put(updateNote)
    .delete(deleteNote);

// Special route for just toggling completion status
router.patch('/notes/:noteId/status', updateNoteStatus);

module.exports = router;