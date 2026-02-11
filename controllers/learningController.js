const pool = require('../config/db');

// @desc    Get all visible learning content
const getLearningContent = async (req, res) => {
    try {
        const userId = req.user.id;
        const tenantId = req.user.tenant_id;

        const [content] = await pool.query(`
            SELECT 
                lc.id,
                lc.title,
                p.full_name as author,
                p.profile_image_url as authorAvatar,
                lc.created_at as publishDate,
                lc.description,
                lc.type,
                lc.image_url as imageUrl,
                lc.content,
                lc.duration,
                lc.category,
                lc.difficulty,
                (SELECT COUNT(*) FROM learning_content_likes WHERE content_id = lc.id) as likes,
                (SELECT COUNT(*) FROM learning_content_comments WHERE content_id = lc.id) as commentCount,
                EXISTS(SELECT 1 FROM learning_content_likes WHERE content_id = lc.id AND user_id = ?) as isLiked,
                EXISTS(SELECT 1 FROM learning_content_bookmarks WHERE content_id = lc.id AND user_id = ?) as isBookmarked
            FROM learning_content lc
            JOIN profiles p ON lc.user_id = p.user_id
            WHERE 
                lc.visibility = 'public' OR (lc.visibility = 'tenant' AND lc.tenant_id = ?)
            ORDER BY lc.created_at DESC
        `, [userId, userId, tenantId]);

        res.status(200).json({ success: true, data: content });
    } catch (error) {
        console.error("Error fetching learning content:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const createLearningContent = async (req, res) => {
    try {
        const { title, description, imageUrl, type, content, duration, category, difficulty, visibility } = req.body;
        const userId = req.user.id;
        const tenantId = req.user.tenant_id;

        const [result] = await pool.query(
            `INSERT INTO learning_content (tenant_id, user_id, title, description, image_url, type, content, duration, category, difficulty, visibility) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [tenantId, userId, title, description, imageUrl, type, content, duration, category, difficulty, visibility]
        );

        res.status(201).json({ success: true, message: "Content created successfully", data: { id: result.insertId } });
    } catch (error) {
        console.error("Error creating learning content:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateLearningContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, imageUrl, type, content, duration, category, difficulty, visibility } = req.body;

        await pool.query(
            `UPDATE learning_content SET 
                title = ?, description = ?, image_url = ?, type = ?, content = ?, duration = ?, category = ?, difficulty = ?, visibility = ?
             WHERE id = ?`,
            [title, description, imageUrl, type, content, duration, category, difficulty, visibility, id]
        );

        res.status(200).json({ success: true, message: "Content updated successfully" });
    } catch (error) {
        console.error("Error updating learning content:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteLearningContent = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM learning_content WHERE id = ?", [id]);
        res.status(200).json({ success: true, message: "Content deleted successfully" });
    } catch (error) {
        console.error("Error deleting learning content:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const toggleLike = async (req, res) => {
    try {
        const { id: content_id } = req.params;
        const user_id = req.user.id;
        const [[exists]] = await pool.query("SELECT * FROM learning_content_likes WHERE content_id = ? AND user_id = ?", [content_id, user_id]);
        if (exists) {
            await pool.query("DELETE FROM learning_content_likes WHERE content_id = ? AND user_id = ?", [content_id, user_id]);
            res.status(200).json({ success: true, liked: false });
        } else {
            await pool.query("INSERT INTO learning_content_likes (content_id, user_id) VALUES (?, ?)", [content_id, user_id]);
            res.status(200).json({ success: true, liked: true });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const toggleBookmark = async (req, res) => {
    try {
        const { id: content_id } = req.params;
        const user_id = req.user.id;
        const [[exists]] = await pool.query("SELECT * FROM learning_content_bookmarks WHERE content_id = ? AND user_id = ?", [content_id, user_id]);
        if (exists) {
            await pool.query("DELETE FROM learning_content_bookmarks WHERE content_id = ? AND user_id = ?", [content_id, user_id]);
            res.status(200).json({ success: true, bookmarked: false });
        } else {
            await pool.query("INSERT INTO learning_content_bookmarks (content_id, user_id) VALUES (?, ?)", [content_id, user_id]);
            res.status(200).json({ success: true, bookmarked: true });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getCommentsForContent = async (req, res) => {
    try {
        const { id } = req.params;
        const [comments] = await pool.query(`
            SELECT c.id, c.user_id as userId, c.parent_id as parentId, c.comment_text as text, c.created_at as timestamp,
                   p.full_name as author, p.profile_image_url as authorAvatar, u.tenant_id as authorTenantId
            FROM learning_content_comments c
            JOIN profiles p ON c.user_id = p.user_id
            JOIN users u ON c.user_id = u.id
            WHERE c.content_id = ?
            ORDER BY c.created_at ASC
        `, [id]);
        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const addComment = async (req, res) => {
    try {
        const { id: content_id } = req.params;
        const user_id = req.user.id;
        const { text, parentId } = req.body;

        if (!text) {
            return res.status(400).json({ success: false, message: "Comment text is required" });
        }

        const [result] = await pool.query(
            "INSERT INTO learning_content_comments (content_id, user_id, comment_text, parent_id) VALUES (?, ?, ?, ?)",
            [content_id, user_id, text, parentId || null]
        );

        const [[newComment]] = await pool.query(`
            SELECT c.id, c.user_id as userId, c.parent_id as parentId, c.comment_text as text, c.created_at as timestamp,
                   p.full_name as author, p.profile_image_url as authorAvatar, u.tenant_id as authorTenantId
            FROM learning_content_comments c
            JOIN profiles p ON c.user_id = p.user_id
            JOIN users u ON c.user_id = u.id
            WHERE c.id = ?
        `, [result.insertId]);

        res.status(201).json({ success: true, data: newComment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;
        const [result] = await pool.query("UPDATE learning_content_comments SET comment_text = ? WHERE id = ? AND user_id = ?", [text, commentId, userId]);
        if (result.affectedRows === 0) return res.status(403).json({ success: false, message: "Not authorized or comment not found." });
        res.status(200).json({ success: true, message: "Comment updated." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        const userTenantId = req.user.tenant_id;

        const [[comment]] = await pool.query(`
            SELECT c.user_id, u.tenant_id as authorTenantId 
            FROM learning_content_comments c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.id = ?
        `, [commentId]);

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found." });
        }

        const roles = Array.isArray(userRole) ? userRole : (userRole || "").split(",");
        const isOwner = comment.user_id === userId;
        const isSystemAdmin = roles.includes('system_admin');
        const isSchoolAdmin = roles.includes('superior_admin') && userTenantId === comment.authorTenantId;

        if (isOwner || isSystemAdmin || isSchoolAdmin) {
            await pool.query("DELETE FROM learning_content_comments WHERE id = ?", [commentId]);
            return res.status(200).json({ success: true, message: "Comment deleted." });
        }

        res.status(403).json({ success: false, message: "Not authorized to delete this comment." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

module.exports = {
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
};