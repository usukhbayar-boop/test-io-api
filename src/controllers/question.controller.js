const questionService = require('../services/question.service');

async function create(req, res, next) {
  try {
    const files = req.files || {};
    const image_url = files.image?.[0] ? `/${files.image[0].path}` : null;
    const audio_url = files.audio?.[0] ? `/${files.audio[0].path}` : null;
    const video_url = files.video?.[0] ? `/${files.video[0].path}` : null;

    // Parse answers from form data (JSON string) or body
    let answers = req.body.answers;
    if (typeof answers === 'string') {
      answers = JSON.parse(answers);
    }

    const question = await questionService.createQuestion(req.params.courseId, {
      text_content: req.body.text_content,
      image_url,
      audio_url,
      video_url,
      answers,
    });
    res.status(201).json({ success: true, data: question });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const files = req.files || {};
    const data = { text_content: req.body.text_content };

    if (files.image?.[0]) data.image_url = `/${files.image[0].path}`;
    if (files.audio?.[0]) data.audio_url = `/${files.audio[0].path}`;
    if (files.video?.[0]) data.video_url = `/${files.video[0].path}`;

    if (req.body.answers) {
      data.answers = typeof req.body.answers === 'string'
        ? JSON.parse(req.body.answers)
        : req.body.answers;
    }

    const question = await questionService.updateQuestion(req.params.id, data);
    res.json({ success: true, data: question });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await questionService.deleteQuestion(req.params.id);
    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (err) {
    next(err);
  }
}

async function getByCourse(req, res, next) {
  try {
    const questions = await questionService.getQuestionsByCourse(req.params.courseId);
    res.json({ success: true, data: questions });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, update, remove, getByCourse };
