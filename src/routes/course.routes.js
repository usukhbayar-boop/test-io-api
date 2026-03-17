const { Router } = require('express');
const courseController = require('../controllers/course.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { uploadCourseImage } = require('../middlewares/upload');
const {
  createCourseRules,
  updateCourseRules,
  deleteCourseRules,
  courseResultsRules,
} = require('../validators/course.validator');
const validate = require('../middlewares/validate');

const router = Router();

// Public
router.get('/', courseController.getAll);

// Admin
router.post(
  '/',
  authenticate, authorize('admin'),
  uploadCourseImage,
  createCourseRules, validate,
  courseController.create,
);

router.put(
  '/:id',
  authenticate, authorize('admin'),
  uploadCourseImage,
  updateCourseRules, validate,
  courseController.update,
);

router.delete(
  '/:id',
  authenticate, authorize('admin'),
  deleteCourseRules, validate,
  courseController.remove,
);

module.exports = router;
