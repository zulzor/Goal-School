const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Раздаем статические файлы из web-export
app.use(express.static(path.join(__dirname, 'web-export')));

// Обрабатываем все остальные маршруты, возвращая index.html для клиентского роутинга
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'web-export', 'index.html');

  // Проверяем, существует ли index.html
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Если index.html не существует, создаем простую страницу
    res.status(404).send(`
      <!DOCTYPE html>
      <html lang="ru">
        <head>
          <title>Футбольная школа "Арсенал"</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>Футбольная школа "Арсенал"</h1>
            <p>Приложение еще не собрано. Пожалуйста, запустите команду сборки:</p>
            <code>npm run build-full-web</code>
            <p>Затем перезапустите сервер:</p>
            <code>npm run serve-final-web</code>
          </div>
        </body>
      </html>
    `);
  }
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`
    <!DOCTYPE html>
    <html lang="ru">
      <head>
        <title>Ошибка сервера</title>
        <meta charset="UTF-8">
      </head>
      <body>
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>Ошибка сервера</h1>
          <p>Произошла ошибка при обработке запроса.</p>
        </div>
      </body>
    </html>
  `);
});

const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('ФУТБОЛЬНАЯ ШКОЛА "АРСЕНАЛ" - ВЕБ-ВЕРСИЯ');
  console.log('='.repeat(50));
  console.log(`Сервер запущен на: http://localhost:${PORT}`);
  console.log('');
  console.log('Для корректной работы убедитесь, что:');
  console.log('1. Вы собрали веб-версию командой: npm run build-full-web');
  console.log('2. Все файлы находятся в папке web-export');
  console.log('');
  console.log('q для входа:');
  console.log('- Email: admin1@gs.com, Пароль: admin (Ребенок)');
  console.log('- Email: admin2@gs.com, Пароль: admin (Родитель)');
  console.log('- Email: admin3@gs.com, Пароль: admin (Управляющий)');
  console.log('- Email: admin4@gs.com, Пароль: admin (Тренер)');
  console.log('- Email: admin5@gs.com, Пароль: admin (SMM Менеджер)');
  console.log('='.repeat(50));
});

// Обработка graceful shutdown
process.on('SIGINT', () => {
  console.log('\nПолучен сигнал завершения. Закрываем сервер...');
  server.close(() => {
    console.log('Сервер остановлен.');
    process.exit(0);
  });
});
