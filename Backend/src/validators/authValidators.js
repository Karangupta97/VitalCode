const { body, query } = require('express-validator');
const { ROLE_VALUES, ROLES } = require('../constants/roles');

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,64}$/;
const AADHAAR_REGEX = /^\d{12}$/;

const signupValidation = [
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required.')
    .isIn(ROLE_VALUES)
    .withMessage(`Role must be one of: ${ROLE_VALUES.join(', ')}.`),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('A valid email address is required.')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .matches(PASSWORD_REGEX)
    .withMessage('Password must be 8-64 chars and include uppercase, lowercase, number, and special character.'),

  body('aadhaarNumber')
    .trim()
    .notEmpty()
    .withMessage('Aadhaar number is required.')
    .matches(AADHAAR_REGEX)
    .withMessage('Aadhaar number must contain exactly 12 digits.'),

  body('fullName')
    .if((value, { req }) => req.body.role === ROLES.DOCTOR)
    .trim()
    .notEmpty()
    .withMessage('Full name is required for doctor signup.')
    .isLength({ min: 2, max: 80 })
    .withMessage('Full name must be between 2 and 80 characters.'),

  body('medicalLicenseNumber')
    .if((value, { req }) => req.body.role === ROLES.DOCTOR)
    .trim()
    .notEmpty()
    .withMessage('Medical license number is required for doctor signup.')
    .isLength({ min: 4, max: 60 })
    .withMessage('Medical license number must be between 4 and 60 characters.'),

  body('specialization')
    .if((value, { req }) => req.body.role === ROLES.DOCTOR)
    .trim()
    .notEmpty()
    .withMessage('Specialization is required for doctor signup.')
    .isLength({ min: 2, max: 80 })
    .withMessage('Specialization must be between 2 and 80 characters.'),

  body('hospitalOrClinicName')
    .if((value, { req }) => req.body.role === ROLES.DOCTOR)
    .trim()
    .notEmpty()
    .withMessage('Hospital or clinic name is required for doctor signup.')
    .isLength({ min: 2, max: 120 })
    .withMessage('Hospital or clinic name must be between 2 and 120 characters.'),

  body('pharmacyName')
    .if((value, { req }) => req.body.role === ROLES.PHARMACY)
    .trim()
    .notEmpty()
    .withMessage('Pharmacy name is required for pharmacy signup.')
    .isLength({ min: 2, max: 120 })
    .withMessage('Pharmacy name must be between 2 and 120 characters.'),

  body('pharmacyLicenseNumber')
    .if((value, { req }) => req.body.role === ROLES.PHARMACY)
    .trim()
    .notEmpty()
    .withMessage('License number is required for pharmacy signup.')
    .isLength({ min: 4, max: 60 })
    .withMessage('License number must be between 4 and 60 characters.'),

  body('pharmacyAddress')
    .if((value, { req }) => req.body.role === ROLES.PHARMACY)
    .trim()
    .notEmpty()
    .withMessage('Address is required for pharmacy signup.')
    .isLength({ min: 8, max: 240 })
    .withMessage('Address must be between 8 and 240 characters.'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('A valid email address is required.')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required.'),

  body('role')
    .optional()
    .trim()
    .isIn(ROLE_VALUES)
    .withMessage(`Role must be one of: ${ROLE_VALUES.join(', ')}.`),
];

const verifyEmailValidation = [
  query('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('A valid email address is required.')
    .normalizeEmail(),

  query('token')
    .trim()
    .notEmpty()
    .withMessage('Verification token is required.')
    .isHexadecimal()
    .withMessage('Verification token is invalid.')
    .isLength({ min: 64, max: 64 })
    .withMessage('Verification token is invalid.'),
];

const resendVerificationValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('A valid email address is required.')
    .normalizeEmail(),
];

module.exports = {
  signupValidation,
  loginValidation,
  verifyEmailValidation,
  resendVerificationValidation,
};
