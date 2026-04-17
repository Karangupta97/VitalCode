const express = require('express');
const {
  signup,
  verifyEmail,
  resendVerification,
  login,
} = require('../controllers/authController');
const {
  signupValidation,
  verifyEmailValidation,
  resendVerificationValidation,
  loginValidation,
} = require('../validators/authValidators');
const validateRequest = require('../middleware/validateRequest');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/signup', authLimiter, signupValidation, validateRequest, signup);
router.post('/login', authLimiter, loginValidation, validateRequest, login);
router.get('/verify-email', verifyEmailValidation, validateRequest, verifyEmail);
router.post('/resend-verification', authLimiter, resendVerificationValidation, validateRequest, resendVerification);

module.exports = router;
