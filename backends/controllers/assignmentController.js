const Assignment = require('../models/assignment');

exports.createAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.create(req.body);
    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
};

exports.getAssignments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = { title: { $regex: search, $options: 'i' } };

    const assignments = await Assignment.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(assignments);
  } catch (err) {
    next(err);
  }
};

exports.getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });
    res.json(assignment);
  } catch (err) {
    next(err);
  }
};

exports.updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(assignment);
  } catch (err) {
    next(err);
  }
};

exports.deleteAssignment = async (req, res, next) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Assignment deleted' });
  } catch (err) {
    next(err);
  }
};
