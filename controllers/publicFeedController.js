const pool = require('../config/db');
const path = require('path');

// @desc    Get all public posts
// @route   GET /api/public-feed/posts
// @access  Private (User must be logged in to see the feed)
const getPublicPosts = async (req, res) => {
    try {
        const userId = req.user.id;

        const [posts] = await pool.query(`
            SELECT 
                pp.id, pp.title, pp.description, pp.image_url as imageUrl,
                t.name as author, t.logo_url as authorAvatar,
                pp.created_at as date, pp.type, pp.location,
                pp.event_date as eventDate, pp.is_important as isImportant,
                (SELECT COUNT(*) FROM public_post_likes WHERE post_id = pp.id) as likes,
                (SELECT COUNT(*) FROM public_post_comments WHERE post_id = pp.id) as commentCount,
                EXISTS(SELECT 1 FROM public_post_likes WHERE post_id = pp.id AND user_id = ?) as isLiked
            FROM public_posts pp
            JOIN users u ON pp.user_id = u.id
            JOIN tenants t ON u.tenant_id = t.id
            ORDER BY pp.is_important DESC, pp.created_at DESC
        `, [userId]);

        const processedPosts = posts.map(post => ({
            ...post,
            isLiked: post.isLiked === 1,
        }));

        res.status(200).json({ success: true, data: processedPosts });
    } catch (error) {
        console.error("[getPublicPosts] FATAL ERROR:", error);
        res.status(500).json({ success: false, message: "Server error while fetching public posts." });
    }
};

// @desc    Create a new public post
// @route   POST /api/public-feed/admin/posts
// @access  Private (Superior Admin)
const createPublicPost = async (req, res) => {
    try {
        const { title, description, type, location, eventDate, isImportant, imageUrl } = req.body;
        const userId = req.user.id;

        let finalImageUrl = imageUrl || null;
        if (req.file) {
            finalImageUrl = path.join('uploads', req.file.filename).replace(/\\/g, '/');
        }
        if (finalImageUrl === '') {
            finalImageUrl = null;
        }

        const [result] = await pool.query(
            `INSERT INTO public_posts (user_id, title, description, image_url, type, location, event_date, is_important) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, title, description, finalImageUrl, type, location || null, eventDate || null, isImportant === 'true' ? 1 : 0]
        );

        res.status(201).json({ success: true, message: "Public post created successfully.", data: { id: result.insertId } });
    } catch (error) {
        console.error("[createPublicPost] FATAL ERROR:", error);
        res.status(500).json({ success: false, message: "Server error while creating public post." });
    }
};

// @desc    Update a public post
// @route   PUT /api/public-feed/admin/posts/:postId
// @access  Private (Superior Admin)
const updatePublicPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { title, description, type, isImportant, location, eventDate } = req.body;

        const [result] = await pool.query(
            `UPDATE public_posts SET title = ?, description = ?, type = ?, is_important = ?, location = ?, event_date = ? WHERE id = ?`,
            [title, description, type, isImportant === 'true' ? 1 : 0, location || null, eventDate || null, postId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Public post not found.' });
        }
        res.status(200).json({ success: true, message: 'Public post updated successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Delete a public post
// @route   DELETE /api/public-feed/admin/posts/:postId
// @access  Private (Superior Admin)
const deletePublicPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const [result] = await pool.query("DELETE FROM public_posts WHERE id = ?", [postId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Public post not found.' });
        }
        res.status(200).json({ success: true, message: 'Public post deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Toggle a like on a public post
// @route   POST /api/public-feed/posts/:postId/like
// @access  Private
const togglePublicPostLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;
        const [[likeExists]] = await pool.query(
            "SELECT id FROM public_post_likes WHERE post_id = ? AND user_id = ?", [postId, userId]
        );
        if (likeExists) {
            await pool.query("DELETE FROM public_post_likes WHERE id = ?", [likeExists.id]);
            res.status(200).json({ success: true, message: 'Post unliked.', liked: false });
        } else {
            await pool.query("INSERT INTO public_post_likes (post_id, user_id) VALUES (?, ?)", [postId, userId]);
            res.status(201).json({ success: true, message: 'Post liked.', liked: true });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Get all comments for a public post
// @route   GET /api/public-feed/posts/:postId/comments
// @access  Private
const getPublicPostComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const [comments] = await pool.query(`
            SELECT c.id, c.comment_text as text, c.created_at as timestamp,
                   p.full_name as author, p.profile_image_url as authorAvatar
            FROM public_post_comments c
            JOIN profiles p ON c.user_id = p.user_id
            WHERE c.post_id = ?
            ORDER BY c.created_at DESC
        `, [postId]);
        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Create a new comment on a public post
// @route   POST /api/public-feed/posts/:postId/comments
// @access  Private
const createPublicPostComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;
        const { text } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ success: false, message: 'Comment text cannot be empty.' });
        }

        const [result] = await pool.query(
            "INSERT INTO public_post_comments (post_id, user_id, comment_text) VALUES (?, ?, ?)",
            [postId, userId, text]
        );

        const [[newComment]] = await pool.query(`
            SELECT c.id, c.comment_text as text, c.created_at as timestamp,
                   p.full_name as author, p.profile_image_url as authorAvatar
            FROM public_post_comments c
            JOIN profiles p ON c.user_id = p.user_id
            WHERE c.id = ?
        `, [result.insertId]);

        res.status(201).json({ success: true, message: 'Comment posted.', data: newComment });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

module.exports = {
    getPublicPosts,
    togglePublicPostLike,
    getPublicPostComments,
    createPublicPostComment,
    createPublicPost,
    updatePublicPost,
    deletePublicPost,
};