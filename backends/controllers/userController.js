const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { successResponse, errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

const getUsers = async (req, res) => {
  if (req.user.role !== "admin")
    return errorResponse(res, "Access denied", 403);

  try {
    const users = await User.find({ role: "student" });
    successResponse(res, users);
  } catch (err) {
    logger.error("Unexpected error fetching users", { err });
    errorResponse(res, "Server error", 500);
  }
};

const createUser = async (req, res) => {
  if (req.user.role !== "admin")
    return errorResponse(res, "Access denied", 403);

  const { username, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return errorResponse(res, "Username already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();

    logger.info(`User ${username} created successfully`);
    successResponse(res, { id: user._id, username, role }, 201);
  } catch (err) {
    logger.error("Unexpected error creating user", { err });
    errorResponse(res, "Server error", 500);
  }
};

module.exports = { getUsers, createUser };
