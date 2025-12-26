const pool = require('../config/db');

const runMigration = async () => {
    console.log('🔄 Starting Database Migration for Phone Authentication...');
    const connection = await pool.getConnection();

    try {
        // 1. Add phone_number column
        try {
            await connection.query('ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) UNIQUE AFTER id');
            console.log('✅ Added phone_number column');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('ℹ️ phone_number column already exists');
            else console.error('❌ Error adding phone_number:', e.message);
        }

        // 2. Make email nullable
        try {
            await connection.query('ALTER TABLE users MODIFY COLUMN email VARCHAR(255) NULL');
            console.log('✅ Made email nullable');
        } catch (e) {
            console.error('❌ Error modifying email:', e.message);
        }

        // 3. Make password_hash nullable
        try {
            await connection.query('ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL');
            console.log('✅ Made password_hash nullable');
        } catch (e) {
            console.error('❌ Error modifying password_hash:', e.message);
        }

        // 4. Add otp_code column
        try {
            await connection.query('ALTER TABLE users ADD COLUMN otp_code VARCHAR(10) NULL');
            console.log('✅ Added otp_code column');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('ℹ️ otp_code column already exists');
            else console.error('❌ Error adding otp_code:', e.message);
        }

        // 5. Add otp_expires_at column
        try {
            await connection.query('ALTER TABLE users ADD COLUMN otp_expires_at DATETIME NULL');
            console.log('✅ Added otp_expires_at column');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('ℹ️ otp_expires_at column already exists');
            else console.error('❌ Error adding otp_expires_at:', e.message);
        }

        console.log('🏁 Migration Completed.');
    } catch (error) {
        console.error('💥 Migration Fatal Error:', error);
    } finally {
        connection.release();
        process.exit();
    }
};

runMigration();
