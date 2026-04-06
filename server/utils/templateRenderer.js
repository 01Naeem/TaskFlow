const ejs = require("ejs");
const path = require("path");

const renderTemplate = async (templateName, data) => {
  const filePath = path.join(
    process.cwd(),
    "templates/emails",
    `${templateName}.ejs`
  );

  return await ejs.renderFile(filePath, data);
};

module.exports = renderTemplate;