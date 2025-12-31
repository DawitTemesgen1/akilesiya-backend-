require('dotenv').config();
const { sendEmailOTP } = require('./services/emailService');

console.log("🧪 Starting Email Test...");

const testEmail = process.env.SMTP_USER || 'dawittamasgen1@gmail.com';

(async () => {
    console.log(`📧 Attempting to send test email to: ${testEmail}`);
    const result = await sendEmailOTP(testEmail, '123456', 'Test User', 'Test Tenant');

    if (result) {
        console.log("\n✅ SUCCESS: Email sent successfully!");
        process.exit(0);
    } else {
        console.error("\n❌ FAILURE: Email failed to send.");
        process.exit(1);
    }
})();
