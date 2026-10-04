const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const FROM_EMAIL = process.env.EMAIL_USER || 'alhassansaeed2005@gmail.com';
const FROM_NAME = 'CampusEvents UDS';

const sendEmail = async (toEmail, toName, subject, htmlContent) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = { name: FROM_NAME, email: FROM_EMAIL };
  sendSmtpEmail.to = [{ email: toEmail, name: toName }];

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Email sent to ${toEmail}`);
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

const sendEventReminder = async (toEmail, userName, eventTitle, eventLocation, eventTime) => {
  await sendEmail(toEmail, userName, `⏰ Reminder: ${eventTitle} is starting soon!`, `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0d1f0d; padding: 20px; text-align: center;">
        <img src="https://res.cloudinary.com/difjtbnve/image/upload/v1782196514/uds-logo_ewm8w2.jpg" 
          style="width:60px;height:60px;border-radius:50%;border:2px solid #4CAF50;" />
        <h1 style="color: #4CAF50; margin: 0.5rem 0 0;">CampusEvents UDS</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2>Hello ${userName}! 👋</h2>
        <p>This is a reminder that an event you registered for is starting soon!</p>
        <div style="background: #fff; padding: 20px; border-radius: 10px; border-left: 4px solid #2E7D32;">
          <h3 style="color: #2E7D32;">${eventTitle}</h3>
          <p>📍 <strong>Location:</strong> ${eventLocation}</p>
          <p>🗓 <strong>Time:</strong> ${new Date(eventTime).toLocaleString()}</p>
        </div>
        <p style="margin-top: 20px;">Don't be late! See you there. 🎉</p>
      </div>
      <div style="background: #0d1f0d; padding: 15px; text-align: center;">
        <p style="color: #4CAF50; margin: 0;">CampusEvents UDS — University of Development Studies</p>
        <p style="color: rgba(255,255,255,0.6); margin: 0.3rem 0 0; font-size: 0.85rem;">"Knowledge for Development"</p>
      </div>
    </div>
  `);
};

const sendWelcomeEmail = async (toEmail, userName) => {
  await sendEmail(toEmail, userName, `Welcome to CampusEvents UDS! 🎓`, `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0d1f0d; padding: 20px; text-align: center;">
        <img src="https://res.cloudinary.com/difjtbnve/image/upload/v1782196514/uds-logo_ewm8w2.jpg"
          style="width:60px;height:60px;border-radius:50%;border:2px solid #4CAF50;" />
        <h1 style="color: #4CAF50; margin: 0.5rem 0 0;">CampusEvents UDS</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2>Welcome, ${userName}! 🎉</h2>
        <p>You have successfully registered on CampusEvents UDS.</p>
        <p>You can now:</p>
        <ul>
          <li>Browse and discover campus events</li>
          <li>RSVP to events you want to attend</li>
          <li>Create and manage your own events</li>
          <li>Get reminders before events start</li>
          <li>Follow your favorite organizers</li>
        </ul>
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://campus-event-app-nine.vercel.app"
            style="background: #2E7D32; color: #fff; padding: 12px 30px; border-radius: 30px; text-decoration: none; font-weight: bold;">
            🎓 Browse Events
          </a>
        </div>
      </div>
      <div style="background: #0d1f0d; padding: 15px; text-align: center;">
        <p style="color: #4CAF50; margin: 0;">CampusEvents UDS — University of Development Studies</p>
        <p style="color: rgba(255,255,255,0.6); margin: 0.3rem 0 0; font-size: 0.85rem;">"Knowledge for Development"</p>
      </div>
    </div>
  `);
};

const sendVerificationEmail = async (toEmail, userName, token) => {
  const verifyUrl = `https://campus-event-app-nine.vercel.app/verify/${token}`;
  await sendEmail(toEmail, userName, `✅ Verify Your Email — CampusEvents UDS`, `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0d1f0d; padding: 20px; text-align: center;">
        <img src="https://res.cloudinary.com/difjtbnve/image/upload/v1782196514/uds-logo_ewm8w2.jpg"
          style="width:60px;height:60px;border-radius:50%;border:2px solid #4CAF50;" />
        <h1 style="color: #4CAF50; margin: 0.5rem 0 0;">CampusEvents UDS</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2>Hello ${userName}! 👋</h2>
        <p>Thank you for registering on CampusEvents UDS!</p>
        <p>Please verify your email address to activate your account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}"
            style="background: #2E7D32; color: #fff; padding: 15px 30px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 1rem;">
            ✅ Verify My Email
          </a>
        </div>
        <p style="color: #999; font-size: 0.85rem;">
          This link expires in 24 hours. If you did not register, ignore this email.
        </p>
      </div>
      <div style="background: #0d1f0d; padding: 15px; text-align: center;">
        <p style="color: #4CAF50; margin: 0;">CampusEvents UDS — University For Development Studies</p>
        <p style="color: rgba(255,255,255,0.6); margin: 0.3rem 0 0; font-size: 0.85rem;">"Knowledge for Development"</p>
      </div>
    </div>
  `);
};

const sendPasswordResetEmail = async (toEmail, userName, token) => {
  const resetUrl = `https://campus-event-app-nine.vercel.app/reset-password/${token}`;
  await sendEmail(toEmail, userName, `🔐 Reset Your Password — CampusEvents UDS`, `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0d1f0d; padding: 20px; text-align: center;">
        <img src="https://res.cloudinary.com/difjtbnve/image/upload/v1782196514/uds-logo_ewm8w2.jpg"
          style="width:60px;height:60px;border-radius:50%;border:2px solid #4CAF50;" />
        <h1 style="color: #4CAF50; margin: 0.5rem 0 0;">CampusEvents UDS</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2>Hello ${userName}! 👋</h2>
        <p>We received a request to reset your password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}"
            style="background: #2E7D32; color: #fff; padding: 15px 30px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 1rem;">
            🔐 Reset My Password
          </a>
        </div>
        <p style="color: #999; font-size: 0.85rem;">
          This link expires in 1 hour. If you did not request this, ignore this email.
        </p>
      </div>
      <div style="background: #0d1f0d; padding: 15px; text-align: center;">
        <p style="color: #4CAF50; margin: 0;">CampusEvents UDS — University of Development Studies</p>
        <p style="color: rgba(255,255,255,0.6); margin: 0.3rem 0 0; font-size: 0.85rem;">"Knowledge for Development"</p>
      </div>
    </div>
  `);
};

module.exports = { sendEventReminder, sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail };