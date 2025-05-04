const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  res.status(500).json({ message: "Server error" });
};

module.exports = errorHandler;
