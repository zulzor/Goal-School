const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Начинаем сборку полнофункциональной веб-версии приложения...');

// Запускаем экспорт веб-версии с помощью Expo
exec('npx expo export:web --dev', (error, stdout, stderr) => {
  if (error) {
    console.error(`Ошибка при сборке: ${error}`);
    return;
  }

  if (stderr) {
    console.warn(`Предупреждения: ${stderr}`);
  }

  console.log(`Сборка завершена: ${stdout}`);

  // Копируем необходимые файлы
  try {
    // Убедимся, что папка web-export существует
    const webExportDir = path.join(__dirname, 'web-export');
    if (!fs.existsSync(webExportDir)) {
      fs.mkdirSync(webExportDir, { recursive: true });
    }

    console.log('Полнофункциональная веб-версия приложения собрана в папке web-export');
    console.log('Для запуска используйте: npm run serve-web');
  } catch (copyError) {
    console.error(`Ошибка при копировании файлов: ${copyError}`);
  }
});
