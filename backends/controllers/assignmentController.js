const { Assignment, User } = require("../models");
const { successResponse, errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

const getAssignments = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    let assignments;

    if (role === "student") {
      assignments = await Assignment.find({ assignedTo: userId });
    } else {
      assignments = await Assignment.find();
    }

    successResponse(res, assignments);
  } catch (err) {
    logger.error("Unexpected error fetching assignments", { err });
    errorResponse(res, "Server error", 500);
  }
};

const createAssignment = async (req, res) => {
  if (req.user.role !== "admin")
    return errorResponse(res, "Access denied", 403);

  const { title, description, dueDate, assignedTo } = req.body;

  try {
    const assignedUsers = await User.find({ _id: { $in: assignedTo } });
    if (assignedTo.length !== assignedUsers.length)
      return errorResponse(res, "Invalid user IDs");

    const assignment = new Assignment({
      title,
      description,
      dueDate,
      assignedTo,
    });
    await assignment.save();

    logger.info(`Assignment ${title} created successfully`);
    successResponse(res, assignment, 201);
  } catch (err) {
    logger.error("Unexpected error creating assignment", { err });
    errorResponse(res, "Server error", 500);
  }
};

module.exports = { getAssignments, createAssignment };
