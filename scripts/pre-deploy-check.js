// scripts/pre-deploy-check.js
// Скрипт для выполнения всех проверок перед развертыванием

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

async function checkNodeAndNpm() {
  console.log('=== Проверка Node.js и npm ===\n');

  const nodeCheck = await runCommand('node --version', 'Проверка версии Node.js');
  if (!nodeCheck.success) return false;

  const npmCheck = await runCommand('npm --version', 'Проверка версии npm');
  return npmCheck.success;
}

async function checkDependencies() {
  console.log('=== Проверка зависимостей ===\n');

  if (!fs.existsSync(path.join(__dirname, '..', 'node_modules'))) {
    console.log('Установка зависимостей...');
    const installResult = await runCommand('npm install', 'Установка зависимостей');
    if (!installResult.success) return false;
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

  console.log('✓ Файл .env найден\n');
  return true;
}

async function checkDatabase() {
  console.log('=== Проверка базы данных ===\n');

  const dbInit = await runCommand(
    'node scripts/init-mysql-database.js',
    'Инициализация базы данных MySQL'
  );
  if (!dbInit.success) return false;

  const testUsers = await runCommand(
    'node scripts/create-test-users.js',
    'Создание тестовых пользователей'
  );
  return testUsers.success;
}

async function checkBuild() {
  console.log('=== Проверка сборки ===\n');

  const buildResult = await runCommand('npm run build', 'Сборка веб-версии приложения');
  return buildResult.success;
}

async function runTests() {
  console.log('=== Запуск тестов ===\n');

  const testResult = await runCommand('npm test', 'Запуск тестов');
  return testResult.success;
}

async function preDeployCheck() {
  console.log('Предварительная проверка перед развертыванием GoalSchool\n');

  let checksPassed = 0;
  let totalChecks = 6;

  // Проверка Node.js и npm
  if (await checkNodeAndNpm()) checksPassed++;

  // Проверка зависимостей
  if (await checkDependencies()) checksPassed++;

  // Проверка файла окружения
  if (await checkEnvFile()) checksPassed++;

  // Проверка базы данных
  if (await checkDatabase()) checksPassed++;

  // Проверка сборки
  if (await checkBuild()) checksPassed++;

  // Запуск тестов
  if (await runTests()) checksPassed++;

  console.log('\n=== Результаты предварительной проверки ===');
  console.log(`Пройдено проверок: ${checksPassed}/${totalChecks}`);

  if (checksPassed === totalChecks) {
    console.log('🎉 Все проверки пройдены успешно!');
    console.log('\nПриложение готово к развертыванию:');
    console.log('1. Загрузите файлы на сервер');
    console.log('2. Настройте переменные окружения');
    console.log('3. Запустите сервер: npm run app:start');
    return true;
  } else {
    console.log('⚠ Некоторые проверки не пройдены. Исправьте ошибки перед развертыванием.');
    return false;
  }
}

// Запуск проверки
preDeployCheck()
  .then(success => {
    if (success) {
      console.log('\n✅ Приложение готово к развертыванию!');
      process.exit(0);
    } else {
      console.log('\n❌ Приложение не готово к развертыванию. Исправьте ошибки.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Ошибка выполнения проверки:', error);
    process.exit(1);
  });
