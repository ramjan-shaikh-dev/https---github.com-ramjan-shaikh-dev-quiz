const transporter = require("../config/nodemailer");
const EMAIL = "mitalikashaveni@gmail.com";

async function sendEmail(to, subject, text) {
  console.log("sendEmail",to,subject,text)
  try {
    if (!to || !subject || !text) {
      throw new Error("to , subject , text is required");
    }
    const info = await transporter.sendMail({
      from: EMAIL,
      to: to,
      subject: subject,
      text: text,
    });
    return info;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  sendEmail,
};
