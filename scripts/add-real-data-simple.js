// Скрипт для добавления реальных данных в базу данных
require('../src/config/loadEnv');

const mysql = require('mysql2/promise');

// Данные филиалов
const branches = [
  {
    id: 'branch_1',
    name: 'Футбольная школа "Арсенал" Жулебино',
    address: 'г. Москва, район Жулебино',
    phone: '+7 (495) 123-45-67',
    email: 'zhulebino@arsenal-school.ru',
  },
  {
    id: 'branch_2',
    name: 'Футбольная школа "Арсенал" Дмитриевское',
    address: 'г. Москва, район Дмитриевское',
    phone: '+7 (495) 234-56-78',
    email: 'dmitrievskoe@arsenal-school.ru',
  },
];

// Данные тренера
const trainer = {
  email: 'zakhar.trainer@arsenal.ru',
  name: 'Захар (тренер)',
  role: 'coach',
};

// Данные учеников
const students = [
  // Ученики филиала Жулебино
  {
    email: 'makar.voropaev@student.ru',
    name: 'Воропаев Макар Андреевич',
    role: 'child',
    dateOfBirth: '2015-04-23',
  },
  {
    email: 'varvara.voropaeva@student.ru',
    name: 'Воропаева Варвара Андреевна',
    role: 'child',
    dateOfBirth: '2015-04-23',
  },
  // Ученики филиала Дмитриевского
  {
    email: 'sergey.gudkov@student.ru',
    name: 'Гудков Сергей Дмитриевич',
    role: 'child',
    dateOfBirth: '2014-03-05',
  },
  {
    email: 'maksim.achin@student.ru',
    name: 'Ачин Максим Сергеевич',
    role: 'child',
    dateOfBirth: '2014-02-18',
  },
];

async function addRealData() {
  try {
    // Создаем подключение к базе данных
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Подключение к базе данных установлено');

    // Проверяем существующие таблицы
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Существующие таблицы:', tables);

    // Добавляем филиалы (если таблица существует)
    try {
      console.log('Добавляем филиалы...');
      for (const branch of branches) {
        const [result] = await connection.execute(
          'INSERT INTO branches (id, name, address, phone, email) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), address=VALUES(address), phone=VALUES(phone), email=VALUES(email)',
          [branch.id, branch.name, branch.address, branch.phone, branch.email]
        );
        console.log(`  ✅ Филиал "${branch.name}" добавлен/обновлен`);
      }
    } catch (error) {
      console.log('  ℹ️  Таблица branches не существует или другая ошибка:', error.message);
    }

    // Добавляем тренера
    console.log('Добавляем тренера...');
    const trainerPassword = 'trainer123'; // Пароль для тренера
    const [trainerResult] = await connection.execute(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), role=VALUES(role)',
      [trainer.email, trainerPassword, trainer.name, trainer.role]
    );
    console.log(`  ✅ Тренер "${trainer.name}" добавлен`);

    // Добавляем учеников
    console.log('Добавляем учеников...');
    for (const student of students) {
      const studentPassword = 'student123'; // Пароль для учеников
      const [studentResult] = await connection.execute(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), role=VALUES(role)',
        [student.email, studentPassword, student.name, student.role]
      );
      console.log(`  ✅ Ученик "${student.name}" добавлен`);
    }

    // Закрываем соединение
    await connection.end();
    console.log('✅ Все данные успешно добавлены в базу данных');

    console.log('\nТестовые учетные данные:');
    console.log('========================');
    console.log(`Тренер: ${trainer.email} / trainer123`);
    for (const student of students) {
      console.log(`Ученик: ${student.email} / student123`);
    }
  } catch (error) {
    console.error('❌ Ошибка при добавлении данных:', error);
  }
}

// Запускаем скрипт
addRealData();
