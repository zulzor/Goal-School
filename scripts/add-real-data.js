// Скрипт для добавления реальных данных в базу данных
require('../src/config/loadEnv');
const { initializeMySQLDatabase } = require('../src/config/mysql');
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
  branchId: 'branch_1', // По умолчанию привязываем к первому филиалу
};

// Данные учеников
const students = [
  // Ученики филиала Жулебино
  {
    email: 'makar.voropaev@student.ru',
    name: 'Воропаев Макар Андреевич',
    role: 'child',
    branchId: 'branch_1',
    dateOfBirth: '2015-04-23',
  },
  {
    email: 'varvara.voropaeva@student.ru',
    name: 'Воропаева Варвара Андреевна',
    role: 'child',
    branchId: 'branch_1',
    dateOfBirth: '2015-04-23',
  },
  // Ученики филиала Дмитриевского
  {
    email: 'sergey.gudkov@student.ru',
    name: 'Гудков Сергей Дмитриевич',
    role: 'child',
    branchId: 'branch_2',
    dateOfBirth: '2014-03-05',
  },
  {
    email: 'maksim.achin@student.ru',
    name: 'Ачин Максим Сергеевич',
    role: 'child',
    branchId: 'branch_2',
    dateOfBirth: '2014-02-18',
  },
];

// Данные родителей
const parents = [
  {
    email: 'andrey.voropaev@parent.ru',
    name: 'Воропаев Андрей (родитель)',
    role: 'parent',
    branchId: 'branch_1',
    childrenIds: [], // Будем заполнять после создания учеников
  },
  {
    email: 'sergey.gudkov@parent.ru',
    name: 'Гудков Сергей (родитель)',
    role: 'parent',
    branchId: 'branch_2',
    childrenIds: [], // Будем заполнять после создания учеников
  },
  {
    email: 'maksim.achin@parent.ru',
    name: 'Ачин Сергей (родитель)',
    role: 'parent',
    branchId: 'branch_2',
    childrenIds: [], // Будем заполнять после создания учеников
  },
];

// Расписание занятий
const schedule = [
  // Расписание для Жулебино
  {
    title: 'Тренировка (Жулебино)',
    description: 'Групповая тренировка',
    date: '2025-09-16', // Вторник
    time: '18:00:00',
    endTime: '19:00:00',
    location: 'Филиал Жулебино',
    branchId: 'branch_1',
    coachId: null, // Будем заполнять после создания тренера
  },
  {
    title: 'Тренировка (Жулебино)',
    description: 'Групповая тренировка',
    date: '2025-09-18', // Четверг
    time: '18:00:00',
    endTime: '19:00:00',
    location: 'Филиал Жулебино',
    branchId: 'branch_1',
    coachId: null, // Будем заполнять после создания тренера
  },
  {
    title: 'Тренировка (Жулебино)',
    description: 'Групповая тренировка',
    date: '2025-09-20', // Суббота
    time: '18:00:00',
    endTime: '19:00:00',
    location: 'Филиал Жулебино',
    branchId: 'branch_1',
    coachId: null, // Будем заполнять после создания тренера
  },
  // Расписание для Дмитриевского
  {
    title: 'Тренировка (Дмитриевское)',
    description: 'Групповая тренировка',
    date: '2025-09-15', // Понедельник
    time: '17:30:00',
    endTime: '18:30:00',
    location: 'Филиал Дмитриевское',
    branchId: 'branch_2',
    coachId: null, // Будем заполнять после создания тренера
  },
  {
    title: 'Тренировка (Дмитриевское)',
    description: 'Групповая тренировка',
    date: '2025-09-17', // Среда
    time: '17:30:00',
    endTime: '18:30:00',
    location: 'Филиал Дмитриевское',
    branchId: 'branch_2',
    coachId: null, // Будем заполнять после создания тренера
  },
  {
    title: 'Тренировка (Дмитриевское)',
    description: 'Групповая тренировка',
    date: '2025-09-19', // Пятница
    time: '17:30:00',
    endTime: '18:30:00',
    location: 'Филиал Дмитриевское',
    branchId: 'branch_2',
    coachId: null, // Будем заполнять после создания тренера
  },
  // Сегодняшняя тренировка
  {
    title: 'Тренировка (Дмитриевское)',
    description: 'Групповая тренировка',
    date: '2025-09-12', // Сегодня
    time: '17:30:00',
    endTime: '18:30:00',
    location: 'Филиал Дмитриевское',
    branchId: 'branch_2',
    coachId: null, // Будем заполнять после создания тренера
  },
];

// Результаты учеников
const studentResults = [
  // Результаты Сергея Гудкова
  {
    studentId: null, // Будем заполнять после создания учеников
    date: '2025-09-08',
    results: {
      running: '10 минут',
      pullUps: '3 раза',
      ladder: '7.50 м/с',
      hoops: '13.70 м/с',
      snake: '47.60 м/с',
      pushUps: '10',
      squats: '10',
      passes: '17',
    },
  },
  {
    studentId: null, // Будем заполнять после создания учеников
    date: '2025-09-10',
    results: {
      running: '10 минут',
      pullUps: '3 раза',
      ladder: '10.37 м/с',
      hoops: '13.70 м/с',
      snake: '32 сек',
      pushUps: '10',
      squats: '10',
      passes: '17',
    },
  },
  // Результаты Максима Ачина
  {
    studentId: null, // Будем заполнять после создания учеников
    date: '2025-09-08',
    results: {
      running: '10 минут',
      pullUps: '3 раза',
      ladder: '13.80 м/с',
      hoops: '11 сек',
      snake: '27.64 м/с',
      pushUps: '10',
      squats: '10',
      passes: '17',
    },
  },
  {
    studentId: null, // Будем заполнять после создания учеников
    date: '2025-09-10',
    results: {
      running: '10 минут',
      pullUps: '3 раза',
      ladder: '29 сек',
      hoops: '11 сек',
      snake: '32 сек',
      pushUps: '10',
      squats: '10',
      passes: '17',
    },
  },
];

