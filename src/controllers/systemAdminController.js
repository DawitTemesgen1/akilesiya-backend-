const pool = require('../config/db');

// @desc    Search users across all schools
const searchUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', school_id = '', role = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT 
                u.*,
                p.full_name,
                p.profile_image_url,
                p.spiritual_class,
                t.name as school_name
            FROM users u
            JOIN profiles p ON u.id = p.user_id
            JOIN tenants t ON u.tenant_id = t.id
            WHERE 1=1
        `;

        const queryParams = [];

        if (search) {
            query += ' AND (p.full_name LIKE ? OR u.email LIKE ?)';
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        if (school_id) {
            query += ' AND u.tenant_id = ?';
            queryParams.push(school_id);
        }

        if (role) {
            query += ' AND u.role LIKE ?';
            queryParams.push(`%${role}%`);
        }

        query += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), parseInt(offset));

        const [users] = await pool.query(query, queryParams);

        // Get total count
        let countQuery = `
            SELECT COUNT(*) as total 
            FROM users u
            JOIN profiles p ON u.id = p.user_id
            JOIN tenants t ON u.tenant_id = t.id
            WHERE 1=1
        `;
        const countParams = [...queryParams.slice(0, -2)];

        if (search) {
            countQuery += ' AND (p.full_name LIKE ? OR u.email LIKE ?)';
        }
        if (school_id) {
            countQuery += ' AND u.tenant_id = ?';
        }
        if (role) {
            countQuery += ' AND u.role LIKE ?';
        }

        const [totalResult] = await pool.query(countQuery, countParams);

        res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalResult[0].total / limit),
                    totalItems: totalResult[0].total,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ success: false, message: 'Server error while searching users.' });
    }
};

// @desc    Get platform analytics
const getPlatformAnalytics = async (req, res) => {
    try {
        const { period = '30d' } = req.query;
        
        // Calculate date range based on period
        let dateRange;
        switch (period) {
            case '7d':
                dateRange = '7 DAY';
                break;
            case '90d':
                dateRange = '90 DAY';
                break;
            case '1y':
                dateRange = '1 YEAR';
                break;
            default:
                dateRange = '30 DAY';
        }

        // User growth analytics
        const [userGrowth] = await pool.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as new_users,
                SUM(COUNT(*)) OVER (ORDER BY DATE(created_at)) as cumulative_users
            FROM users 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${dateRange})
            GROUP BY DATE(created_at)
            ORDER BY date
        `);

        // School statistics
        const [schoolStats] = await pool.query(`
            SELECT 
                COUNT(*) as total_schools,
                SUM(is_active = 1) as active_schools,
                AVG((SELECT COUNT(*) FROM users u WHERE u.tenant_id = t.id AND u.is_active = 1)) as avg_members_per_school,
                MAX((SELECT COUNT(*) FROM users u WHERE u.tenant_id = t.id AND u.is_active = 1)) as max_members_per_school
            FROM tenants t
        `);

        // Role distribution
        const [roleDistribution] = await pool.query(`
            SELECT 
                CASE 
                    WHEN role LIKE '%system_admin%' THEN 'system_admin'
                    WHEN role LIKE '%superior_admin%' THEN 'superior_admin'
                    WHEN role LIKE '%admin%' THEN 'other_admin'
                    ELSE 'user'
                END as role_type,
                COUNT(*) as count
            FROM users 
            WHERE is_active = 1
            GROUP BY role_type
        `);

        // Activity metrics
        const [activityMetrics] = await pool.query(`
            SELECT 
                COUNT(DISTINCT u.id) as active_users_30d,
                COUNT(DISTINCT t.id) as active_schools_30d,
                (SELECT COUNT(*) FROM users WHERE last_login >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as recently_logged_in
            FROM users u
            JOIN tenants t ON u.tenant_id = t.id
            WHERE u.last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `);

        res.status(200).json({
            success: true,
            data: {
                userGrowth,
                schoolStats: schoolStats[0],
                roleDistribution,
                activityMetrics: activityMetrics[0]
            }
        });
    } catch (error) {
        console.error('Error fetching platform analytics:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching analytics.' });
    }
};

