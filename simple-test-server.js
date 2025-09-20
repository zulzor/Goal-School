const express = require('express');
const path = require('path');
const { Logger } = require('./src/utils/logger');
const { requestLogger, errorLogger } = require('./src/middleware/loggingMiddleware');

const app = express();
const PORT = 3003;

// Create a logger for the server
const serverLogger = new Logger('Server');

// Use our custom logging middleware
app.use(requestLogger);

// Parse JSON bodies for API endpoints
app.use(express.json());

// API routes should come before static file serving
// Add endpoint for client-side logs
app.post('/api/client-log', (req, res) => {
  try {
    serverLogger.info('Client log received', {
      message: req.body.message
    });
    res.status(200).json({ status: 'OK' });
  } catch (error) {
    serverLogger.error('Error handling client log', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: 'Failed to process client log' });
  }
});

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  try {
    serverLogger.info('Health check requested');
    res.json({ 
      status: 'OK', 
      message: 'Simple test server is running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    serverLogger.error('Error in health check', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      status: 'ERROR',
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Serve static files with error handling (after API routes)
app.use(express.static(path.join(__dirname, 'web-export'), {
  // Log errors when serving static files
  fallthrough: true // Allow requests to pass through to next handler if file not found
}));

// Handle 404 for static files
app.use('/static/*', (req, res, next) => {
  serverLogger.warn('Static file not found', {
    url: req.url
  });
  
  res.status(404).json({ 
    error: 'Not Found',
    message: `Static file not found: ${req.url}`,
    timestamp: new Date().toISOString()
  });
});

// Serve the simplified index.html for root route
app.get('/', (req, res) => {
  try {
    serverLogger.info('Serving simplified index page');
    res.sendFile(path.join(__dirname, 'web-export', 'index-simple.html'));
  } catch (error) {
    serverLogger.error('Error serving simplified index', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to serve simplified index page',
      timestamp: new Date().toISOString()
    });
  }
});

// Serve the main index.html for app route
app.get('/app', (req, res) => {
  try {
    serverLogger.info('Serving full app (may be slow)');
    res.sendFile(path.join(__dirname, 'web-export', 'index.html'));
  } catch (error) {
    serverLogger.error('Error serving full app', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to serve full application',
      timestamp: new Date().toISOString()
    });
  }
});

// Handle all other routes
app.get('*', (req, res) => {
  // Check if this is an API route
  if (req.url.startsWith('/api/')) {
    serverLogger.warn('API route not found', {
      url: req.url
    });
    return res.status(404).json({ 
      error: 'Not Found',
      message: `API endpoint not found: ${req.url}`,
      timestamp: new Date().toISOString()
    });
  }
  
  serverLogger.warn('Route not found', {
    url: req.url
  });
  
  try {
    res.status(404).json({ 
      error: 'Not Found',
      message: `Route not found: ${req.url}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    serverLogger.error('Error sending 404 response', {
      error: error.message,
      stack: error.stack
    });
  }
});

// Error logging middleware
app.use(errorLogger);

// Handle errors in the error logging middleware
app.use((err, req, res, next) => {
  serverLogger.error('Error in error logging middleware', {
    error: err.message,
    stack: err.stack
  });
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  });
});

// Handle server startup errors
const server = app.listen(PORT, () => {
  serverLogger.info('Server started successfully', {
    port: PORT
  });
  
  console.log(`🚀 Simple test server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🏠 Simplified app: http://localhost:${PORT}/`);
  console.log(`📱 Full app (may be slow): http://localhost:${PORT}/app`);
  console.log(`⏹️  Press Ctrl+C to stop`);
});

// Log server errors
server.on('error', (error) => {
  serverLogger.error('Server error', {
    error: error.message,
    stack: error.stack
  });
});

// Log when server is closing
process.on('SIGINT', () => {
  serverLogger.info('Server shutting down...');
  server.close(() => {
    serverLogger.info('Server closed');
    process.exit(0);
  });
});

// Log unhandled exceptions
process.on('uncaughtException', (error) => {
  serverLogger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  serverLogger.error('Unhandled Rejection', {
    reason: reason,
    promise: promise
  });
});