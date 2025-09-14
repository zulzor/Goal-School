// src/config/mysql.ts
// Конфигурация подключения к MySQL
import mysql from 'mysql2/promise';

// Конфигурация подключения к MySQL
const mysqlConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'goalschool',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Создаем пул соединений
const pool = mysql.createPool(mysqlConfig);

// Функция для проверки подключения к базе данных
export const checkMySQLConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    try {
      const [result]: any = await connection.query('SELECT NOW() as now');
      console.log('MySQL database connection successful:', result[0]);
      return true;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('MySQL database connection failed:', error);
    return false;
  }
};

// Функция для выполнения запросов к базе данных
export const mysqlQuery = async (text: string, params?: any[]) => {
  const start = Date.now();
  const [rows, fields] = await pool.execute(text, params);
  const duration = Date.now() - start;
  console.log('Executed MySQL query', {
    text,
    duration,
    rows: Array.isArray(rows) ? rows.length : 1,
  });
  return { rows, fields };
};

// Функция для инициализации базы данных
export const initializeMySQLDatabase = async (): Promise<void> => {
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
  } catch (error) {
    console.error('MySQL database initialization failed:', error);
    throw error;
  }
};

export default pool;
