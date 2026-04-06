const nodemailer = require("nodemailer");

// ✅ Ensure env is loaded (only once in your app entry ideally)
require("dotenv").config();

// 🔥 CREATE TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔥 VERIFY CONNECTION (VERY IMPORTANT FOR DEBUG)
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email Config Error:", error);
  } else {
    console.log("✅ Email server is ready");
  }
});

// 🔥 SEND EMAIL FUNCTION
const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials missing in environment variables");
    }

    const info = await transporter.sendMail({
      from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;