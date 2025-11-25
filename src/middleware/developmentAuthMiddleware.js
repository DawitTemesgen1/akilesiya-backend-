// src/middleware/developmentAuthMiddleware.js

/**
 * Middleware to check if a user has permission to access the Member Development module.
 * It allows access ONLY to 'superior_admin' and 'development_admin' roles.
 */
const canAccessDevelopment = (req, res, next) => {
    if (req.user && (req.user.role === 'superior_admin' || req.user.role === 'development_admin')) {
        // User has the correct global role, so proceed.
        next();
    } else {
        res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to access Member Development.' });
    }
};

module.exports = { canAccessDevelopment };