// src/middleware/planAuthMiddleware.js

const pool = require('../config/db');

/**
 * Middleware to check if a user has permission to access the Plan Control module.
 * It allows access to 'superior_admin' OR any user who is an 'admin' or 'manager'
 * of at least one department.
 */
const canAccessPlans = async (req, res, next) => {
    try {
        // A superior_admin can always access everything.
        if (req.user && req.user.role === 'superior_admin') {
            return next();
        }

        // For other users, check if they have a privileged role in any department.
        const [rows] = await pool.query(
            "SELECT 1 FROM department_members WHERE user_id = ? AND role IN ('admin', 'manager') LIMIT 1",
            [req.user.id]
        );

        if (rows.length > 0) {
            // User is an admin or manager of at least one department, so grant access.
            next();
        } else {
            // User is logged in but has no admin/manager roles in any department.
            res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to access Plan Management.' });
        }
    } catch (error) {
        // This log is important and should be kept to see actual errors.
        console.error("[Auth Check] CRITICAL ERROR in canAccessPlans middleware:", error);
        res.status(500).json({ success: false, message: "Server error during authorization." });
    }
};

module.exports = { canAccessPlans };