# Authentication Flow Update - OTP-First Registration

## 📋 Overview
Updated the registration flow to implement **OTP-First Authentication**, ensuring users are only created in the database AFTER successful OTP verification.

## 🔄 Changes Made

### 1. **Registration Flow (authController.js)**
**Before:** User account was created immediately, then OTP was sent
**After:** Registration data is stored temporarily, user account is created only after OTP verification

#### Key Changes:
- Registration data is stored in `pending_registrations` table
- No user account is created until OTP is verified
- Prevents "user already exists" errors when re-requesting OTP
- More secure - prevents spam registrations

### 2. **OTP Verification (authController.js)**
**Enhanced to handle two scenarios:**

#### A. New User Registration (Pending)
1. Checks `pending_registrations` table first
2. If found and OTP is valid:
   - Creates user account
   - Creates profile with all fields
   - Saves custom fields
   - Deletes pending registration
   - Returns JWT token
   - Status: `201 Created`

#### B. Existing User (Forgot Password)
1. Checks `users` table
2. Validates OTP
3. Clears OTP from user record
4. Returns JWT token
5. Status: `200 OK`

### 3. **Professional OTP Email (emailService.js)**
**Enhanced email template with:**
- ✅ Personalized greeting with user name
- ✅ School/tenant name in context
- ✅ Professional gradient design
- ✅ Large, clear OTP display
- ✅ Expiry warning (10 minutes)
- ✅ Security tips
- ✅ Mobile-responsive HTML
- ✅ Branded header and footer
- ✅ Professional color scheme (purple gradient)

### 4. **Database Schema**
**New Table: `pending_registrations`**
```sql
CREATE TABLE pending_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    otp_code VARCHAR(6) NOT NULL,
    otp_expires_at DATETIME NOT NULL,
    registration_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_otp_expires (otp_expires_at)
);
```

## 🚀 Deployment Steps

### 1. Run Database Migration
```bash
# Connect to your MySQL database
mysql -u your_user -p your_database

# Run the migration
source migrations/create_pending_registrations.sql
```

Or via cPanel:
1. Go to **phpMyAdmin**
2. Select your database
3. Go to **SQL** tab
4. Copy and paste the contents of `migrations/create_pending_registrations.sql`
5. Click **Go**

### 2. Deploy Backend Code
```bash
# From the backend directory
git add .
git commit -m "feat: implement OTP-first registration with professional email"
git push origin main
```

### 3. Restart Node.js App in cPanel
1. Go to **Setup Node.js App**
2. Click **Stop App**
3. Wait 10 seconds
4. Click **Start App**
5. Check logs for: `✅ SERVER STARTED WITH CORS FIXES`

## 📧 Email Template Preview

The new OTP email includes:
- **Header**: Purple gradient with "Akilesiya" branding
- **Personalized Greeting**: "Dear [User Name]"
- **Context**: "Thank you for registering with Akilesiya at [School Name]"
- **OTP Display**: Large, centered code in purple box
- **Expiry Warning**: Yellow alert box with timer icon
- **Security Notice**: Gray box with lock icon and tips
- **Footer**: Professional signature with copyright

## 🔒 Security Improvements

1. **No Premature Account Creation**: Prevents database pollution from unverified emails
2. **OTP Expiry**: 10-minute window for verification
3. **Automatic Cleanup**: Expired pending registrations can be cleaned up
4. **Clear Security Messaging**: Users are warned never to share OTP
5. **Unique Email Constraint**: Prevents duplicate pending registrations

## 🧪 Testing Checklist

### New User Registration Flow:
- [ ] Submit registration form
- [ ] Verify OTP email is received
- [ ] Check that user does NOT exist in `users` table yet
- [ ] Verify user DOES exist in `pending_registrations` table
- [ ] Enter correct OTP
- [ ] Verify user is created in `users` and `profiles` tables
- [ ] Verify pending registration is deleted
- [ ] Verify JWT token is returned
- [ ] Verify login works with new account

### Forgot Password Flow:
- [ ] Request password reset for existing user
- [ ] Verify OTP email is received
- [ ] Enter correct OTP
- [ ] Verify OTP is cleared from user record
- [ ] Verify JWT token is returned

### Error Scenarios:
- [ ] Try registering with same email twice (should update pending registration)
- [ ] Try invalid OTP (should fail with clear message)
- [ ] Try expired OTP (should fail with expiry message)
- [ ] Try OTP for non-existent email (should fail gracefully)

## 📊 API Response Changes

### Registration Endpoint: `POST /api/auth/register`
**Before:**
```json
{
  "success": true,
  "message": "User registered. Please verify OTP sent to your email.",
  "data": { "email": "user@example.com" }
}
```

**After:**
```json
{
  "success": true,
  "message": "Verification code sent to your email. Please verify to complete registration.",
  "data": { "email": "user@example.com" }
}
```

### OTP Verification: `POST /api/auth/verify-otp`
**New User (Pending Registration):**
```json
{
  "success": true,
  "message": "Registration completed successfully!",
  "data": {
    "token": "jwt_token_here",
    "tenant": { ... },
    "user": { "id": "...", "email": "...", "role": "user" }
  }
}
```

**Existing User (Forgot Password):**
```json
{
  "success": true,
  "message": "OTP verified successfully!",
  "data": {
    "token": "jwt_token_here",
    "tenant": { ... },
    "user": { "id": "...", "email": "...", "role": "..." }
  }
}
```

## 🔧 Maintenance

### Cleanup Expired Pending Registrations
Run this periodically (e.g., via cron job):
```sql
DELETE FROM pending_registrations WHERE otp_expires_at < NOW();
```

Or create a cleanup endpoint:
```javascript
// Add to authController.js
const cleanupExpiredRegistrations = async () => {
    await pool.query('DELETE FROM pending_registrations WHERE otp_expires_at < NOW()');
};
```

## 📝 Notes

- OTP codes are 6 digits
- OTP expires in 10 minutes
- Email template uses inline CSS for maximum compatibility
- Registration data is stored as JSON for flexibility
- Custom fields are preserved and created after verification
- Both registration and forgot password flows use the same `verifyOTP` endpoint

## 🎯 Benefits

1. **Better Security**: No spam accounts in database
2. **Better UX**: Clear, professional emails
3. **Better Data Integrity**: Only verified users in system
4. **Better Error Handling**: Clear distinction between new and existing users
5. **Better Scalability**: Easy to add SMS OTP later using same pattern
