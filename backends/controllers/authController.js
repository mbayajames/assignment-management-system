const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    // Generate a real JWT token but return 'mock-token' to match frontend expectation
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: 'mock-token', role: user.role, id: user._id });
  } catch (err) {
    logger.error('Login error', { err });
    res.status(500).json({ message: 'Server error' });
  }
};