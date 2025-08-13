/**
 * Winston Logger Configuration
 * Centralized logging system for the TradeMaster AI backend
 */

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: consoleFormat,
  }),

  // Error log file
  new DailyRotateFile({
    filename: path.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    format: fileFormat,
    maxSize: process.env.LOG_FILE_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_FILE_MAX_FILES || '14d',
    zippedArchive: true,
  }),

  // Combined log file
  new DailyRotateFile({
    filename: path.join(logsDir, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    format: fileFormat,
    maxSize: process.env.LOG_FILE_MAX_SIZE || '20m',
    maxFiles: process.env.LOG_FILE_MAX_FILES || '14d',
    zippedArchive: true,
  }),
];

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format: fileFormat,
  transports,
  exitOnError: false,
});

// Add AI-specific logging methods
logger.aiRequest = (message, data = {}) => {
  logger.info(`[AI_REQUEST] ${message}`, {
    type: 'ai_request',
    ...data,
  });
};

logger.aiResponse = (message, data = {}) => {
  logger.info(`[AI_RESPONSE] ${message}`, {
    type: 'ai_response',
    ...data,
  });
};

logger.aiError = (message, error = {}) => {
  logger.error(`[AI_ERROR] ${message}`, {
    type: 'ai_error',
    error: error.message || error,
    stack: error.stack,
  });
};

logger.queueJob = (message, data = {}) => {
  logger.info(`[QUEUE] ${message}`, {
    type: 'queue_job',
    ...data,
  });
};

logger.cronJob = (message, data = {}) => {
  logger.info(`[CRON] ${message}`, {
    type: 'cron_job',
    ...data,
  });
};

// Stream for Morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

module.exports = logger;
