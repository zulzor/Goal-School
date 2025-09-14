# Локальная разработка с PostgreSQL

## Требования

- Node.js 16+
- PostgreSQL 16.4
- npm или yarn
- Docker (опционально)

## Установка PostgreSQL

### Windows

1. Скачайте установщик с [официального сайта PostgreSQL](https://www.postgresql.org/download/windows/)
2. Запустите установщик и следуйте инструкциям
3. Запомните пароль для пользователя postgres

### macOS

```bash
# Используя Homebrew
brew install postgresql

# Запустите PostgreSQL
brew services start postgresql
```

### Linux (Ubuntu/Debian)

```bash
# Установка PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Запуск PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Настройка базы данных

### Создание базы данных

1. Подключитесь к PostgreSQL:

   ```bash
   psql -U postgres
   ```

2. Создайте базу данных для разработки:

   ```sql
   CREATE DATABASE goalschool_dev;
   ```

3. Создайте пользователя для приложения:

   ```sql
   CREATE USER dev_user WITH PASSWORD 'dev_password';
   GRANT ALL PRIVILEGES ON DATABASE goalschool_dev TO dev_user;
   ```

4. Выйдите из psql:
   ```sql
   \q
   ```

## Конфигурация приложения

### Создание файла .env

Создайте файл `.env` в корне проекта:

```env
# Development environment configuration
NODE_ENV=development
PORT=3000

# PostgreSQL Database Configuration for Development
DATABASE_URL=postgresql://dev_user:dev_password@localhost:5432/goalschool_dev
DB_HOST=localhost
DB_PORT=5432
DB_NAME=goalschool_dev
DB_USER=dev_user
DB_PASSWORD=dev_password
DB_SSL=false

# Security
JWT_SECRET=development_jwt_secret
BCRYPT_SALT_ROUNDS=10
```

### Проверка конфигурации

Проверьте переменные окружения:

```bash
node scripts/check-env.js
```

## Инициализация базы данных

Выполните инициализацию базы данных:

```bash
npm run db:init
```

Эта команда:

1. Создаст все необходимые таблицы
2. Заполнит таблицы начальными данными
3. Создаст индексы для оптимизации запросов

## Запуск приложения

### Без Docker

1. Установите зависимости:

   ```bash
   npm install
   ```

2. Запустите приложение:
   ```bash
   npm start
   ```

### С Docker

1. Запустите все сервисы:

   ```bash
   docker-compose up
   ```

2. Приложение будет доступно по адресу: http://localhost:3000

## Разработка с базой данных

### Миграция данных

Если у вас уже есть данные в локальном хранилище, вы можете перенести их в PostgreSQL:

1. Убедитесь, что приложение использует локальное хранилище
2. Создайте скрипт миграции
3. Выполните миграцию данных

### Тестирование подключения

Проверьте подключение к базе данных:

```bash
npm run db:check
```

### Резервное копирование

Создайте резервную копию базы данных:

```bash
npm run db:backup
```

### Очистка базы данных

Очистите базу данных (ТОЛЬКО ДЛЯ РАЗРАБОТКИ!):

```bash
npm run db:clear
```

## Отладка

### Логи базы данных

Проверьте логи PostgreSQL:

```bash
# Linux/macOS
tail -f /usr/local/var/log/postgres.log

# Или через Docker
docker-compose logs postgres
```

### Логи приложения

Логи приложения выводятся в консоль при запуске:

```bash
npm start
```

### Отладка SQL запросов

Все SQL запросы логгируются в консоль разработчика. Вы можете включить дополнительную отладку:

```env
# Добавьте в .env файл
DEBUG=sql*
```

## Тестирование

### Unit тесты

Запустите unit тесты:

```bash
npm test
```

### Интеграционные тесты

Интеграционные тесты используют тестовую базу данных:

```bash
# Создайте тестовую базу данных
createdb goalschool_test

# Запустите тесты
npm test
```

## Решение常见ых проблем

### Ошибка "password authentication failed"

1. Проверьте пароль в файле `.env`
2. Убедитесь, что пользователь существует в PostgreSQL
3. Перезапустите PostgreSQL сервер

### Ошибка "database does not exist"

1. Создайте базу данных:

   ```sql
   CREATE DATABASE goalschool_dev;
   ```

2. Проверьте имя базы данных в файле `.env`

### Ошибка "connection refused"

1. Убедитесь, что PostgreSQL запущен:

   ```bash
   # Linux/macOS
   pg_isready

   # Windows
   pg_isready.exe
   ```

2. Проверьте порт в файле `.env`

### Ошибка "relation does not exist"

1. Выполните инициализацию базы данных:

   ```bash
   npm run db:init
   ```

2. Проверьте логи инициализации на наличие ошибок

### Медленные запросы

1. Проверьте, созданы ли индексы:

   ```bash
   npm run db:check
   ```

2. Оптимизируйте запросы в сервисах

## Best Practices

### Работа с базой данных

1. Используйте транзакции для связанных операций
2. Создавайте индексы для часто используемых полей
3. Ограничивайте количество возвращаемых записей
4. Используйте EXPLAIN для анализа запросов

### Разработка

1. Тестируйте изменения с базой данных локально
2. Создавайте резервные копии перед крупными изменениями
3. Используйте миграции для изменения структуры базы данных
4. Документируйте изменения в базе данных

### Безопасность

1. Не храните пароли в коде
2. Используйте разные учетные данные для разработки и production
3. Регулярно обновляйте PostgreSQL
4. Ограничивайте права пользователей базы данных