async function addRealData() {
  try {
    // Инициализируем базу данных
    await initializeMySQLDatabase();

    // Создаем подключение к базе данных
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('✅ Подключение к базе данных установлено');

    // Добавляем филиалы
    console.log('Добавляем филиалы...');
    for (const branch of branches) {
      const [result] = await connection.execute(
        'INSERT INTO branches (id, name, address, phone, email) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), address=VALUES(address), phone=VALUES(phone), email=VALUES(email)',
        [branch.id, branch.name, branch.address, branch.phone, branch.email]
      );
      console.log(`  ✅ Филиал "${branch.name}" добавлен/обновлен`);
    }

    // Добавляем тренера
    console.log('Добавляем тренера...');
    const trainerPassword = await bcryptHash('trainer123'); // Пароль для тренера
    const [trainerResult] = await connection.execute(
      'INSERT INTO users (email, password, name, role, branch_id) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), role=VALUES(role), branch_id=VALUES(branch_id)',
      [trainer.email, trainerPassword, trainer.name, trainer.role, trainer.branchId]
    );
    const trainerId =
      trainerResult.insertId ||
      (await connection.execute('SELECT id FROM users WHERE email = ?', [trainer.email]))[0][0].id;
    console.log(`  ✅ Тренер "${trainer.name}" добавлен`);

    // Добавляем учеников
    console.log('Добавляем учеников...');
    const studentIds = {};
    for (const student of students) {
      const studentPassword = await bcryptHash('student123'); // Пароль для учеников
      const [studentResult] = await connection.execute(
        'INSERT INTO users (email, password, name, role, branch_id, date_of_birth) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), role=VALUES(role), branch_id=VALUES(branch_id), date_of_birth=VALUES(date_of_birth)',
        [
          student.email,
          studentPassword,
          student.name,
          student.role,
          student.branchId,
          student.dateOfBirth,
        ]
      );
      const studentId =
        studentResult.insertId ||
        (await connection.execute('SELECT id FROM users WHERE email = ?', [student.email]))[0][0]
          .id;
      studentIds[student.email] = studentId;
      console.log(`  ✅ Ученик "${student.name}" добавлен`);
    }

    // Обновляем данные результатов учеников с их ID
    for (const result of studentResults) {
      if (result.date === '2025-09-08' || result.date === '2025-09-10') {
        // Определяем, чьи это результаты по дате
        if (result.results.ladder === '7.50 м/с' || result.results.ladder === '10.37 м/с') {
          result.studentId = studentIds['sergey.gudkov@student.ru'];
        } else {
          result.studentId = studentIds['maksim.achin@student.ru'];
        }
      }
    }

    // Добавляем результаты учеников
    console.log('Добавляем результаты учеников...');
    for (const result of studentResults) {
      if (result.studentId) {
        const [resultResult] = await connection.execute(
          'INSERT INTO student_results (student_id, date, results) VALUES (?, ?, ?)',
          [result.studentId, result.date, JSON.stringify(result.results)]
        );
        console.log(`  ✅ Результаты ученика добавлены на ${result.date}`);
      }
    }

    // Обновляем расписание с ID тренера
    for (const item of schedule) {
      item.coachId = trainerId;
    }

    // Добавляем расписание
    console.log('Добавляем расписание...');
    for (const item of schedule) {
      const [scheduleResult] = await connection.execute(
        'INSERT INTO schedule (title, description, date, time, end_time, location, branch_id, coach_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          item.title,
          item.description,
          item.date,
          item.time,
          item.endTime,
          item.location,
          item.branchId,
          item.coachId,
        ]
      );
      console.log(`  ✅ Расписание "${item.title}" на ${item.date} добавлено`);
    }

    // Закрываем соединение
    await connection.end();
    console.log('✅ Все данные успешно добавлены в базу данных');

    console.log('\nТестовые учетные данные:');
    console.log('========================');
    console.log(`Тренер: ${trainer.email} / trainer123`);
    console.log(`Ученик (Сергей): ${students[2].email} / student123`);
    console.log(`Ученик (Максим): ${students[3].email} / student123`);
    console.log(`Ученик (Макар): ${students[0].email} / student123`);
    console.log(`Ученик (Варвара): ${students[1].email} / student123`);
  } catch (error) {
    console.error('❌ Ошибка при добавлении данных:', error);
  }
}

// Функция для хэширования пароля
async function bcryptHash(password) {
  // В реальном приложении здесь будет использоваться bcrypt
  // Для тестовых данных просто возвращаем пароль в верхнем регистре
  return password.toUpperCase();
}

// Запускаем скрипт
addRealData();
