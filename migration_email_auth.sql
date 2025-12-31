-- Migration to support Email Authentication

-- 1. (Skipped) 'email' column already exists.
-- Ensure it is unique if it isn't already:
-- ALTER TABLE users ADD UNIQUE (email);

-- 2. Make phone_number nullable (IMPORTANT: This allows users to register with just email)
ALTER TABLE users MODIFY COLUMN phone_number VARCHAR(255) NULL;

-- 3. Update profiles table to allow null phone numbers as well
ALTER TABLE profiles MODIFY COLUMN phone_number VARCHAR(255) NULL;

