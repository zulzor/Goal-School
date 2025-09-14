const fs = require('fs');
const path = require('path');

console.log('🚀 ПОДГОТОВКА ВЕБ-ЭКСПОРТА');
console.log('='.repeat(30));

// Функция для рекурсивного копирования файлов
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(function (childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Функция для проверки и создания папки
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Создана папка: ${dirPath}`);
  }
}

try {
  // Проверяем наличие папки web-export
  const webExportPath = path.join(__dirname, 'web-export');
  ensureDir(webExportPath);

  // Проверяем, есть ли в ней файлы
  const files = fs.readdirSync(webExportPath);
  if (files.length > 0) {
    console.log(`✅ В папке web-export найдено ${files.length} файлов`);

    // Проверяем наличие ключевых файлов
    const keyFiles = ['index.html', 'app.js'];
    keyFiles.forEach(file => {
      const filePath = path.join(webExportPath, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log(`✅ ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
      } else {
        console.warn(`⚠️  Отсутствует файл: ${file}`);
      }
    });
  } else {
    console.log('⚠️  Папка web-export пуста');

    // Создаем минимальный index.html
    const indexPath = path.join(webExportPath, 'index.html');
    const indexContent = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Футбольная школа "Арсенал"</title>
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
        h1 { color: #023474; }
        p { color: #666; line-height: 1.6; }
        .note { 
            background: #fff8e1; 
            padding: 15px; 
            border-radius: 4px; 
            margin: 20px 0;
            border-left: 4px solid #ffc107;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚽ Футбольная школа "Арсенал"</h1>
        <p>Веб-версия приложения для управления футбольной школой</p>
        
        <div class="note">
            <p><strong>Важно:</strong> Для полнофункциональной работы приложения необходимо выполнить сборку веб-версии.</p>
        </div>
        
        <h2>Инструкция по запуску:</h2>
        <ol style="text-align: left; max-width: 400px; margin: 0 auto;">
            <li>Откройте терминал в корневой папке проекта</li>
            <li>Выполните команду: <code>npm run build-full-web-app</code></li>
            <li>После завершения сборки запустите сервер: <code>npm run serve-web</code></li>
        </ol>
        
        <p style="margin-top: 30px;">
            <a href="https://github.com" style="color: #023474; text-decoration: none; font-weight: bold;">
                Документация проекта
            </a>
        </p>
    </div>
</body>
</html>`;

    fs.writeFileSync(indexPath, indexContent, 'utf8');
    console.log('✅ Создан минимальный index.html');
  }

  console.log('\n🎉 ПОДГОТОВКА ЗАВЕРШЕНА!');
  console.log('='.repeat(30));
  console.log('Для запуска веб-сервера используйте команду:');
  console.log('npm run serve-web');
  console.log('='.repeat(30));
} catch (error) {
  console.error('❌ Ошибка при подготовке веб-экспорта:', error.message);
  process.exit(1);
}
