const { Submission, Assignment, User } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

const submissionController = {
  async getAllSubmissions(req, res) {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      let submissions;
      if (role === 'admin') {
        submissions = await Submission.findAll({
          include: [
            { model: Assignment, attributes: ['id', 'title'] },
            { model: User, attributes: ['id', 'username'] }
          ]
        });
      } else {
        submissions = await Submission.findAll({
          where: { studentId: userId },
          include: [{ model: Assignment, attributes: ['id', 'title'] }]
        });
      }
      return res.status(200).json(successResponse('Submissions retrieved successfully', submissions));
    } catch (error) {
      return res.status(500).json(errorResponse('Error retrieving submissions', error.message));
    }
  },

  async getSubmissionById(req, res) {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      const where = { id: req.params.id };
      if (role !== 'admin') {
        where.studentId = userId;
      }
      const submission = await Submission.findOne({
        where,
        include: [
          { model: Assignment, attributes: ['id', 'title'] },
          { model: User, attributes: ['id', 'username'] }
        ]
      });
      if (!submission) {
        return res.status(404).json(errorResponse('Submission not found or not authorized'));
      }
      return res.status(200).json(successResponse('Submission retrieved successfully', submission));
    } catch (error) {
      return res.status(500).json(errorResponse('Error retrieving submission', error.message));
    }
  },

  async createSubmission(req, res) {
    try {
      if (req.user.role !== 'student') {
        return res.status(403).json(errorResponse('Only students can submit assignments'));
      }
      const { assignmentId, content } = req.body;
      const assignment = await Assignment.findOne({
        where: { id: assignmentId },
        include: [{ model: User, as: 'Users', where: { id: req.user.id } }]
      });
      if (!assignment) {
        return res.status(404).json(errorResponse('Assignment not found or not assigned to you'));
      }
      const submission = await Submission.create({
        assignmentId,
        studentId: req.user.id,
        content,
        submittedAt: new Date(),
        status: 'pending'
      });
      const createdSubmission = await Submission.findByPk(submission.id, {
        include: [
          { model: Assignment, attributes: ['id', 'title'] },
          { model: User, attributes: ['id', 'username'] }
        ]
      });
      return res.status(201).json(successResponse('Submission created successfully', createdSubmission));
    } catch (error) {
      return res.status(400).json(errorResponse('Error creating submission', error.message));
    }
  },

  async updateSubmission(req, res) {
    try {
      if (req.user.role !== 'student') {
        return res.status(403).json(errorResponse('Only students can update submissions'));
      }
      const { content } = req.body;
      const submission = await Submission.findOne({ where: { id: req.params.id, studentId: req.user.id } });
      if (!submission) {
        return res.status(404).json(errorResponse('Submission not found'));
      }
      await submission.update({ content });
      const updatedSubmission = await Submission.findByPk(submission.id, {
        include: [
          { model: Assignment, attributes: ['id', 'title'] },
          { model: User, attributes: ['id', 'username'] }
        ]
      });
      return res.status(200).json(successResponse('Submission updated successfully', updatedSubmission));
    } catch (error) {
      return res.status(400).json(errorResponse('Error updating submission', error.message));
    }
  },

  async deleteSubmission(req, res) {
    try {
      if (req.user.role !== 'student') {
        return res.status(403).json(errorResponse('Only students can delete submissions'));
      }
      const submission = await Submission.findOne({ where: { id: req.params.id, studentId: req.user.id } });
      if (!submission) {
        return res.status(404).json(errorResponse('Submission not found'));
      }
      await submission.destroy();
      return res.status(200).json(successResponse('Submission deleted successfully'));
    } catch (error) {
      return res.status(500).json(errorResponse('Error deleting submission', error.message));
    }
  },

  async markSubmission(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json(errorResponse('Only admins can mark submissions'));
      }
      const { status } = req.body;
      const submission = await Submission.findByPk(req.params.id);
      if (!submission) {
        return res.status(404).json(errorResponse('Submission not found'));
      }
      if (!['correct', 'incorrect'].includes(status)) {
        return res.status(400).json(errorResponse('Invalid status'));
      }
      await submission.update({ status });
      const updatedSubmission = await Submission.findByPk(submission.id, {
        include: [
          { model: Assignment, attributes: ['id', 'title'] },
          { model: User, attributes: ['id', 'username'] }
        ]
      });
      return res.status(200).json(successResponse('Submission marked successfully', updatedSubmission));
    } catch (error) {
      return res.status(400).json(errorResponse('Error marking submission', error.message));
    }
  }
};

module.exports = submissionController;