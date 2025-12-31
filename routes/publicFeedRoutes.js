const express = require('express');
const router = express.Router();
const { protect, superiorAdmin } = require('../middleware/authMiddleware'); // <-- Import superiorAdmin
const {
    getPublicPosts,
    togglePublicPostLike,
    getPublicPostComments,
    createPublicPostComment,
    createPublicPost,
    updatePublicPost,
    deletePublicPost
} = require('../controllers/publicFeedController');
const { upload } = require('../middleware/uploadMiddleware'); // Import upload middleware

// All routes require a user to be logged in
router.use(protect);

// --- Public User Routes ---
router.get('/posts', getPublicPosts);
router.post('/posts/:postId/like', togglePublicPostLike);
router.get('/posts/:postId/comments', getPublicPostComments);
router.post('/posts/:postId/comments', createPublicPostComment);

// --- Admin-Only Routes ---
// Use superiorAdmin middleware to protect these endpoints
router.post('/admin/posts', superiorAdmin, upload.single('image'), createPublicPost);
router.put('/admin/posts/:postId', superiorAdmin, updatePublicPost);
router.delete('/admin/posts/:postId', superiorAdmin, deletePublicPost);


module.exports = router;