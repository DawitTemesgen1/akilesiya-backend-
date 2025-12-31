// src/routes/bookRoutes.js - FINAL VERSION
const express = require('express');
const router = express.Router();
const { protect, superiorAdmin } = require('../middleware/authMiddleware');
const {
    getAssignedBooks, getComments, addComment, updateComment, deleteComment,
    toggleLike, updateReadStatus, createMasterBook, assignBook
} = require('../controllers/bookController');

router.use(protect);

router.get('/', getAssignedBooks);
router.get('/:bookId/comments', getComments);
router.post('/:bookId/comments', addComment);
router.put('/comments/:commentId', updateComment);
router.delete('/comments/:commentId', deleteComment);
router.post('/assignments/:assignmentId/like', toggleLike);
router.patch('/assignments/:assignmentId/status', updateReadStatus);
router.post('/master-list', superiorAdmin, createMasterBook);
router.post('/assign', superiorAdmin, assignBook);

module.exports = router;