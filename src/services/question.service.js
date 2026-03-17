const prisma = require('../config/database');
const ApiError = require('../utils/ApiError');

async function createQuestion(courseId, { text_content, image_url, audio_url, video_url, answers }) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw ApiError.notFound('Course not found');

  if (answers.length < 2 || answers.length > 6) {
    throw ApiError.badRequest('Must provide between 2 and 6 answers');
  }

  // First answer is automatically correct
  const answerData = answers.map((a, index) => ({
    text: a.text,
    is_correct: index === 0,
  }));

  return prisma.question.create({
    data: {
      course_id: courseId,
      text_content,
      image_url,
      audio_url,
      video_url,
      answers: {
        create: answerData,
      },
    },
    include: { answers: true },
  });
}

async function updateQuestion(id, { text_content, image_url, audio_url, video_url, answers }) {
  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) throw ApiError.notFound('Question not found');

  const data = {};
  if (text_content !== undefined) data.text_content = text_content;
  if (image_url !== undefined) data.image_url = image_url;
  if (audio_url !== undefined) data.audio_url = audio_url;
  if (video_url !== undefined) data.video_url = video_url;

  if (answers) {
    if (answers.length < 2 || answers.length > 6) {
      throw ApiError.badRequest('Must provide between 2 and 6 answers');
    }

    // Delete existing answers and create new ones
    await prisma.answer.deleteMany({ where: { question_id: id } });
    data.answers = {
      create: answers.map((a, index) => ({
        text: a.text,
        is_correct: index === 0,
      })),
    };
  }

  return prisma.question.update({
    where: { id },
    data,
    include: { answers: true },
  });
}

async function deleteQuestion(id) {
  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) throw ApiError.notFound('Question not found');
  await prisma.question.delete({ where: { id } });
}

async function getQuestionsByCourse(courseId) {
  return prisma.question.findMany({
    where: { course_id: courseId },
    include: { answers: true },
    orderBy: { created_at: 'desc' },
  });
}

module.exports = {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsByCourse,
};
