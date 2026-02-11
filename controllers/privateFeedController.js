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

const getPrivatePosts = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const userId = req.user.id;

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
    try {
        const { title, description, type, tags, location, eventDate, isImportant, targetGroups, imageUrl } = req.body;
        const userId = req.user.id;
        const tenantId = req.user.tenant_id;

        let finalImageUrl = imageUrl || null;
        if (req.file) {
            finalImageUrl = path.join('uploads', req.file.filename).replace(/\\/g, '/');
        }

        const [result] = await pool.query(
            `INSERT INTO private_posts (tenant_id, user_id, title, description, image_url, type, tags, location, event_date, is_important, target_groups) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [tenantId, userId, title, description, finalImageUrl, type, tags || '[]', location || null, eventDate || null, isImportant === 'true' ? 1 : 0, targetGroups || '[]']
        );

        res.status(201).json({ success: true, message: "Private post created successfully.", data: { id: result.insertId } });
    } catch (error) {
        console.error("Error creating private post:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const updatePrivatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { title, description, type, tags, location, eventDate, isImportant, targetGroups } = req.body;

        const [result] = await pool.query(
            `UPDATE private_posts SET title = ?, description = ?, type = ?, tags = ?, location = ?, event_date = ?, is_important = ?, target_groups = ? WHERE id = ?`,
            [title, description, type, tags || '[]', location || null, eventDate || null, isImportant === 'true' ? 1 : 0, targetGroups || '[]', postId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Post not found.' });
        }
        res.status(200).json({ success: true, message: 'Post updated successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const deletePrivatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const [result] = await pool.query("DELETE FROM private_posts WHERE id = ?", [postId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Post not found.' });
        }
        res.status(200).json({ success: true, message: 'Post deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};


// @desc    Update tenant details (for admin)
const updateTenantDetails = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { name, member_count } = req.body;

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
const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const [comments] = await pool.query(`
            SELECT c.id, c.user_id as userId, c.parent_id as parentId, c.comment_text as text, c.created_at as timestamp,
                   p.full_name as author, p.profile_image_url as authorAvatar, p.tenant_id as authorTenantId
            FROM private_post_comments c
            JOIN profiles p ON c.user_id = p.user_id
            WHERE c.post_id = ?
            ORDER BY c.created_at ASC
        `, [postId]);

        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        console.error("Error fetching post comments:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Create a new comment on a private post
const createPostComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;
        const { text, parentId } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ success: false, message: 'Comment text cannot be empty.' });
        }

        const [result] = await pool.query(
            "INSERT INTO private_post_comments (post_id, user_id, comment_text, parent_id) VALUES (?, ?, ?, ?)",
            [postId, userId, text, parentId || null]
        );

        const [[newComment]] = await pool.query(`
            SELECT c.id, c.user_id as userId, c.parent_id as parentId, c.comment_text as text, c.created_at as timestamp,
                   p.full_name as author, p.profile_image_url as authorAvatar, p.tenant_id as authorTenantId
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

// @desc    Update a comment on a private post
const updatePostComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;

        const [result] = await pool.query(
            "UPDATE private_post_comments SET comment_text = ? WHERE id = ? AND user_id = ?",
            [text, commentId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(403).json({ success: false, message: "Not authorized or comment not found." });
        }
        res.status(200).json({ success: true, message: "Comment updated." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Delete a comment on a private post
const deletePostComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        const userTenantId = req.user.tenant_id;

        const [[comment]] = await pool.query(`
            SELECT c.user_id, p.tenant_id as authorTenantId 
            FROM private_post_comments c 
            JOIN profiles p ON c.user_id = p.user_id 
            WHERE c.id = ?
        `, [commentId]);

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found." });
        }

        const isOwner = comment.user_id === userId;
        const isSystemAdmin = userRole === 'system_admin';
        const isSchoolAdmin = userRole === 'superior_admin' && userTenantId === comment.authorTenantId;

        if (isOwner || isSystemAdmin || isSchoolAdmin) {
            await pool.query("DELETE FROM private_post_comments WHERE id = ?", [commentId]);
            return res.status(200).json({ success: true, message: "Comment deleted." });
        }

        res.status(403).json({ success: false, message: "Not authorized to delete this comment." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};


module.exports = {
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
};