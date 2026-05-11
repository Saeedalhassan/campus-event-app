const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEventReminder = async (toEmail, userName, eventTitle, eventLocation, eventTime) => {
  const mailOptions = {
    from: `"CampusEvents UDS" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `⏰ Reminder: ${eventTitle} is starting soon!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a2e; padding: 20px; text-align: center;">
          <h1 style="color: #e94560;">🎓 CampusEvents UDS</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Hello ${userName}! 👋</h2>
          <p>This is a reminder that an event you registered for is starting soon!</p>
          <div style="background: #fff; padding: 20px; border-radius: 10px; border-left: 4px solid #e94560;">
            <h3 style="color: #e94560;">${eventTitle}</h3>
            <p>📍 <strong>Location:</strong> ${eventLocation}</p>
            <p>🗓 <strong>Time:</strong> ${new Date(eventTime).toLocaleString()}</p>
          </div>
          <p style="margin-top: 20px;">Don't be late! See you there. 🎉</p>
        </div>
        <div style="background: #1a1a2e; padding: 15px; text-align: center;">
          <p style="color: #fff; margin: 0;">CampusEvents UDS — University For Development Studies</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendWelcomeEmail = async (toEmail, userName) => {
  const mailOptions = {
    from: `"CampusEvents UDS" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Welcome to CampusEvents UDS! 🎓`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a2e; padding: 20px; text-align: center;">
          <h1 style="color: #e94560;">🎓 CampusEvents UDS</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Welcome, ${userName}! 🎉</h2>
          <p>You have successfully registered on CampusEvents UDS.</p>
          <p>You can now browse and join campus events!</p>
        </div>
        <div style="background: #1a1a2e; padding: 15px; text-align: center;">
          <p style="color: #fff; margin: 0;">CampusEvents UDS — University For Development Studies</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendVerificationEmail = async (toEmail, userName, token) => {
  const verifyUrl = `http://localhost:3000/verify/${token}`;
  const mailOptions = {
    from: `"CampusEvents UDS" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `✅ Verify Your Email — CampusEvents UDS`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a2e; padding: 20px; text-align: center;">
          <h1 style="color: #e94560;">🎓 CampusEvents UDS</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Hello ${userName}! 👋</h2>
          <p>Thank you for registering on CampusEvents UDS!</p>
          <p>Please verify your email address to activate your account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" 
               style="background: #e94560; color: #fff; padding: 15px 30px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 1rem;">
              ✅ Verify My Email
            </a>
          </div>
          <p style="color: #999; font-size: 0.85rem;">This link expires in 24 hours. If you did not register, ignore this email.</p>
        </div>
        <div style="background: #1a1a2e; padding: 15px; text-align: center;">
          <p style="color: #fff; margin: 0;">CampusEvents UDS — University of Development Studies</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (toEmail, userName, token) => {
  const resetUrl = `http://localhost:3000/reset-password/${token}`;
  const mailOptions = {
    from: `"CampusEvents UDS" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `🔐 Reset Your Password — CampusEvents UDS`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a2e; padding: 20px; text-align: center;">
          <h1 style="color: #e94560;">🎓 CampusEvents UDS</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Hello ${userName}! 👋</h2>
          <p>We received a request to reset your password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background: #e94560; color: #fff; padding: 15px 30px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 1rem;">
              🔐 Reset My Password
            </a>
          </div>
          <p style="color: #999; font-size: 0.85rem;">This link expires in 1 hour. If you did not request this, ignore this email.</p>
        </div>
        <div style="background: #1a1a2e; padding: 15px; text-align: center;">
          <p style="color: #fff; margin: 0;">CampusEvents UDS — University of Development Studies</p>
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendEventReminder, sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail };