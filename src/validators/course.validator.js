const { body, param, query } = require('express-validator');

const createCourseRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Course name is required')
    .isLength({ max: 255 })
    .withMessage('Course name must be at most 255 characters'),
];

const updateCourseRules = [
  param('id').isUUID().withMessage('Invalid course ID'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Course name cannot be empty')
    .isLength({ max: 255 })
    .withMessage('Course name must be at most 255 characters'),
];

const deleteCourseRules = [
  param('id').isUUID().withMessage('Invalid course ID'),
  body('confirm')
    .equals('true')
    .withMessage('Confirmation is required. Send { "confirm": "true" } to delete.'),
];

const courseIdRule = [
  param('id').isUUID().withMessage('Invalid course ID'),
];

const courseResultsRules = [
  param('id').isUUID().withMessage('Invalid course ID'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

module.exports = {
  createCourseRules,
  updateCourseRules,
  deleteCourseRules,
  courseIdRule,
  courseResultsRules,
};
