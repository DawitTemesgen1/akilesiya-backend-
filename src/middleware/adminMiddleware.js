// src/middleware/adminMiddleware.js

const isAdmin = (...allowedRoles) => {
    return (req, res, next) => {
        // This middleware must run after the 'protect' middleware.
        if (!req.user || !req.user.role) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        // The user's roles are expected to be a comma-separated string.
        const userRoles = req.user.role.split(',').map(role => role.trim());

        // A 'superior_admin' has universal access to all admin-protected routes.
        if (userRoles.includes('superior_admin')) {
            return next();
        }

        // Check if the user has at least one of the specific roles required for this route.
        // The `some` method returns true if at least one role matches.
        const hasRequiredRole = userRoles.some(role => allowedRoles.includes(role));

        if (hasRequiredRole) {
            return next();
        } else {
            // If the user is not a superior_admin and does not have any of the allowed roles.
            return res.status(403).json({ success: false, message: 'Forbidden: You do not have the required permissions for this action.' });
        }
    };
};

module.exports = { isAdmin };