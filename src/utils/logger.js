/**
 * Comprehensive logging utility for the Football School application
 */

// Ensure the utils directory exists
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logsDir)) {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create logs directory:', error);
  }
}

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Current log level (can be set via environment variable)
const CURRENT_LOG_LEVEL = process.env.LOG_LEVEL ? 
  LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()] || LOG_LEVELS.INFO : 
  LOG_LEVELS.INFO;

class Logger {
  constructor(name) {
    this.name = name;
  }

  _log(level, message, meta = null) {
    // Check if we should log this level
    if (LOG_LEVELS[level] > CURRENT_LOG_LEVEL) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      name: this.name,
      message,
      meta
    };

    // Format the log message
    const formattedMessage = `[${timestamp}] ${level} [${this.name}] ${message}`;
    
    // Log to console
    if (level === 'ERROR') {
      console.error(formattedMessage);
    } else if (level === 'WARN') {
      console.warn(formattedMessage);
    } else {
      console.log(formattedMessage);
    }

    // Also log to file
    this._writeToFile(logEntry);

    // Send to external logging service if configured
    this._sendToExternalService(logEntry);
  }

  _writeToFile(logEntry) {
    try {
      // Write to a daily log file
      const date = new Date().toISOString().split('T')[0];
      const logFile = path.join(logsDir, `app-${date}.log`);
      
      const logLine = JSON.stringify(logEntry) + '\n';
      fs.appendFileSync(logFile, logLine);
    } catch (error) {
      // We can't log an error in the logger, so we'll just silently fail
      // In a production environment, you might want to handle this differently
    }
  }

  _sendToExternalService(logEntry) {
    // In a real application, you might send logs to an external service
    // like Loggly, Papertrail, or a custom logging API
    // This is just a placeholder
    if (process.env.LOGGING_SERVICE_URL) {
      // Implementation would go here
    }
  }

  error(message, meta = null) {
    this._log('ERROR', message, meta);
  }

  warn(message, meta = null) {
    this._log('WARN', message, meta);
  }

  info(message, meta = null) {
    this._log('INFO', message, meta);
  }

  debug(message, meta = null) {
    this._log('DEBUG', message, meta);
  }
}

// Create a default logger
const defaultLogger = new Logger('App');

// Export both the class and default instance
module.exports = {
  Logger,
  logger: defaultLogger,
  // Convenience methods that use the default logger
  error: (...args) => defaultLogger.error(...args),
  warn: (...args) => defaultLogger.warn(...args),
  info: (...args) => defaultLogger.info(...args),
  debug: (...args) => defaultLogger.debug(...args)
};