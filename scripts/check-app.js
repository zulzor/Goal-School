// scripts/check-app.js
// Скрипт для полной проверки приложения

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

async function runCommand(command, description) {
  console.log(`\nВыполняем: ${description}`);
  console.log(`Команда: ${command}\n`);

  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.log(stderr);
    return { success: true, stdout, stderr };
  } catch (error) {
    console.error(`Ошибка выполнения команды: ${error.message}`);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.log(error.stderr);
    return { success: false, error: error.message, stdout: error.stdout, stderr: error.stderr };
  }
}

async function checkEnvironment() {
  console.log('=== Проверка окружения ===\n');

  // Проверяем Node.js
  const nodeCheck = await runCommand('node --version', 'Проверка версии Node.js');
  if (!nodeCheck.success) {
    console.log('✗ Node.js не установлен или недоступен');
    return false;
  }

  // Проверяем npm
  const npmCheck = await runCommand('npm --version', 'Проверка версии npm');
  if (!npmCheck.success) {
    console.log('✗ npm не установлен или недоступен');
    return false;
  }

  console.log('✓ Окружение настроено корректно\n');
  return true;
}

async function checkDependencies() {
  console.log('=== Проверка зависимостей ===\n');

  // Проверяем наличие node_modules
  if (!fs.existsSync(path.join(__dirname, '..', 'node_modules'))) {
    console.log('✗ Зависимости не установлены. Запустите "npm install"');
    return false;
  }

  console.log('✓ Зависимости установлены\n');
  return true;
}

async function checkEnvFile() {
  console.log('=== Проверка файла окружения ===\n');

  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.log('⚠ Файл .env не найден. Создайте его на основе .env.example');
    return false;
  }

  // Загружаем переменные окружения
  require('dotenv').config();

  // Проверяем основные переменные
  const requiredVars = ['DATABASE_URL', 'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  let allPresent = true;

  for (const variable of requiredVars) {
    if (!process.env[variable]) {
      console.log(`✗ ${variable}: не задана`);
      allPresent = false;
    }
  }

  if (allPresent) {
    console.log('✓ Все необходимые переменные окружения заданы\n');
  }

  return allPresent;
}

async function checkDatabaseConnection() {
  console.log('=== Проверка подключения к базе данных ===\n');

  const dbCheck = await runCommand(
    'node scripts/check-database.js',
    'Проверка подключения к базе данных'
  );
  return dbCheck.success;
}

async function checkWebBuild() {
  console.log('=== Проверка веб-сборки ===\n');

  const webBuildPath = path.join(__dirname, '..', 'web-build');
  if (!fs.existsSync(webBuildPath)) {
    console.log('⚠ Веб-сборка не найдена. Запустите "npm run build"');
    return false;
  }

  const indexHtmlPath = path.join(webBuildPath, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.log('✗ Файл index.html не найден в веб-сборке');
    return false;
  }

  console.log('✓ Веб-сборка существует\n');
  return true;
}

async function checkApp() {
  console.log('Полная проверка приложения GoalSchool\n');

  let checksPassed = 0;
  let totalChecks = 5;

  // Проверка окружения
  if (await checkEnvironment()) checksPassed++;

  // Проверка зависимостей
  if (await checkDependencies()) checksPassed++;

  // Проверка файла окружения
  if (await checkEnvFile()) checksPassed++;

  // Проверка подключения к базе данных
  if (await checkDatabaseConnection()) checksPassed++;

  // Проверка веб-сборки
  if (await checkWebBuild()) checksPassed++;

  console.log('\n=== Результаты проверки ===');
  console.log(`Пройдено проверок: ${checksPassed}/${totalChecks}`);

  if (checksPassed === totalChecks) {
    console.log('🎉 Все проверки пройдены успешно!');
    console.log('\nПриложение готово к запуску:');
    console.log('1. Запустите сервер: npm run app:start');
    console.log('2. Откройте браузер и перейдите по адресу: http://localhost:3000');
  } else {
    console.log(
      '⚠ Некоторые проверки не пройдены. Пожалуйста, исправьте ошибки и повторите проверку.'
    );
  }
}

// Запуск проверки
checkApp().catch(error => {
  console.error('Ошибка выполнения проверки:', error);
  process.exit(1);
});
