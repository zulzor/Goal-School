// src/config/mysql.js
// Конфигурация подключения к MySQL
const mysql = require('mysql2/promise');
require('dotenv').config();

// Попытка подключения к MySQL
let mysqlAvailable = false;
let pool = null;

try {
  // Конфигурация подключения к MySQL
  // Замените значения в .env файле на данные вашей базы данных на Beget
  const mysqlConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    database: process.env.MYSQL_DATABASE || 'goalschool',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  // Создаем пул соединений
  pool = mysql.createPool(mysqlConfig);
  
  // Проверяем подключение
  pool.getConnection()
    .then(connection => {
      connection.release();
      mysqlAvailable = true;
      console.log('✅ MySQL database is available');
    })
    .catch(error => {
      console.log('⚠️  MySQL database connection failed, using mock database instead');
      console.log('MySQL error:', error.message);
      mysqlAvailable = false;
    });
} catch (error) {
  console.log('⚠️  MySQL database is not available, using mock database instead');
  console.log('MySQL error:', error.message);
  mysqlAvailable = false;
}

// Функция для проверки подключения к базе данных
const checkMySQLConnection = async () => {
  if (!mysqlAvailable) {
    // Используем mock реализацию
    const { checkMockConnection } = require('./mockDatabase');
    return await checkMockConnection();
  }
  
  try {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query('SELECT NOW() as now');
      console.log('MySQL database connection successful:', result[0]);
      return true;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('MySQL database connection failed:', error);
    // Если подключение к MySQL не удалось, используем mock базу данных
    mysqlAvailable = false;
    const { checkMockConnection } = require('./mockDatabase');
    return await checkMockConnection();
  }
};

// Функция для выполнения запросов к базе данных
const mysqlQuery = async (text, params) => {
  if (!mysqlAvailable) {
    // Используем mock реализацию
    const { mockQuery } = require('./mockDatabase');
    return await mockQuery(text, params);
  }
  
  try {
    const start = Date.now();
    const [rows, fields] = await pool.execute(text, params);
    const duration = Date.now() - start;
    console.log('Executed MySQL query', {
      text,
      duration,
      rows: Array.isArray(rows) ? rows.length : 1,
    });
    return { rows, fields };
  } catch (error) {
    console.error('MySQL query failed:', error);
    // Если запрос к MySQL не удался, используем mock базу данных
    mysqlAvailable = false;
    const { mockQuery } = require('./mockDatabase');
    return await mockQuery(text, params);
  }
};

// Функция для инициализации базы данных
const initializeMySQLDatabase = async () => {
  if (!mysqlAvailable) {
    // Используем mock реализацию
    const { initializeMockDatabase } = require('./mockDatabase');
    return await initializeMockDatabase();
  }
  
  try {
    // Создание таблиц, если они не существуют
    await mysqlQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await mysqlQuery(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'present',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await mysqlQuery(`
      CREATE TABLE IF NOT EXISTS progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        skill VARCHAR(100) NOT NULL,
        level INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await mysqlQuery(`
      CREATE TABLE IF NOT EXISTS nutrition (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await mysqlQuery(`
      CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await mysqlQuery(`
      CREATE TABLE IF NOT EXISTS schedule (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        time TIME NOT NULL,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await mysqlQuery(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await mysqlQuery(`
      CREATE TABLE IF NOT EXISTS achievements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        points INT DEFAULT 0,
        earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('MySQL database initialized successfully');
    return true;
  } catch (error) {
    console.error('MySQL database initialization failed:', error);
    // Если инициализация MySQL не удалась, используем mock базу данных
    mysqlAvailable = false;
    const { initializeMockDatabase } = require('./mockDatabase');
    return await initializeMockDatabase();
  }
};

module.exports = {
  checkMySQLConnection,
  mysqlQuery,
  initializeMySQLDatabase,
  pool,
  mysqlAvailable
};