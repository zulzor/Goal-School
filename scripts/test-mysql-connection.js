// scripts/test-mysql-connection.js
// Тест подключения к базе данных MySQL

// Загрузка переменных окружения
require('../src/config/loadEnv');

const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('Тестирование подключения к базе данных MySQL...');
  console.log('Параметры подключения:');
  console.log('- Хост:', process.env.DB_HOST || 'localhost');
  console.log('- Порт:', process.env.DB_PORT || '3306');
  console.log('- База данных:', process.env.DB_NAME || 'goalschool');
  console.log('- Пользователь:', process.env.DB_USER || 'root');
  console.log('- Пароль: *** (скрыт для безопасности)');
  console.log('');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Подключение к базе данных MySQL успешно установлено!');

    // Выполняем тестовый запрос
    const [rows] = await connection.execute('SELECT NOW() as now');
    console.log('Текущее время на сервере:', rows[0].now);

    await connection.end();
  } catch (error) {
    console.error('❌ Ошибка при подключении к базе данных:', error.message);
    console.log('Возможные причины:');
    console.log('1. Неправильный пароль пользователя базы данных');
    console.log('2. База данных еще не создана');
    console.log('3. Пользователю не предоставлен доступ к базе данных');
    console.log('4. Сервер MySQL временно недоступен');
  }
}

// Запуск теста
testConnection();
