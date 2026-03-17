const { Router } = require('express');
const courseController = require('../controllers/course.controller');
const { authenticate, authorize } = require('../middlewares/auth');
const { courseResultsRules } = require('../validators/course.validator');
const validate = require('../middlewares/validate');

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/courses/:id/results', courseResultsRules, validate, courseController.getResults);

module.exports = router;
