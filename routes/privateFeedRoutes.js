const express = require('express');
const router = express.Router();
const { protect, superiorAdmin } = require('../middleware/authMiddleware'); // <-- Import superiorAdmin
const {
    getTenantDetails,
    getPrivatePosts,
    createPrivatePost,
    updatePrivatePost,
    deletePrivatePost,
    updateTenantDetails,
    togglePostLike,
    getPostComments,
    createPostComment,
    updatePostComment,
    deletePostComment
} = require('../controllers/privateFeedController');
const { upload } = require('../middleware/uploadMiddleware'); // Import upload middleware

// All routes require a user to be logged in
router.use(protect);

// --- Sunday School Routes ---
router.get('/tenant/:tenantId', getTenantDetails);
router.get('/posts/:tenantId', getPrivatePosts);
router.post('/posts/:postId/like', togglePostLike);
router.get('/posts/:postId/comments', getPostComments);
router.post('/posts/:postId/comments', createPostComment);
router.put('/comments/:commentId', updatePostComment);
router.delete('/comments/:commentId', deletePostComment);

// --- Admin-Only Routes ---
router.put('/tenant/:tenantId', superiorAdmin, updateTenantDetails);
router.post('/admin/posts', superiorAdmin, upload.single('image'), createPrivatePost);
router.put('/admin/posts/:postId', superiorAdmin, updatePrivatePost);
router.delete('/admin/posts/:postId', superiorAdmin, deletePrivatePost);


module.exports = router;