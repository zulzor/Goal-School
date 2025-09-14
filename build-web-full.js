const { exec } = require('child_process');
const path = require('path');

console.log('Начинаем сборку полнофункциональной веб-версии приложения...');

// Запускаем экспорт веб-версии через Expo
exec('npx expo export:web', (error, stdout, stderr) => {
  if (error) {
    console.error(`Ошибка при сборке веб-версии: ${error}`);
    return;
  }

  if (stderr) {
    console.error(`Предупреждения при сборке: ${stderr}`);
  }

  console.log('Сборка веб-версии завершена успешно!');
  console.log(stdout);

  console.log('Веб-версия приложения собрана и находится в папке web-export');
  console.log('Для запуска веб-версии используйте команду: npm run serve-web-full');
});
