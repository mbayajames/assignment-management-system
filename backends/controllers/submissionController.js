const { Submission, Assignment } = require("../models");
const { successResponse, errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

const getSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    let submissions;

    if (role === "admin") {
      submissions = await Submission.find().populate(
        "assignmentId userId",
        "title username"
      );
    } else {
      submissions = await Submission.find({ userId }).populate(
        "assignmentId",
        "title"
      );
    }

    successResponse(res, submissions);
  } catch (err) {
    logger.error("Unexpected error fetching submissions", { err });
    errorResponse(res, "Server error", 500);
  }
};

const createSubmission = async (req, res) => {
  if (req.user.role !== "student")
    return errorResponse(res, "Access denied", 403);

  const { assignmentId, fileUrl } = req.body;
  const userId = req.user.id;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return errorResponse(res, "Assignment not found");
    if (!assignment.assignedTo.includes(userId))
      return errorResponse(res, "Not assigned to this user");

    const submission = new Submission({ assignmentId, userId, fileUrl });
    await submission.save();

    logger.info(
      `Submission created for assignment ${assignmentId} by user ${userId}`
    );
    successResponse(res, submission, 201);
  } catch (err) {
    logger.error("Unexpected error creating submission", { err });
    errorResponse(res, "Server error", 500);
  }
};

const updateSubmission = async (req, res) => {
  if (req.user.role !== "admin")
    return errorResponse(res, "Access denied", 403);

  const { submissionId } = req.params;
  const { fileUrl } = req.body;

  try {
    const submission = await Submission.findById(submissionId);
    if (!submission) return errorResponse(res, "Submission not found");

    submission.fileUrl = fileUrl || submission.fileUrl;
    await submission.save();

    logger.info(`Submission ${submissionId} updated successfully`);
    successResponse(res, submission);
  } catch (err) {
    logger.error("Unexpected error updating submission", { err });
    errorResponse(res, "Server error", 500);
  }
};

const markSubmission = async (req, res) => {
  if (req.user.role !== "admin")
    return errorResponse(res, "Access denied", 403);

  const { submissionId } = req.params;
  const { status } = req.body;

  try {
    const submission = await Submission.findById(submissionId);
    if (!submission) return errorResponse(res, "Submission not found");

    submission.status = status;
    await submission.save();

    logger.info(`Submission ${submissionId} marked as ${status}`);
    successResponse(res, submission);
  } catch (err) {
    logger.error("Unexpected error marking submission", { err });
    errorResponse(res, "Server error", 500);
  }
};

const deleteSubmission = async (req, res) => {
  if (req.user.role !== "admin")
    return errorResponse(res, "Access denied", 403);

  const { submissionId } = req.params;

  try {
    const submission = await Submission.findByIdAndDelete(submissionId);
    if (!submission) return errorResponse(res, "Submission not found");

    logger.info(`Submission ${submissionId} deleted successfully`);
    successResponse(res, { message: "Submission deleted successfully" });
  } catch (err) {
    logger.error("Unexpected error deleting submission", { err });
    errorResponse(res, "Server error", 500);
  }
};

module.exports = {
  getSubmissions,
  createSubmission,
  updateSubmission,
  markSubmission,
  deleteSubmission,
};
