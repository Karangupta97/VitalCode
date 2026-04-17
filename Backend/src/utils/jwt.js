const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

const generateAccessToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn },
  );

module.exports = {
  generateAccessToken,
};
