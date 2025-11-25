// src/controllers/bookController.js - FINAL, STABLE VERSION

const pool = require('../config/db');

// @desc    Get all books assigned to the logged-in user (STABLE VERSION)
const getAssignedBooks = async (req, res) => {
    try {
        const userId = req.user.id;
        const [books] = await pool.query(`
            SELECT 
                b.*, ab.id AS assignmentId, ab.deadline, ab.is_read, ab.availability
            FROM assigned_books ab JOIN books b ON ab.book_id = b.id WHERE ab.user_id = ?
        `, [userId]);

        if (books.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        const assignmentIds = books.map(b => b.assignmentId);
        const [likesData] = await pool.query(
            `SELECT 
                assigned_book_id, 
                COUNT(*) as like_count, 
                SUM(IF(user_id = ?, 1, 0)) as is_liked_by_user 
             FROM book_likes WHERE assigned_book_id IN (?) GROUP BY assigned_book_id`,
             [userId, assignmentIds]
        );

        const likesMap = new Map(likesData.map(l => [l.assigned_book_id, { likes: l.like_count, isLiked: l.is_liked_by_user > 0 }]));
        const processedBooks = books.map(book => ({
            ...book,
            genres: book.genres ? JSON.parse(book.genres) : [],
            perfect_for: book.perfect_for ? JSON.parse(book.perfect_for) : [],
            likes: likesMap.get(book.assignmentId)?.likes ?? 0,
            isLiked: likesMap.get(book.assignmentId)?.isLiked ?? false,
        }));
        
        res.status(200).json({ success: true, data: processedBooks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Get comments for a specific book
const getComments = async (req, res) => {
    try {
        const { bookId } = req.params;
        const [comments] = await pool.query(`
            SELECT c.id, p.full_name as userName, p.profile_image_url as profileImageUrl, c.comment_text as text, c.created_at as timestamp
            FROM book_comments c JOIN profiles p ON c.user_id = p.user_id WHERE c.book_id = ? ORDER BY c.created_at DESC
        `, [bookId]);
        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Add a comment to a book
// In src/controllers/bookController.js

// @desc    Add a comment to a book
const addComment = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;

        if (!text || text.trim() === '') {
            return res.status(400).json({ success: false, message: "Comment text cannot be empty." });
        }

        // Step 1: Insert the new comment
        const [result] = await pool.query(
            "INSERT INTO book_comments (book_id, user_id, comment_text) VALUES (?, ?, ?)",
            [bookId, userId, text.trim()]
        );

        // ======================= THE FIX =======================
        // Step 2: Fetch the complete comment *with user details* to send back to the app.
        // This JOIN was missing, causing the blank comment issue.
        const [[newComment]] = await pool.query(`
            SELECT 
                c.id, 
                p.full_name as userName, 
                p.profile_image_url as profileImageUrl, 
                c.comment_text as text, 
                c.created_at as timestamp
            FROM book_comments c
            JOIN profiles p ON c.user_id = p.user_id
            WHERE c.id = ?
        `, [result.insertId]);
        // =======================================================

        res.status(201).json({ success: true, data: newComment });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Update a comment
const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;
        const [result] = await pool.query("UPDATE book_comments SET comment_text = ? WHERE id = ? AND user_id = ?", [text, commentId, req.user.id]);
        if (result.affectedRows === 0) return res.status(403).json({ success: false, message: "Not authorized or comment not found." });
        res.status(200).json({ success: true, message: "Comment updated." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Delete a comment
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const [result] = await pool.query("DELETE FROM book_comments WHERE id = ? AND (user_id = ? OR ? = 'superior_admin')", [commentId, req.user.id, req.user.role]);
        if (result.affectedRows === 0) return res.status(403).json({ success: false, message: "Not authorized or comment not found." });
        res.status(200).json({ success: true, message: "Comment deleted." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Toggle like status for an assigned book
const toggleLike = async (req, res) => {
    const { assignmentId } = req.params;
    const userId = req.user.id;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [[like]] = await connection.query("SELECT id FROM book_likes WHERE assigned_book_id = ? AND user_id = ?", [assignmentId, userId]);
        let isNowLiked = false;
        if (like) {
            await connection.query("DELETE FROM book_likes WHERE id = ?", [like.id]);
        } else {
            await connection.query("INSERT INTO book_likes (assigned_book_id, user_id) VALUES (?, ?)", [assignmentId, userId]);
            isNowLiked = true;
        }
        const [[{ likes }]] = await connection.query("SELECT COUNT(*) as likes FROM book_likes WHERE assigned_book_id = ?", [assignmentId]);
        await connection.commit();
        res.status(200).json({ success: true, data: { isLiked: isNowLiked, likes } });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: "Server error." });
    } finally {
        connection.release();
    }
};

// @desc    Update the read status of an assignment
const updateReadStatus = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { isRead } = req.body;
        await pool.query("UPDATE assigned_books SET is_read = ? WHERE id = ?", [isRead, assignmentId]);
        res.status(200).json({ success: true, message: "Status updated." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Create a new book in the master 'books' table (Admin)
// In src/controllers/bookController.js

const createMasterBook = async (req, res) => {
    try {
        const { title, author, cover_url, description, rating, genres, is_featured, pull_quote, full_review, perfect_for } = req.body;
        
        const [result] = await pool.query(
            "INSERT INTO books (tenant_id, title, author, cover_url, description, rating, genres, is_featured, pull_quote, full_review, perfect_for) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                req.user.tenant_id, title, author, cover_url, description, 
                rating || 0.0, 
                // Ensure data is stringified for JSON columns
                JSON.stringify(genres || []), 
                is_featured || 0, 
                pull_quote || '', 
                full_review || '', 
                JSON.stringify(perfect_for || [])
            ]
        );
        res.status(201).json({ success: true, message: "Master book created successfully.", data: { id: result.insertId } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Assign a book to a user (Admin)
const assignBook = async (req, res) => {
    try {
        const { userId, bookTitle, finishBy, availability } = req.body;
        const adminId = req.user.id;
        const tenantId = req.user.tenant_id;
        const [[book]] = await pool.query("SELECT id FROM books WHERE title = ? AND tenant_id = ? LIMIT 1", [bookTitle, tenantId]);
        if (!book) {
            return res.status(404).json({ success: false, message: `Book with title "${bookTitle}" not found in master library.` });
        }
        await pool.query(
            "INSERT INTO assigned_books (book_id, user_id, deadline, availability, assigned_by) VALUES (?, ?, ?, ?, ?)",
            [book.id, userId, finishBy, availability, adminId]
        );
        res.status(201).json({ success: true, message: "Book assigned successfully." });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: "This user has already been assigned this book." });
        }
        res.status(500).json({ success: false, message: "Server error." });
    }
};

module.exports = {
    getAssignedBooks, getComments, addComment, updateComment, deleteComment,
    toggleLike, updateReadStatus, createMasterBook, assignBook
};