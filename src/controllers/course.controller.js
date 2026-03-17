const courseService = require('../services/course.service');
const { parsePagination, paginatedResponse } = require('../utils/pagination');

async function create(req, res, next) {
  try {
    const image_url = req.file ? `/${req.file.path}` : null;
    const course = await courseService.createCourse({
      name: req.body.name,
      image_url,
    });
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const courses = await courseService.getAllCourses();
    res.json({ success: true, data: courses });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const course = await courseService.getCourseById(req.params.id);
    res.json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const image_url = req.file ? `/${req.file.path}` : undefined;
    const course = await courseService.updateCourse(req.params.id, {
      name: req.body.name,
      image_url,
    });
    res.json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await courseService.deleteCourse(req.params.id);
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    next(err);
  }
}

async function getResults(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const { data, total } = await courseService.getCourseResults(req.params.id, { skip, limit });
    res.json({ success: true, ...paginatedResponse(data, total, page, limit) });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getAll, getById, update, remove, getResults };
