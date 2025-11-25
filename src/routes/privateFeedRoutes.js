const express = require('express');
const router = express.Router();
const { protect, superiorAdmin } = require('../middleware/authMiddleware');
const {
    getTenantDetails,
    getPrivatePosts,
    createPrivatePost,
    updatePrivatePost,
    deletePrivatePost,
    updateTenantDetails,
    togglePostLike,
    getPostComments,
    createPostComment
} = require('../controllers/privateFeedController');

const { upload } = require('../middleware/uploadMiddleware');

router.use(protect); // All routes below are now protected

// --- Tenant Routes ---
router.get('/tenant/:tenantId', getTenantDetails);
router.put('/tenant/:tenantId', superiorAdmin, updateTenantDetails); // <-- NEW

// --- Post Feed Routes ---
router.get('/posts/:tenantId', getPrivatePosts);
router.post('/posts', superiorAdmin, upload.single('image'), createPrivatePost);
router.put('/posts/:postId', superiorAdmin, updatePrivatePost);
router.delete('/posts/:postId', superiorAdmin, deletePrivatePost);

// --- Post Interaction Routes ---
router.post('/posts/:postId/like', togglePostLike); // <-- NEW
router.get('/posts/:postId/comments', getPostComments); // <-- NEW
router.post('/posts/:postId/comments', createPostComment); // <-- NEW

module.exports = router;