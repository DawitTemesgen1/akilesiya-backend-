// src/controllers/developmentController.js

const pool = require('../config/db');

// @desc    Get all development notes for a specific user
// @route   GET /api/development/:userId
// @access  Superior Admin / Development Admin
const getNotesForUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const [notes] = await pool.query(
            "SELECT * FROM development_notes WHERE user_id = ? ORDER BY date DESC",
            [userId]
        );
        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Create a new development note for a user
// @route   POST /api/development/:userId
// @access  Superior Admin / Development Admin
const createNote = async (req, res) => {
    try {
        const { userId } = req.params;
        const adminId = req.user.id; // The logged-in admin
        const { category, issue, plan, date } = req.body;

        if (!category || !issue || !plan || !date) {
            return res.status(400).json({ success: false, message: "Category, issue, plan, and date are required." });
        }

        const [result] = await pool.query(
            "INSERT INTO development_notes (user_id, admin_id, category, issue, plan, date) VALUES (?, ?, ?, ?, ?, ?)",
            [userId, adminId, category, issue, plan, date]
        );

        const [[newNote]] = await pool.query("SELECT * FROM development_notes WHERE id = ?", [result.insertId]);
        res.status(201).json({ success: true, data: newNote });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Update a specific development note
// @route   PUT /api/development/notes/:noteId
// @access  Superior Admin / Development Admin
const updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { category, issue, plan, date } = req.body;

        if (!category || !issue || !plan || !date) {
            return res.status(400).json({ success: false, message: "All fields are required for an update." });
        }
        
        await pool.query(
            "UPDATE development_notes SET category = ?, issue = ?, plan = ?, date = ? WHERE id = ?",
            [category, issue, plan, date, noteId]
        );

        const [[updatedNote]] = await pool.query("SELECT * FROM development_notes WHERE id = ?", [noteId]);
        res.status(200).json({ success: true, data: updatedNote });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Update a note's completion status
// @route   PATCH /api/development/notes/:noteId/status
// @access  Superior Admin / Development Admin
const updateNoteStatus = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { isCompleted } = req.body;

        if (isCompleted === undefined) {
            return res.status(400).json({ success: false, message: "isCompleted field is required." });
        }

        await pool.query(
            "UPDATE development_notes SET is_completed = ? WHERE id = ?",
            [isCompleted, noteId]
        );
        
        res.status(200).json({ success: true, message: "Status updated successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};


// @desc    Delete a development note
// @route   DELETE /api/development/notes/:noteId
// @access  Superior Admin / Development Admin
const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        await pool.query("DELETE FROM development_notes WHERE id = ?", [noteId]);
        res.status(200).json({ success: true, message: "Note deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};


// ======================= THE FIX =======================
// This block should ONLY export the functions defined in THIS file.
module.exports = {
    getNotesForUser,
    createNote,
    updateNote,
    updateNoteStatus,
    deleteNote
};
