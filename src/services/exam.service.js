const prisma = require('../config/database');
const config = require('../config');
const ApiError = require('../utils/ApiError');
const { shuffleArray } = require('../utils/shuffle');

async function startExam(userId, courseId) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw ApiError.notFound('Course not found');

  // Get all questions for this course
  const allQuestions = await prisma.question.findMany({
    where: { course_id: courseId },
    include: { answers: true },
  });

  if (allQuestions.length === 0) {
    throw ApiError.badRequest('This course has no questions yet');
  }

  // Randomly select up to N questions
  const shuffled = shuffleArray(allQuestions);
  const selected = shuffled.slice(0, config.exam.questionsPerExam);

  // Create exam record (started_at is null until first answer or auto-start)
  const exam = await prisma.exam.create({
    data: {
      user_id: userId,
      course_id: courseId,
    },
  });

  // Prepare questions with shuffled answers (hide is_correct)
  const questions = selected.map((q) => ({
    id: q.id,
    text_content: q.text_content,
    image_url: q.image_url,
    audio_url: q.audio_url,
    video_url: q.video_url,
    answers: shuffleArray(q.answers).map((a) => ({
      id: a.id,
      text: a.text,
    })),
  }));

  return {
    exam_id: exam.id,
    course_name: course.name,
    total_questions: questions.length,
    duration_seconds: config.exam.durationSeconds,
    auto_start_delay_seconds: config.exam.autoStartDelaySeconds,
    questions,
  };
}

async function submitExam(userId, { exam_id, answers }) {
  const exam = await prisma.exam.findUnique({ where: { id: exam_id } });

  if (!exam) throw ApiError.notFound('Exam not found');
  if (exam.user_id !== userId) throw ApiError.forbidden('This exam does not belong to you');
  if (exam.finished_at) throw ApiError.badRequest('This exam has already been submitted');

  const now = new Date();

  // If exam was never started, set started_at to creation time
  const startedAt = exam.started_at || exam.id; // fallback handled below

  // Calculate duration
  const effectiveStart = exam.started_at || now;
  let durationSeconds = Math.floor((now - effectiveStart) / 1000);

  // Cap at max duration
  const exceeded = durationSeconds > config.exam.durationSeconds;
  if (exceeded) {
    durationSeconds = config.exam.durationSeconds;
  }

  // Get correct answers for all submitted questions
  const questionIds = answers.map((a) => a.question_id);
  const correctAnswers = await prisma.answer.findMany({
    where: {
      question_id: { in: questionIds },
      is_correct: true,
    },
  });
  const correctMap = new Map(correctAnswers.map((a) => [a.question_id, a.id]));

  let correctCount = 0;
  let wrongCount = 0;

  const examAnswerData = answers.map((a) => {
    const isCorrect = correctMap.get(a.question_id) === a.selected_answer_id;
    if (isCorrect) correctCount++;
    else wrongCount++;

    return {
      exam_id,
      question_id: a.question_id,
      selected_answer_id: a.selected_answer_id,
      is_correct: isCorrect,
    };
  });

  // Save all in a transaction
  await prisma.$transaction([
    prisma.examAnswer.createMany({ data: examAnswerData }),
    prisma.exam.update({
      where: { id: exam_id },
      data: {
        started_at: exam.started_at || now,
        finished_at: now,
        duration_seconds: durationSeconds,
        score: correctCount,
        correct_count: correctCount,
        wrong_count: wrongCount,
      },
    }),
  ]);

  return {
    score: correctCount,
    correct_count: correctCount,
    wrong_count: wrongCount,
    total_answered: answers.length,
    duration_seconds: durationSeconds,
    time_exceeded: exceeded,
  };
}

async function markExamStarted(examId, userId) {
  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam) throw ApiError.notFound('Exam not found');
  if (exam.user_id !== userId) throw ApiError.forbidden('This exam does not belong to you');
  if (exam.started_at) return exam;

  return prisma.exam.update({
    where: { id: examId },
    data: { started_at: new Date() },
  });
}

module.exports = { startExam, submitExam, markExamStarted };
