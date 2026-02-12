// src/middleware/developmentAuthMiddleware.js

/**
 * Middleware to check if a user has permission to access the Member Development module.
 * It allows access ONLY to 'superior_admin' and 'development_admin' roles.
 */
const canAccessDevelopment = (req, res, next) => {
    // Check if user exists and has a role that includes the required keywords
    const hasPermission = req.user && req.user.role && (
        req.user.role.includes('superior_admin') ||
        req.user.role.includes('development_admin')
    );

    if (hasPermission) {
        // User has the correct role, so proceed.
        next();
    } else {
        res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to access Member Development.' });
    }
};

module.exports = { canAccessDevelopment };