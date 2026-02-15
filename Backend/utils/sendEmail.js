import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Healance AI" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    throw error;
  }
};

// Pre-built email templates
export const sendWelcomeEmail = async (email, name) => {
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #0ea5e9, #8b5cf6); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">Welcome to Healance! 🎉</h1>
      </div>
      <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 16px 16px;">
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thank you for joining Healance AI. Your health journey starts now!</p>
        <p>Here's what you can do:</p>
        <ul>
          <li>🩺 Get AI-powered health risk predictions</li>
          <li>💬 Chat with our AI health assistant</li>
          <li>🏃 Track your steps and earn rewards</li>
          <li>📊 Monitor your health trends</li>
        </ul>
        <p>Get started by completing your health profile in the dashboard.</p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">
          © ${new Date().getFullYear()} Healance AI. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject: 'Welcome to Healance AI! 🚀', html });
};

export const sendContactConfirmation = async (email, name) => {
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Thank you for contacting Healance, ${name}!</h2>
      <p>We have received your message and will get back to you within 24 hours.</p>
      <p>Best regards,<br>The Healance Team</p>
    </div>
  `;

  return sendEmail({ to: email, subject: 'We received your message - Healance', html });
};

export default sendEmail;
