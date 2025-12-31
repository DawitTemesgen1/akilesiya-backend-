const gradeAdmin = (req, res, next) => {
    // A user has grade management privileges if they are a superior_admin OR a grade_admin.
    if (req.user && (req.user.role.includes('superior_admin') || req.user.role.includes('grade_admin'))) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Not authorized for grade management' });
    }
};

const superiorAdminOnly = (req, res, next) => {
    // This action is restricted to ONLY superior_admins.
    if (req.user && req.user.role.includes('superior_admin')) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'This action requires superior administrator privileges' });
    }
}

module.exports = { 
    gradeAdmin,
    superiorAdminOnly,
};