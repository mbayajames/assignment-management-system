const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');

// Define the log directory path
const logDir = path.join(__dirname, '..', 'logs');

// Create log directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    // Write all logs with level `error` and below to `error.log`
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    // Write all logs with level `info` and below to `combined.log`
    new transports.File({ filename: path.join(logDir, 'combined.log') }),
  ],
});

// If not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  );
}

module.exports = logger;
