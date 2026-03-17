const { Router } = require('express');
const authRoutes = require('./auth.routes');
const courseRoutes = require('./course.routes');
const questionRoutes = require('./question.routes');
const examRoutes = require('./exam.routes');
const adminRoutes = require('./admin.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/questions', questionRoutes);
router.use('/exam', examRoutes);
router.use('/admin', adminRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
