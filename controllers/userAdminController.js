const pool = require('../config/db');
const logAudit = async (connection, { tenant_id, admin_user_id, affected_user_id, action_type, action_description, previous_value, new_value }) => {
    const sql = `
        INSERT INTO audit_logs 
            (tenant_id, admin_user_id, affected_user_id, action_type, action_description, previous_value, new_value) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.query(sql, [tenant_id, admin_user_id, affected_user_id, action_type, action_description, previous_value, new_value]);
};


const updateUserRoles = async (req, res) => {
    const { userId } = req.params;
    const { shouldBeAdmin, role: roleToToggle } = req.body;

    if (typeof shouldBeAdmin !== 'boolean' || !roleToToggle) {
        return res.status(400).json({ success: false, message: 'Invalid payload.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [users] = await connection.query('SELECT role FROM users WHERE id = ?', [userId]);

        if (users.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        
        const currentRoleString = users[0].role || 'user';
        let roles = currentRoleString.split(',').map(r => r.trim()).filter(r => r);
        const hasRole = roles.includes(roleToToggle);

        if (shouldBeAdmin && !hasRole) {
            roles.push(roleToToggle);
        } else if (!shouldBeAdmin && hasRole) {
            roles = roles.filter(r => r !== roleToToggle);
        }

        const newRoleString = [...new Set(roles)].join(',') || 'user';

        if (newRoleString !== currentRoleString) {
            await connection.query('UPDATE users SET role = ? WHERE id = ?', [newRoleString, userId]);
            
            // ======================== THE FIX IS HERE ========================
            // We now log descriptive names instead of true/false.
            const previousValue = hasRole ? roleToToggle : 'user';
            const newValue = shouldBeAdmin ? roleToToggle : 'user';
            
            await logAudit(connection, {
                tenant_id: req.user.tenant_id,
                admin_user_id: req.user.id,
                affected_user_id: userId,
                action_type: 'ROLE_CHANGE',
                action_description: `Role permissions updated`,
                previous_value: previousValue,
                new_value: newValue
            });
            // ===============================================================
        }
        
        await connection.commit();
        res.status(200).json({ success: true, message: 'User roles updated successfully.' });

    } catch (error) {
        await connection.rollback();
        console.error("Error updating user roles:", error);
        res.status(500).json({ success: false, message: 'Server error.' });
    } finally {
        connection.release();
    }
};



const getUserDetailsForAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        const [[details]] = await pool.query(`
            SELECT u.id, u.email, u.role, u.is_active, p.* 
            FROM users u 
            JOIN profiles p ON u.id = p.user_id 
            WHERE u.id = ?`, [userId]);
            
        if (!details) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        
        const [customValues] = await pool.query('SELECT field_id, option_id FROM custom_field_values WHERE user_id = ?', [userId]);
        details.custom_field_values = customValues;

        res.status(200).json({ success: true, data: details });
    } catch (error) { 
        console.error("Error in getUserDetailsForAdmin:", error);
        res.status(500).json({ success: false, message: 'Server error fetching user details.' }); 
    }
};

const verifyUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const [result] = await pool.query('UPDATE users SET is_verified = TRUE WHERE id = ?', [userId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.status(200).json({ success: true, message: 'User verified successfully.' });
    } catch (error) { 
        console.error("Error in verifyUser:", error);
        res.status(500).json({ success: false, message: 'Server error verifying user.' }); 
    }
};

const updateUserByAdmin = async (req, res) => {
    const { userId } = req.params;
    const updates = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const userUpdates = {};
        if (updates.is_active !== undefined) {
            userUpdates.is_active = updates.is_active;
        }

        const profileUpdates = {};
        // ======================= THE FIX IS HERE =======================
        // This line ensures that if 'service_status' is sent from the frontend,
        // it gets added to the list of things to update in the 'profiles' table.
        // ===============================================================
        if (updates.service_status !== undefined) {
            profileUpdates.service_status = updates.service_status;
        }

        if (Object.keys(userUpdates).length > 0) {
            await connection.query('UPDATE users SET ? WHERE id = ?', [userUpdates, userId]);
        }
        if (Object.keys(profileUpdates).length > 0) {
            await connection.query('UPDATE profiles SET ? WHERE user_id = ?', [profileUpdates, userId]);
        }
        
        if (updates.custom_field_values && typeof updates.custom_field_values === 'object') {
            await connection.query('DELETE FROM custom_field_values WHERE user_id = ?', [userId]);
            for (const field_id in updates.custom_field_values) {
                const option_id = updates.custom_field_values[field_id];
                if (option_id && option_id !== 'null' && option_id !== null) {
                    await connection.query(`INSERT INTO custom_field_values (user_id, field_id, option_id) VALUES (?, ?, ?)`, [userId, field_id, option_id]);
                }
            }
        }

        await connection.commit();
        res.status(200).json({ success: true, message: 'User updated successfully.' });
    } catch (error) {
        await connection.rollback();
        console.error("Error in updateUserByAdmin:", error);
        res.status(500).json({ success: false, message: 'Server error during update.' });
    } finally {
        connection.release();
    }
};
// ===================================
// SERVICE SECTOR & UNIT CONTROLLERS
// ===================================
const createServiceSector = async (req, res) => {
    try {
        const { name } = req.body;
        const tenant_id = req.user.tenant_id;
        const [result] = await pool.query('INSERT INTO service_sectors (tenant_id, name) VALUES (?, ?)', [tenant_id, name]);
        res.status(201).json({ success: true, message: 'Service Sector created.', data: { id: result.insertId, name } });
    } catch (error) {
        console.error('Create Sector Error:', error);
        res.status(500).json({ success: false, message: 'Server error creating sector.' });
    }
};

const getServiceSectors = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const [sectors] = await pool.query('SELECT * FROM service_sectors WHERE tenant_id = ? ORDER BY name ASC', [tenant_id]);
        res.status(200).json({ success: true, data: sectors });
    } catch (error) {
        console.error('Get Sectors Error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching sectors.' });
    }
};

const deleteServiceSector = async (req, res) => {
    try {
        const { sectorId } = req.params;
        await pool.query('DELETE FROM service_sectors WHERE id = ? AND tenant_id = ?', [sectorId, req.user.tenant_id]);
        res.status(200).json({ success: true, message: 'Service sector deleted.' });
    } catch (error) {
        console.error('Delete Sector Error:', error);
        res.status(500).json({ success: false, message: 'Server error deleting sector.' });
    }
};

const createServiceUnit = async (req, res) => {
    try {
        const { sector_id, name } = req.body;
        const [result] = await pool.query('INSERT INTO service_units (sector_id, name) VALUES (?, ?)', [sector_id, name]);
        res.status(201).json({ success: true, message: 'Service Unit created.', data: { id: result.insertId, name } });
    } catch (error) {
        console.error('Create Unit Error:', error);
        res.status(500).json({ success: false, message: 'Server error creating unit.' });
    }
};

const getServiceUnitsForSector = async (req, res) => {
    try {
        const { sectorId } = req.params;
        const [units] = await pool.query('SELECT id, name FROM service_units WHERE sector_id = ? ORDER BY name ASC', [sectorId]);
        res.status(200).json({ success: true, data: units });
    } catch (error) {
        console.error('Get Units Error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching units.' });
    }
};

const deleteServiceUnit = async (req, res) => {
    try {
        await pool.query('DELETE FROM service_units WHERE id = ?', [req.params.unitId]);
        res.status(200).json({ success: true, message: 'Service unit deleted.' });
    } catch (error) {
        console.error('Delete Unit Error:', error);
        res.status(500).json({ success: false, message: 'Server error deleting unit.' });
    }
};

// ===================================
// PROFILE VISIBILITY CONTROLLERS
// ===================================
const getProfileSettings = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const [settings] = await pool.query('SELECT widget_key, is_visible FROM tenant_profile_settings WHERE tenant_id = ?', [tenant_id]);
        const settingsMap = settings.reduce((acc, setting) => {
            acc[setting.widget_key] = !!setting.is_visible;
            return acc;
        }, {});
        res.status(200).json({ success: true, data: settingsMap });
    } catch (error) {
        console.error('Get Profile Settings Error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching settings.' });
    }
};

const updateProfileSettings = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const tenant_id = req.user.tenant_id;
        const settings = req.body;
        
        await connection.beginTransaction();
        for (const widget_key in settings) {
            const is_visible = settings[widget_key];
            await connection.query(
                `INSERT INTO tenant_profile_settings (tenant_id, widget_key, is_visible) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE is_visible = ?`,
                [tenant_id, widget_key, is_visible, is_visible]
            );
        }
        await connection.commit();
        res.status(200).json({ success: true, message: 'Profile settings updated.' });
    } catch (error) {
        await connection.rollback();
        console.error('Update Profile Settings Error:', error);
        res.status(500).json({ success: false, message: 'Server error updating settings.' });
    } finally {
        connection.release();
    }
};

// ===================================
// CHANGE LOG CONTROLLERS
// ===================================
const getUsersWithUnreviewedChanges = async (req, res) => {
    try {
        const [users] = await pool.query(`
            SELECT u.id, p.full_name, COUNT(cl.id) as unreviewed_changes 
            FROM change_logs cl 
            JOIN users u ON cl.user_id = u.id 
            JOIN profiles p ON u.id = p.user_id 
            WHERE cl.is_reviewed = FALSE 
            GROUP BY u.id, p.full_name 
            ORDER BY MAX(cl.created_at) DESC`);
        res.status(200).json({ success: true, data: users });
    } catch (error) { 
        console.error("Error in getUsersWithUnreviewedChanges:", error);
        res.status(500).json({ success: false, message: 'Server error fetching log summary.' }); 
    }
};

const getChangeLogForUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const [logs] = await pool.query('SELECT * FROM change_logs WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.status(200).json({ success: true, data: logs });
    } catch (error) { 
        console.error("Error in getChangeLogForUser:", error);
        res.status(500).json({ success: false, message: 'Server error fetching user log.' }); 
    }
};

const markLogsAsReviewed = async (req, res) => {
    try {
        const { userId } = req.params;
        await pool.query('UPDATE change_logs SET is_reviewed = TRUE WHERE user_id = ?', [userId]);
        res.status(200).json({ success: true, message: 'Logs marked as reviewed.' });
    } catch (error) { 
        console.error("Error in markLogsAsReviewed:", error);
        res.status(500).json({ success: false, message: 'Server error updating logs.' }); 
    }
};
// ADD THIS ENTIRE FUNCTION
// ADD THIS ENTIRE FUNCTION to src/controllers/userAdminController.js
// ADD THIS ENTIRE FUNCTION to src/controllers/userAdminController.js

const getAllUsers = async (req, res) => {
    const tenantId = req.user.tenant_id;
    try {
        const [users] = await pool.query(`
            SELECT u.id, p.full_name, u.email, u.role, u.is_verified
            FROM users u
            JOIN profiles p ON u.id = p.user_id
            WHERE u.tenant_id = ?
            ORDER BY p.full_name;
        `, [tenantId]);
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Error fetching all users for admin:", error);
        res.status(500).json({ success: false, message: 'Server error fetching users.' });
    }
};



// ===================================
// MODULE EXPORTS - THIS IS THE FIX
// ===================================
module.exports = { 
    // User Management
    getAllUsers, 
    getUserDetailsForAdmin, 
    verifyUser, 
    updateUserByAdmin,
    updateUserRoles, 
    
    // Service Group Management (These were missing before)
    createServiceSector, 
    getServiceSectors, 
    deleteServiceSector, 
    createServiceUnit, 
    getServiceUnitsForSector, 
    deleteServiceUnit,

    // Profile Visibility
    getProfileSettings,
    updateProfileSettings,
    
    // Change Logs
    getUsersWithUnreviewedChanges,
    getChangeLogForUser,
    markLogsAsReviewed
};