// @desc    Get system settings
const getSystemSettings = async (req, res) => {
    try {
        // Check if system_settings table exists, if not return defaults
        const [settings] = await pool.query(`
            SELECT setting_key, setting_value, data_type 
            FROM system_settings
        `).catch(async (error) => {
            // If table doesn't exist, create it and return defaults
            if (error.code === 'ER_NO_SUCH_TABLE') {
                await pool.query(`
                    CREATE TABLE system_settings (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        setting_key VARCHAR(255) NOT NULL UNIQUE,
                        setting_value TEXT NOT NULL,
                        data_type ENUM('string','boolean','number','json') DEFAULT 'string',
                        description TEXT,
                        updated_by VARCHAR(36),
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    )
                `);
                
                // Insert default settings
                const defaultSettings = [
                    ['platform_name', 'Amde Haymanot Sunday School System', 'string', 'Display name for the platform'],
                    ['allow_new_registrations', 'true', 'boolean', 'Allow new schools and users to register'],
                    ['require_email_verification', 'true', 'boolean', 'Users must verify their email address'],
                    ['max_schools_per_account', '1', 'number', 'Maximum number of schools a user can create'],
                    ['default_user_role', 'user', 'string', 'Default role for new users'],
                    ['maintenance_mode', 'false', 'boolean', 'Put the entire platform in maintenance mode'],
                    ['email_notifications', 'true', 'boolean', 'Send system-wide email notifications'],
                    ['data_retention_days', '365', 'number', 'How long to keep user data after account deletion']
                ];

                for (const [key, value, type, desc] of defaultSettings) {
                    await pool.query(
                        'INSERT INTO system_settings (setting_key, setting_value, data_type, description) VALUES (?, ?, ?, ?)',
                        [key, value, type, desc]
                    );
                }
                
                return [defaultSettings.map(([key, value, type]) => ({ setting_key: key, setting_value: value, data_type: type }))];
            }
            throw error;
        });

        // Convert to key-value object with proper data types
        const settingsMap = {};
        settings.forEach(setting => {
            switch (setting.data_type) {
                case 'boolean':
                    settingsMap[setting.setting_key] = setting.setting_value === 'true';
                    break;
                case 'number':
                    settingsMap[setting.setting_key] = parseInt(setting.setting_value);
                    break;
                case 'json':
                    try {
                        settingsMap[setting.setting_key] = JSON.parse(setting.setting_value);
                    } catch (e) {
                        settingsMap[setting.setting_key] = setting.setting_value;
                    }
                    break;
                default:
                    settingsMap[setting.setting_key] = setting.setting_value;
            }
        });

        res.status(200).json({
            success: true,
            data: settingsMap
        });
    } catch (error) {
        console.error('Error fetching system settings:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching settings.' });
    }
};

// @desc    Update system settings
const updateSystemSettings = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const settings = req.body;
        
        await connection.beginTransaction();

        for (const [key, value] of Object.entries(settings)) {
            let stringValue;
            let dataType = 'string';
            
            if (typeof value === 'boolean') {
                stringValue = value.toString();
                dataType = 'boolean';
            } else if (typeof value === 'number') {
                stringValue = value.toString();
                dataType = 'number';
            } else if (typeof value === 'object') {
                stringValue = JSON.stringify(value);
                dataType = 'json';
            } else {
                stringValue = value;
            }

            await connection.query(
                `INSERT INTO system_settings (setting_key, setting_value, data_type, updated_by) 
                 VALUES (?, ?, ?, ?) 
                 ON DUPLICATE KEY UPDATE setting_value = ?, data_type = ?, updated_by = ?`,
                [key, stringValue, dataType, req.user.id, stringValue, dataType, req.user.id]
            );
        }

        // Log the settings update
        await connection.query(
            `INSERT INTO system_audit_logs (system_admin_id, action_type, action_description, ip_address, user_agent) 
             VALUES (?, ?, ?, ?, ?)`,
            [req.user.id, 'SYSTEM_SETTINGS_UPDATED', 'Updated system settings', req.ip, req.get('User-Agent')]
        );

        await connection.commit();

        res.status(200).json({
            success: true,
            message: 'System settings updated successfully.'
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error updating system settings:', error);
        res.status(500).json({ success: false, message: 'Server error while updating settings.' });
    } finally {
        connection.release();
    }
};

