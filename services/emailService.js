const nodemailer = require('nodemailer');

const sendEmailOTP = async (email, otp) => {
    // 1. Log to console for development ease
    console.log(`\n============== [EMAIL DEBUG] ==============\nTo: ${email}\nOTP: ${otp}\n===========================================\n`);

    // 2. Configure Transporter
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    // Log config status (masked)
    console.log("SMTP Config Check:");
    console.log(`- HOST: ${smtpHost ? 'OK (' + smtpHost + ')' : 'MISSING'}`);
    console.log(`- PORT: ${smtpPort || 'MISSING (Default 587)'}`);
    console.log(`- USER: ${smtpUser ? 'OK' : 'MISSING'}`);
    console.log(`- PASS: ${smtpPass ? 'OK (Length: ' + smtpPass.length + ')' : 'MISSING'}`);

    if (!smtpHost || !smtpUser || !smtpPass) {
        console.error("❌ CRTICIAL: SMTP credentials not found in .env. Email cannot be sent.");
        return false; // Fail request so user knows config is missing
    }

    try {
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });

        // 3. Send Email
        const info = await transporter.sendMail({
            from: `"Akilesiya Support" <${smtpUser}>`,
            to: email,
            subject: "Your Verification Code",
            text: `Your verification code is ${otp}. It expires in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #333;">Verification Code</h2>
                    <p>Use the following code to complete your verification:</p>
                    <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
                    <p>This code expires in 10 minutes.</p>
                </div>
            `,
        });

        console.log("✅ Email sent successfully: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("❌ Failed to send email:", error);
        return false;
    }
};

module.exports = { sendEmailOTP };
