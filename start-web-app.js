const { exec } = require('child_process');
const path = require('path');

console.log('Запуск полнофункциональной веб-версии приложения...');
console.log('Проверяем наличие собранной версии...');

// Проверяем, существует ли папка web-export
const fs = require('fs');
const webExportPath = path.join(__dirname, 'web-export');

if (fs.existsSync(webExportPath)) {
  console.log('Найдена собранная версия. Запускаем сервер...');
  require('./main-server.js');
} else {
  console.log('Собранная версия не найдена. Запускаем процесс сборки...');

  // Запускаем сборку
  const buildProcess = exec('node build-full-web.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Ошибка при сборке: ${error}`);
      return;
    }

    if (stderr) {
      console.warn(`Предупреждения: ${stderr}`);
    }

    console.log(`Сборка завершена: ${stdout}`);
    console.log('Запускаем сервер...');
    require('./main-server.js');
  });

  // Выводим логи в реальном времени
  buildProcess.stdout.on('data', data => {
    console.log(data);
  });

  buildProcess.stderr.on('data', data => {
    console.error(data);
  });
}
