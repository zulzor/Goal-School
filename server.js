// Загрузка переменных окружения в самом начале

require('./src/config/loadEnv');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'web-export')));

// API endpoint for health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API endpoint for database connection test
app.get('/api/db-test', async (req, res) => {
  try {
    let isConnected = false;
    let dbType = 'none';

    // Проверяем MySQL, если переменные окружения заданы
    if (process.env.DB_HOST && process.env.DB_NAME) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { checkMySQLConnection } = require('./src/config/mysql');
      isConnected = await checkMySQLConnection();
      dbType = 'MySQL';
    }

    res.json({
      status: 'Database connection test completed',
      database: dbType,
      connected: isConnected,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Database connection failed',
      details: error.message,
    });
  }
});

// API endpoint for database initialization
app.get('/api/db-init', async (req, res) => {
  try {
    let dbType = 'none';

    // Инициализируем MySQL, если переменные окружения заданы
    if (process.env.DB_HOST && process.env.DB_NAME) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { initializeMySQLDatabase } = require('./src/config/mysql');
      await initializeMySQLDatabase();
      dbType = 'MySQL';
    }

    res.json({
      status: 'Database initialization completed successfully',
      database: dbType,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Database initialization failed',
      details: error.message,
    });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web-export', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Database test: http://localhost:${PORT}/api/db-test`);
  console.log(`Database init: http://localhost:${PORT}/api/db-init`);
});
