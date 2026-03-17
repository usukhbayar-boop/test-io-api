const { body, param } = require('express-validator');

// Middleware to parse answers JSON string from form-data before validation
function parseAnswers(req, res, next) {
  if (typeof req.body.answers === 'string') {
    try {
      req.body.answers = JSON.parse(req.body.answers);
    } catch {
      // Let the validator handle the error
    }
  }
  next();
}

const createQuestionRules = [
  parseAnswers,
  param('courseId').isUUID().withMessage('Invalid course ID'),
  body('text_content')
    .optional()
    .trim(),
  body('answers')
    .isArray({ min: 2, max: 6 })
    .withMessage('Must provide between 2 and 6 answers'),
  body('answers.*.text')
    .trim()
    .notEmpty()
    .withMessage('Each answer must have text'),
];

const updateQuestionRules = [
  parseAnswers,
  param('id').isUUID().withMessage('Invalid question ID'),
  body('text_content')
    .optional()
    .trim(),
  body('answers')
    .optional()
    .isArray({ min: 2, max: 6 })
    .withMessage('Must provide between 2 and 6 answers'),
  body('answers.*.text')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Each answer must have text'),
];

const deleteQuestionRules = [
  param('id').isUUID().withMessage('Invalid question ID'),
];

module.exports = {
  createQuestionRules,
  updateQuestionRules,
  deleteQuestionRules,
};
