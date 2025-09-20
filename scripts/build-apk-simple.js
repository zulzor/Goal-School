// Простой скрипт для создания APK файла
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Начинаем простую сборку APK файла...');

// Проверяем, существует ли директория android
if (!fs.existsSync(path.join(__dirname, '..', 'android'))) {
  console.log('Директория android не найдена. Создаем проект Android...');

  // Создаем проект Android
  const initProcess = exec(
    'npx react-native init TempProject --version 0.74.1',
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Ошибка создания проекта: ${error}`);
        return;
      }

      console.log('Проект Android успешно создан');
    }
  );

  initProcess.stdout.on('data', data => {
    console.log(data);
  });

  initProcess.stderr.on('data', data => {
    console.error(data);
  });
} else {
  console.log('Директория android найдена. Начинаем сборку APK...');

  // Переходим в директорию android и запускаем сборку
  const gradlewPath = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';

  const buildProcess = exec(
    `${gradlewPath} assembleRelease`,
    { cwd: path.join(__dirname, '..', 'android') },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Ошибка при сборке APK: ${error}`);
        return;
      }

      if (stderr) {
        console.warn(`Предупреждения: ${stderr}`);
      }

      console.log(`Сборка APK завершена: ${stdout}`);

      // Проверяем, существует ли APK файл
      const apkPath = path.join(
        __dirname,
        '..',
        'android',
        'app',
        'build',
        'outputs',
        'apk',
        'release',
        'app-release.apk'
      );

      if (fs.existsSync(apkPath)) {
        console.log('✅ APK файл успешно создан!');
        console.log(`Путь к APK: ${apkPath}`);
        console.log('Вы можете загрузить этот файл в RuStore');
      } else {
        console.log('❌ APK файл не найден. Проверьте путь к файлу или попробуйте снова.');
      }
    }
  );

  // Выводим логи в реальном времени
  buildProcess.stdout.on('data', data => {
    console.log(data);
  });

  buildProcess.stderr.on('data', data => {
    console.error(data);
  });
}
