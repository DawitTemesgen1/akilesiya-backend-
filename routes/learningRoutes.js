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
    updateComment,
    deleteComment,
    toggleLike,
    toggleBookmark
} = require('../controllers/learningController');

router.use(protect);

router.get('/', getLearningContent);
router.post('/:id/like', toggleLike);
router.post('/:id/bookmark', toggleBookmark);
router.get('/:id/comments', getCommentsForContent);
router.post('/:id/comments', addComment);
router.put('/comments/:commentId', updateComment);
router.delete('/comments/:commentId', deleteComment);

// Admin-only routes
router.post('/admin', superiorAdmin, createLearningContent);
router.put('/admin/:id', superiorAdmin, updateLearningContent);
router.delete('/admin/:id', superiorAdmin, deleteLearningContent);

module.exports = router;