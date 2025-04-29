const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

const authController = {
    async login(req, res) {
      try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return res.status(401).json(errorResponse('Invalid credentials'));
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json(successResponse('Login successful', { token, user: { id: user.id, username: user.username, role: user.role } }));
      } catch (error) {
        return res.status(500).json(errorResponse('Error logging in', error.message));
      }
    }
  };
  
  module.exports = authController;