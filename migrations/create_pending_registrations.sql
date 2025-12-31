-- Migration: Create pending_registrations table
-- This table stores temporary registration data until OTP verification

CREATE TABLE IF NOT EXISTS pending_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    otp_code VARCHAR(6) NOT NULL,
    otp_expires_at DATETIME NOT NULL,
    registration_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_otp_expires (otp_expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clean up expired pending registrations (optional, can be run periodically)
-- DELETE FROM pending_registrations WHERE otp_expires_at < NOW();
