// scripts/check-env.js
// Скрипт для проверки переменных окружения

const fs = require('fs');
const path = require('path');

console.log('Проверка переменных окружения...\n');

// Проверяем наличие .env файла
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  console.log('✓ Файл .env найден');
} else {
  console.log('✗ Файл .env не найден');
  console.log('  Создайте файл .env на основе .env.example');
}

// Загружаем переменные окружения
require('dotenv').config();

// Проверяем основные переменные
const requiredVars = [
  'DATABASE_URL',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'NODE_ENV',
  'PORT',
  'JWT_SECRET',
  'BCRYPT_SALT_ROUNDS',
];

console.log('\nПроверка переменных окружения:\n');

let allPresent = true;
for (const variable of requiredVars) {
  if (process.env[variable]) {
    console.log(`✓ ${variable}: ${process.env[variable]}`);
  } else {
    console.log(`✗ ${variable}: не задана`);
    allPresent = false;
  }
}

console.log('\nПроверка подключения к базе данных:\n');

// Проверяем DATABASE_URL
if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log(`✓ DATABASE_URL протокол: ${url.protocol}`);
    console.log(`✓ DATABASE_URL хост: ${url.hostname}`);
    console.log(`✓ DATABASE_URL порт: ${url.port || 'по умолчанию'}`);
    console.log(`✓ DATABASE_URL база данных: ${url.pathname.substring(1)}`);
  } catch (error) {
    console.log(`✗ DATABASE_URL некорректный: ${error.message}`);
  }
}

console.log('\nРезультат проверки:');
if (allPresent) {
  console.log('✓ Все необходимые переменные окружения заданы');
} else {
  console.log('✗ Некоторые переменные окружения отсутствуют');
  console.log('  Пожалуйста, проверьте файл .env');
}

console.log('\nДополнительная информация:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'не задан');
console.log('- PORT:', process.env.PORT || '3000 (по умолчанию)');
