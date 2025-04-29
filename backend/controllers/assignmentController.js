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
                return res.status(403).json(errorResponse())
            }
        }
    }
}