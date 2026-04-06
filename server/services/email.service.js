const renderTemplate = require("../utils/templateRenderer.js");
const sendEmail = require("../utils/sendEmail.js");

const sendWelcomeEmail = async (payload) => {
  const html = await renderTemplate("welcome", {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    department: payload.department,
    designation: payload.designation,
    adminName: payload.adminName,
    loginUrl: "https://app.taskflow.com/login",
  });

  await sendEmail({
    to: payload.email,
    subject: "Welcome to TaskFlow — Your Account Is Ready",
    html,
  });
};

module.exports = sendWelcomeEmail;