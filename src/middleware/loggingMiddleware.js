const { Logger } = require('../utils/logger');

const logger = new Logger('Express');

/**
 * Middleware for logging HTTP requests
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log incoming request
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Log when response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });

  // Log if request is closed unexpectedly
  req.on('close', () => {
    if (!res.writableEnded) {
      logger.warn('Request closed unexpectedly', {
        method: req.method,
        url: req.url
      });
    }
  });

  next();
};

/**
 * Middleware for logging errors
 */
const errorLogger = (err, req, res, next) => {
  logger.error('Unhandled error occurred', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    headers: req.headers
  });

  next(err);
};

module.exports = {
  requestLogger,
  errorLogger
};