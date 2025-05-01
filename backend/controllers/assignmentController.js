const { Assignment, User } = require("../models");
const { successResponse, errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

const assignmentController = {
  async getAllAssignments(req, res) {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      let assignments;
      if (role === "admin") {
        assignments = await Assignment.findAll({
          include: [
            {
              model: User,
              as: "Users",
              through: { attributes: [] },
              attributes: ["id", "username"],
            },
          ],
        });
      } else {
        assignments = await Assignment.findAll({
          include: [
            {
              model: User,
              as: "Users",
              where: { id: userId },
              through: { attributes: [] },
              attributes: ["id", "username"],
            },
          ],
        });
      }
      logger.info(
        `Fetched ${assignments.length} assignments for user ${userId}, role: ${role}`
      );
      return res
        .status(200)
        .json(
          successResponse("Assignments retrieved successfully", assignments)
        );
    } catch (error) {
      logger.error(
        `Error retrieving assignments for user ${req.user.id}: ${error.message}`
      );
      return res
        .status(500)
        .json(errorResponse("Error retrieving assignments", error.message));
    }
  },

  async getAssignmentById(req, res) {
    try {
      const userId = req.user.id;
      const role = req.user.role;
      const where = { id: req.params.id };
      if (role !== "admin") {
        where.Users = { id: userId };
      }
      const assignment = await Assignment.findOne({
        where,
        include: [
          {
            model: User,
            as: "Users",
            through: { attributes: [] },
            attributes: ["id", "username"],
          },
        ],
      });
      if (!assignment) {
        logger.warn(
          `Assignment ${req.params.id} not found or not authorized for user ${userId}`
        );
        return res
          .status(404)
          .json(errorResponse("Assignment not found or not authorized"));
      }
      logger.info(`Fetched assignment ${req.params.id} for user ${userId}`);
      return res
        .status(200)
        .json(successResponse("Assignment retrieved successfully", assignment));
    } catch (error) {
      logger.error(
        `Error retrieving assignment ${req.params.id} for user ${userId}: ${error.message}`
      );
      return res
        .status(500)
        .json(errorResponse("Error retrieving assignment", error.message));
    }
  },

  async createAssignment(req, res) {
    try {
      if (req.user.role !== "admin") {
        logger.warn(
          `Unauthorized attempt to create assignment by user ${req.user.id}`
        );
        return res
          .status(403)
          .json(errorResponse("Only admins can create assignments"));
      }
      const { title, description, dueDate, assignedTo } = req.body;
      const assignment = await Assignment.create({
        title,
        description,
        dueDate,
        createdBy: req.user.id,
      });
      if (assignedTo && assignedTo.length > 0) {
        await assignment.setUsers(assignedTo);
      }
      const createdAssignment = await Assignment.findByPk(assignment.id, {
        include: [
          {
            model: User,
            as: "Users",
            through: { attributes: [] },
            attributes: ["id", "username"],
          },
        ],
      });
      logger.info(
        `Assignment created: ${assignment.id} by user ${req.user.id}`
      );
      return res
        .status(201)
        .json(
          successResponse("Assignment created successfully", createdAssignment)
        );
    } catch (error) {
      logger.error(
        `Error creating assignment for user ${req.user.id}: ${error.message}`
      );
      return res
        .status(400)
        .json(errorResponse("Error creating assignment", error.message));
    }
  },

  async updateAssignment(req, res) {
    try {
      if (req.user.role !== "admin") {
        logger.warn(
          `Unauthorized attempt to update assignment ${req.params.id} by user ${req.user.id}`
        );
        return res
          .status(403)
          .json(errorResponse("Only admins can update assignments"));
      }
      const { title, description, dueDate, assignedTo } = req.body;
      const assignment = await Assignment.findOne({
        where: { id: req.params.id, createdBy: req.user.id },
      });
      if (!assignment) {
        logger.warn(
          `Assignment ${req.params.id} not found for user ${req.user.id}`
        );
        return res.status(404).json(errorResponse("Assignment not found"));
      }
      await assignment.update({ title, description, dueDate });
      if (assignedTo) {
        await assignment.setUsers(assignedTo);
      }
      const updatedAssignment = await Assignment.findByPk(assignment.id, {
        include: [
          {
            model: User,
            as: "Users",
            through: { attributes: [] },
            attributes: ["id", "username"],
          },
        ],
      });
      logger.info(
        `Assignment updated: ${assignment.id} by user ${req.user.id}`
      );
      return res
        .status(200)
        .json(
          successResponse("Assignment updated successfully", updatedAssignment)
        );
    } catch (error) {
      logger.error(
        `Error updating assignment ${req.params.id} for user ${req.user.id}: ${error.message}`
      );
      return res
        .status(400)
        .json(errorResponse("Error updating assignment", error.message));
    }
  },

  async deleteAssignment(req, res) {
    try {
      if (req.user.role !== "admin") {
        logger.warn(
          `Unauthorized attempt to delete assignment ${req.params.id} by user ${req.user.id}`
        );
        return res
          .status(403)
          .json(errorResponse("Only admins can delete assignments"));
      }
      const assignment = await Assignment.findOne({
        where: { id: req.params.id, createdBy: req.user.id },
      });
      if (!assignment) {
        logger.warn(
          `Assignment ${req.params.id} not found for user ${req.user.id}`
        );
        return res.status(404).json(errorResponse("Assignment not found"));
      }
      await assignment.destroy();
      logger.info(
        `Assignment deleted: ${req.params.id} by user ${req.user.id}`
      );
      return res
        .status(200)
        .json(successResponse("Assignment deleted successfully"));
    } catch (error) {
      logger.error(
        `Error deleting assignment ${req.params.id} for user ${req.user.id}: ${error.message}`
      );
      return res
        .status(500)
        .json(errorResponse("Error deleting assignment", error.message));
    }
  },
};

module.exports = assignmentController;
