const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Начинаем сборку APK файла для Rustore...');

// Проверяем, установлен ли React Native CLI
exec('npx react-native --version', (error, stdout, stderr) => {
  if (error) {
    console.log('React Native CLI не найден. Устанавливаем...');
    exec(
      'npm install -g @react-native-community/cli',
      (installError, installStdout, installStderr) => {
        if (installError) {
          console.error(`Ошибка установки React Native CLI: ${installError}`);
          return;
        }
        console.log('React Native CLI успешно установлен');
        buildAPK();
      }
    );
  } else {
    console.log('React Native CLI уже установлен');
    buildAPK();
  }
});

function buildAPK() {
  console.log('Создаем сборку APK...');

  // Запускаем сборку APK
  const buildProcess = exec(
    'npx react-native build-android --mode=release',
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
        'android',
        'app',
        'build',
        'outputs',
        'apk',
        'release',
        'app-release.apk'
      );
      if (fs.existsSync(apkPath)) {
        console.log('APK файл успешно создан!');
        console.log(`Путь к APK: ${apkPath}`);
        console.log('Вы можете загрузить этот файл в Rustore');
      } else {
        console.log('APK файл не найден. Проверьте путь к файлу или попробуйте снова.');
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
