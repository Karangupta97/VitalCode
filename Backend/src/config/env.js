const dotenv = require('dotenv');

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const port = Number(process.env.PORT) || 4000;

module.exports = {
  nodeEnv,
  port,
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  appBaseUrl: process.env.APP_BASE_URL || `http://localhost:${port}`,
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendFromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
};
