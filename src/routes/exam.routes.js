const { Router } = require('express');
const examController = require('../controllers/exam.controller');
const { authenticate } = require('../middlewares/auth');
const { startExamRules, submitExamRules } = require('../validators/exam.validator');
const validate = require('../middlewares/validate');

const router = Router();

// User endpoints
router.post('/start/:courseId', authenticate, startExamRules, validate, examController.start);
router.post('/submit', authenticate, submitExamRules, validate, examController.submit);
router.patch('/:examId/start-timer', authenticate, examController.markStarted);

module.exports = router;
