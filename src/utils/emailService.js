import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOtpEmail(toEmail, otp) {
  const mailOptions = {
    from: `"Idea2LLD" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your Password Reset OTP",
    html: `
      <h2>Password Reset</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
      <p>If you didn’t request this, ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
