// src/controllers/auditController.js
const pool = require('../config/db');

const getAuditTrail = async (req, res) => {
    try {
        const { type } = req.query;

        let query = `
            SELECT 
                al.id, al.action_type, al.action_description,
                al.previous_value, al.new_value, al.timestamp,
                admin_profile.full_name AS admin_name,
                user_profile.full_name AS user_name
            FROM audit_logs al
            LEFT JOIN users admin_user ON al.admin_user_id = admin_user.id
            LEFT JOIN profiles admin_profile ON admin_user.id = admin_profile.user_id
            LEFT JOIN users affected_user ON al.affected_user_id = affected_user.id
            LEFT JOIN profiles user_profile ON affected_user.id = user_profile.user_id
            WHERE al.tenant_id = ?
        `;
        const params = [req.user.tenant_id];

        if (type) {
            const types = type.split(',');
            query += ' AND al.action_type IN (?)';
            params.push(types);
        }

        query += ' ORDER BY al.timestamp DESC LIMIT 100;';

        const [logs] = await pool.query(query, params);
        res.status(200).json({ success: true, data: logs });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error fetching audit trail.' });
    }
};

module.exports = { getAuditTrail };