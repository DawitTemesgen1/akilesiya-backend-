const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { sendOTP } = require('../services/smsService');
require('dotenv').config();

// Helper: Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT
const generateToken = (id, role, tenant_id) => {
    return jwt.sign({ id, role, tenant_id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user via Phone + OTP
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const {
        tenantName,
        fullName,
        phone,
        // Additional profile fields
        christianName,
        confessionFatherName,
        motherName,
        gender,
        dob,
        academicLevel,
        parentName,
        parentPhone,
        spiritualClass
    } = req.body;

    if (!tenantName || !fullName || !phone) {
        return res.status(400).json({ success: false, message: 'Please provide school, name, and phone number.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Check Tenant
        let [tenants] = await connection.query('SELECT id FROM tenants WHERE name = ?', [tenantName]);
        if (tenants.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'School not found.' });
        }
        const tenantId = tenants[0].id;

        // 2. Check if user exists
        const [existingUsers] = await connection.query('SELECT id FROM users WHERE phone_number = ?', [phone]);
        if (existingUsers.length > 0) {
            await connection.rollback();
            return res.status(409).json({ success: false, message: 'A user with this phone number already exists. Please login.' });
        }

        // 3. Create User
        const userId = uuidv4();
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        await connection.query(
            'INSERT INTO users (id, tenant_id, phone_number, role, is_active, otp_code, otp_expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, tenantId, phone, 'user', true, otp, otpExpires]
        );

        // 4. Create Profile with all fields
        await connection.query(
            `INSERT INTO profiles (
                user_id, full_name, phone_number, christian_name, 
                confession_father_name, mother_name, gender, dob, 
                academic_level, parent_name, parent_phone_number, spiritual_class
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                fullName,
                phone,
                christianName || null,
                confessionFatherName || null,
                motherName || null,
                gender || null,
                dob || null,
                academicLevel || null,
                parentName || null,
                parentPhone || null,
                spiritualClass || null
            ]
        );

        // 5. Save Custom Fields
        const { customFields } = req.body;
        if (customFields && typeof customFields === 'object') {
            for (const fieldId in customFields) {
                const optionId = customFields[fieldId];
                if (optionId) {
                    await connection.query(
                        'INSERT INTO custom_field_values (user_id, field_id, option_id) VALUES (?, ?, ?)',
                        [userId, fieldId, optionId]
                    );
                }
            }
        }

        await connection.commit();

        // 5. Send OTP
        await sendOTP(phone, otp);

        res.status(201).json({
            success: true,
            message: 'User registered. Please verify OTP.',
            data: { phone }
        });

    } catch (error) {
        await connection.rollback();
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: "Server error during registration." });
    } finally {
        connection.release();
    }
};

// @desc    Login via Phone + Password
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { phone, password, tenantName } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ success: false, message: 'Please provide phone number and password.' });
    }

    try {
        // Find user by phone
        const [userRows] = await pool.query('SELECT * FROM users WHERE phone_number = ?', [phone]);

        if (userRows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found. Please register.' });
        }

        const user = userRows[0];

        if (!user.is_active) {
            return res.status(403).json({ success: false, message: 'Your account has been suspended.' });
        }

        // Check password
        if (!user.password_hash) {
            return res.status(400).json({ success: false, message: 'Please complete registration by verifying OTP first.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid password.' });
        }

        // Fetch Tenant info
        const [tenant] = await pool.query('SELECT * FROM tenants WHERE id = ?', [user.tenant_id]);

        if (!tenant || tenant.length === 0) {
            return res.status(500).json({ success: false, message: 'Tenant not found for this user.' });
        }

        // Generate Token
        const token = generateToken(user.id, user.role, user.tenant_id);

        res.status(200).json({
            success: true,
            message: 'Login successful.',
            data: {
                token,
                tenant: tenant[0],
                user: {
                    id: user.id,
                    phone: user.phone_number,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login.' });
    }
};

// @desc    Verify OTP and Get Token
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ success: false, message: 'Phone and OTP are required.' });
    }

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE phone_number = ?', [phone]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const user = users[0];

        // Check OTP validity
        if (user.otp_code !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP.' });
        }

        if (new Date() > new Date(user.otp_expires_at)) {
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        // OTP Valid! Clear it.
        await pool.query('UPDATE users SET otp_code = NULL, otp_expires_at = NULL WHERE id = ?', [user.id]);

        // Fetch Tenant info for response
        const [tenant] = await pool.query('SELECT * FROM tenants WHERE id = ?', [user.tenant_id]);

        if (!tenant || tenant.length === 0) {
            return res.status(500).json({ success: false, message: 'Tenant not found for this user.' });
        }

        // Generate Token
        const token = generateToken(user.id, user.role, user.tenant_id);

        res.status(200).json({
            success: true,
            data: {
                token,
                tenant: tenant[0],
                user: {
                    id: user.id,
                    phone: user.phone_number,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ success: false, message: 'Server error during verification.' });
    }
};

// @desc    Set Password after OTP Verification (Complete Registration)
// @route   POST /api/auth/set-password
// @access  Public (but requires valid OTP verification first)
const setPassword = async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ success: false, message: 'Phone and password are required.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE phone_number = ?', [phone]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const user = users[0];

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update user with password
        await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, user.id]);

        res.status(200).json({
            success: true,
            message: 'Password set successfully. You can now login.'
        });

    } catch (error) {
        console.error('Set Password error:', error);
        res.status(500).json({ success: false, message: 'Server error while setting password.' });
    }
};

// @desc    Forgot Password - Request OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE phone_number = ?', [phone]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const user = users[0];

        // Generate OTP
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await pool.query('UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?', [otp, otpExpires, user.id]);

        // Send OTP
        await sendOTP(phone, otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent to your phone for password reset.',
            data: { phone }
        });

    } catch (error) {
        console.error('Forgot Password error:', error);
        res.status(500).json({ success: false, message: 'Server error during password reset request.' });
    }
};

// @desc    Reset Password after OTP Verification
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { phone, otp, newPassword } = req.body;

    if (!phone || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: 'Phone, OTP, and new password are required.' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE phone_number = ?', [phone]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const user = users[0];

        // Check OTP validity
        if (user.otp_code !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP.' });
        }

        if (new Date() > new Date(user.otp_expires_at)) {
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear OTP
        await pool.query(
            'UPDATE users SET password_hash = ?, otp_code = NULL, otp_expires_at = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );

        res.status(200).json({
            success: true,
            message: 'Password reset successfully. You can now login with your new password.'
        });

    } catch (error) {
        console.error('Reset Password error:', error);
        res.status(500).json({ success: false, message: 'Server error during password reset.' });
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone number required' });

    try {
        const [users] = await pool.query('SELECT id FROM users WHERE phone_number = ?', [phone]);
        if (users.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await pool.query('UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE id = ?', [otp, otpExpires, users[0].id]);
        await sendOTP(phone, otp);

        res.status(200).json({ success: true, message: 'OTP Resent' });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// @desc    Get current user's profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                u.id,
                u.email,
                u.phone_number, -- Added phone number to selection
                u.role,
                u.tenant_id,
                p.full_name,
                p.profile_image_url,
                p.christian_name,
                p.confession_father_name,
                p.mother_name,
                p.gender,
                p.dob,
                p.academic_level,
                p.phone_number as profile_phone, -- distinguish from auth phone
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

        // Fetch human-readable custom fields (LEFT JOIN to show all tenant fields even if empty)
        try {
            const [customFieldsRows] = await pool.query(`
                SELECT 
                    cf.name as field_name, 
                    cfo.option_value as field_value,
                    cf.profile_tab
                FROM custom_fields cf
                LEFT JOIN custom_field_values cfv ON cf.id = cfv.field_id AND cfv.user_id = ?
                LEFT JOIN custom_field_options cfo ON cfv.option_id = cfo.id
                WHERE cf.tenant_id = ?
            `, [req.user.id, req.user.tenant_id]);

            console.log(`DEBUG: Custom fields for user ${req.user.id}:`, customFieldsRows);
            userProfile.custom_fields_detail = customFieldsRows;

            // Raw IDs for compatibility
            const [customValues] = await pool.query('SELECT field_id, option_id FROM custom_field_values WHERE user_id = ?', [req.user.id]);
            userProfile.custom_field_values = customValues;

        } catch (err) {
            console.error("DEBUG: Error fetching custom fields:", err);
            userProfile.custom_fields_detail = [];
            userProfile.custom_field_values = [];
        }

        // Keep the raw ID map for compatibility if needed, or just rely on detail
        if (userProfile.custom_field_values) {
            try {
                userProfile.custom_field_values = JSON.parse(userProfile.custom_field_values);
            } catch (e) {
                userProfile.custom_field_values = {};
            }
        } else {
            userProfile.custom_field_values = {};
        }

        // Fetch Allowed Screens (Role + User specific)
        try {
            const [rolePerms] = await pool.query(`
                SELECT s.screen_key 
                FROM role_screen_permissions rsp
                JOIN screens s ON rsp.screen_id = s.id
                WHERE rsp.role_name = ?
            `, [userProfile.role]);

            const [userPerms] = await pool.query(`
                SELECT s.screen_key 
                FROM user_screen_permissions usp
                JOIN screens s ON usp.screen_id = s.id
                WHERE usp.user_id = ?
            `, [userProfile.id]);

            const allowedScreens = new Set([
                ...rolePerms.map(r => r.screen_key),
                ...userPerms.map(r => r.screen_key)
            ]);

            userProfile.allowed_screens = Array.from(allowedScreens);
        } catch (e) {
            console.error("Error fetching permissions:", e);
            userProfile.allowed_screens = [];
        }

        res.status(200).json({ success: true, data: userProfile });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error while fetching user profile.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyOTP,
    setPassword,
    forgotPassword,
    resetPassword,
    resendOTP,
    getMe,
};