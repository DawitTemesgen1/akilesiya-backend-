const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

// Middleware to verify token and attach user to req object
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const [rows] = await pool.query(
        'SELECT id, email, role, tenant_id FROM users WHERE id = ?',
        [decoded.id]
      );
      
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Attach the user object from the database to the request
      req.user = rows[0];
      next();

    } catch (error) {
      console.error('Authorization Error:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no Bearer token' });
  }
};

// Middleware to check if the user has a general admin role
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role && (req.user.role.includes('admin') || req.user.role.includes('superior_admin'))) {
        next(); // User has a correct role, proceed
    } else {
        // User is logged in but does not have admin rights
        res.status(403).json({ message: 'Forbidden: Access is denied. Admin rights required.' });
    }
};

// ======================= THE CHANGE =======================
// Middleware to specifically check if the user is a 'superior_admin'.
// Renamed to 'superiorAdmin' to match your existing route files.

const superiorAdmin = (req, res, next) => {
    // The .includes() check is the correct way to verify if the user has the required role.
    if (req.user && req.user.role && req.user.role.includes('superior_admin')) {
        next(); // User has the 'superior_admin' role, proceed.
    } else {
        res.status(403).json({ message: 'Forbidden: This action requires superior admin privileges.' });
    }
};
// ==========================================================

module.exports = { 
    protect, 
    isAdmin,
    superiorAdmin // <-- Exporting 'superiorAdmin' as requested.
};