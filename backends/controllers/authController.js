const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { successResponse, errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return errorResponse(res, "User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorResponse(res, "Invalid credentials");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    logger.info(`User ${username} logged in successfully`);
    successResponse(res, { token, role: user.role, userId: user._id });
  } catch (err) {
    logger.error("Unexpected error during login", { err });
    errorResponse(res, "Server error", 500);
  }
};

module.exports = { login };
