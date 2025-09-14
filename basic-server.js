const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8083; // Изменили порт на 8083

const server = http.createServer((req, res) => {
  // Путь к файлу
  let filePath = path.join(__dirname, 'web-export', req.url === '/' ? 'test.html' : req.url);

  // Если путь указывает на директорию, добавляем index.html
  if (req.url === '/') {
    filePath = path.join(__dirname, 'web-export', 'test.html');
  }

  // Определяем тип контента по расширению файла
  const extname = path.extname(filePath);
  let contentType = 'text/html';

  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.ico':
      contentType = 'image/x-icon';
      break;
  }

  // Читаем файл
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Файл не найден
        fs.readFile(path.join(__dirname, 'web-export', 'test.html'), (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end(`Server Error: ${err.code}`);
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf8');
          }
        });
      } else {
        // Другая ошибка сервера
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Успешно отправляем файл
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Базовый сервер запущен на http://localhost:${PORT}`);
  console.log(
    `Откройте браузер и перейдите по адресу http://localhost:${PORT} для просмотра тестовой страницы`
  );
});
