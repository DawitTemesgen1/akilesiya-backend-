const pool = require('../config/db');

/**
 * @desc    Get all users with their library roles for management.
 * @route   GET /api/librarian-admin/users
 * @access  Private (Superior Admin)
 */
const getAllUsersWithLibraryRoles = async (req, res) => {
    try {
        const [users] = await pool.query(`
            SELECT 
                u.id,
                p.full_name,
                p.profile_image_url,
                u.role
            FROM users u
            JOIN profiles p ON u.id = p.user_id
            WHERE u.tenant_id = ? AND u.is_active = 1
            ORDER BY p.full_name ASC
        `, [req.user.tenant_id]);

        const formattedUsers = users.map(user => ({
            id: user.id,
            fullName: user.full_name,
            profileImageUrl: user.profile_image_url,
            // Check if the role string contains the specific roles
            isLibrarian: user.role.includes('librarian'),
            isLibraryAdmin: user.role.includes('library_admin')
        }));

        res.status(200).json({ success: true, data: formattedUsers });

    } catch (error) {
        console.error("Error fetching users for librarian admin:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

/**
 * @desc    Update a user's library-specific roles.
 * @route   PUT /api/librarian-admin/users/:userId/roles
 * @access  Private (Superior Admin)
 */
const updateUserLibraryRoles = async (req, res) => {
    const { userId } = req.params;
    const { isLibrarian, isLibraryAdmin } = req.body; // Expecting booleans

    if (typeof isLibrarian !== 'boolean' || typeof isLibraryAdmin !== 'boolean') {
        return res.status(400).json({ success: false, message: 'Invalid role data provided.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Get the user's current roles
        const [[user]] = await connection.query('SELECT role FROM users WHERE id = ?', [userId]);
        if (!user) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // 2. Manipulate the roles as a Set for easy addition/removal
        let currentRoles = new Set(user.role.split(','));

        // Add or remove librarian role
        if (isLibrarian) {
            currentRoles.add('librarian');
        } else {
            currentRoles.delete('librarian');
        }

        // Add or remove library_admin role
        if (isLibraryAdmin) {
            currentRoles.add('library_admin');
        } else {
            currentRoles.delete('library_admin');
        }
        
        // Ensure 'user' role is present if no other primary roles exist
        if (currentRoles.size === 0) {
            currentRoles.add('user');
        } else if (currentRoles.size > 1 && currentRoles.has('user')) {
             // A user with specific roles shouldn't also be just a plain 'user'
            currentRoles.delete('user');
        }

        // 3. Convert the Set back to a comma-separated string for the DB
        const newRolesString = Array.from(currentRoles).join(',');

        // 4. Update the user in the database
        await connection.query('UPDATE users SET role = ? WHERE id = ?', [newRolesString, userId]);

        await connection.commit();
        res.status(200).json({ success: true, message: 'User roles updated successfully.' });

    } catch (error) {
        await connection.rollback();
        console.error("Error updating user library roles:", error);
        res.status(500).json({ success: false, message: "Server error while updating roles." });
    } finally {
        connection.release();
    }
};


module.exports = {
    getAllUsersWithLibraryRoles,
    updateUserLibraryRoles,
};