const winston = require('winston');
const path = require('path');
require('dotenv').config();

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'hotspot-backend' },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    // File transport for production
    new winston.transports.File({
      filename: path.join(process.env.LOG_FILE_PATH || 'logs/app.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Separate file for error logs
    new winston.transports.File({
      filename: path.join('logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ]
});

module.exports = logger;
