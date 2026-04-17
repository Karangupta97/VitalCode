const {
  nodeEnv,
  mongoUri,
  jwtSecret,
  resendApiKey,
  resendFromEmail,
} = require('./env');

const validateMongoUri = () => {
  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://');
  }

  const scheme = mongoUri.startsWith('mongodb+srv://') ? 'mongodb+srv://' : 'mongodb://';
  const atIndex = mongoUri.indexOf('@');
  const rawCredentialPart = atIndex > -1 ? mongoUri.slice(scheme.length, atIndex) : '';
  const credentialPieces = rawCredentialPart.split(':');
  const rawUser = credentialPieces[0] || '';
  const rawPass = credentialPieces.length > 1 ? credentialPieces.slice(1).join(':') : '';

  if (/[<>]/.test(rawCredentialPart)) {
    throw new Error('MONGODB_URI contains angle brackets in credentials. Remove < and > around username/password.');
  }

  if (/(username|password)/i.test(rawCredentialPart)) {
    throw new Error('MONGODB_URI appears to contain placeholder credentials. Replace them with your Atlas database user credentials.');
  }

  // Reserved URI characters must be percent-encoded inside username/password.
  if (/[\s@/?#[\]]/.test(rawUser) || /[\s@/?#[\]]/.test(rawPass)) {
    throw new Error('MONGODB_URI credentials contain unencoded reserved characters. URL-encode username/password before use.');
  }

  let parsed;
  try {
    parsed = new URL(mongoUri);
  } catch (error) {
    throw new Error('MONGODB_URI is not a valid URI.');
  }

  if (!parsed.username || !parsed.password) {
    throw new Error('MONGODB_URI must include both username and password for Atlas authentication.');
  }
};

const validateEnv = () => {
  const missing = [];

  if (!mongoUri) missing.push('MONGODB_URI');
  if (!jwtSecret) missing.push('JWT_SECRET');

  if (nodeEnv === 'production') {
    if (!resendApiKey) missing.push('RESEND_API_KEY');
    if (!resendFromEmail) missing.push('RESEND_FROM_EMAIL');
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  validateMongoUri();
};

module.exports = validateEnv;
