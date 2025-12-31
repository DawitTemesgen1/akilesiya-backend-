const fetch = global.fetch; // Ensure fetch is available, normally global in Node 18+

const sendOTP = async (phone, otp) => {
    // 1. Log to console for development ease
    console.log(`\n============== [SMS MOCK] ==============\nTo: ${phone}\nOTP: ${otp}\n========================================\n`);

    // 2. Implementation for Geez SMS
    const token = process.env.GEEZ_SMS_TOKEN;
    if (!token) {
        console.warn("⚠️ GEEZ_SMS_TOKEN not found in .env. SMS not sent via API.");
        // We return true so dev flow continues even without API key
        return true;
    }

    try {
        const url = 'https://api.geezsms.com/api/v1/sms/send';
        const body = {
            token: token,
            phone: phone,
            msg: `Your verification code is ${otp}`
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        console.log("Geez SMS API Response:", data);

        // Return true if success
        return true;
    } catch (error) {
        console.error("Failed to send SMS via Geez:", error);
        return false;
    }
};

module.exports = { sendOTP };
