const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Создаем папку для веб-экспорта если её нет
const webExportDir = path.join(__dirname, 'web-export');
if (!fs.existsSync(webExportDir)) {
  fs.mkdirSync(webExportDir, { recursive: true });
}

// Обслуживаем статические файлы из web-export
app.use(express.static(webExportDir));

// Если index.html не существует, создаем простой
const indexPath = path.join(webExportDir, 'index.html');
if (!fs.existsSync(indexPath)) {
  const simpleHtml = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Футбольная школа Arsenal - Предварительный просмотр</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background-color: #f0f0f0;
        }
        .container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: 0 auto;
        }
        h1 {
            color: #EF0107; /* Красный цвет Arsenal */
        }
        .info {
            background-color: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .steps {
            text-align: left;
            background-color: #fff3e0;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .steps h3 {
            color: #e65100;
            margin-top: 0;
        }
        .steps ol {
            padding-left: 20px;
        }
        .steps li {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Футбольная школа Arsenal</h1>
        <div class="info">
            <p>Предварительный просмотр веб-версии приложения</p>
        </div>
        
        <div class="steps">
            <h3>Для создания полноценной веб-версии:</h3>
            <ol>
                <li>Остановите этот сервер (Ctrl+C)</li>
                <li>Запустите команду: <code>npx expo export:web</code></li>
                <li>После экспорта запустите этот сервер снова</li>
                <li>Откройте браузер и перейдите по адресу: http://localhost:3000</li>
            </ol>
        </div>
        
        <p>Текущее время: ${new Date().toLocaleString('ru-RU')}</p>
    </div>
</body>
</html>
  `;
  fs.writeFileSync(indexPath, simpleHtml);
}

// Обрабатываем корневой маршрут
app.get('/', (req, res) => {
  res.sendFile(indexPath);
});

// Запускаем сервер
app.listen(PORT, () => {
  console.log(`Сервер предварительного просмотра запущен на http://localhost:${PORT}`);
  console.log(`Веб-версия будет доступна по адресу http://localhost:${PORT}`);
  console.log(`Для остановки сервера нажмите Ctrl+C`);
});
