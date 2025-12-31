const nodemailer = require('nodemailer');

const sendEmailOTP = async (email, otp, userName = '', tenantName = '') => {
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
        console.error("❌ CRITICAL: SMTP credentials not found in .env. Email cannot be sent.");
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

        // Personalized greeting
        const greeting = userName ? `Dear ${userName}` : 'Hello';
        const schoolInfo = tenantName ? ` at ${tenantName}` : '';

        // 3. Send Professional Email
        const info = await transporter.sendMail({
            from: `"Akilesiya - Church School Management" <${smtpUser}>`,
            to: email,
            subject: "Your Verification Code - Akilesiya",
            text: `${greeting},\n\nYour verification code for Akilesiya${schoolInfo} is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this code, please ignore this email.\n\nBest regards,\nAkilesiya Support Team`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 20px;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Akilesiya</h1>
                                            <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 14px;">Church School Management System</p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Content -->
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">${greeting},</p>
                                            
                                            <p style="margin: 0 0 30px 0; color: #555555; font-size: 15px; line-height: 1.6;">
                                                Thank you for registering with Akilesiya${schoolInfo}. To complete your registration, please use the verification code below:
                                            </p>
                                            
                                            <!-- OTP Box -->
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td align="center" style="padding: 20px 0;">
                                                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 25px; display: inline-block;">
                                                            <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
                                                            <h2 style="margin: 0; color: #ffffff; font-size: 42px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h2>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- Expiry Notice -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                                                <tr>
                                                    <td style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px 20px; border-radius: 6px;">
                                                        <p style="margin: 0; color: #856404; font-size: 14px;">
                                                            ⏱️ <strong>Important:</strong> This code will expire in <strong>10 minutes</strong>.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- Security Notice -->
                                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                                                <tr>
                                                    <td style="background-color: #f8f9fa; border-radius: 6px; padding: 20px;">
                                                        <p style="margin: 0 0 10px 0; color: #666666; font-size: 13px; line-height: 1.6;">
                                                            🔒 <strong>Security Tip:</strong> Never share this code with anyone. Akilesiya staff will never ask for your verification code.
                                                        </p>
                                                        <p style="margin: 0; color: #666666; font-size: 13px; line-height: 1.6;">
                                                            If you didn't request this code, please ignore this email or contact support if you have concerns.
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    
                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                            <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                                                Best regards,<br>
                                                <strong>The Akilesiya Team</strong>
                                            </p>
                                            <p style="margin: 20px 0 0 0; color: #999999; font-size: 12px;">
                                                © ${new Date().getFullYear()} Akilesiya. All rights reserved.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
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
