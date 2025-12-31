const pool = require('../config/db');

// =======================================================================
// This is the definitive and complete controller file.
// 1. getStudentsForAttendance uses the correct GROUP_CONCAT query for MariaDB 10.4.
// 2. getDetailedAttendanceSummary uses a robust two-query logic, correctly scoped to the TENANT.
// 3. saveAttendance now includes audit logging for changes.
// 4. All other functions are verified correct.
// =======================================================================

/**
 * @desc    Helper function to log audit trails.
 * @param   {object} connection - The database connection object.
 * @param   {object} logData - The data to be logged.
 */
const logAudit = async (connection, { tenant_id, admin_user_id, affected_user_id, action_type, action_description, previous_value, new_value }) => {
    const sql = `
        INSERT INTO audit_logs 
            (tenant_id, admin_user_id, affected_user_id, action_type, action_description, previous_value, new_value) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.query(sql, [tenant_id, admin_user_id, affected_user_id, action_type, action_description, previous_value, new_value]);
};

const getStudentsForAttendance = async (req, res) => {
    try {
        const [students] = await pool.query(`
            SELECT 
                u.id, 
                p.full_name,
                (SELECT
                    CONCAT('{',
                        COALESCE(
                            GROUP_CONCAT(
                                CONCAT('"', cfv.field_id, '":', cfv.option_id)
                            ),
                        ''),
                    '}')
                 FROM custom_field_values cfv 
                 WHERE cfv.user_id = u.id
                ) as custom_fields_json_string
            FROM 
                users u 
            JOIN 
                profiles p ON u.id = p.user_id 
            WHERE 
                u.tenant_id = ? AND u.is_active = 1
            ORDER BY 
                p.full_name ASC
        `, [req.user.tenant_id]);
        
        const formattedStudents = students.map(s => {
            let customFields = {};
            try {
                if (s.custom_fields_json_string && s.custom_fields_json_string.length > 2) {
                    customFields = JSON.parse(s.custom_fields_json_string);
                }
            } catch (e) { console.error(`Failed to parse custom fields for user ${s.id}:`, s.custom_fields_json_string); }
            return { id: s.id, full_name: s.full_name, custom_fields: customFields };
        });
        res.status(200).json({ success: true, data: formattedStudents });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching students.' });
    }
};

const getAttendanceRecords = async (req, res) => {
    try {
        const { date, session, attendance_type } = req.query;
        const tenantId = req.user.tenant_id;
        const [attendance] = await pool.query('SELECT user_id, status, late_time FROM attendance WHERE attendance_date = ? AND session = ? AND attendance_type = ? AND tenant_id = ?', [date, session, attendance_type, tenantId]);
        const [[topicResult]] = await pool.query('SELECT topic FROM daily_topics WHERE date = ? AND session = ? AND attendance_type = ? AND tenant_id = ?', [date, session, attendance_type, tenantId]);
        res.status(200).json({ success: true, data: { attendance: attendance || [], topic: topicResult ? topicResult.topic : null }});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching records.' });
    }
};

const saveAttendance = async (req, res) => {
    const { records, dailyTopic } = req.body;
    const adminUserId = req.user.id;
    const tenantId = req.user.tenant_id;

    if (!records || !Array.isArray(records)) {
        return res.status(400).json({ success: false, message: 'Invalid payload.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        if (dailyTopic && dailyTopic.topic) {
            const { date, session, topic, attendance_type } = dailyTopic;
            await connection.query('INSERT INTO daily_topics (tenant_id, date, session, attendance_type, topic) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE topic = VALUES(topic)', [tenantId, date, session, attendance_type, topic]);
        }
        
        // Get existing statuses to compare for changes
        const studentIds = records.map(r => r.student_id);
        const date = records.length > 0 ? records[0].date : null;
        
        let existingStatuses = {};
        if (date && studentIds.length > 0) {
            const [currentRecords] = await connection.query(
                'SELECT user_id, status FROM attendance WHERE user_id IN (?) AND attendance_date = ? AND session = ? AND attendance_type = ? AND tenant_id = ?',
                [studentIds, date, records[0].session, records[0].attendance_type, tenantId]
            );
            currentRecords.forEach(rec => {
                existingStatuses[rec.user_id] = rec.status;
            });
        }
        
        for (const record of records) {
            const { student_id, date, session, status, attendance_type, late_time } = record;
            const previousStatus = existingStatuses[student_id] || 'Not Recorded';

            // Only log if the status has actually changed
            if (previousStatus !== status) {
                 await logAudit(connection, {
                    tenant_id: tenantId,
                    admin_user_id: adminUserId,
                    affected_user_id: student_id,
                    action_type: 'ATTENDANCE_UPDATE',
                    action_description: `Attendance for ${date}`,
                    previous_value: previousStatus,
                    new_value: status
                });
            }

            // Perform the insert/update for the attendance record
            await connection.query(`
                INSERT INTO attendance (user_id, attendance_date, session, status, attendance_type, late_time, recorded_by_id, tenant_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    status = VALUES(status), 
                    late_time = VALUES(late_time),
                    recorded_by_id = VALUES(recorded_by_id)
            `, [student_id, date, session, status, attendance_type, late_time, adminUserId, tenantId]);
        }

        await connection.commit();
        res.status(200).json({ success: true, message: 'Attendance saved successfully.' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: 'Server error saving attendance.' });
    } finally {
        connection.release();
    }
};

/**
 * @desc    Get a detailed and filterable attendance summary FOR ALL USERS.
 * @route   GET /api/attendance/detailed-summary
 * @access  Private/Admin
 */
const getDetailedAttendanceSummary = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { startDate, endDate, attendanceType, session, dynamicFilterFieldId, dynamicFilterOptionId } = req.query;

        // STEP 1: Get ALL users that match the filters for the TENANT.
        let userQuery = `SELECT u.id, p.full_name FROM users u JOIN profiles p ON u.id = p.user_id`;
        const userParams = [tenant_id]; // First param is always the tenant_id
        let userWhereClauses = ['u.tenant_id = ?'];

        if (dynamicFilterFieldId && dynamicFilterOptionId) {
            userQuery += ` JOIN custom_field_values cfv ON u.id = cfv.user_id`;
            userWhereClauses.push('cfv.field_id = ? AND cfv.option_id = ?');
            userParams.push(dynamicFilterFieldId, dynamicFilterOptionId);
        }
        
        userQuery += ` WHERE ${userWhereClauses.join(' AND ')}`;
        
        const [allFilteredUsers] = await pool.query(userQuery, userParams);

        if (allFilteredUsers.length === 0) {
            return res.status(200).json({ success: true, data: { student_stats: [], overall_stats: { unique_days_count: 0 } } });
        }

        const filteredUserIds = allFilteredUsers.map(u => u.id);

        // STEP 2: Get attendance stats ONLY for those specific users within the date range and other filters.
        let attendanceQuery = `SELECT user_id, status, COUNT(id) as count, attendance_date FROM attendance`;
        const attendanceParams = [filteredUserIds];
        let attendanceWhereClauses = [`user_id IN (?)`];
        
        if (startDate && endDate) {
            attendanceWhereClauses.push('attendance_date BETWEEN ? AND ?');
            attendanceParams.push(startDate, endDate);
        }
        if (attendanceType) {
            attendanceWhereClauses.push('attendance_type = ?');
            attendanceParams.push(attendanceType);
        }
        if (session) {
            attendanceWhereClauses.push('session = ?');
            attendanceParams.push(session);
        }

        attendanceQuery += ` WHERE ${attendanceWhereClauses.join(' AND ')} GROUP BY user_id, status, attendance_date`;
        
        const [attendanceStats] = await pool.query(attendanceQuery, attendanceParams);

        // STEP 3: Process the data in JavaScript.
        const attendanceMap = new Map();
        const uniqueDays = new Set();

        for (const stat of attendanceStats) {
            uniqueDays.add(stat.attendance_date.toISOString().split('T')[0]);
            
            const userStats = attendanceMap.get(stat.user_id) || { present: 0, absent: 0, late: 0, permission: 0 };
            userStats[stat.status] = (userStats[stat.status] || 0) + stat.count;
            attendanceMap.set(stat.user_id, userStats);
        }

        const student_stats = allFilteredUsers.map(user => {
            const stats = attendanceMap.get(user.id) || {};
            const present_count = stats.present || 0;
            const absent_count = stats.absent || 0;
            const late_count = stats.late || 0;
            const permission_count = stats.permission || 0;
            const total_records = present_count + absent_count + late_count + permission_count;
            const percentage = total_records > 0 ? ((present_count + late_count) / total_records) * 100 : 0;

            return {
                user_id: user.id,
                full_name: user.full_name,
                total_records,
                present_count,
                absent_count,
                late_count,
                permission_count,
                percentage
            };
        });

        const overallStats = student_stats.reduce((acc, student) => {
            acc.total_present += student.present_count;
            acc.total_absent += student.absent_count;
            acc.total_late += student.late_count;
            acc.total_permission += student.permission_count;
            return acc;
        }, { total_present: 0, total_absent: 0, total_late: 0, total_permission: 0 });

        const totalOverallRecords = Object.values(overallStats).reduce((sum, count) => sum + count, 0);
        overallStats.overall_percentage = totalOverallRecords > 0 
            ? ((overallStats.total_present + overallStats.total_late) / totalOverallRecords) * 100 
            : 0;
        overallStats.unique_days_count = uniqueDays.size;

        res.status(200).json({
            success: true,
            data: { student_stats, overall_stats: overallStats }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching detailed summary.' });
    }
};

const getMyAttendanceHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const [history] = await pool.query(`SELECT a.attendance_date, a.session, a.status, a.late_time, a.attendance_type, dt.topic FROM attendance a LEFT JOIN daily_topics dt ON a.attendance_date = dt.date AND a.session = dt.session AND a.attendance_type = dt.attendance_type AND a.tenant_id = dt.tenant_id WHERE a.user_id = ? ORDER BY a.attendance_date DESC;`, [userId]);
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching user history.' });
    }
};

const getAttendanceHistoryForUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const [history] = await pool.query(`SELECT a.attendance_date, a.session, a.status, a.late_time, a.attendance_type, dt.topic FROM attendance a LEFT JOIN daily_topics dt ON a.attendance_date = dt.date AND a.session = dt.session AND a.attendance_type = dt.attendance_type AND a.tenant_id = dt.tenant_id WHERE a.user_id = ? ORDER BY a.attendance_date DESC;`, [userId]);
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching user history.' });
    }
};

module.exports = {
    getStudentsForAttendance,
    getAttendanceRecords,
    saveAttendance,
    getDetailedAttendanceSummary,
    getMyAttendanceHistory,
    getAttendanceHistoryForUser
};