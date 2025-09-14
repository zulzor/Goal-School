// Simple web build script
const webpack = require('webpack');
const { exec } = require('child_process');
const path = require('path');

console.log('Начинаем сборку веб-версии приложения...');

// Запускаем экспорт веб-версии
exec('npx expo export:web', (error, stdout, stderr) => {
  if (error) {
    console.error(`Ошибка при сборке: ${error}`);
    return;
  }

  if (stderr) {
    console.error(`Предупреждения: ${stderr}`);
  }

  console.log(`Сборка завершена успешно: ${stdout}`);
  console.log('Веб-версия приложения собрана в папке web-export');
});
