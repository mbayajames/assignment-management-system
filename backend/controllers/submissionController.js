const { Submission, Assignment, User } = require("../models");
const { successResponse, errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

const submissionController = {
  async getAllSubmissions(req, res) {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      let submissions;
      if (role === "admin") {
        submissions = await Submission.findAll({
          include: [
            { model: Assignment, attributes: ["id", "title"] },
            { model: User, attributes: ["id", "username"] },
          ],
        });
      } else {
        submissions = await Submission.findAll({
          where: { studentId: userId },
          include: [{ model: Assignment, attributes: ["id", "title"] }],
        });
      }
      logger.info(
        `Fetched ${submissions.length} submissions for user ${userId}, role: ${role}`
      );
      return res
        .status(200)
        .json(
          successResponse("Submissions retrieved successfully", submissions)
        );
    } catch (error) {
      logger.error(
        `Error retrieving submissions for user ${req.user.id}: ${error.message}`
      );
      return res
        .status(500)
        .json(errorResponse("Error retrieving submissions", error.message));
    }
  },

  async getSubmissionById(req, res) {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      const where = { id: req.params.id };
      if (role !== "admin") {
        where.studentId = userId;
      }
      const submission = await Submission.findOne({
        where,
        include: [
          { model: Assignment, attributes: ["id", "title"] },
          { model: User, attributes: ["id", "username"] },
        ],
      });
      if (!submission) {
        logger.warn(
          `Submission ${req.params.id} not found or not authorized for user ${userId}`
        );
        return res
          .status(404)
          .json(errorResponse("Submission not found or not authorized"));
      }
      logger.info(`Fetched submission ${req.params.id} for user ${userId}`);
      return res
        .status(200)
        .json(successResponse("Submission retrieved successfully", submission));
    } catch (error) {
      logger.error(
        `Error retrieving submission ${req.params.id} for user ${userId}: ${error.message}`
      );
      return res
        .status(500)
        .json(errorResponse("Error retrieving submission", error.message));
    }
  },

  async createSubmission(req, res) {
    try {
      if (req.user.role !== "student") {
        logger.warn(
          `Unauthorized attempt to create submission by user ${req.user.id}`
        );
        return res
          .status(403)
          .json(errorResponse("Only students can submit assignments"));
      }
      const { assignmentId, content } = req.body;
      const assignment = await Assignment.findOne({
        where: { id: assignmentId },
        include: [{ model: User, as: "Users", where: { id: req.user.id } }],
      });
      if (!assignment) {
        logger.warn(
          `Assignment ${assignmentId} not found or not assigned to user ${req.user.id}`
        );
        return res
          .status(404)
          .json(errorResponse("Assignment not found or not assigned to you"));
      }
      const submission = await Submission.create({
        assignmentId,
        studentId: req.user.id,
        content,
        submittedAt: new Date(),
        status: "pending",
      });
      const createdSubmission = await Submission.findByPk(submission.id, {
        include: [
          { model: Assignment, attributes: ["id", "title"] },
          { model: User, attributes: ["id", "username"] },
        ],
      });
      logger.info(
        `Submission created: ${submission.id} by user ${req.user.id}`
      );
      return res
        .status(201)
        .json(
          successResponse("Submission created successfully", createdSubmission)
        );
    } catch (error) {
      logger.error(
        `Error creating submission for user ${req.user.id}: ${error.message}`
      );
      return res
        .status(400)
        .json(errorResponse("Error creating submission", error.message));
    }
  },

  async updateSubmission(req, res) {
    try {
      if (req.user.role !== "student") {
        logger.warn(
          `Unauthorized attempt to update submission ${req.params.id} by user ${req.user.id}`
        );
        return res
          .status(403)
          .json(errorResponse("Only students can update submissions"));
      }
      const { content } = req.body;
      const submission = await Submission.findOne({
        where: { id: req.params.id, studentId: req.user.id },
      });
      if (!submission) {
        logger.warn(
          `Submission ${req.params.id} not found for user ${req.user.id}`
        );
        return res.status(404).json(errorResponse("Submission not found"));
      }
      await submission.update({ content });
      const updatedSubmission = await Submission.findByPk(submission.id, {
        include: [
          { model: Assignment, attributes: ["id", "title"] },
          { model: User, attributes: ["id", "username"] },
        ],
      });
      logger.info(
        `Submission updated: ${submission.id} by user ${req.user.id}`
      );
      return res
        .status(200)
        .json(
          successResponse("Submission updated successfully", updatedSubmission)
        );
    } catch (error) {
      logger.error(
        `Error updating submission ${req.params.id} for user ${req.user.id}: ${error.message}`
      );
      return res
        .status(400)
        .json(errorResponse("Error updating submission", error.message));
    }
  },

  async deleteSubmission(req, res) {
    try {
      if (req.user.role !== "student") {
        logger.warn(
          `Unauthorized attempt to delete submission ${req.params.id} by user ${req.user.id}`
        );
        return res
          .status(403)
          .json(errorResponse("Only students can delete submissions"));
      }
      const submission = await Submission.findOne({
        where: { id: req.params.id, studentId: req.user.id },
      });
      if (!submission) {
        logger.warn(
          `Submission ${req.params.id} not found for user ${req.user.id}`
        );
        return res.status(404).json(errorResponse("Submission not found"));
      }
      await submission.destroy();
      logger.info(
        `Submission deleted: ${req.params.id} by user ${req.user.id}`
      );
      return res
        .status(200)
        .json(successResponse("Submission deleted successfully"));
    } catch (error) {
      logger.error(
        `Error deleting submission ${req.params.id} for user ${req.user.id}: ${error.message}`
      );
      return res
        .status(500)
        .json(errorResponse("Error deleting submission", error.message));
    }
  },

  async markSubmission(req, res) {
    try {
      if (req.user.role !== "admin") {
        logger.warn(
          `Unauthorized attempt to mark submission ${req.params.id} by user ${req.user.id}`
        );
        return res
          .status(403)
          .json(errorResponse("Only admins can mark submissions"));
      }
      const { status } = req.body;
      const submission = await Submission.findByPk(req.params.id);
      if (!submission) {
        logger.warn(`Submission ${req.params.id} not found`);
        return res.status(404).json(errorResponse("Submission not found"));
      }
      if (!["correct", "incorrect"].includes(status)) {
        logger.warn(`Invalid status ${status} for submission ${req.params.id}`);
        return res.status(400).json(errorResponse("Invalid status"));
      }
      await submission.update({ status });
      const updatedSubmission = await Submission.findByPk(submission.id, {
        include: [
          { model: Assignment, attributes: ["id", "title"] },
          { model: User, attributes: ["id", "username"] },
        ],
      });
      logger.info(
        `Submission marked: ${submission.id} as ${status} by user ${req.user.id}`
      );
      return res
        .status(200)
        .json(
          successResponse("Submission marked successfully", updatedSubmission)
        );
    } catch (error) {
      logger.error(
        `Error marking submission ${req.params.id} for user ${req.user.id}: ${error.message}`
      );
      return res
        .status(400)
        .json(errorResponse("Error marking submission", error.message));
    }
  },
};

module.exports = submissionController;
