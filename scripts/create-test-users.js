// scripts/create-test-users.js
// Скрипт для создания тестовых пользователей в MySQL

const { MySQLUserService } = require('../src/services/mysql');

async function createTestUsers() {
  console.log('Создание тестовых пользователей...\n');

  try {
    // Создание тестовых пользователей разных ролей
    const testUsers = [
      {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Администратор',
        role: 'admin',
      },
      {
        email: 'manager@example.com',
        password: 'manager123',
        name: 'Менеджер',
        role: 'manager',
      },
      {
        email: 'coach@example.com',
        password: 'coach123',
        name: 'Тренер',
        role: 'coach',
      },
      {
        email: 'parent@example.com',
        password: 'parent123',
        name: 'Родитель',
        role: 'parent',
      },
      {
        email: 'student@example.com',
        password: 'student123',
        name: 'Ученик',
        role: 'student',
      },
    ];

    for (const userData of testUsers) {
      try {
        // Проверяем, существует ли пользователь
        const existingUser = await MySQLUserService.getUserByEmail(userData.email);

        if (existingUser) {
          console.log(`Пользователь ${userData.email} уже существует`);
        } else {
          // Создаем нового пользователя
          const user = await MySQLUserService.createUser(userData);
          console.log(`Создан пользователь: ${user.email} (${user.role})`);
        }
      } catch (error) {
        console.error(`Ошибка создания пользователя ${userData.email}:`, error.message);
      }
    }

    console.log('\n✅ Создание тестовых пользователей завершено!');
    console.log('\nТестовые учетные записи:');
    console.log('- Администратор: admin@example.com / admin123');
    console.log('- Менеджер: manager@example.com / manager123');
    console.log('- Тренер: coach@example.com / coach123');
    console.log('- Родитель: parent@example.com / parent123');
    console.log('- Ученик: student@example.com / student123');
  } catch (error) {
    console.error('Ошибка при создании тестовых пользователей:', error);
    process.exit(1);
  }
}

// Запуск скрипта
createTestUsers().catch(error => {
  console.error('Ошибка выполнения скрипта:', error);
  process.exit(1);
});
