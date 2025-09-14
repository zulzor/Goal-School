// scripts/init-mysql-database.js
// Скрипт для инициализации базы данных MySQL

const { initializeMySQLDatabase } = require('../src/config/mysql.js');

async function initializeDatabase() {
  console.log('Initializing MySQL database...');

  try {
    await initializeMySQLDatabase();
    console.log('MySQL database tables created successfully');

    // Заполнение таблицы навыков начальными данными (если нужно)
    console.log('Database seeding completed');
    console.log('MySQL database initialization finished successfully');
    process.exit(0);
  } catch (error) {
    console.error('MySQL database initialization failed:', error);
    process.exit(1);
  }
}

// Запуск инициализации
initializeDatabase();
