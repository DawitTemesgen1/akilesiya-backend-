const express = require('express');
const router = express.Router();
const pool = require('../../config/db');

// This would be a protected route
// GET /api/users/admin/dashboard
router.get('/admin/dashboard', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, email, role FROM users');
    // Render an EJS template and pass the user data to it
    res.render('admin_dashboard', { users: users });
  } catch (error) {
    res.status(500).send('Error loading dashboard');
  }
});

module.exports = router;