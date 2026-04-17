const mongoose = require('mongoose');
const { mongoUri, nodeEnv } = require('./env');

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: nodeEnv !== 'production',
      serverSelectionTimeoutMS: 10000,
    });

    console.log('MongoDB connected successfully.');
  } catch (error) {
    const message = String(error && error.message ? error.message : '');

    if (/bad auth|Authentication failed/i.test(message)) {
      throw new Error(
        'MongoDB authentication failed. Verify Atlas Database Access user credentials in MONGODB_URI and URL-encode special characters in password.',
      );
    }

    throw error;
  }
};

module.exports = connectDB;
