const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

const userController = {
  async createUser(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json(errorResponse('Only admins can create users'));
      }
      const { username, password, role } = req.body;
      if (!['admin', 'student'].includes(role)) {
        return res.status(400).json(errorResponse('Invalid role'));
      }
      if (password.length < 6) {
        return res.status(400).json(errorResponse('Password must be at least 6 characters'));
      }
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json(errorResponse('Username already exists'));
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await User.create({ username, password: hashedPassword, role });
      return res.status(201).json(successResponse('User created successfully', { id: user.id, username: user.username, role: user.role }));
    } catch (error) {
      return res.status(400).json(errorResponse('Error creating user', error.message));
    }
  },

  async getAllUsers(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json(errorResponse('Only admins can view users'));
      }
      const users = await User.findAll({ attributes: ['id', 'username', 'role'] });
      return res.status(200).json(successResponse('Users retrieved successfully', users));
    } catch (error) {
      return res.status(500).json(errorResponse('Error retrieving users', error.message));
    }
  }
};

module.exports = userController;