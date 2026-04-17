const { Resend } = require('resend');
const AppError = require('../utils/AppError');
const { resendApiKey, resendFromEmail } = require('../config/env');

const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

const sendVerificationEmail = async ({ email, role, verificationUrl }) => {
  if (!resendClient) {
    console.warn('RESEND_API_KEY is not set. Verification URL:', verificationUrl);
    return { delivered: false };
  }

  const subject = 'Verify your VitalCode account';
  const text = [
    'Welcome to VitalCode.',
    '',
    `Please verify your ${role} account by opening this link:`,
    verificationUrl,
    '',
    'This verification link expires in 30 minutes.',
    'If you did not request this account, you can safely ignore this email.',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #102a43; max-width: 600px; margin: 0 auto;">
      <h2 style="margin-bottom: 8px;">VitalCode Email Verification</h2>
      <p style="margin-top: 0;">Welcome. Please verify your <strong>${role}</strong> account to activate login access.</p>
      <p>
        <a href="${verificationUrl}" style="display: inline-block; background: #0f766e; color: #ffffff; padding: 10px 16px; border-radius: 8px; text-decoration: none; font-weight: 600;">Verify Email</a>
      </p>
      <p style="font-size: 14px; color: #486581;">This link expires in 30 minutes.</p>
      <p style="font-size: 12px; color: #829ab1;">If you did not create this account, you can ignore this email.</p>
    </div>
  `;

  try {
    await resendClient.emails.send({
      from: resendFromEmail,
      to: email,
      subject,
      html,
      text,
    });

    return { delivered: true };
  } catch (error) {
    console.error('Resend delivery error:', error);
    throw new AppError('Unable to send verification email. Please try again later.', 502);
  }
};

module.exports = {
  sendVerificationEmail,
};
