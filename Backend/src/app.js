const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { frontendUrl, nodeEnv } = require('./config/env');
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const { apiLimiter } = require('./middleware/rateLimiter');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const corsOrigin =
  frontendUrl === '*'
    ? true
    : frontendUrl
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

if (nodeEnv !== 'test') {
  app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));
}

app.get('/', (req, res) => {
  res.status(200).json({
    name: 'VitalCode API',
    version: '2.0.0',
    endpoints: [
      'GET  /api/health',
      'POST /api/auth/signup',
      'POST /api/auth/login',
      'GET  /api/auth/verify-email',
      'POST /api/auth/resend-verification',
      'GET  /api/protected/me',
      'GET  /api/protected/doctor-only',
      'GET  /api/protected/pharmacy-only',
      'GET  /api/protected/patient-only',
    ],
  });
});

app.use('/api', apiLimiter);
app.use('/api', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
