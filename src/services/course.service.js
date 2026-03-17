const prisma = require('../config/database');
const ApiError = require('../utils/ApiError');

async function createCourse({ name, image_url }) {
  return prisma.course.create({
    data: { name, image_url },
  });
}

async function getAllCourses() {
  return prisma.course.findMany({
    select: { id: true, name: true, image_url: true },
    orderBy: { created_at: 'desc' },
  });
}

async function getCourseById(id) {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      questions: {
        include: { answers: true },
        orderBy: { created_at: 'desc' },
      },
    },
  });
  if (!course) throw ApiError.notFound('Course not found');
  return course;
}

async function updateCourse(id, { name, image_url }) {
  const data = {};
  if (name !== undefined) data.name = name;
  if (image_url !== undefined) data.image_url = image_url;

  return prisma.course.update({
    where: { id },
    data,
  });
}

async function deleteCourse(id) {
  await prisma.course.delete({ where: { id } });
}

async function getCourseResults(courseId, { skip, limit }) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw ApiError.notFound('Course not found');

  const [results, total] = await Promise.all([
    prisma.exam.findMany({
      where: { course_id: courseId, finished_at: { not: null } },
      select: {
        user_id: true,
        correct_count: true,
        wrong_count: true,
        score: true,
        duration_seconds: true,
        user: {
          select: { first_name: true, last_name: true },
        },
      },
      orderBy: { finished_at: 'desc' },
      skip,
      take: limit,
    }),
    prisma.exam.count({
      where: { course_id: courseId, finished_at: { not: null } },
    }),
  ]);

  const data = results.map((r) => ({
    user_id: r.user_id,
    user_name: `${r.user.first_name} ${r.user.last_name}`,
    correct_count: r.correct_count,
    wrong_count: r.wrong_count,
    score: r.score,
    exam_duration: r.duration_seconds,
  }));

  return { data, total };
}

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseResults,
};