// @desc    Toggle user active status
const toggleUserStatus = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { userId } = req.params;
        const { is_active } = req.body;

        if (typeof is_active !== 'boolean') {
            return res.status(400).json({ success: false, message: 'is_active must be a boolean.' });
        }

        await connection.beginTransaction();

        // Get user info for audit log
        const [users] = await connection.query(`
            SELECT u.id, u.email, p.full_name, t.name as school_name 
            FROM users u 
            JOIN profiles p ON u.id = p.user_id 
            JOIN tenants t ON u.tenant_id = t.id 
            WHERE u.id = ?
        `, [userId]);

        if (users.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const user = users[0];

        // Cannot deactivate system admins
        if (!is_active && user.role.includes('system_admin')) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'Cannot deactivate system administrators.' });
        }

        // Update user status
        await connection.query('UPDATE users SET is_active = ? WHERE id = ?', [is_active, userId]);

        // Log the action
        const action = is_active ? 'USER_ACTIVATED' : 'USER_DEACTIVATED';
        const description = is_active ? 
            `Activated user: ${user.full_name} (${user.email}) in ${user.school_name}` :
            `Deactivated user: ${user.full_name} (${user.email}) in ${user.school_name}`;
        
        await connection.query(
            `INSERT INTO system_audit_logs (system_admin_id, action_type, action_description, affected_tenant_id, affected_user_id, ip_address, user_agent) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [req.user.id, action, description, user.tenant_id, userId, req.ip, req.get('User-Agent')]
        );

        await connection.commit();

        res.status(200).json({
            success: true,
            message: `User ${is_active ? 'activated' : 'deactivated'} successfully.`
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error toggling user status:', error);
        res.status(500).json({ success: false, message: 'Server error while updating user status.' });
    } finally {
        connection.release();
    }
};

// @desc    Get user details for system admin
const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;

        const [users] = await pool.query(`
            SELECT 
                u.*,
                p.*,
                t.name as school_name,
                t.id as school_id
            FROM users u
            JOIN profiles p ON u.id = p.user_id
            JOIN tenants t ON u.tenant_id = t.id
            WHERE u.id = ?
        `, [userId]);

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const user = users[0];

        // Get user's custom fields
        const [customFields] = await pool.query(`
            SELECT 
                cf.name as field_name,
                cfo.option_value as selected_value
            FROM custom_field_values cfv
            JOIN custom_fields cf ON cfv.field_id = cf.id
            JOIN custom_field_options cfo ON cfv.option_id = cfo.id
            WHERE cfv.user_id = ?
        `, [userId]);

        // Get user's attendance summary
        const [attendanceSummary] = await pool.query(`
            SELECT 
                COUNT(*) as total_records,
                SUM(status = 'present') as present_count,
                SUM(status = 'absent') as absent_count,
                SUM(status = 'late') as late_count,
                MAX(attendance_date) as last_attendance
            FROM attendance 
            WHERE user_id = ?
        `, [userId]);

        res.status(200).json({
            success: true,
            data: {
                user,
                customFields,
                attendanceSummary: attendanceSummary[0],
                statistics: {
                    total_attendance: attendanceSummary[0]?.total_records || 0,
                    attendance_rate: attendanceSummary[0]?.total_records ? 
                        (attendanceSummary[0].present_count / attendanceSummary[0].total_records * 100).toFixed(1) : 0
                }
            }
        });

    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching user details.' });
    }
};

// =======================================================
// --- EXISTING FUNCTIONS (Keep these from before) ---
// =======================================================

// @desc    Get system-wide dashboard statistics
const getSystemDashboard = async (req, res) => {
    try {
        // Get total statistics
        const [schoolStats] = await pool.query(`
            SELECT 
                COUNT(*) as total_schools,
                SUM(is_active = 1) as active_schools
            FROM tenants
        `);

        const [userStats] = await pool.query(`
            SELECT 
                COUNT(*) as total_users,
                SUM(is_active = 1) as active_users,
                SUM(role LIKE '%admin%') as total_admins
            FROM users
        `);

        // Get recent activity
        const [recentActivity] = await pool.query(`
            SELECT 
                t.name as school_name,
                t.last_activity,
                (SELECT COUNT(*) FROM users u WHERE u.tenant_id = t.id AND u.is_active = 1) as active_members
            FROM tenants t
            ORDER BY t.last_activity DESC
            LIMIT 10
        `);

        // Get growth data (last 30 days)
        const [growthStats] = await pool.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as new_users
            FROM users 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date
        `);

        res.status(200).json({
            success: true,
            data: {
                schools: schoolStats[0],
                users: userStats[0],
                recentActivity,
                growthStats
            }
        });
    } catch (error) {
        console.error('Error fetching system dashboard:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching system dashboard.' });
    }
};

