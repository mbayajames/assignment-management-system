const { errorResponse } = require("../utils/response");
const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  logger.error(`Internal server error: ${err.message}`, {
    stack: err.stack,
    url: req.url,
  });
  res.status(500).json(errorResponse("Internal server error", err.message));
};
