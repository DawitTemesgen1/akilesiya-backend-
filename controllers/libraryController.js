const pool = require('../config/db');

// @desc    Get all users with their reading stats for the library
// @route   GET /api/library/readers
// @access  Private (Admin/Superior Admin)
const getReaders = async (req, res) => {
    try {
        // ======================= THE FIX =======================
        // The SQL query was modified to remove the "u.role = 'user'" filter.
        // This ensures that ALL members of the tenant (Sunday School) are fetched,
        // not just those with the specific role of 'user', allowing any member
        // to be assigned a book.
        // =======================================================
        const [users] = await pool.query(`
            SELECT 
                u.id, 
                p.full_name, 
                p.profile_image_url, 
                p.spiritual_class,
                (SELECT COUNT(*) FROM assigned_books ab WHERE ab.user_id = u.id AND ab.is_read = 0) as unfinishedBooksCount,
                (SELECT COUNT(*) FROM assigned_books ab WHERE ab.user_id = u.id AND ab.is_read = 0 AND ab.deadline < CURDATE()) as overdueBooksCount
            FROM users u
            JOIN profiles p ON u.id = p.user_id
            WHERE u.tenant_id = ?
            ORDER BY p.full_name
        `, [req.user.tenant_id]);

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Error fetching library readers:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Get the detailed reading history for a specific user
// @route   GET /api/library/history/:userId
// @access  Private (Admin/Superior Admin)
const getReadingHistory = async (req, res) => {
    const { userId } = req.params;
    try {
        const [history] = await pool.query(`
            SELECT 
                b.title as bookTitle,
                ab.deadline as finishBy,
                ab.is_read
            FROM assigned_books ab
            JOIN books b ON ab.book_id = b.id
            WHERE ab.user_id = ?
            ORDER BY ab.created_at DESC
        `, [userId]);

        const processedHistory = history.map(item => {
            let status = 'in_progress';
            // is_read is a tinyint(1), so it will be 1 for true, 0 for false.
            if (item.is_read === 1) {
                status = 'completed';
            } else if (item.finishBy && new Date(item.finishBy) < new Date()) {
                status = 'overdue';
            }
            return {
                bookTitle: item.bookTitle,
                finishBy: item.finishBy,
                status: status
            };
        });

        res.status(200).json({ success: true, data: processedHistory });
    } catch (error) {
        console.error("Error fetching reading history:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Assign a new book to a user
// @route   POST /api/library/assign
// @access  Private (Admin/Superior Admin)
const assignBook = async (req, res) => {
    console.log('--- Received request body for /api/library/assign ---');
    console.log(req.body);

    const { userId, bookTitle, finishBy } = req.body;
    const tenantId = req.user.tenant_id;

    if (!userId || !bookTitle || !finishBy) {
        return res.status(400).json({ success: false, message: "User, book title, and finish date are required." });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Check if the book already exists.
        let [books] = await connection.query('SELECT id FROM books WHERE title = ? AND tenant_id = ? LIMIT 1', [bookTitle, tenantId]);
        let bookId;

        if (books.length > 0) {
            // Use existing book's ID
            bookId = books[0].id;
        } else {
            // If book doesn't exist, create it.
            const [newBookResult] = await connection.query(
                'INSERT INTO books (title, author, tenant_id) VALUES (?, ?, ?)',
                [bookTitle, 'Assigned by Admin', tenantId]
            );
            bookId = newBookResult.insertId;
        }

        // Assign the book to the user
        await connection.query(
            'INSERT INTO assigned_books (book_id, user_id, deadline) VALUES (?, ?, ?)',
            [bookId, userId, finishBy]
        );

        await connection.commit();
        res.status(201).json({ success: true, message: 'Book assigned successfully.' });

    } catch (error) {
        await connection.rollback();
        console.error("Error assigning book:", error);
        if (error.code === 'ER_DUP_ENTRY') {
             return res.status(409).json({ success: false, message: "This user has already been assigned this book." });
        }
        res.status(500).json({ success: false, message: "Server error while assigning book." });
    } finally {
        connection.release();
    }
};

// Ensure all controller functions are exported
module.exports = {
    getReaders,
    getReadingHistory,
    assignBook
};