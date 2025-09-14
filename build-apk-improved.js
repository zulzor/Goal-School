const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Создание APK для RuStore...');

try {
  // Проверяем наличие Android проекта
  const androidDir = path.join(__dirname, 'android');
  if (!fs.existsSync(androidDir)) {
    console.log('Android проект не найден. Создаем его с помощью Expo...');
    execSync('npx expo prebuild', { stdio: 'inherit' });
  }

  // Проверяем наличие необходимых файлов
  const gradlewPath = path.join(androidDir, 'gradlew.bat');
  if (!fs.existsSync(gradlewPath)) {
    console.log('gradlew.bat не найден!');
    process.exit(1);
  }

  // Переходим в папку android
  console.log('Переходим в папку android...');
  process.chdir(androidDir);

  // Собираем APK
  console.log('Собираем APK...');
  execSync('.\\gradlew.bat assembleRelease', { stdio: 'inherit' });

  // Копируем APK в корневую папку
  const apkPath = path.join(
    androidDir,
    'app',
    'build',
    'outputs',
    'apk',
    'release',
    'app-release.apk'
  );
  if (fs.existsSync(apkPath)) {
    const destPath = path.join(__dirname, 'GoalSchoolApp.apk');
    fs.copyFileSync(apkPath, destPath);
    console.log(`APK успешно создан! Файл находится по адресу: ${destPath}`);
  } else {
    console.log('APK файл не найден!');
    console.log('Проверьте папку android/app/build/outputs/apk/release/ для наличия APK файла');
  }

  // Возвращаемся в корневую папку
  process.chdir(__dirname);
} catch (error) {
  console.error('Ошибка при создании APK:', error.message);
  console.log('\nДля создания APK вручную:');
  console.log('1. Установите Android Studio и Android SDK');
  console.log('2. Установите JDK 11');
  console.log('3. Перейдите в папку android');
  console.log('4. Выполните команду: .\\gradlew.bat assembleRelease');
  console.log('5. APK будет находиться в android/app/build/outputs/apk/release/');

  // Возвращаемся в корневую папку в случае ошибки
  try {
    process.chdir(__dirname);
  } catch (e) {
    // Игнорируем ошибку при возврате в корневую папку
  }
}
