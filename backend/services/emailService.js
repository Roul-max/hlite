import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  secure: process.env.SMTP_PORT === "465", // secure only if port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send OTP Email
export const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER, // must match Gmail account
      to: email,
      subject: "Verify Your Email - NotesApp",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Email Verification</h1>
          </div>
          <div style="padding: 40px; background: #f9fafb;">
            <h2 style="color: #374151; margin-bottom: 20px;">Complete Your Registration</h2>
            <p style="color: #6b7280; margin-bottom: 30px;">
              Please use the verification code below to complete your registration:
            </p>
            <div style="background: white; padding: 30px; text-align: center; border-radius: 8px; margin: 30px 0;">
              <div style="font-size: 36px; font-weight: bold; color: #1f2937; letter-spacing: 8px;">
                ${otp}
              </div>
            </div>
            <p style="color: #9ca3af; font-size: 14px;">
              This code will expire in 10 minutes. If you didn’t request this, ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    // Log OTP for debugging
    if (process.env.EMAIL_DEBUG === "true") {
      console.log(`OTP for ${email}: ${otp}`);
    }

    // Try sending
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}`);

  } catch (error) {
    console.error("❌ Failed to send OTP email:", error.message);

    // Still log OTP so user can continue
    console.log(`OTP for ${email}: ${otp}`);
    // Don’t throw — let signup/login continue
  }
};

// Debugging SMTP setup
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS exists:", !!process.env.SMTP_PASS);
