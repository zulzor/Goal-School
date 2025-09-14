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

  // Переходим в папку android
  process.chdir(androidDir);

  // Проверяем наличие gradlew
  if (!fs.existsSync('gradlew.bat')) {
    console.log('gradlew.bat не найден!');
    process.exit(1);
  }

  // Даем права на выполнение
  console.log('Даем права на выполнение gradlew...');
  execSync('chmod +x gradlew.bat', { stdio: 'inherit' });

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
  }
} catch (error) {
  console.error('Ошибка при создании APK:', error.message);
  console.log('\nДля создания APK вручную:');
  console.log('1. Установите Android Studio и Android SDK');
  console.log('2. Установите JDK 11');
  console.log('3. Перейдите в папку android');
  console.log('4. Выполните команду: .\\gradlew.bat assembleRelease');
  console.log('5. APK будет находиться в android/app/build/outputs/apk/release/');
}
