// email.service.js
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // ✅ required for port 465
  auth: {
    user: process.env.NODE_MAILER_AUTH_USER,
    pass: process.env.NODE_MAILER_AUTH_PASSWORD,
  },
});

const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: "Welcome to our platform!",
    text: `Hello ${user.username}, welcome to our platform!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully!");
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

module.exports = { sendWelcomeEmail };
