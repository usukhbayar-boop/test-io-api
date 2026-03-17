const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
  video: ['video/mp4', 'video/webm', 'video/ogg'],
};

const ALL_ALLOWED = [
  ...ALLOWED_TYPES.image,
  ...ALLOWED_TYPES.audio,
  ...ALLOWED_TYPES.video,
];

function getSubfolder(mimetype) {
  if (ALLOWED_TYPES.image.includes(mimetype)) return 'images';
  if (ALLOWED_TYPES.audio.includes(mimetype)) return 'audio';
  if (ALLOWED_TYPES.video.includes(mimetype)) return 'video';
  return 'misc';
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const subfolder = getSubfolder(file.mimetype);
    cb(null, path.join(config.upload.dir, subfolder));
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (ALL_ALLOWED.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSizeMB * 1024 * 1024,
  },
});

// Single image upload for courses
const uploadCourseImage = upload.single('image');

// Multiple media uploads for questions
const uploadQuestionMedia = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

module.exports = { uploadCourseImage, uploadQuestionMedia };
