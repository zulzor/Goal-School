// scripts/init-app.js
// Скрипт для инициализации приложения

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
    return true;
  } catch (error) {
    console.error(`Ошибка выполнения команды: ${error.message}`);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.log(error.stderr);
    return false;
  }
}

async function checkPrerequisites() {
  console.log('Проверка необходимых компонентов...\n');

  // Проверяем наличие Node.js
  try {
    await execAsync('node --version');
    console.log('✓ Node.js установлен');
  } catch (error) {
    console.log('✗ Node.js не найден. Пожалуйста, установите Node.js');
    return false;
  }

  // Проверяем наличие npm
  try {
    await execAsync('npm --version');
    console.log('✓ npm установлен');
  } catch (error) {
    console.log('✗ npm не найден. Пожалуйста, установите npm');
    return false;
  }

  return true;
}

async function initializeApp() {
  console.log('Инициализация приложения GoalSchool...\n');

  // Проверка необходимых компонентов
  if (!(await checkPrerequisites())) {
    console.log(
      '\nНе все необходимые компоненты установлены. Пожалуйста, установите их и повторите попытку.'
    );
    return;
  }

  // Установка зависимостей
  console.log('\n--- Установка зависимостей ---');
  const depsInstalled = await runCommand('npm install', 'Установка зависимостей');

  if (!depsInstalled) {
    console.log(
      '\nОшибка установки зависимостей. Проверьте подключение к интернету и повторите попытку.'
    );
    return;
  }

  // Проверка переменных окружения
  console.log('\n--- Проверка переменных окружения ---');
  await runCommand('node scripts/check-env.js', 'Проверка переменных окружения');

  // Инициализация базы данных MySQL (если используется)
  console.log('\n--- Инициализация базы данных MySQL ---');
  await runCommand('node scripts/init-mysql-database.js', 'Инициализация базы данных MySQL');

  // Создание тестовых пользователей
  console.log('\n--- Создание тестовых пользователей ---');
  await runCommand('node scripts/create-test-users.js', 'Создание тестовых пользователей');

  // Генерация веб-версии приложения
  console.log('\n--- Генерация веб-версии приложения ---');
  const webBuilt = await runCommand('npm run build', 'Генерация веб-версии приложения');

  if (!webBuilt) {
    console.log('\nОшибка генерации веб-версии приложения.');
    return;
  }

  console.log('\n✅ Инициализация приложения завершена успешно!');
  console.log('\nСледующие шаги:');
  console.log('1. Запустите сервер: npm run app:start');
  console.log('2. Откройте браузер и перейдите по адресу: http://localhost:3000');
  console.log('3. Используйте тестовые учетные данные для входа:');
  console.log('   - Администратор: admin@example.com / admin123');
  console.log('   - Менеджер: manager@example.com / manager123');
  console.log('   - Тренер: coach@example.com / coach123');
  console.log('   - Родитель: parent@example.com / parent123');
  console.log('   - Ученик: student@example.com / student123');

  console.log('\nДля развертывания на Beget следуйте инструкции в файле DEPLOYMENT_TO_BEGET.md');
}

// Запуск инициализации
initializeApp().catch(error => {
  console.error('Ошибка инициализации приложения:', error);
  process.exit(1);
});
