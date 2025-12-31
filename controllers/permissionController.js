const pool = require('../config/db');

// --- Helper: Get All Screens ---
const getAllScreens = async (req, res) => {
    try {
        const [screens] = await pool.query('SELECT * FROM screens ORDER BY display_name');
        res.status(200).json({ success: true, data: screens });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- Helper: Get All Users (Simple List for Dropdown) ---
const getAllUsersSimple = async (req, res) => {
    try {
        // Fetch only necessary fields
        const [users] = await pool.query(`
            SELECT u.id, p.full_name, u.email, u.role
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            WHERE u.tenant_id = ?
            ORDER BY p.full_name
        `, [req.user.tenant_id]);
        res.status(200).json({ success: true, data: users });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- ROLE PERMISSIONS ---

const getRolePermissions = async (req, res) => {
    const { roleName } = req.params;
    try {
        const [rows] = await pool.query('SELECT screen_id FROM role_screen_permissions WHERE role_name = ?', [roleName]);
        const ids = rows.map(r => r.screen_id);
        res.status(200).json({ success: true, data: ids });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const updateRolePermissions = async (req, res) => {
    const { p_role_name, p_screen_ids } = req.body; // Expects array of IDs
    if (!p_role_name) return res.status(400).json({ success: false, message: 'Role name required' });

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Clear existing
        await connection.query('DELETE FROM role_screen_permissions WHERE role_name = ?', [p_role_name]);

        // 2. Insert new
        if (p_screen_ids && p_screen_ids.length > 0) {
            const values = p_screen_ids.map(id => [p_role_name, id]);
            await connection.query('INSERT INTO role_screen_permissions (role_name, screen_id) VALUES ?', [values]);
        }

        await connection.commit();
        res.status(200).json({ success: true, message: 'Role permissions updated' });
    } catch (e) {
        await connection.rollback();
        console.error(e);
        res.status(500).json({ success: false, message: 'Server Error' });
    } finally {
        connection.release();
    }
};

// --- USER PERMISSIONS (Override/Additional) ---

const getUserPermissions = async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await pool.query('SELECT screen_id FROM user_screen_permissions WHERE user_id = ?', [userId]);
        const ids = rows.map(r => r.screen_id);
        res.status(200).json({ success: true, data: ids });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const updateUserPermissions = async (req, res) => {
    const { user_id, screen_ids } = req.body;
    if (!user_id) return res.status(400).json({ success: false, message: 'User ID required' });

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Clear existing
        await connection.query('DELETE FROM user_screen_permissions WHERE user_id = ?', [user_id]);

        // 2. Insert new
        if (screen_ids && screen_ids.length > 0) {
            const values = screen_ids.map(id => [user_id, id]);
            await connection.query('INSERT INTO user_screen_permissions (user_id, screen_id) VALUES ?', [values]);
        }

        await connection.commit();
        res.status(200).json({ success: true, message: 'User permissions updated' });
    } catch (e) {
        await connection.rollback();
        console.error(e);
        res.status(500).json({ success: false, message: 'Server Error' });
    } finally {
        connection.release();
    }
};

module.exports = {
    getAllScreens,
    getAllUsersSimple,
    getRolePermissions,
    updateRolePermissions,
    getUserPermissions,
    updateUserPermissions
};
