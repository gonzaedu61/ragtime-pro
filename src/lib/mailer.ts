import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.purelymail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.PURELYMAIL_SMTP_USER,
    pass: process.env.PURELYMAIL_SMTP_PASS,
  },
});

export default transporter;
