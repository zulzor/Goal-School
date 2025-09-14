const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000; // Используем порт 3000

// Сервируем статические файлы из папки web-export
app.use(express.static(path.join(__dirname, 'web-export')));

// Обслуживаем index.html для всех маршрутов (для работы React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web-export', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Веб-сервер запущен на порту ${PORT}`);
  console.log(`Откройте в браузере: http://localhost:${PORT}`);
});
