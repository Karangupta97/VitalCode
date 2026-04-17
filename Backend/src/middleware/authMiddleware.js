const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { jwtSecret } = require('../config/env');

const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication token is missing.', 401));
  }

  const token = authHeader.split(' ')[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, jwtSecret);
  } catch (error) {
    return next(new AppError('Invalid or expired token.', 401));
  }

  const user = await User.findById(decodedToken.sub);

  if (!user) {
    return next(new AppError('User no longer exists.', 401));
  }

  req.user = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
  };

  return next();
});

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication is required.', 401));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new AppError('Forbidden: insufficient permissions.', 403));
  }

  return next();
};

module.exports = {
  authenticate,
  authorizeRoles,
};