// @desc    Get all schools with detailed information
const getAllSchools = async (req, res) => {
    try {
        const { page = 1, limit = 20, search = '', status = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT 
                t.*,
                COUNT(u.id) as total_members,
                SUM(u.is_active = 1) as active_members,
                SUM(u.role LIKE '%admin%') as admin_count,
                MAX(u.created_at) as last_member_joined
            FROM tenants t
            LEFT JOIN users u ON t.id = u.tenant_id
        `;

        const queryParams = [];
        const whereConditions = [];

        if (search) {
            whereConditions.push('(t.name LIKE ? OR t.email LIKE ? OR t.pastor_name LIKE ?)');
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (status === 'active') {
            whereConditions.push('t.is_active = 1');
        } else if (status === 'inactive') {
            whereConditions.push('t.is_active = 0');
        }

        if (whereConditions.length > 0) {
            query += ` WHERE ${whereConditions.join(' AND ')}`;
        }

        query += ` GROUP BY t.id ORDER BY t.created_at DESC LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        const [schools] = await pool.query(query, queryParams);

        // Get total count for pagination
        let countQuery = `SELECT COUNT(*) as total FROM tenants t`;
        const countParams = [];
        
        if (whereConditions.length > 0) {
            countQuery += ` WHERE ${whereConditions.join(' AND ')}`;
            countParams.push(...queryParams.slice(0, -2)); // Remove limit and offset
        }

        const [totalResult] = await pool.query(countQuery, countParams);

        res.status(200).json({
            success: true,
            data: {
                schools,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalResult[0].total / limit),
                    totalItems: totalResult[0].total,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching schools:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching schools.' });
    }
};

// @desc    Get detailed information about a specific school
const getSchoolDetail = async (req, res) => {
    try {
        const { schoolId } = req.params;

        // Get school basic info
        const [schools] = await pool.query('SELECT * FROM tenants WHERE id = ?', [schoolId]);
        if (schools.length === 0) {
            return res.status(404).json({ success: false, message: 'School not found.' });
        }

        const school = schools[0];

        // Get member statistics
        const [memberStats] = await pool.query(`
            SELECT 
                COUNT(*) as total_members,
                SUM(is_active = 1) as active_members,
                SUM(is_verified = 1) as verified_members,
                SUM(role LIKE '%admin%') as admin_count,
                SUM(role = 'user') as regular_users,
                DATE(MIN(created_at)) as first_member_date,
                DATE(MAX(created_at)) as last_member_date
            FROM users 
            WHERE tenant_id = ?
        `, [schoolId]);

        // Get role distribution
        const [roleDistribution] = await pool.query(`
            SELECT 
                role,
                COUNT(*) as count
            FROM users 
            WHERE tenant_id = ? AND is_active = 1
            GROUP BY role
        `, [schoolId]);

        // Get recent activity
        const [recentActivity] = await pool.query(`
            SELECT 
                u.id,
                p.full_name,
                u.email,
                u.role,
                u.last_login,
                p.spiritual_class
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            WHERE u.tenant_id = ? AND u.is_active = 1
            ORDER BY u.last_login DESC
            LIMIT 10
        `, [schoolId]);

        // Get growth data for this school
        const [growthData] = await pool.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as new_members
            FROM users 
            WHERE tenant_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date
        `, [schoolId]);

        res.status(200).json({
            success: true,
            data: {
                school,
                statistics: memberStats[0],
                roleDistribution,
                recentActivity,
                growthData
            }
        });
    } catch (error) {
        console.error('Error fetching school detail:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching school details.' });
    }
};

// @desc    Create a new school
const createSchool = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const {
            name, description, address, phone, email, 
            pastor_name, service_times, established_date,
            primary_color = '#012564', accent_color = '#FFD700'
        } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'School name is required.' });
        }

        await connection.beginTransaction();

        const schoolId = require('uuid').v4();
        await connection.query(
            `INSERT INTO tenants (id, name, description, address, phone, email, pastor_name, service_times, established_date, primary_color, accent_color) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [schoolId, name, description, address, phone, email, pastor_name, service_times, established_date, primary_color, accent_color]
        );

        // Log the action
        await connection.query(
            `INSERT INTO system_audit_logs (system_admin_id, action_type, action_description, affected_tenant_id, ip_address, user_agent) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.id, 'SCHOOL_CREATED', `Created new school: ${name}`, schoolId, req.ip, req.get('User-Agent')]
        );

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'School created successfully.',
            data: { id: schoolId, name }
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error creating school:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'A school with this name already exists.' });
        }
        res.status(500).json({ success: false, message: 'Server error while creating school.' });
    } finally {
        connection.release();
    }
};

// @desc    Update school information
const updateSchool = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { schoolId } = req.params;
        const updates = req.body;

        await connection.beginTransaction();

        // Get current school data for audit log
        const [currentSchool] = await connection.query('SELECT * FROM tenants WHERE id = ?', [schoolId]);
        if (currentSchool.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'School not found.' });
        }

        // Update school
        await connection.query('UPDATE tenants SET ? WHERE id = ?', [updates, schoolId]);

        // Log the action
        await connection.query(
            `INSERT INTO system_audit_logs (system_admin_id, action_type, action_description, affected_tenant_id, ip_address, user_agent) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.id, 'SCHOOL_UPDATED', `Updated school information: ${currentSchool[0].name}`, schoolId, req.ip, req.get('User-Agent')]
        );

        await connection.commit();

        res.status(200).json({
            success: true,
            message: 'School updated successfully.'
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error updating school:', error);
        res.status(500).json({ success: false, message: 'Server error while updating school.' });
    } finally {
        connection.release();
    }
};

// @desc    Toggle school active status
const toggleSchoolStatus = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { schoolId } = req.params;
        const { is_active } = req.body;

        if (typeof is_active !== 'boolean') {
            return res.status(400).json({ success: false, message: 'is_active must be a boolean.' });
        }

        await connection.beginTransaction();

        // Get school name for audit log
        const [school] = await connection.query('SELECT name FROM tenants WHERE id = ?', [schoolId]);
        if (school.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'School not found.' });
        }

        // Update status
        await connection.query('UPDATE tenants SET is_active = ? WHERE id = ?', [is_active, schoolId]);

        // Log the action
        const action = is_active ? 'SCHOOL_ACTIVATED' : 'SCHOOL_DEACTIVATED';
        const description = is_active ? `Activated school: ${school[0].name}` : `Deactivated school: ${school[0].name}`;
        
        await connection.query(
            `INSERT INTO system_audit_logs (system_admin_id, action_type, action_description, affected_tenant_id, ip_address, user_agent) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [req.user.id, action, description, schoolId, req.ip, req.get('User-Agent')]
        );

        await connection.commit();

        res.status(200).json({
            success: true,
            message: `School ${is_active ? 'activated' : 'deactivated'} successfully.`
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error toggling school status:', error);
        res.status(500).json({ success: false, message: 'Server error while updating school status.' });
    } finally {
        connection.release();
    }
};

// @desc    Promote user to superior admin for a school
const promoteToSuperiorAdmin = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { schoolId } = req.params;
        const { userId } = req.body;

        await connection.beginTransaction();

        // Verify school exists
        const [school] = await connection.query('SELECT name FROM tenants WHERE id = ?', [schoolId]);
        if (school.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'School not found.' });
        }

        // Verify user exists and belongs to this school
        const [user] = await connection.query(
            'SELECT id, email, role FROM users WHERE id = ? AND tenant_id = ?',
            [userId, schoolId]
        );
        if (user.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'User not found in this school.' });
        }

        // Check if user is already a superior admin
        const currentRoles = new Set(user[0].role.split(',').filter(r => r));
        if (currentRoles.has('superior_admin')) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'User is already a superior admin.' });
        }

        // Update user role to include superior_admin
        currentRoles.add('superior_admin');
        if (currentRoles.size > 1) {
            currentRoles.delete('user');
        }
        const newRole = Array.from(currentRoles).join(',');

        await connection.query('UPDATE users SET role = ? WHERE id = ?', [newRole, userId]);

        // Log the action
        await connection.query(
            `INSERT INTO system_audit_logs (system_admin_id, action_type, action_description, affected_tenant_id, affected_user_id, ip_address, user_agent) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [req.user.id, 'USER_PROMOTED', `Promoted user to superior admin in school: ${school[0].name}`, schoolId, userId, req.ip, req.get('User-Agent')]
        );

        await connection.commit();

        res.status(200).json({
            success: true,
            message: 'User promoted to superior admin successfully.'
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error promoting user:', error);
        res.status(500).json({ success: false, message: 'Server error while promoting user.' });
    } finally {
        connection.release();
    }
};

// @desc    Get system audit logs
const getSystemAuditLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, action_type = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT 
                sal.*,
                t.name as school_name,
                u.email as admin_email
            FROM system_audit_logs sal
            LEFT JOIN tenants t ON sal.affected_tenant_id = t.id
            LEFT JOIN users u ON sal.system_admin_id = u.id
        `;

        const queryParams = [];
        if (action_type) {
            query += ' WHERE sal.action_type = ?';
            queryParams.push(action_type);
        }

        query += ' ORDER BY sal.timestamp DESC LIMIT ? OFFSET ?';
        queryParams.push(parseInt(limit), parseInt(offset));

        const [logs] = await pool.query(query, queryParams);

        // Get total count
        let countQuery = `SELECT COUNT(*) as total FROM system_audit_logs sal`;
        if (action_type) {
            countQuery += ' WHERE sal.action_type = ?';
        }
        const [totalResult] = await pool.query(countQuery, action_type ? [action_type] : []);

        res.status(200).json({
            success: true,
            data: {
                logs,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalResult[0].total / limit),
                    totalItems: totalResult[0].total,
                    itemsPerPage: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching system audit logs:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching audit logs.' });
    }
};
// @desc    Remove superior admin rights from a user
const removeSuperiorAdmin = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { schoolId } = req.params;
        const { userId } = req.body;

        await connection.beginTransaction();

        // Verify school exists
        const [school] = await connection.query('SELECT name FROM tenants WHERE id = ?', [schoolId]);
        if (school.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'School not found.' });
        }

        // Verify user exists and belongs to this school
        const [user] = await connection.query(
            'SELECT id, email, role FROM users WHERE id = ? AND tenant_id = ?',
            [userId, schoolId]
        );
        if (user.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'User not found in this school.' });
        }

        // Check if user is actually a superior admin
        const currentRoles = new Set(user[0].role.split(',').filter(r => r));
        if (!currentRoles.has('superior_admin')) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'User is not a superior admin.' });
        }

        // Remove superior_admin role
        currentRoles.delete('superior_admin');
        
        // If no roles left, add 'user' role
        if (currentRoles.size === 0) {
            currentRoles.add('user');
        }
        
        const newRole = Array.from(currentRoles).join(',');

        await connection.query('UPDATE users SET role = ? WHERE id = ?', [newRole, userId]);

        // Log the action
        await connection.query(
            `INSERT INTO system_audit_logs (system_admin_id, action_type, action_description, affected_tenant_id, affected_user_id, ip_address, user_agent) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [req.user.id, 'USER_DEMOTED', `Removed superior admin rights from user in school: ${school[0].name}`, schoolId, userId, req.ip, req.get('User-Agent')]
        );

        await connection.commit();

        res.status(200).json({
            success: true,
            message: 'Superior admin rights removed successfully.'
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error removing superior admin rights:', error);
        res.status(500).json({ success: false, message: 'Server error while removing admin rights.' });
    } finally {
        connection.release();
    }
};
// =======================================================
// --- EXPORT ALL FUNCTIONS ---
// =======================================================

module.exports = {
    // Dashboard and Overview
    getSystemDashboard,
    
    // School Management
    getAllSchools,
    getSchoolDetail,
    createSchool,
    updateSchool,
    toggleSchoolStatus,
    promoteToSuperiorAdmin,
    
    // User Management
    searchUsers,
    getUserDetails,
    toggleUserStatus,
    
    // Analytics and Settings
    getPlatformAnalytics,
    getSystemSettings,
    updateSystemSettings,
    removeSuperiorAdmin,
    // Audit Logs
    getSystemAuditLogs
};