// src/services/__tests__/DatabaseInitService.test.ts
import { DatabaseInitService } from '../DatabaseInitService';

// Мокаем модуль базы данных
jest.mock('../../config/mysql', () => ({
  mysqlQuery: jest.fn(),
}));

const mockMysqlQuery = require('../../config/mysql').mysqlQuery;

describe('DatabaseInitService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeAllTables', () => {
    it('should create all required tables', async () => {
      mockMysqlQuery.mockResolvedValue([{ count: '0' }]);

      await DatabaseInitService.initializeAllTables();

      // Проверяем, что были вызваны функции создания всех таблиц
      expect(mockMysqlQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS users')
      );
      expect(mockMysqlQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS attendance')
      );
      expect(mockMysqlQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS progress')
      );
      expect(mockMysqlQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS nutrition')
      );
      expect(mockMysqlQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS news')
      );
      expect(mockMysqlQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS schedule')
      );
      expect(mockMysqlQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS skills')
      );
      expect(mockMysqlQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE IF NOT EXISTS achievements')
      );

      // Проверяем, что были созданы индексы
      expect(mockMysqlQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE INDEX IF NOT EXISTS idx_users_email')
      );
      expect(mockMysqlQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE INDEX IF NOT EXISTS idx_attendance_user_date')
      );
      expect(mockMysqlQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE INDEX IF NOT EXISTS idx_progress_user_skill')
      );
      expect(mockMysqlQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE INDEX IF NOT EXISTS idx_nutrition_date')
      );
      expect(mockMysqlQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE INDEX IF NOT EXISTS idx_news_created_at')
      );
      expect(mockMysqlQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE INDEX IF NOT EXISTS idx_schedule_date')
      );
      expect(mockMysqlQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE INDEX IF NOT EXISTS idx_skills_category')
      );
      expect(mockMysqlQuery).toHaveBeenCalledWith(
        expect.stringContaining('CREATE INDEX IF NOT EXISTS idx_achievements_user_earned')
      );
    });

    it('should handle database errors', async () => {
      mockMysqlQuery.mockRejectedValue(new Error('Database error'));

      await expect(DatabaseInitService.initializeAllTables()).rejects.toThrow('Database error');
    });
  });

  describe('createUserTable', () => {
    it('should create users table with correct schema', async () => {
      mockMysqlQuery.mockResolvedValue([{ count: '0' }]);

      await DatabaseInitService.createUserTable();

      expect(mockMysqlQuery).toHaveBeenCalledWith(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

      expect(mockMysqlQuery).toHaveBeenCalledWith(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);
    });
  });

  describe('createAttendanceTable', () => {
    it('should create attendance table with correct schema', async () => {
      mockMysqlQuery.mockResolvedValue([{ count: '0' }]);

      await DatabaseInitService.createAttendanceTable();

      expect(mockMysqlQuery).toHaveBeenCalledWith(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'present',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

      expect(mockMysqlQuery).toHaveBeenCalledWith(`
      CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON attendance(user_id, date)
    `);
    });
  });

  describe('createProgressTable', () => {
    it('should create progress table with correct schema', async () => {
      mockMysqlQuery.mockResolvedValue([{ count: '0' }]);

      await DatabaseInitService.createProgressTable();

      expect(mockMysqlQuery).toHaveBeenCalledWith(`
      CREATE TABLE IF NOT EXISTS progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        skill VARCHAR(100) NOT NULL,
        level INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

      expect(mockMysqlQuery).toHaveBeenCalledWith(`
      CREATE INDEX IF NOT EXISTS idx_progress_user_skill ON progress(user_id, skill)
    `);
    });
  });

  describe('seedDatabase', () => {
    it('should seed database with initial data', async () => {
      // Сначала возвращаем 0 навыков, чтобы запустить seeding
      mockMysqlQuery.mockResolvedValueOnce([{ count: '0' }]);
      // Затем возвращаем пустой результат для insert запросов
      mockMysqlQuery.mockResolvedValue([{ count: '0' }]);

      await DatabaseInitService.seedDatabase();

      // Проверяем, что был выполнен запрос на подсчет навыков
      expect(mockMysqlQuery).toHaveBeenCalledWith('SELECT COUNT(*) as count FROM skills');

      // Проверяем, что были добавлены навыки (проверяем несколько примеров)
      expect(mockMysqlQuery).toHaveBeenCalledWith(
        'INSERT INTO skills (name, category, description) VALUES (?, ?, ?)',
        ['Ведение мяча', 'Техника', 'Умение контролировать мяч во время движения']
      );

      expect(mockMysqlQuery).toHaveBeenCalledWith(
        'INSERT INTO skills (name, category, description) VALUES (?, ?, ?)',
        ['Пас', 'Техника', 'Точная передача мяча teammate']
      );
    });

    it('should not seed if skills already exist', async () => {
      // Возвращаем 27 навыков (как в реальной системе)
      mockMysqlQuery.mockResolvedValue([{ count: '27' }]);

      await DatabaseInitService.seedDatabase();

      // Проверяем, что был выполнен только запрос на подсчет навыков
      expect(mockMysqlQuery).toHaveBeenCalledTimes(1);
      expect(mockMysqlQuery).toHaveBeenCalledWith('SELECT COUNT(*) as count FROM skills');
    });
  });
});
