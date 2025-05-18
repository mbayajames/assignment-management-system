const Submission = require('../models/submission');
const path = require('path');

exports.submitAssignment = async (req, res, next) => {
  try {
    const file = req.file ? req.file.filename : null;

    const submission = await Submission.create({
      student: req.body.student,
      assignment: req.body.assignment,
      file,
    });

    res.status(201).json(submission);
  } catch (err) {
    next(err);
  }
};

exports.getSubmissions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const submissions = await Submission.find()
      .populate('student assignment')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(submissions);
  } catch (err) {
    next(err);
  }
};

exports.gradeSubmission = async (req, res, next) => {
  try {
    const { grade, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { grade, feedback },
      { new: true }
    );
    res.json(submission);
  } catch (err) {
    next(err);
  }
};
