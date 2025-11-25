const pool = require('../config/db');
const path = require('path');

const getTenantDetails = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const [[tenant]] = await pool.query("SELECT * FROM tenants WHERE id = ?", [tenantId]);
        if (!tenant) {
            return res.status(404).json({ success: false, message: 'Tenant not found' });
        }
        res.status(200).json({ success: true, data: tenant });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// ==========================================================
// --- UPDATED to be more efficient ---
// Now includes like count, comment count, and if the current user has liked the post.
// ==========================================================
const getPrivatePosts = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const userId = req.user.id; // Get current user from `protect` middleware

        const [posts] = await pool.query(`
            SELECT 
                pp.id, pp.title, pp.description, pp.image_url as imageUrl,
                p.full_name as author, p.profile_image_url as authorAvatar,
                pp.created_at as date, pp.type, pp.tags, pp.location,
                pp.event_date as eventDate, pp.is_important as isImportant,
                pp.target_groups as targetGroups,
                (SELECT COUNT(*) FROM private_post_likes WHERE post_id = pp.id) as likes,
                (SELECT COUNT(*) FROM private_post_comments WHERE post_id = pp.id) as commentCount,
                EXISTS(SELECT 1 FROM private_post_likes WHERE post_id = pp.id AND user_id = ?) as isLiked
            FROM private_posts pp
            LEFT JOIN profiles p ON pp.user_id = p.user_id
            WHERE pp.tenant_id = ?
            ORDER BY pp.is_important DESC, pp.created_at DESC
        `, [userId, tenantId]);

        const processedPosts = posts.map(post => ({
            ...post,
            isLiked: post.isLiked === 1,
            tags: post.tags ? JSON.parse(post.tags) : [],
            targetGroups: post.targetGroups ? JSON.parse(post.targetGroups) : [],
        }));

        res.status(200).json({ success: true, data: processedPosts });
    } catch (error) {
        console.error("[getPrivatePosts] FATAL ERROR:", error);
        res.status(500).json({ success: false, message: "Server error while fetching posts." });
    }
};

const createPrivatePost = async (req, res) => {
    // ... (This function is correct and unchanged from the previous response)
};

const updatePrivatePost = async (req, res) => {
    // ... (This function is correct and unchanged)
};

const deletePrivatePost = async (req, res) => {
    // ... (This function is correct and unchanged)
};


// ==========================================================
// --- NEW FUNCTIONS FOR NEW FEATURES ---
// ==========================================================

// @desc    Update tenant details (for admin)
// @route   PUT /api/private-feed/tenant/:tenantId
// @access  Private (Superior Admin)
const updateTenantDetails = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { name, member_count } = req.body;

        // Ensure only allowed fields are updated
        if (name === undefined || member_count === undefined) {
            return res.status(400).json({ success: false, message: 'Name and member count are required.' });
        }

        const [result] = await pool.query(
            `UPDATE tenants SET name = ?, member_count = ? WHERE id = ?`,
            [name, member_count, tenantId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Tenant not found.' });
        }

        res.status(200).json({ success: true, message: 'Sunday School details updated successfully.' });
    } catch (error) {
        console.error("Error updating tenant details:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Toggle a like on a private post
// @route   POST /api/private-feed/posts/:postId/like
// @access  Private
const togglePostLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const [[likeExists]] = await pool.query(
            "SELECT id FROM private_post_likes WHERE post_id = ? AND user_id = ?",
            [postId, userId]
        );

        if (likeExists) {
            await pool.query("DELETE FROM private_post_likes WHERE id = ?", [likeExists.id]);
            res.status(200).json({ success: true, message: 'Post unliked.', liked: false });
        } else {
            await pool.query("INSERT INTO private_post_likes (post_id, user_id) VALUES (?, ?)", [postId, userId]);
            res.status(201).json({ success: true, message: 'Post liked.', liked: true });
        }
    } catch (error) {
        console.error("Error toggling post like:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Get all comments for a private post
// @route   GET /api/private-feed/posts/:postId/comments
// @access  Private
const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const [comments] = await pool.query(`
            SELECT c.id, c.comment_text as text, c.created_at as timestamp,
                   p.full_name as author, p.profile_image_url as authorAvatar
            FROM private_post_comments c
            JOIN profiles p ON c.user_id = p.user_id
            WHERE c.post_id = ?
            ORDER BY c.created_at DESC
        `, [postId]);

        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        console.error("Error fetching post comments:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Create a new comment on a private post
// @route   POST /api/private-feed/posts/:postId/comments
// @access  Private
const createPostComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;
        const { text } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ success: false, message: 'Comment text cannot be empty.' });
        }

        const [result] = await pool.query(
            "INSERT INTO private_post_comments (post_id, user_id, comment_text) VALUES (?, ?, ?)",
            [postId, userId, text]
        );

        // Fetch the newly created comment to return it with author details
        const [[newComment]] = await pool.query(`
            SELECT c.id, c.comment_text as text, c.created_at as timestamp,
                   p.full_name as author, p.profile_image_url as authorAvatar
            FROM private_post_comments c
            JOIN profiles p ON c.user_id = p.user_id
            WHERE c.id = ?
        `, [result.insertId]);

        res.status(201).json({ success: true, message: 'Comment posted.', data: newComment });
    } catch (error) {
        console.error("Error creating post comment:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};


module.exports = {
    getTenantDetails,
    getPrivatePosts,
    createPrivatePost,
    updatePrivatePost,
    deletePrivatePost,
    // --- EXPORT NEW FUNCTIONS ---
    updateTenantDetails,
    togglePostLike,
    getPostComments,
    createPostComment
};