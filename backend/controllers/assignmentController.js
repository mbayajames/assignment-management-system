const { Assignment, User} = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

const assignmentController = {
    async getAllAssignment(req, res) {
        try {
            const userId = req.user.id;
            const role = req.user.role;
            let assignments;
            if (role === 'admin') {
                assignments = await Assignment.findAll({
                    include: [{ model: User, as: 'Users', through: { attributes: [] }, attributes: ['id', 'username'] }]
                });
            } else {
                assignments = await Assignment.findAll({
                    include: [{
                        model: User,
                        as: 'Users',
                        where: { id: userId },
                        through: { attributes: [] },
                        attributes: ['id', 'username']
                    }]
                });
            }
            return res.status(200).json(successResponse('Assignments retrieved successfully', assignments));
        } catch (error) {
            return res.status(500).json(errorResponse('Error retrieving assignments', error.message));
        }
    },

    async getAssignmentById(req, res) {
        try {
            const userId = req.user.id;
            const role = req.user.role;
            const where = { id: req.params.id };
            if (role !== 'admin') {
                where.Users = { id: userId };
            }
            const assignment = await Assignment.findOne({
                where,
                include: [{ model: User, as: 'Users', through: { attributes: [] }, attributes: ['id', 'username'] }]
            });
            if (!assignment) {
                return res.status(404).json(errorResponse('Assignment not found or not authorized'));
            }
            return res.status(200).json(successResponse('Assignment retrieved successfuly', assignment));
        } catch (error) {
            return res.status(500).json(errorResponse('Error retrieving assignment', error.message));
        }
    },

    async createAssignment(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json(errorResponse('Only admins can create assignments'));
            }
            const { title, description, dueDate, assignedTo } = req.body;
            const assignment = await Assignment.create({
                title,
                description,
                dueDate,
                createdBy: req.user.id
            });
            if (assignedTo && assignedTo.length > 0) {
                await assignment.setUsers(assignedTo);
            }
            const createdAssignment = await Assignment.findByPk(assignment.id, {
                include: [{ model: Users, as: 'Users', through: { attributes: [] }, attributes: ['id', 'username'] }]
            });
            return res.status(201).json(successResponse('Assignment created successfully', createdAssignment));
        } catch (error) {
            return res.status(400).json(errorResponse('Error creating assignment', error.message));
        }
    },

    async updateAssignment(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json(errorResponse('Only admins can update assignments'));
            }
            const { title, description, dueDate, assignedTo } = req.body; 
            const assignment = await Assignment.findOne({ where: { id: req.params.id, createdBy: req.user.id } });
            if (!assignment) {
                return res.status(404).json(errorResponse('Assignment not found'));
            }
            await assignment.update({ title, description, dueDate });
            if (assignedTo) {
                await assignment.setUsers(assignedTo);
            }
            const updatedAssignment = await Assignment.findByPk(assignment.id, {
                include: [{ model: User, as: 'Users', through: { attributes: [] }, attributes: ['id', 'username'] }]
            });
            return res.status(200).json(successResponse('Assignment updated successfully', updatedAssignment));
        } catch (error) {
            return res.status(400).json(errorResponse('Error updating assignment', error.message));
        }
    },

    async deleteAssignment(req, res) {
        try {
          if (req.user.role !== 'admin') {
            return res.status(403).json(errorResponse('Only admins can delete assignments'));
          }
          const assignment = await Assignment.findOne({ where: { id: req.params.id, createdBy: req.user.id } });
          if (!assignment) {
            return res.status(404).json(errorResponse('Assignment not found'));
          }
          await assignment.destroy();
          return res.status(200).json(successResponse('Assignment deleted successfully'));
        } catch (error) {
          return res.status(500).json(errorResponse('Error deleting assignment', error.message));
        }
    };
};