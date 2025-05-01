const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { successResponse, errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

const authController = {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });
      if (!user || !bcrypt.compareSync(password, user.password)) {
        logger.error(`Login failed for username: ${username}`);
        return res.status(401).json(errorResponse("Invalid credentials"));
      }
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      logger.info(`User logged in: ${username} (ID: ${user.id})`);
      return res.status(200).json(
        successResponse("Login successful", {
          token,
          user: { id: user.id, username: user.username, role: user.role },
        })
      );
    } catch (error) {
      logger.error(
        `Error logging in for username ${username}: ${error.message}`
      );
      return res
        .status(500)
        .json(errorResponse("Error logging in", error.message));
    }
  },
};

module.exports = authController;
