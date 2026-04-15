const nodemailer = require("nodemailer");

async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false // 🔥 FIX
    }
  });

  await transporter.sendMail({
    from: `"Job Tracker" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  });

  console.log("✅ Email sent to:", to);
}

module.exports = sendEmail;
