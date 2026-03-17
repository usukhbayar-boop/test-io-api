const { body } = require('express-validator');

const registerRules = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 100 })
    .withMessage('First name must be at most 100 characters'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 100 })
    .withMessage('Last name must be at most 100 characters'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[0-9]{8,15}$/)
    .withMessage('Phone number must be 8-15 digits, optionally starting with +'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginRules = [
  body('password').notEmpty().withMessage('Password is required'),
  body()
    .custom((value) => {
      if (!value.email && !value.phone) {
        throw new Error('Either email or phone is required');
      }
      return true;
    }),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .matches(/^\+?[0-9]{8,15}$/)
    .withMessage('Phone number must be 8-15 digits, optionally starting with +'),
];

const adminLoginRules = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

module.exports = { registerRules, loginRules, adminLoginRules };
