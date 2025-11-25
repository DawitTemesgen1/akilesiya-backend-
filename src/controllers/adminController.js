// src/controllers/adminController.js

const pool = require('../config/db');

// @desc    Get all users for general admin management
const getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query(`
            SELECT u.id, u.email, u.role, p.full_name, p.profile_image_url
            FROM users u LEFT JOIN profiles p ON u.id = p.user_id
            WHERE u.tenant_id = ? ORDER BY p.full_name
        `, [req.user.tenant_id]);
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error while fetching users.' });
    }
};

// @desc    Update a user's general details
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { full_name, role } = req.body;
    if (!full_name || !role) {
        return res.status(400).json({ message: 'Full name and role are required.' });
    }
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
        await connection.query('UPDATE profiles SET full_name = ? WHERE user_id = ?', [full_name, id]);
        await connection.commit();
        res.status(200).json({ message: 'User updated successfully.' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Server error while updating user.' });
    } finally {
        connection.release();
    }
};

// @desc    Get users eligible for plan admin promotion
const getPlanAdminCandidates = async (req, res) => {
    const tenantId = req.user.tenant_id;
    try {
        const [users] = await pool.query(
            "SELECT u.id, u.email, p.full_name, p.profile_image_url FROM users u JOIN profiles p ON u.id = p.user_id WHERE u.tenant_id = ? AND u.role = 'user'",
            [tenantId]
        );
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Get users eligible for development admin promotion
const getDevelopmentAdminCandidates = async (req, res) => {
    const tenantId = req.user.tenant_id;
    try {
        const [users] = await pool.query(
            `SELECT u.id, u.email, u.role, p.full_name, p.profile_image_url 
             FROM users u JOIN profiles p ON u.id = p.user_id 
             WHERE u.tenant_id = ? 
             AND u.role != 'superior_admin' 
             AND NOT FIND_IN_SET('development_admin', u.role)`,
            [tenantId]
        );
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Update a user's roles (add or remove a single role from the SET)
const updateUserRoles = async (req, res) => {
    const { userId, role, action } = req.body; // action can be 'add' or 'remove'

    if (!userId || !role || !action || !['add', 'remove'].includes(action)) {
        return res.status(400).json({ success: false, message: "User ID, a valid role, and an action ('add' or 'remove') are required." });
    }
    if (userId === req.user.id) {
        return res.status(400).json({ success: false, message: "Cannot change your own roles."});
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [[user]] = await connection.query("SELECT role FROM users WHERE id = ?", [userId]);
        if (!user) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const currentRoles = new Set(user.role ? user.role.split(',').filter(r => r) : []);

        if (action === 'add') {
            currentRoles.add(role);
        } else { // 'remove'
            currentRoles.delete(role);
        }
        
        if (currentRoles.size > 1) {
            currentRoles.delete('user');
        }
        if (currentRoles.size === 0) {
            currentRoles.add('user');
        }
        
        const newRoles = Array.from(currentRoles).join(',');

        await connection.query("UPDATE users SET role = ? WHERE id = ?", [newRoles, userId]);

        await connection.commit();
        res.status(200).json({ success: true, message: `User roles updated to: ${newRoles}` });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: "Server error while updating roles." });
    } finally {
        connection.release();
    }
};

// @desc    Get all users with their library roles for management.
const getAllUsersWithLibraryRoles = async (req, res) => {
    try {
        const [users] = await pool.query(`
            SELECT u.id, p.full_name, p.profile_image_url, u.role
            FROM users u JOIN profiles p ON u.id = p.user_id
            WHERE u.tenant_id = ? AND u.is_active = 1
            ORDER BY p.full_name ASC
        `, [req.user.tenant_id]);

        const formattedUsers = users.map(user => ({
            id: user.id,
            fullName: user.full_name,
            profileImageUrl: user.profile_image_url,
            isLibrarian: user.role.includes('librarian'),
            isLibraryAdmin: user.role.includes('library_admin')
        }));
        res.status(200).json({ success: true, data: formattedUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Update a user's library-specific roles.
const updateUserLibraryRoles = async (req, res) => {
    const { userId } = req.params;
    const { isLibrarian, isLibraryAdmin } = req.body;


    if (typeof isLibrarian !== 'boolean' || typeof isLibraryAdmin !== 'boolean') {
        return res.status(400).json({ success: false, message: 'Invalid role data provided.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [[user]] = await connection.query('SELECT role FROM users WHERE id = ?', [userId]);
        if (!user) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        let currentRoles = new Set(user.role.split(',').filter(r => r));

        if (isLibrarian) currentRoles.add('librarian');
        else currentRoles.delete('librarian');

        if (isLibraryAdmin) currentRoles.add('library_admin');
        else currentRoles.delete('library_admin');
        

        if (currentRoles.size > 1) currentRoles.delete('user');
        if (currentRoles.size === 0) currentRoles.add('user');
        
        const newRolesString = Array.from(currentRoles).join(',');
        
        const [updateResult] = await connection.query('UPDATE users SET role = ? WHERE id = ?', [newRolesString, userId]);
        
        await connection.commit();
        res.status(200).json({ success: true, message: 'User library roles updated successfully.' });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: "Server error while updating roles." });
    } finally {
        connection.release();
    }
};

// @desc    Get all users with their learning roles for management.
const getAllUsersWithLearningRoles = async (req, res) => {
    try {
        const [users] = await pool.query(`
            SELECT u.id, p.full_name, p.profile_image_url, u.role
            FROM users u JOIN profiles p ON u.id = p.user_id
            WHERE u.tenant_id = ? AND u.is_active = 1
            ORDER BY p.full_name ASC
        `, [req.user.tenant_id]);

        const formattedUsers = users.map(user => ({
            id: user.id,
            fullName: user.full_name,
            profileImageUrl: user.profile_image_url,
            isLearningAdmin: user.role.includes('learning_admin') 
        }));
        res.status(200).json({ success: true, data: formattedUsers });
    } catch (error) {
        console.error("Error fetching users for learning admin management:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Update a user's learning-specific role.
const updateUserLearningRoles = async (req, res) => {
    const { userId } = req.params;
    const { isLearningAdmin } = req.body;

    if (typeof isLearningAdmin !== 'boolean') {
        return res.status(400).json({ success: false, message: 'A boolean value for isLearningAdmin is required.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [[user]] = await connection.query('SELECT role FROM users WHERE id = ?', [userId]);
        if (!user) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        let currentRoles = new Set(user.role.split(',').filter(r => r));
        if (isLearningAdmin) currentRoles.add('learning_admin');
        else currentRoles.delete('learning_admin');

        if (currentRoles.size > 1) currentRoles.delete('user');
        if (currentRoles.size === 0) currentRoles.add('user');
        
        const newRolesString = Array.from(currentRoles).join(',');
        await connection.query('UPDATE users SET role = ? WHERE id = ?', [newRolesString, userId]);
        await connection.commit();
        res.status(200).json({ success: true, message: 'User learning roles updated successfully.' });

    } catch (error) {
        await connection.rollback();
        console.error("Error updating user learning roles:", error);
        res.status(500).json({ success: false, message: "Server error while updating roles." });
    } finally {
        connection.release();
    }
};


// =======================================================
// --- NEW FUNCTIONS FOR USER COCKPIT SCREEN ---
// =======================================================

// @desc    Get dashboard stats for user management.
const getUserStats = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const [totalUsersResult] = await pool.query('SELECT COUNT(id) as total FROM users WHERE tenant_id = ? AND is_active = 1', [tenantId]);
        const [totalAdminsResult] = await pool.query("SELECT COUNT(id) as total FROM users WHERE tenant_id = ? AND is_active = 1 AND role LIKE '%admin%'", [tenantId]);

        res.status(200).json({
            success: true,
            data: {
                totalMembers: totalUsersResult[0].total,
                totalAdmins: totalAdminsResult[0].total
            }
        });
    } catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Get a detailed, filterable list of all users.
const getDetailedUsers = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const { search, role, spiritualClass } = req.query;

        let query = `
            SELECT u.id, p.full_name, u.email, u.role, p.profile_image_url, p.spiritual_class
            FROM users u
            JOIN profiles p ON u.id = p.user_id
            WHERE u.tenant_id = ? AND u.is_active = 1
        `;
        const params = [tenantId];

        if (search) {
            query += ' AND (p.full_name LIKE ? OR u.email LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (role) {
            query += ' AND FIND_IN_SET(?, u.role)';
            params.push(role);
        }
        if (spiritualClass) {
            query += ' AND p.spiritual_class = ?';
            params.push(spiritualClass);
        }
        query += ' ORDER BY p.full_name ASC';
        const [users] = await pool.query(query, params);
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Error fetching detailed users:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// @desc    Get a complete profile for a single user for printing/details.
// THIS IS THE FUNCTION WITH ADDED DEBUGGING.
const getFullUserDetail = async (req, res) => {
    try {
        const { userId } = req.params;

        // =======================================================
        // --- THE FIX: ADDED THE MISSING SERVICE HISTORY FIELDS ---
        // =======================================================
        const [rows] = await pool.query(`
            SELECT 
                u.id, u.email, u.role,
                p.full_name, p.profile_image_url, p.christian_name, p.confession_father_name,
                p.mother_name, p.gender, p.dob, p.academic_level, p.phone_number,
                p.parent_name, p.parent_phone_number, p.spiritual_class, p.kifil,
                p.member_level, p.service_status, p.service_assignment,
                -- Added the service history fields here --
                p.had_previous_service, p.previous_department, p.previous_responsibility, p.previous_service_level,
                GROUP_CONCAT(
                    DISTINCT JSON_OBJECT(
                        'fieldName', cf.name,
                        'fieldTab', cf.profile_tab,
                        'optionValue', cfo.option_value
                    )
                ) as custom_fields_json_string
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            LEFT JOIN custom_field_values cfv ON u.id = cfv.user_id
            LEFT JOIN custom_fields cf ON cfv.field_id = cf.id
            LEFT JOIN custom_field_options cfo ON cfv.option_id = cfo.id
            WHERE u.id = ?
            GROUP BY u.id
        `, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        let userDetail = rows[0];
        
        // Custom fields parsing logic (unchanged)
        if (userDetail.custom_fields_json_string) {
            try {
                userDetail.custom_fields = JSON.parse(`[${userDetail.custom_fields_json_string}]`);
                userDetail.custom_fields = userDetail.custom_fields.filter(cf => cf !== null);
            } catch (e) {
                userDetail.custom_fields = [];
            }
        } else {
            userDetail.custom_fields = [];
        }
        delete userDetail.custom_fields_json_string;

        res.status(200).json({ success: true, data: userDetail });

    } catch (error) {
        console.error("Error fetching full user detail:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};



module.exports = {
    getAllUsers,
    updateUser,
    getPlanAdminCandidates,
    getDevelopmentAdminCandidates,
    updateUserRoles,
    getAllUsersWithLibraryRoles,
    updateUserLibraryRoles,
    getAllUsersWithLearningRoles,
    updateUserLearningRoles,
    getUserStats,
    getDetailedUsers,
    getFullUserDetail
};