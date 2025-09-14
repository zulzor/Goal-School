// scripts/check-database.js
// Скрипт для проверки подключения к базе данных MySQL

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Загружаем переменные окружения
dotenv.config();

async function checkMySQLConnection() {
  console.log('Checking MySQL database connection...');

  // Конфигурация подключения к MySQL
  const mysqlConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    database: process.env.MYSQL_DATABASE || 'goalschool',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
  };

  try {
    // Создаем пул соединений
    const pool = mysql.createPool(mysqlConfig);
    const connection = await pool.getConnection();

    try {
      const [result] = await connection.query('SELECT NOW() as now');
      console.log('MySQL database connection successful:', result[0].now);
      console.log('MySQL configuration:');
      console.log('- Host:', process.env.MYSQL_HOST || 'localhost');
      console.log('- Port:', process.env.MYSQL_PORT || '3306');
      console.log('- Database:', process.env.MYSQL_DATABASE || 'goalschool');
      console.log('- User:', process.env.MYSQL_USER || 'root');

      // Проверяем существующие таблицы
      const [tables] = await connection.query(`
        SHOW TABLES
      `);

      console.log('Existing tables:');
      tables.forEach(row => {
        const tableName = Object.values(row)[0];
        console.log('- ' + tableName);
      });

      return true;
    } finally {
      connection.release();
      await pool.end();
    }
  } catch (error) {
    console.error('MySQL database connection failed:', error.message);
    return false;
  }
}

async function checkDatabaseConnection() {
  // Проверяем MySQL, если переменные окружения заданы
  if (process.env.MYSQL_HOST && process.env.MYSQL_DATABASE) {
    return await checkMySQLConnection();
  }

  console.log('No MySQL database configuration found in .env file');
  console.log('Please check your MySQL database configuration');
  return false;
}

// Запуск проверки подключения
checkDatabaseConnection().then(success => {
  if (success) {
    console.log('\n✅ Database connection check completed successfully!');
  } else {
    console.log('\n❌ Database connection check failed!');
    console.log('Please check your MySQL database configuration in .env file');
  }
  process.exit(success ? 0 : 1);
});
