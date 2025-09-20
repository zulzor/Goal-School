// src/config/mysql.ts
// Конфигурация подключения к MySQL

// Проверяем, что мы не в веб-окружении
const isWeb = typeof window !== 'undefined';

// В веб-окружении сразу экспортируем заглушки
let checkMySQLConnection: () => Promise<boolean>;
let mysqlQuery: (text: string, params?: any[]) => Promise<{ rows: any[]; fields: any[] }>;
let initializeMySQLDatabase: () => Promise<void>;
let defaultExport: any = null;

if (isWeb) {
  checkMySQLConnection = async (): Promise<boolean> => {
    console.log('[Web] MySQL проверка пропущена, используется API');
    return false; // В веб-версии MySQL недоступен
  };

  mysqlQuery = async (text: string, params?: any[]) => {
    console.log('[Web] MySQL запрос пропущен, используется API:', text);
    return { rows: [], fields: [] };
  };

  initializeMySQLDatabase = async (): Promise<void> => {
    console.log('[Web] MySQL инициализация пропущена, используется API');
    return;
  };

  defaultExport = null;
} else {
  // Динамический импорт MySQL только для нативной версии
  let mysql: any = null;
  let pool: any = null;

  try {
    mysql = require('mysql2/promise');
  } catch (e) {
    console.log('MySQL2 не доступен, используется API');
  }

  // Конфигурация подключения к MySQL
  const mysqlConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'football_school',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  // Создаем пул соединений только для нативной версии
  if (mysql) {
    try {
      pool = mysql.createPool(mysqlConfig);
    } catch (error) {
      console.error('Failed to create MySQL pool:', error);
      pool = null;
    }
  }

  // Функция для проверки подключения к базе данных
  checkMySQLConnection = async (): Promise<boolean> => {
    if (!pool) {
      console.error('MySQL pool не инициализирован');
      return false;
    }
    
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
  mysqlQuery = async (text: string, params?: any[]) => {
    if (!pool) {
      throw new Error('MySQL pool не инициализирован');
    }
    
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
  initializeMySQLDatabase = async (): Promise<void> => {
    if (!pool) {
      throw new Error('MySQL pool не инициализирован');
    }
    
    try {
      // Создание таблиц, если они не существуют (используем правильную схему)
      await mysqlQuery(`
        CREATE TABLE IF NOT EXISTS families (
          id INT AUTO_INCREMENT PRIMARY KEY,
          family_name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      await mysqlQuery(`
        CREATE TABLE IF NOT EXISTS branches (
          id INT AUTO_INCREMENT PRIMARY KEY,
          branch_name VARCHAR(255) NOT NULL,
          address TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      await mysqlQuery(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role ENUM('manager', 'coach', 'parent', 'child', 'smm_manager') NOT NULL,
          family_id INT NULL,
          child_id INT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE SET NULL,
          FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE SET NULL
        )
      `);

      await mysqlQuery(`
        CREATE TABLE IF NOT EXISTS children (
          id INT AUTO_INCREMENT PRIMARY KEY,
          family_id INT NOT NULL,
          name VARCHAR(255) NOT NULL,
          balance INT DEFAULT 0,
          birth_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
        )
      `);

      await mysqlQuery(`
        CREATE TABLE IF NOT EXISTS trainers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          branch_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
        )
      `);

      await mysqlQuery(`
        CREATE TABLE IF NOT EXISTS disciplines (
          id INT AUTO_INCREMENT PRIMARY KEY,
          discipline_name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      await mysqlQuery(`
        CREATE TABLE IF NOT EXISTS trainings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          branch_id INT NOT NULL,
          trainer_id INT NOT NULL,
          training_date DATETIME NOT NULL,
          discipline_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
          FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
          FOREIGN KEY (discipline_id) REFERENCES disciplines(id) ON DELETE CASCADE
        )
      `);

      await mysqlQuery(`
        CREATE TABLE IF NOT EXISTS attendance (
          id INT AUTO_INCREMENT PRIMARY KEY,
          training_id INT NOT NULL,
          child_id INT NOT NULL,
          visited BOOLEAN DEFAULT FALSE,
          confirmed_by_coach BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (training_id) REFERENCES trainings(id) ON DELETE CASCADE,
          FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
          UNIQUE KEY unique_attendance (training_id, child_id)
        )
      `);

      await mysqlQuery(`
        CREATE TABLE IF NOT EXISTS progress (
          id INT AUTO_INCREMENT PRIMARY KEY,
          child_id INT NOT NULL,
          discipline_id INT NOT NULL,
          value DECIMAL(10, 2) NOT NULL,
          measurement_date DATE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
          FOREIGN KEY (discipline_id) REFERENCES disciplines(id) ON DELETE CASCADE
        )
      `);

      // Создаем индексы для оптимизации запросов
      await mysqlQuery('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
      await mysqlQuery('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
      await mysqlQuery('CREATE INDEX IF NOT EXISTS idx_children_family ON children(family_id)');
      await mysqlQuery('CREATE INDEX IF NOT EXISTS idx_trainings_date ON trainings(training_date)');
      await mysqlQuery('CREATE INDEX IF NOT EXISTS idx_trainings_branch ON trainings(branch_id)');
      await mysqlQuery('CREATE INDEX IF NOT EXISTS idx_attendance_training ON attendance(training_id)');
      await mysqlQuery('CREATE INDEX IF NOT EXISTS idx_attendance_child ON attendance(child_id)');
      await mysqlQuery('CREATE INDEX IF NOT EXISTS idx_progress_child ON progress(child_id)');
      await mysqlQuery('CREATE INDEX IF NOT EXISTS idx_progress_discipline ON progress(discipline_id)');

      console.log('MySQL database initialized successfully');
    } catch (error) {
      console.error('MySQL database initialization failed:', error);
      throw error;
    }
  };

  defaultExport = pool;
}

export { checkMySQLConnection, mysqlQuery, initializeMySQLDatabase };
export default defaultExport;