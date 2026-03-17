const examService = require('../services/exam.service');

async function start(req, res, next) {
  try {
    const result = await examService.startExam(req.user.id, req.params.courseId);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function submit(req, res, next) {
  try {
    const result = await examService.submitExam(req.user.id, req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function markStarted(req, res, next) {
  try {
    await examService.markExamStarted(req.params.examId, req.user.id);
    res.json({ success: true, message: 'Exam timer started' });
  } catch (err) {
    next(err);
  }
}

module.exports = { start, submit, markStarted };
