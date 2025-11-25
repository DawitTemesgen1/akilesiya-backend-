const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Generate JWT - This version includes role and tenant for the middleware
const generateToken = (id, role, tenant_id) => {
    return jwt.sign({ id, role, tenant_id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    // This function looks correct, no changes needed.
    const { tenantName, fullName, email, password } = req.body;

    if (!tenantName || !fullName || !email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let [tenants] = await connection.query('SELECT id FROM tenants WHERE name = ?', [tenantName]);
        let tenantId;

        if (tenants.length > 0) {
            tenantId = tenants[0].id;
        } else {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'School not found.' });
        }
        
        const [existingUsers] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            await connection.rollback();
            return res.status(409).json({ success: false, message: 'A user with this email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const userId = uuidv4();

        await connection.query(
            'INSERT INTO users (id, tenant_id, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [userId, tenantId, email, password_hash, 'user']
        );

        await connection.query(
            'INSERT INTO profiles (user_id, full_name) VALUES (?, ?)',
            [userId, fullName]
        );

        await connection.commit();

        const [[user]] = await connection.query('SELECT id, role, tenant_id FROM users WHERE id = ?', [userId]);
        const [tenant] = await connection.query('SELECT * FROM tenants WHERE id = ?', [tenantId]);

        res.status(201).json({
            success: true,
            data: {
                token: generateToken(user.id, user.role, user.tenant_id),
                tenant: tenant[0]
            }
        });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: "Server error during registration." });
    } finally {
        connection.release();
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    // This function looks correct, no changes needed.
    const { email, password, tenantName } = req.body;
    if (!email || !password || !tenantName) {
        return res.status(400).json({ success: false, message: 'Please provide email, password, and school name.' });
    }
    try {
        const [tenantRows] = await pool.query('SELECT * FROM tenants WHERE name = ?', [tenantName]);
        if (tenantRows.length === 0) {
            return res.status(404).json({ success: false, message: 'School not found.' });
        }
        const tenant = tenantRows[0];
        
        const [userRows] = await pool.query('SELECT * FROM users WHERE email = ? AND tenant_id = ?', [email, tenant.id]);
        if (userRows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        const user = userRows[0];
        
        if (!user.is_active) {
            return res.status(403).json({ success: false, message: 'Your account has been suspended.' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (isMatch) {
            res.status(200).json({
                success: true,
                data: {
                    token: generateToken(user.id, user.role, user.tenant_id),
                    tenant: tenant
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
};


// @desc    Get current user's profile
// @route   GET /api/auth/me
// @access  Private
// ======================= THE FIX =======================
// This function is now replaced with the more efficient single-query version.
const getMe = async (req, res) => {
    try {
        // This single, efficient query fetches everything the UserProvider needs.
        const [rows] = await pool.query(`
            SELECT 
                u.id,
                u.email,
                u.role, -- This is the essential comma-separated role string
                u.tenant_id,
                p.full_name,
                p.profile_image_url,
                p.christian_name,
                p.confession_father_name,
                p.mother_name,
                p.gender,
                p.dob,
                p.academic_level,
                p.phone_number,
                p.parent_name,
                p.parent_phone_number,
                p.spiritual_class,
                (
                    SELECT CONCAT('{', GROUP_CONCAT(CONCAT('"', field_id, '":"', option_id, '"')), '}')
                    FROM custom_field_values 
                    WHERE user_id = u.id
                ) as custom_field_values
            FROM users u
            LEFT JOIN profiles p ON u.id = p.user_id
            WHERE u.id = ?
        `, [req.user.id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        let userProfile = rows[0];
        
        // The subquery returns custom fields as a JSON string. Parse it into an object.
        // This avoids a second database call.
        if (userProfile.custom_field_values) {
            try {
                userProfile.custom_field_values = JSON.parse(userProfile.custom_field_values);
            } catch (e) {
                console.error("Failed to parse custom_field_values JSON:", userProfile.custom_field_values);
                userProfile.custom_field_values = {}; // Default to empty object on error
            }
        } else {
            userProfile.custom_field_values = {};
        }

        res.status(200).json({ success: true, data: userProfile });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error while fetching user profile.' });
    }
};
// =======================================================


module.exports = {
    registerUser,
    loginUser,
    getMe,
};