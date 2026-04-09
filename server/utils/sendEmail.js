const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// 🔐 VALIDATE ENV VARIABLES AT STARTUP
if (!process.env.SENDGRID_API_KEY) {
  throw new Error("❌ SENDGRID_API_KEY is missing in .env");
}

if (!process.env.SENDGRID_FROM_EMAIL) {
  throw new Error("❌ SENDGRID_FROM_EMAIL is missing in .env");
}

// 🔑 SET API KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 🔥 MAIN SEND EMAIL FUNCTION
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // 🧪 BASIC VALIDATION
    if (!to || !subject || (!html && !text)) {
      throw new Error("Missing required fields: to, subject, html/text");
    }

    const msg = {
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: "TaskFlow", // Sender name
      },
      subject,
      text: text || "This is a test email from TaskFlow",
      html: html || `<p>This is a test email from <b>TaskFlow</b></p>`,
    };

    // 🚀 SEND EMAIL
    const response = await sgMail.send(msg);

    console.log("✅ Email sent successfully");
    console.log("📨 Status Code:", response[0].statusCode);

    return {
      success: true,
      statusCode: response[0].statusCode,
    };
  } catch (error) {
    console.error("❌ Email sending failed");

    // 🔍 DETAILED ERROR LOGGING
    if (error.response) {
      console.error("📛 SendGrid Error:", error.response.body);
    } else {
      console.error("📛 Error:", error.message);
    }

    return {
      success: false,
      error: error.response?.body || error.message,
    };
  }
};

module.exports = sendEmail;
