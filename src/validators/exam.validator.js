const { body, param } = require('express-validator');

const startExamRules = [
  param('courseId').isUUID().withMessage('Invalid course ID'),
];

const submitExamRules = [
  body('exam_id')
    .notEmpty()
    .withMessage('Exam ID is required')
    .isUUID()
    .withMessage('Invalid exam ID'),
  body('answers')
    .isArray({ min: 1 })
    .withMessage('Answers array is required'),
  body('answers.*.question_id')
    .isUUID()
    .withMessage('Invalid question ID'),
  body('answers.*.selected_answer_id')
    .isUUID()
    .withMessage('Invalid answer ID'),
];

module.exports = { startExamRules, submitExamRules };
