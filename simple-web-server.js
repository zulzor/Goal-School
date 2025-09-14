const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Раздаем статические файлы из web-export
app.use(express.static(path.join(__dirname, 'web-export')));

// Обрабатываем все остальные маршруты, возвращая index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web-export', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
