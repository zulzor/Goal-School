const express = require('express');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const { createProxyMiddleware } = require('http-proxy-middleware');

console.log('🚀 ЗАПУСК РАЗРАБОТОЧНОГО СЕРВЕРА ФУТБОЛЬНОЙ ШКОЛЫ "АРСЕНАЛ"');
console.log('='.repeat(60));

const app = express();
const PORT = process.env.PORT || 3003;
const PHP_BACKEND_PORT = process.env.PHP_BACKEND_PORT || 8080;
const PHP_BACKEND_HOST = process.env.PHP_BACKEND_HOST || 'localhost';

// Middleware для парсинга JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the web-export directory with proper caching
app.use(express.static(path.join(__dirname, '..', 'web-export'), {
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Proxy all /api requests to the PHP backend
app.use('/api', createProxyMiddleware({
  target: `http://${PHP_BACKEND_HOST}:${PHP_BACKEND_PORT}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api' // remove /api prefix when forwarding to PHP backend
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.originalUrl} to PHP backend`);
  },
  onProxyRes: (proxyRes, req, res) => {
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
  const webExportPath = path.join(__dirname, '..', 'web-export');
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
  console.log('✅ Сервер успешно запущен!');
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🏥 Проверка состояния: http://localhost:${PORT}/api/health`);
  console.log(`🔗 PHP Backend: http://${PHP_BACKEND_HOST}:${PHP_BACKEND_PORT}`);
  console.log('='.repeat(60));
  console.log('Для остановки сервера нажмите Ctrl+C');
  console.log('='.repeat(60));
});

// Наблюдаем за изменениями в файлах и перезагружаем страницу
const watcher = chokidar.watch(path.join(__dirname, '..', 'web-export'), {
  ignored: /node_modules/,
  persistent: true
});

watcher.on('change', (path) => {
  console.log(`🔄 Файл изменен: ${path}`);
  // Отправляем событие перезагрузки всем подключенным клиентам
  // (в реальной реализации здесь был бы WebSocket сервер)
});

watcher.on('add', (path) => {
  console.log(`➕ Файл добавлен: ${path}`);
});

watcher.on('unlink', (path) => {
  console.log(`➖ Файл удален: ${path}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Получен сигнал завершения...');
  watcher.close();
  server.close(() => {
    console.log('✅ Сервер остановлен');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Получен сигнал завершения...');
  watcher.close();
  server.close(() => {
    console.log('✅ Сервер остановлен');
    process.exit(0);
  });
});