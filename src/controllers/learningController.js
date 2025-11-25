const pool = require('../config/db');

// @desc    Get all visible learning content
// @route   GET /api/learning
// @access  Private
// ... (keep createLearningContent, updateLearningContent, etc. the same)

// @desc    Get all visible learning content
// @route   GET /api/learning
// @access  Private
const getLearningContent = async (req, res) => {
    try {
        const userId = req.user.id;
        const tenantId = req.user.tenant_id;

        const [content] = await pool.query(`
            SELECT 
                lc.id,
                lc.title,
                p.full_name as author,
                p.profile_image_url as authorAvatar, -- THIS LINE IS ADDED
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



// @desc    Create new learning content
// @route   POST /api/learning
// @access  Private (Superior Admin)
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

// @desc    Update learning content
// @route   PUT /api/learning/:id
// @access  Private (Superior Admin)
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

// @desc    Delete learning content
// @route   DELETE /api/learning/:id
// @access  Private (Superior Admin)
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

// @desc    Toggle a like on content
// @route   POST /api/learning/:id/like
// @access  Private
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

// @desc    Toggle a bookmark on content
// @route   POST /api/learning/:id/bookmark
// @access  Private
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


// @desc    Get comments for a piece of content
// @route   GET /api/learning/:id/comments
// @access  Private
const getCommentsForContent = async (req, res) => {
    try {
        const { id } = req.params;
        const [comments] = await pool.query(`
            SELECT 
                c.id, 
                p.full_name as author, 
                SUBSTRING(p.full_name, 1, 1) as avatarInitials, 
                c.comment_text as text, 
                c.created_at as timestamp
            FROM learning_content_comments c
            JOIN profiles p ON c.user_id = p.user_id
            WHERE c.content_id = ?
            ORDER BY c.created_at DESC
        `, [id]);
        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Add a comment to a piece of content
// @route   POST /api/learning/:id/comments
// @access  Private
const addComment = async (req, res) => {
    try {
        const { id: content_id } = req.params;
        const user_id = req.user.id;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ success: false, message: "Comment text is required" });
        }

        const [result] = await pool.query(
            "INSERT INTO learning_content_comments (content_id, user_id, comment_text) VALUES (?, ?, ?)",
            [content_id, user_id, text]
        );
        
        // Return the newly created comment
        const [[newComment]] = await pool.query(`
            SELECT 
                c.id, 
                p.full_name as author, 
                SUBSTRING(p.full_name, 1, 1) as avatarInitials, 
                c.comment_text as text, 
                c.created_at as timestamp
            FROM learning_content_comments c
            JOIN profiles p ON c.user_id = p.user_id
            WHERE c.id = ?
        `, [result.insertId]);

        res.status(201).json({ success: true, data: newComment });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports = {
    getLearningContent,
    createLearningContent,
    updateLearningContent,
    deleteLearningContent,
    getCommentsForContent,
    addComment,
    toggleLike,
    toggleBookmark
};