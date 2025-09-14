const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Раздаем статические файлы из web-export
app.use(express.static(path.join(__dirname, 'web-export')));

// Обрабатываем все остальные маршруты, возвращая index.html
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'web-export', 'index.html');

  // Проверяем, существует ли index.html
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Если index.html не существует, создаем простую страницу
    res.status(404).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Футбольная школа "Арсенал"</title>
          <meta charset="UTF-8">
        </head>
        <body>
          <h1>Футбольная школа "Арсенал"</h1>
          <p>Приложение еще не собрано. Пожалуйста, запустите команду сборки.</p>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`Полнофункциональный веб-сервер запущен на http://localhost:${PORT}`);
});
