const express = require('express');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Загрузка переменных окружения
require('./src/config/loadEnv');

const app = express();
const PORT = process.env.PORT || 3004;
const PHP_BACKEND_PORT = process.env.PHP_BACKEND_PORT || 8080;
const PHP_BACKEND_HOST = process.env.PHP_BACKEND_HOST || 'localhost';

// Middleware для парсинга JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the web-export directory with proper caching
app.use(express.static(path.join(__dirname, 'web-export'), {
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// API endpoint for health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    server: 'GoalSchool App Server'
  });
});

// API endpoint for database connection test
app.get('/api/db-test', async (req, res) => {
  try {
    let isConnected = false;
    let dbType = 'none';

    // Проверяем MySQL, если переменные окружения заданы
    if ((process.env.MYSQL_HOST || process.env.DB_HOST) && (process.env.MYSQL_DATABASE || process.env.DB_NAME)) {
      try {
        const { checkMySQLConnection } = require('./src/config/mysql');
        isConnected = await checkMySQLConnection();
        dbType = 'MySQL';
      } catch (error) {
        console.log('MySQL connection test failed:', error.message);
      }
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
    if ((process.env.MYSQL_HOST || process.env.DB_HOST) && (process.env.MYSQL_DATABASE || process.env.DB_NAME)) {
      try {
        const { initializeMySQLDatabase } = require('./src/config/mysql');
        await initializeMySQLDatabase();
        dbType = 'MySQL';
      } catch (error) {
        console.log('MySQL initialization failed:', error.message);
      }
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

// API endpoint for user login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if we have the required data
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        details: 'Email and password are required'
      });
    }
    
    // Determine role based on email pattern (for demo purposes)
    let role = 'child'; // default role
    let name = email.split('@')[0]; // default name from email
    
    // Determine role based on email pattern (for demo purposes)
    if (email.includes('manager')) {
      role = 'manager';
      name = 'Управляющий';
    } else if (email.includes('coach')) {
      role = 'coach';
      name = 'Тренер';
    } else if (email.includes('parent')) {
      role = 'parent';
      name = 'Родитель';
    } else if (email.includes('admin')) {
      role = 'manager'; // Use 'manager' role for admin emails to match frontend
      name = 'Администратор';
    } else {
      // For child users, we can have a more specific name
      name = 'Ученик';
    }
    
    res.json({
      success: true,
      user: {
        id: '1',
        name: name,
        email: email,
        role: role
      },
      token: 'mock-jwt-token-' + Date.now()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Login failed',
      details: error.message,
    });
  }
});

// API endpoint for user registration
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role, branchId } = req.body;
    
    // Check if we have the required data
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        details: 'Name, email, password, and role are required'
      });
    }
    
    // In a real implementation, we would proxy to the PHP backend
    // For now, let's implement proper registration with mock data
    res.json({
      success: true,
      user: {
        id: '2',
        name: name,
        email: email,
        role: role,
        branchId: branchId
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      details: error.message,
    });
  }
});

// Proxy all /api requests to the PHP backend
app.use('/api', createProxyMiddleware({
  target: `http://${PHP_BACKEND_HOST}:${PHP_BACKEND_PORT}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api' // remove /api prefix when forwarding to PHP backend
  },
  onProxyReq: (proxyReq, req, res) => {
    // Log proxied requests
    console.log(`Proxying ${req.method} ${req.originalUrl} to PHP backend`);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Log responses from PHP backend
    console.log(`Received response from PHP backend for ${req.method} ${req.originalUrl}: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({
      error: 'API request failed',
      details: err.message,
    });
  }
}));

// Обрабатываем SPA роутинг для React Router
app.get('*', (req, res) => {
  const webExportPath = path.join(__dirname, 'web-export');
  const indexPath = path.join(webExportPath, 'index.html');
  
  // Проверяем, существует ли запрашиваемый файл
  const requestedPath = path.join(webExportPath, req.path);
  
  // Если запрашиваемый файл существует, отдаем его
  if (fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
    return res.sendFile(requestedPath);
  }
  
  // В противном случае отдаем index.html для обработки клиентским роутингом
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({
      error: 'Application files not found',
      message: 'Please run the build process to generate the web application files'
    });
  }
});

const server = app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('ФУТБОЛЬНАЯ ШКОЛА "АРСЕНАЛ" - ЕДИНЫЙ СЕРВЕР');
  console.log('='.repeat(60));
  console.log(`🚀 Сервер запущен на порту: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🏥 Проверка состояния: http://localhost:${PORT}/api/health`);
  console.log(`📊 Тест БД: http://localhost:${PORT}/api/db-test`);
  console.log(`⚙️  Инициализация БД: http://localhost:${PORT}/api/db-init`);
  console.log(`🔗 PHP Backend: http://${PHP_BACKEND_HOST}:${PHP_BACKEND_PORT}`);
  console.log('='.repeat(60));
  console.log('Для остановки сервера нажмите Ctrl+C');
  console.log('='.repeat(60));
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Получен сигнал завершения...');
  server.close(() => {
    console.log('✅ Сервер остановлен');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Получен сигнал завершения...');
  server.close(() => {
    console.log('✅ Сервер остановлен');
    process.exit(0);
  });
});