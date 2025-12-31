const express = require('express');
const router = express.Router();
const { protect, superiorAdmin } = require('../middleware/authMiddleware');
const {
    getLearningContent,
    createLearningContent,
    updateLearningContent,
    deleteLearningContent,
    getCommentsForContent,
    addComment,
    toggleLike,
    toggleBookmark
} = require('../controllers/learningController');

// All routes are protected and require a user to be logged in
router.use(protect);

// --- Content Routes ---
router.route('/')
    .get(getLearningContent) // GET /api/learning/
    .post(superiorAdmin, createLearningContent); // POST /api/learning/ (Admin Only)

router.route('/:id')
    .put(superiorAdmin, updateLearningContent) // PUT /api/learning/:id (Admin Only)
    .delete(superiorAdmin, deleteLearningContent); // DELETE /api/learning/:id (Admin Only)

// --- Interaction Routes ---
router.post('/:id/like', toggleLike); // POST /api/learning/:id/like
router.post('/:id/bookmark', toggleBookmark); // POST /api/learning/:id/bookmark

// --- Comment Routes ---
router.route('/:id/comments')
    .get(getCommentsForContent) // GET /api/learning/:id/comments
    .post(addComment); // POST /api/learning/:id/comments

module.exports = router;