const fs = require('fs');
const path = require('path');

console.log('Создание простой веб-версии приложения...');

// Создаем папку для веб-экспорта если её нет
const webExportDir = path.join(__dirname, 'web-export');
if (!fs.existsSync(webExportDir)) {
  fs.mkdirSync(webExportDir, { recursive: true });
}

// Копируем основные файлы
const filesToCopy = [
  { src: 'web-template.html', dest: 'index.html' },
  { src: 'web-export/app.js', dest: 'app.js' },
  { src: 'web-export/app-enhanced.js', dest: 'app-enhanced.js' },
];

filesToCopy.forEach(file => {
  const srcPath = path.join(__dirname, file.src);
  const destPath = path.join(webExportDir, file.dest);

  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Скопирован файл: ${file.dest}`);
  } else {
    console.log(`Файл не найден: ${file.src}`);
  }
});

// Копируем папку assets если она существует
const assetsSrc = path.join(__dirname, 'web-export/assets');
const assetsDest = path.join(webExportDir, 'assets');

if (fs.existsSync(assetsSrc)) {
  // Рекурсивно копируем папку assets
  function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  copyDir(assetsSrc, assetsDest);
  console.log('Скопирована папка assets');
}

console.log('Простая веб-версия приложения создана успешно!');
console.log(`Файлы находятся в папке: ${webExportDir}`);
