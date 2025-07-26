// utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,         // 👈 Ethereal or other host
    port: process.env.EMAIL_PORT,         // 587 for Ethereal
    secure: false,                        // false for TLS (Ethereal)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
