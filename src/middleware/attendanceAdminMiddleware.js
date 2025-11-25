const attendanceAdmin = (req, res, next) => {
    // A user has attendance management privileges if they are a superior_admin OR an attendance_admin.
    if (req.user && (req.user.role.includes('superior_admin') || req.user.role.includes('attendance_admin'))) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Not authorized for attendance management' });
    }
};

module.exports = { attendanceAdmin };