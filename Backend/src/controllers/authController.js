const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { generateVerificationToken, hashToken } = require('../utils/crypto');
const { generateAccessToken } = require('../utils/jwt');
const { sendVerificationEmail } = require('../services/emailService');
const { appBaseUrl, nodeEnv } = require('../config/env');
const { ROLES } = require('../constants/roles');

const toCleanString = (value) => (typeof value === 'string' ? value.trim() : value);

const buildVerificationUrl = (email, rawToken) => {
  const normalizedBaseUrl = appBaseUrl.endsWith('/') ? appBaseUrl.slice(0, -1) : appBaseUrl;

  return `${normalizedBaseUrl}/api/auth/verify-email?email=${encodeURIComponent(email)}&token=${encodeURIComponent(rawToken)}`;
};

const assignRoleSpecificFields = (body, userPayload) => {
  if (body.role === ROLES.DOCTOR) {
    userPayload.fullName = toCleanString(body.fullName);
    userPayload.medicalLicenseNumber = toCleanString(body.medicalLicenseNumber);
    userPayload.specialization = toCleanString(body.specialization);
    userPayload.hospitalOrClinicName = toCleanString(body.hospitalOrClinicName);
  }

  if (body.role === ROLES.PHARMACY) {
    userPayload.pharmacyName = toCleanString(body.pharmacyName);
    userPayload.pharmacyLicenseNumber = toCleanString(body.pharmacyLicenseNumber);
    userPayload.pharmacyAddress = toCleanString(body.pharmacyAddress);
  }
};

const createVerificationChallenge = async (user) => {
  const rawVerificationToken = generateVerificationToken();
  const verificationTokenHash = hashToken(rawVerificationToken);
  const verificationExpiry = new Date(Date.now() + 30 * 60 * 1000);

  user.emailVerificationTokenHash = verificationTokenHash;
  user.emailVerificationExpiresAt = verificationExpiry;
  await user.save();

  const verificationUrl = buildVerificationUrl(user.email, rawVerificationToken);
  const emailStatus = await sendVerificationEmail({
    email: user.email,
    role: user.role,
    verificationUrl,
  });

  return {
    verificationUrl,
    emailStatus,
  };
};

const signup = asyncHandler(async (req, res, next) => {
  const userPayload = {
    role: toCleanString(req.body.role),
    email: toCleanString(req.body.email).toLowerCase(),
    password: req.body.password,
    aadhaarNumber: toCleanString(req.body.aadhaarNumber),
  };

  assignRoleSpecificFields(req.body, userPayload);

  const existingUser = await User.findOne({ email: userPayload.email });
  if (existingUser) {
    return next(new AppError('An account with this email already exists.', 409));
  }

  const user = await User.create(userPayload);
  const { verificationUrl, emailStatus } = await createVerificationChallenge(user);

  const responsePayload = {
    success: true,
    message: 'Signup successful. Verify your email before logging in.',
  };

  if (!emailStatus.delivered && nodeEnv !== 'production') {
    responsePayload.developmentVerificationLink = verificationUrl;
  }

  return res.status(201).json(responsePayload);
});

const verifyEmail = asyncHandler(async (req, res, next) => {
  const email = toCleanString(req.query.email).toLowerCase();
  const token = toCleanString(req.query.token);

  const user = await User.findOne({ email }).select('+emailVerificationTokenHash +emailVerificationExpiresAt');

  if (!user) {
    return next(new AppError('Invalid verification request.', 400));
  }

  if (user.isEmailVerified) {
    return res.status(200).json({
      success: true,
      message: 'Email is already verified.',
    });
  }

  const incomingTokenHash = hashToken(token);

  const tokenMatches = user.emailVerificationTokenHash === incomingTokenHash;
  const tokenNotExpired = user.emailVerificationExpiresAt && user.emailVerificationExpiresAt > new Date();

  if (!tokenMatches || !tokenNotExpired) {
    return next(new AppError('Verification token is invalid or has expired.', 400));
  }

  user.isEmailVerified = true;
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationExpiresAt = undefined;
  await user.save();

  return res.status(200).json({
    success: true,
    message: 'Email verified successfully. You can now log in.',
  });
});

const resendVerification = asyncHandler(async (req, res, next) => {
  const email = toCleanString(req.body.email).toLowerCase();

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('No account found with this email.', 404));
  }

  if (user.isEmailVerified) {
    return res.status(200).json({
      success: true,
      message: 'Email is already verified.',
    });
  }

  const { verificationUrl, emailStatus } = await createVerificationChallenge(user);

  const responsePayload = {
    success: true,
    message: 'Verification email sent successfully.',
  };

  if (!emailStatus.delivered && nodeEnv !== 'production') {
    responsePayload.developmentVerificationLink = verificationUrl;
  }

  return res.status(200).json(responsePayload);
});

const login = asyncHandler(async (req, res, next) => {
  const email = toCleanString(req.body.email).toLowerCase();
  const password = req.body.password;
  const selectedRole = req.body.role ? toCleanString(req.body.role) : null;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new AppError('Invalid email or password.', 401));
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    return next(new AppError('Invalid email or password.', 401));
  }

  if (selectedRole && selectedRole !== user.role) {
    return next(new AppError('Selected role does not match this account.', 403));
  }

  if (!user.isEmailVerified) {
    return next(new AppError('Email is not verified. Please verify before login.', 403));
  }

  const token = generateAccessToken(user);

  return res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: {
      token,
      user: user.toSafeObject(),
    },
  });
});

const getMyProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  return res.status(200).json({
    success: true,
    data: {
      user: user.toSafeObject(),
    },
  });
});

module.exports = {
  signup,
  verifyEmail,
  resendVerification,
  login,
  getMyProfile,
};
