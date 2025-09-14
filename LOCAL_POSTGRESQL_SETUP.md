# Настройка локальной разработки с PostgreSQL

## Обзор

Это руководство поможет вам настроить локальную среду разработки с PostgreSQL для приложения GoalSchool.

## Требования

- Node.js 18.x или выше
- PostgreSQL 16.4
- npm 9.x или выше

## Установка PostgreSQL

### Windows

1. Скачайте установщик PostgreSQL с [официального сайта](https://www.postgresql.org/download/windows/)
2. Запустите установщик и следуйте инструкциям
3. Во время установки запомните:
   - Пароль для пользователя postgres (по умолчанию: postgres)
   - Порт (по умолчанию: 5432)

### macOS

```bash
# Установка через Homebrew
brew install postgresql

# Запуск PostgreSQL
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

### 1. Создание базы данных

#### Windows/macOS/Linux:

```bash
# Подключение к PostgreSQL как суперпользователь
sudo -u postgres psql

# Или на Windows:
# Откройте pgAdmin или используйте командную строку
# psql -U postgres
```

```sql
-- Создание базы данных
CREATE DATABASE goalschool_dev;

-- Создание пользователя (опционально)
CREATE USER goalschool_user WITH PASSWORD 'goalschool_pass';

-- Назначение привилегий
GRANT ALL PRIVILEGES ON DATABASE goalschool_dev TO goalschool_user;

-- Выход из psql
\q
```

### 2. Настройка переменных окружения

Создайте файл `.env` в корне проекта на основе `.env.example`:

```bash
cp .env.example .env
```

Откройте файл `.env` и убедитесь, что параметры подключения корректны:

```env
# PostgreSQL Database Configuration for Development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/goalschool_dev
DB_HOST=localhost
DB_PORT=5432
DB_NAME=goalschool_dev
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false

# Application Configuration
NODE_ENV=development
PORT=3000

# Security
JWT_SECRET=development_jwt_secret
BCRYPT_SALT_ROUNDS=10
```

Если вы создали отдельного пользователя, измените параметры:

```env
DATABASE_URL=postgresql://goalschool_user:goalschool_pass@localhost:5432/goalschool_dev
DB_USER=goalschool_user
DB_PASSWORD=goalschool_pass
```

## Инициализация базы данных

### 1. Проверка подключения

```bash
# Проверка подключения к базе данных
npm run db:check

# Или через скрипт
node scripts/check-database.js
```

### 2. Инициализация таблиц

```bash
# Инициализация базы данных
npm run db:init

# Или через скрипт
node scripts/init-database.js
```

### 3. Создание тестовых данных

```bash
# Создание тестовых пользователей
npm run db:create-test-users

# Или через скрипт
node scripts/create-test-users.js
```

## Запуск приложения

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск в режиме разработки

```bash
# Запуск приложения в режиме разработки
npm start

# Или для веб-версии
npm run web
```

### 3. Запуск сервера для продакшн

```bash
# Сборка веб-версии
npm run build

# Запуск сервера
npm run app:start

# Или через node
node server.js
```

## Инструменты разработки

### 1. pgAdmin

pgAdmin - графический инструмент для управления PostgreSQL:

1. Скачайте и установите [pgAdmin](https://www.pgadmin.org/download/)
2. Откройте pgAdmin
3. Создайте новое подключение:
   - Host: localhost
   - Port: 5432
   - Username: postgres (или ваш пользователь)
   - Password: ваш пароль

### 2. Команды psql

Полезные команды для работы с PostgreSQL через командную строку:

```bash
# Подключение к базе данных
psql -U postgres -d goalschool_dev

# Список баз данных
\l

# Подключение к базе данных
\c goalschool_dev

# Список таблиц
\dt

# Описание таблицы
\d table_name

# Выход
\q
```

## Отладка и устранение неполадок

### 1. Ошибка подключения

Если возникает ошибка подключения:

1. Проверьте, запущен ли PostgreSQL:

   ```bash
   # Windows (в PowerShell от имени администратора)
   net start postgresql-x64-16

   # macOS
   brew services start postgresql

   # Linux
   sudo systemctl start postgresql
   ```

2. Проверьте параметры подключения в `.env` файле

3. Проверьте, что порт 5432 не блокируется брандмауэром

### 2. Ошибка аутентификации

Если возникает ошибка аутентификации:

1. Проверьте пароль пользователя в `.env` файле
2. Убедитесь, что пользователь существует в PostgreSQL
3. Проверьте настройки аутентификации в `pg_hba.conf`

### 3. Ошибка инициализации таблиц

Если возникает ошибка при инициализации таблиц:

1. Проверьте логи PostgreSQL
2. Убедитесь, что у пользователя есть права на создание таблиц
3. Проверьте, что база данных существует

## Полезные скрипты

### 1. Проверка среды

```bash
# Проверка переменных окружения
npm run app:check-env

# Или через скрипт
node scripts/check-env.js
```

### 2. Полная инициализация

```bash
# Полная инициализация приложения
npm run app:init

# Или через скрипт
node scripts/init-app.js
```

### 3. Резервное копирование

```bash
# Создание резервной копии
npm run db:backup

# Или через скрипт
node scripts/backup-database.js
```

### 4. Очистка базы данных (для разработки)

```bash
# Очистка базы данных (только для разработки!)
npm run db:clear

# Или через скрипт
node scripts/clear-database.js
```

## Рекомендации

1. **Безопасность**: Не используйте пароли разработки в продакшн среде
2. **Резервное копирование**: Регулярно создавайте резервные копии базы данных
3. **Обновления**: Регулярно обновляйте PostgreSQL и зависимости
4. **Мониторинг**: Следите за производительностью базы данных
5. **Документация**: Документируйте изменения в структуре базы данных
