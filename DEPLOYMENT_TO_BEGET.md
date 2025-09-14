# Развертывание приложения на Beget

## Подготовка к развертыванию

### 1. Подготовка файлов приложения

1. Соберите веб-версию приложения:

   ```bash
   npm run build
   ```

2. Архивируйте содержимое папки `web-build` в ZIP-архив

### 2. Подготовка базы данных на Beget

Приложение поддерживает два типа облачных баз данных:

1. PostgreSQL 16.4 (платная опция)
2. MySQL 8.0 (бесплатная опция)

#### Вариант 1: Использование MySQL 8.0 (рекомендуется)

1. В панели управления Beget перейдите в раздел "Базы данных"
2. Найдите вашу существующую базу данных MySQL 8.0
3. Запишите параметры подключения:
   - Хост: localhost
   - Порт: 3306
   - Имя базы данных: mrzulonz_db_ars
   - Имя пользователя: mrzulonz_db_ars
   - Пароль: ваш пароль

#### Вариант 2: Создание новой базы данных PostgreSQL (платная опция)

1. В панели управления Beget перейдите в раздел "Базы данных"
2. Нажмите "Добавить базу данных"
3. Выберите тип "PostgreSQL 16.4"
4. Укажите имя базы данных (например, `goalschool`)
5. Задайте имя пользователя и пароль
6. Нажмите "Создать"

После создания базы данных вы получите параметры подключения:

- Хост
- Порт
- Имя базы данных
- Имя пользователя
- Пароль

## Загрузка файлов на сервер

### Вариант 1: Через файловый менеджер Beget

1. Войдите в панель управления Beget
2. Перейдите в раздел "Сайты"
3. Выберите нужный сайт
4. Перейдите в файловый менеджер сайта
5. Загрузите подготовленный ZIP-архив
6. Распакуйте архив в корневую директорию сайта

### Вариант 2: Через FTP/SFTP

1. Получите данные для подключения в панели управления Beget
2. Используйте FTP-клиент (например, FileZilla) для загрузки файлов
3. Загрузите содержимое папки `web-build` в корневую директорию сайта

## Настройка Node.js приложения на Beget

### 1. В панели управления Beget

1. Перейдите в раздел "Сайты"
2. Выберите ваш сайт
3. Перейдите на вкладку "Node.js"
4. Укажите точку входа (например, `server.js`)
5. Установите необходимые зависимости:

   ```bash
   # Для MySQL
   npm install express mysql2 dotenv bcryptjs

   # Для PostgreSQL (если используется)
   npm install express pg dotenv bcryptjs
   ```

### 2. Настройка переменных окружения на Beget

1. В панели управления Beget перейдите в раздел "Сайты"
2. Выберите ваш сайт
3. Перейдите на вкладку "Node.js"
4. В разделе "Переменные окружения" добавьте переменные:

#### Для MySQL (рекомендуется):

```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=mrzulonz_db_ars
MYSQL_USER=mrzulonz_db_ars
MYSQL_PASSWORD=ваш_реальный_пароль_от_базы_данных
NODE_ENV=production
PORT=3000
JWT_SECRET=ваш_секретный_ключ_jwt
BCRYPT_SALT_ROUNDS=10
```

#### Для PostgreSQL (если используется):

```
DATABASE_URL=postgresql://имя_пользователя:пароль@хост:порт/имя_базы_данных
DB_HOST=хост_из_панели_управления
DB_PORT=порт_из_панели_управления
DB_NAME=имя_базы_данных
DB_USER=имя_пользователя
DB_PASSWORD=пароль
NODE_ENV=production
PORT=3000
JWT_SECRET=ваш_секретный_ключ_jwt
BCRYPT_SALT_ROUNDS=10
```

## Инициализация базы данных

### 1. Подключение к базе данных через SSH

1. В панели управления Beget перейдите в раздел "SSH"
2. Включите SSH-доступ
3. Подключитесь по SSH:
   ```bash
   ssh имя_пользователя@хост_ssh
   ```

### 2. Загрузка и выполнение скрипта инициализации

#### Для MySQL:

1. Перейдите в директорию вашего сайта:

   ```bash
   cd /home/m/mrzulonz/ваш_домен.ru/public_html
   ```

2. Выполните инициализацию базы данных:
   ```bash
   node scripts/init-mysql-beget.js
   ```

#### Для PostgreSQL:

1. Скопируйте файлы инициализации на сервер:

   ```bash
   scp -r src/config/db.ts имя_пользователя@хост_ssh:~
   scp -r src/services/DatabaseInitService.ts имя_пользователя@хост_ssh:~
   scp -r scripts/init-database.js имя_пользователя@хост_ssh:~
   ```

2. На сервере выполните инициализацию:
   ```bash
   node init-database.js
   ```

## Создание серверного файла

Создайте файл `server.js` в корне проекта:

```javascript
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'web-build')));

// API endpoint for health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API endpoint for database connection test
app.get('/api/db-test', async (req, res) => {
  try {
    let isConnected = false;
    let dbType = 'none';

    // Проверяем MySQL, если переменные окружения заданы
    if (process.env.MYSQL_HOST && process.env.MYSQL_DATABASE) {
      const { checkMySQLConnection } = require('./src/config/mysql');
      isConnected = await checkMySQLConnection();
      dbType = 'MySQL';
    }
    // Иначе проверяем PostgreSQL
    else if (process.env.DATABASE_URL) {
      const { checkDatabaseConnection } = require('./src/config/db');
      isConnected = await checkDatabaseConnection();
      dbType = 'PostgreSQL';
    }

    res.json({
      status: 'Database connection test completed',
      database: dbType,
      connected: isConnected,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: 'Database connection failed',
      details: error.message,
    });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web-build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Database test: http://localhost:${PORT}/api/db-test`);
});
```

## Настройка домена

1. В панели управления Beget перейдите в раздел "Домены"
2. Добавьте ваш домен
3. Настройте DNS-записи согласно инструкции Beget
4. В разделе "Сайты" привяжите домен к вашему сайту

## Тестирование

1. Откройте ваш сайт в браузере
2. Проверьте, что приложение загружается корректно
3. Проверьте работу всех функций (регистрация, вход, навигация)
4. Убедитесь, что данные сохраняются в базе данных

## Обслуживание и мониторинг

### Логи приложения

1. В панели управления Beget перейдите в раздел "Сайты"
2. Выберите ваш сайт
3. Перейдите на вкладку "Node.js"
4. Просматривайте логи в разделе "Логи"

### Резервное копирование

1. Регулярно создавайте резервные копии базы данных через панель управления Beget
2. Храните резервные копии в безопасном месте

### Обновление приложения

1. Загрузите новые файлы через файловый менеджер Beget
2. Перезапустите Node.js приложение в панели Beget

## Устранение неполадок

### Приложение не загружается

1. Проверьте логи Node.js приложения
2. Убедитесь, что все зависимости установлены
3. Проверьте правильность переменных окружения

### Ошибка подключения к базе данных

1. Проверьте параметры подключения в переменных окружения
2. Убедитесь, что база данных доступна
3. Проверьте логи базы данных

### Ошибка инициализации базы данных

1. Проверьте, что таблицы созданы корректно
2. Убедитесь, что у пользователя есть необходимые права
3. Проверьте логи инициализации

## Безопасность

1. Используйте HTTPS для вашего сайта
2. Регулярно обновляйте зависимости
3. Не храните чувствительные данные в открытом виде
4. Ограничьте доступ к панели управления

## Поддержка

Если у вас возникли проблемы с развертыванием приложения на Beget, обратитесь в службу поддержки Beget или создайте issue в репозитории проекта.
