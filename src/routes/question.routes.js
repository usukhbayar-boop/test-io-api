const { Router } = require('express');
const questionController = require('../controllers/question.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { uploadQuestionMedia } = require('../middlewares/upload');
const {
  createQuestionRules,
  updateQuestionRules,
  deleteQuestionRules,
} = require('../validators/question.validator');
const validate = require('../middlewares/validate');

const router = Router();

// Admin only
router.get(
  '/course/:courseId',
  authenticate, authorize('admin'),
  questionController.getByCourse,
);

router.post(
  '/course/:courseId',
  authenticate, authorize('admin'),
  uploadQuestionMedia,
  createQuestionRules, validate,
  questionController.create,
);

router.put(
  '/:id',
  authenticate, authorize('admin'),
  uploadQuestionMedia,
  updateQuestionRules, validate,
  questionController.update,
);

router.delete(
  '/:id',
  authenticate, authorize('admin'),
  deleteQuestionRules, validate,
  questionController.remove,
);

module.exports = router;
