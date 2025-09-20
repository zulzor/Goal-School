// scripts/clear-database.js
// Скрипт для очистки базы данных (ТОЛЬКО ДЛЯ РАЗРАБОТКИ!)

const { Pool } = require('pg');

// Получаем параметры подключения из переменных окружения
const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  // Или отдельные параметры:
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'goalschool',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

const pool = new Pool(poolConfig);

async function clearDatabase() {
  console.log('WARNING: This will delete all data from the database!');
  console.log('This operation should only be used in development environment.');

  // Спрашиваем подтверждение
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Are you sure you want to continue? Type "YES" to confirm: ', async answer => {
    rl.close();

    if (answer !== 'YES') {
      console.log('Operation cancelled');
      await pool.end();
      process.exit(0);
    }

    if (process.env.NODE_ENV === 'production') {
      console.error('ERROR: This script cannot be run in production environment!');
      await pool.end();
      process.exit(1);
    }

    try {
      const client = await pool.connect();

      try {
        // Отключаем триггеры внешних ключей
        await client.query('SET session_replication_role = replica;');

        // Удаляем все данные из таблиц
        await client.query('TRUNCATE TABLE achievements RESTART IDENTITY CASCADE;');
        await client.query('TRUNCATE TABLE progress RESTART IDENTITY CASCADE;');
        await client.query('TRUNCATE TABLE attendance RESTART IDENTITY CASCADE;');
        await client.query('TRUNCATE TABLE skills RESTART IDENTITY CASCADE;');
        await client.query('TRUNCATE TABLE schedule RESTART IDENTITY CASCADE;');
        await client.query('TRUNCATE TABLE news RESTART IDENTITY CASCADE;');
        await client.query('TRUNCATE TABLE nutrition RESTART IDENTITY CASCADE;');
        await client.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');

        // Включаем триггеры внешних ключей обратно
        await client.query('SET session_replication_role = DEFAULT;');

        console.log('Database cleared successfully!');
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Failed to clear database:', error.message);
      process.exit(1);
    } finally {
      await pool.end();
    }

    process.exit(0);
  });
}

// Запуск очистки
clearDatabase();
