const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    logger.warn("No token provided in request");
    return res.status(401).json(errorResponse("No token provided"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Invalid token: ${error.message}`);
    return res.status(401).json(errorResponse("Invalid token"));
  }
};
