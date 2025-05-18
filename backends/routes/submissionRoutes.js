const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const {
  submitAssignment,
  getSubmissions,
  gradeSubmission
} = require('../controllers/submissionController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post('/', auth(), upload.single('file'), submitAssignment);
router.get('/', auth(['admin']), getSubmissions);
router.put('/:id/grade', auth(['admin']), gradeSubmission);

module.exports = router;
