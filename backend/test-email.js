require("dotenv").config();
const nodemailer = require("nodemailer");

async function main() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.ORDER_NOTIFICATION_EMAIL,
    subject: "Nyora Beauty - Email Test",
    text: "Success! Email notifications are being tested for Nyora Beauty.",
  });

  console.log("Test email sent successfully!");
}

main().catch((error) => {
  console.error("Email test failed:", error.message);
  process.exitCode = 1;
});
