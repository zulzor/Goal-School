const express = require('express');
const path = require('path');
const fs = require('fs');

console.log('🚀 ЗАПУСК ВЕБ-СЕРВЕРА ФУТБОЛЬНОЙ ШКОЛЫ "АРСЕНАЛ"');
console.log('='.repeat(60));

const app = express();
const PORT = 3000; // Используем порт 3000

// Проверяем наличие собранной версии
const webExportPath = path.join(__dirname, 'web-export');
if (!fs.existsSync(webExportPath)) {
  console.error('❌ Папка web-export не найдена!');
  console.error('Пожалуйста, сначала выполните сборку:');
  console.error('npm run build-full-web-app');
  process.exit(1);
}

// Логирование запросов
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Раздаем статические файлы
app.use(
  express.static(webExportPath, {
    extensions: ['html'],
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  })
);

// Обрабатываем SPA роутинг
app.get('*', (req, res) => {
  const indexPath = path.join(webExportPath, 'index.html');

  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Футбольная школа "Арсенал" - Ошибка</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 50px; 
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            h1 { color: #EF0107; }
            code { 
              background: #eee; 
              padding: 4px 8px; 
              border-radius: 4px;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>⚠️ Ошибка</h1>
            <p>Файл index.html не найден в папке web-export</p>
            <p>Пожалуйста, выполните сборку приложения:</p>
            <code>npm run build-full-web-app</code>
          </div>
        </body>
      </html>
    `);
  }
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('❌ Ошибка сервера:', err.stack);
  res.status(500).send(`
    <!DOCTYPE html>
    <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <title>Ошибка сервера</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 { color: #EF0107; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>💥 Ошибка сервера</h1>
          <p>Произошла ошибка при обработке запроса.</p>
          <p>Пожалуйста, проверьте консоль сервера для получения дополнительной информации.</p>
        </div>
      </body>
    </html>
  `);
});

const server = app.listen(PORT, () => {
  console.log('✅ Сервер успешно запущен!');
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📂 Каталог: ${webExportPath}`);
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
