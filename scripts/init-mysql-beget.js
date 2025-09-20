// scripts/init-mysql-beget.js
// Скрипт для инициализации базы данных MySQL на Beget

// Загрузка переменных окружения
require('../src/config/loadEnv');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { initializeMySQLDatabase } = require('../src/config/mysql.js');

async function initializeDatabase() {
  console.log('Инициализация базы данных MySQL на Beget...');
  console.log('Параметры подключения:');
  console.log('- Хост:', process.env.DB_HOST || 'localhost');
  console.log('- Порт:', process.env.DB_PORT || '3306');
  console.log('- База данных:', process.env.DB_NAME || 'goalschool');
  console.log('- Пользователь:', process.env.DB_USER || 'root');
  console.log('- Пароль: *** (скрыт для безопасности)');
  console.log('');

  try {
    await initializeMySQLDatabase();
    console.log('✅ Таблицы базы данных MySQL успешно созданы на Beget');

    // Заполнение таблицы навыков начальными данными (если нужно)
    console.log('✅ Инициализация базы данных завершена успешно');
    console.log('');
    console.log('Следующие шаги:');
    console.log('1. Перезапустите Node.js приложение в панели Beget');
    console.log('2. Откройте сайт в браузере и проверьте работу приложения');
    console.log('3. Создайте тестовых пользователей через интерфейс приложения');
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка инициализации базы данных MySQL:', error.message);
    console.error('Дополнительная информация:');
    console.error('- Проверьте правильность параметров подключения в переменных окружения');
    console.error('- Убедитесь, что у пользователя есть права на создание таблиц');
    console.error('- Проверьте логи MySQL на наличие ошибок');
    process.exit(1);
  }
}

// Запуск инициализации
initializeDatabase();
