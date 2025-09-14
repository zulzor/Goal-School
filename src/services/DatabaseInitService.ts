// src/services/DatabaseInitService.ts
import { mysqlQuery } from '../config/mysql';

export class DatabaseInitService {
  // Инициализация всех таблиц
  static async initializeAllTables(): Promise<void> {
    try {
      await this.createUserTable();
      await this.createAttendanceTable();
      await this.createProgressTable();
      await this.createNutritionTable();
      await this.createNewsTable();
      await this.createScheduleTable();
      await this.createSkillsTable();
      await this.createAchievementsTable();

      console.log('All database tables initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  // Создание таблицы пользователей
  static async createUserTable(): Promise<void> {
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

    // Создание индекса для email
    await mysqlQuery(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);
  }

  // Создание таблицы посещаемости
  static async createAttendanceTable(): Promise<void> {
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

    // Создание индекса для user_id и date
    await mysqlQuery(`
      CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON attendance(user_id, date)
    `);
  }

  // Создание таблицы прогресса
  static async createProgressTable(): Promise<void> {
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

    // Создание индекса для user_id и skill
    await mysqlQuery(`
      CREATE INDEX IF NOT EXISTS idx_progress_user_skill ON progress(user_id, skill)
    `);
  }

  // Создание таблицы питания
  static async createNutritionTable(): Promise<void> {
    await mysqlQuery(`
      CREATE TABLE IF NOT EXISTS nutrition (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Создание индекса для date
    await mysqlQuery(`
      CREATE INDEX IF NOT EXISTS idx_nutrition_date ON nutrition(date)
    `);
  }

  // Создание таблицы новостей
  static async createNewsTable(): Promise<void> {
    await mysqlQuery(`
      CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Создание индекса для created_at
    await mysqlQuery(`
      CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC)
    `);
  }

  // Создание таблицы расписания
  static async createScheduleTable(): Promise<void> {
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

    // Создание индекса для date
    await mysqlQuery(`
      CREATE INDEX IF NOT EXISTS idx_schedule_date ON schedule(date)
    `);
  }

  // Создание таблицы навыков
  static async createSkillsTable(): Promise<void> {
    await mysqlQuery(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Создание индекса для category
    await mysqlQuery(`
      CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category)
    `);
  }

  // Создание таблицы достижений
  static async createAchievementsTable(): Promise<void> {
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

    // Создание индекса для user_id и earned_at
    await mysqlQuery(`
      CREATE INDEX IF NOT EXISTS idx_achievements_user_earned ON achievements(user_id, earned_at)
    `);
  }

  // Заполнение таблиц начальными данными (seeding)
  static async seedDatabase(): Promise<void> {
    try {
      // Добавляем начальные навыки, если их нет
      const skillsCount = await mysqlQuery('SELECT COUNT(*) as count FROM skills');

      if (parseInt(skillsCount[0].count) === 0) {
        await this.seedSkills();
      }

      console.log('Database seeding completed');
    } catch (error) {
      console.error('Database seeding failed:', error);
      throw error;
    }
  }

  // Заполнение таблицы навыков начальными данными
  static async seedSkills(): Promise<void> {
    const skills = [
      // Техника
      {
        name: 'Ведение мяча',
        category: 'Техника',
        description: 'Умение контролировать мяч во время движения',
      },
      { name: 'Пас', category: 'Техника', description: 'Точная передача мяча teammate' },
      { name: 'Удар', category: 'Техника', description: 'Нанесение ударов по мячу' },
      { name: 'Захват мяча', category: 'Техника', description: 'Остановка и контроль мяча' },
      { name: 'Удар головой', category: 'Техника', description: 'Нанесение ударов головой' },
      { name: 'Дриблинг', category: 'Техника', description: 'Обводка соперников' },

      // Тактика
      {
        name: 'Позиционирование',
        category: 'Тактика',
        description: 'Правильное расположение на поле',
      },
      { name: 'Коммуникация', category: 'Тактика', description: 'Взаимодействие с teammates' },
      { name: 'Чтение игры', category: 'Тактика', description: 'Предвидение действий соперника' },
      {
        name: 'Переключение внимания',
        category: 'Тактика',
        description: 'Быстрая реакция на изменения в игре',
      },

      // Физика
      {
        name: 'Выносливость',
        category: 'Физика',
        description: 'Способность выполнять нагрузку длительное время',
      },
      { name: 'Скорость', category: 'Физика', description: 'Быстрота передвижения' },
      {
        name: 'Ловкость',
        category: 'Физика',
        description: 'Способность быстро менять направление движения',
      },
      { name: 'Сила', category: 'Физика', description: 'Физическая мощь игрока' },
      { name: 'Гибкость', category: 'Физика', description: 'Амплитуда движений' },
      { name: 'Реакция', category: 'Физика', description: 'Скорость ответной реакции' },

      // Психология
      {
        name: 'Концентрация',
        category: 'Психология',
        description: 'Способность сосредоточиться на задаче',
      },
      { name: 'Уверенность', category: 'Психология', description: 'Вера в свои силы' },
      {
        name: 'Стрессоустойчивость',
        category: 'Психология',
        description: 'Способность сохранять спокойствие в напряженной ситуации',
      },
      { name: 'Мотивация', category: 'Психология', description: 'Желание достигать целей' },
      { name: 'Лидерство', category: 'Психология', description: 'Способность вести за собой' },
      { name: 'Дисциплина', category: 'Психология', description: 'Следование правилам и режиму' },

      // Взаимодействие
      {
        name: 'Работа в команде',
        category: 'Взаимодействие',
        description: 'Эффективное взаимодействие с teammates',
      },
      { name: 'Поддержка', category: 'Взаимодействие', description: 'Помощь teammates' },
      {
        name: 'Соперничество',
        category: 'Взаимодействие',
        description: 'Здоровое соревнование с teammates',
      },
      {
        name: 'Уважение',
        category: 'Взаимодействие',
        description: 'Отношение к teammates и соперникам',
      },
      {
        name: 'Ответственность',
        category: 'Взаимодействие',
        description: 'Выполнение своих обязанностей',
      },
    ];

    for (const skill of skills) {
      await mysqlQuery('INSERT INTO skills (name, category, description) VALUES (?, ?, ?)', [
        skill.name,
        skill.category,
        skill.description,
      ]);
    }
  }
}
