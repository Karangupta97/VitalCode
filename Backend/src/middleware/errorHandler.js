const { nodeEnv } = require('../config/env');

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error.';
  let details = error.details || null;

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed.';
    details = Object.values(error.errors).map((fieldError) => fieldError.message);
  }

  if (error.code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys(error.keyPattern || {})[0] || 'field';
    message = `${duplicateField} already exists.`;
  }

  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier.';
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(nodeEnv !== 'production' && statusCode === 500 ? { stack: error.stack } : {}),
  });
};

module.exports = errorHandler;
