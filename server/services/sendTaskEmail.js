const renderTemplate = require("../utils/templateRenderer.js");
const sendEmail = require("../utils/sendEmail.js");

const sendTaskEmail = async (payload) => {
  const html = await renderTemplate("taskAssigned", {
    name: payload.name,
    title: payload.title,
    description: payload.description,
    priority: payload.priority,
    dueDate: payload.dueDate,
    adminName: payload.adminName,
    taskId: payload.taskId || "N/A",
    taskLink: payload.taskLink || "http://localhost:5173/employee/tasks",
  });

  await sendEmail({
    to: payload.email,
    subject: `New Task Assigned — ${payload.title}`,
    html,
  });
};

module.exports = sendTaskEmail;
