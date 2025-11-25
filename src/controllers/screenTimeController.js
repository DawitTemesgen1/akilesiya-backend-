// src/controllers/screenTimeController.js

const pool = require('../config/db');

/**
 * @desc    Record screen time data sent from a user's device
 * @route   POST /api/screentime
 * @access  Private (Logged-in User)
 */
const recordScreenTime = async (req, res) => {
    const userId = req.user.id;
    const tenantId = req.user.tenant_id;
    const { usageData } = req.body; // Expecting an array of {packageName, durationInSeconds}

    if (!Array.isArray(usageData) || usageData.length === 0) {
        return res.status(400).json({ success: false, message: 'Usage data must be a non-empty array.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

        for (const item of usageData) {
            // Use INSERT ... ON DUPLICATE KEY UPDATE to avoid duplicate daily entries per app
            // This requires a unique key on (user_id, log_date, app_package_name)
            // Let's add it via a simple UPSERT logic for now.
            
            // First, delete any existing record for this user, app, and day
            await connection.query(
                'DELETE FROM screen_time_logs WHERE user_id = ? AND log_date = ? AND app_package_name = ?',
                [userId, today, item.packageName]
            );

            // Then, insert the new record
            if (item.durationInSeconds > 0) {
                 await connection.query(
                    'INSERT INTO screen_time_logs (user_id, tenant_id, app_package_name, duration_seconds, log_date) VALUES (?, ?, ?, ?, ?)',
                    [userId, tenantId, item.packageName, item.durationInSeconds, today]
                );
            }
        }

        await connection.commit();
        res.status(201).json({ success: true, message: 'Screen time data recorded.' });
    } catch (error) {
        await connection.rollback();
        console.error('Error recording screen time:', error);
        res.status(500).json({ success: false, message: 'Server error while recording data.' });
    } finally {
        connection.release();
    }
};

/**
 * @desc    Get a summary of usage for all users (for admin dashboard)
 * @route   GET /api/screentime/users
 * @access  Private (Superior Admin)
 */
const getUsageSummaryForUsers = async (req, res) => {
    try {
        const [users] = await pool.query(`
            SELECT 
                u.id,
                p.full_name,
                p.profile_image_url,
                SUM(stl.duration_seconds) as total_duration_seconds
            FROM users u
            JOIN profiles p ON u.id = p.user_id
            LEFT JOIN screen_time_logs stl ON u.id = stl.user_id
            WHERE u.tenant_id = ?
            GROUP BY u.id, p.full_name, p.profile_image_url
            ORDER BY total_duration_seconds DESC
        `, [req.user.tenant_id]);
        
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error('Error fetching user usage summary:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

/**
 * @desc    Get detailed usage for a specific user
 * @route   GET /api/screentime/users/:userId
 * @access  Private (Superior Admin)
 */
const getDetailedUsageForUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const [logs] = await pool.query(`
            SELECT 
                app_package_name,
                duration_seconds,
                log_date
            FROM screen_time_logs
            WHERE user_id = ?
            ORDER BY log_date DESC, duration_seconds DESC
        `, [userId]);
        
        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        console.error('Error fetching detailed usage for user:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = {
    recordScreenTime,
    getUsageSummaryForUsers,
    getDetailedUsageForUser,
};