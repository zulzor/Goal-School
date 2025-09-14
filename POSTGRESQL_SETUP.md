# Настройка PostgreSQL для приложения Goal School

## Установка PostgreSQL

### Windows

1. Скачайте установщик с [официального сайта PostgreSQL](https://www.postgresql.org/download/windows/)
2. Запустите установщик и следуйте инструкциям
3. Запомните пароль для пользователя postgres - он понадобится позже

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

## Создание базы данных

1. Подключитесь к PostgreSQL:

   ```bash
   psql -U postgres
   ```

2. Создайте базу данных для приложения:

   ```sql
   CREATE DATABASE goalschool;
   ```

3. Создайте пользователя для приложения (опционально):

   ```sql
   CREATE USER goalschool_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE goalschool TO goalschool_user;
   ```

4. Выйдите из psql:
   ```sql
   \q
   ```

## Настройка переменных окружения

Создайте файл `.env` в корне проекта со следующим содержимым:

```env
# PostgreSQL Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/goalschool
DB_HOST=localhost
DB_PORT=5432
DB_NAME=goalschool
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false

# Application Configuration
NODE_ENV=development
PORT=3000
```

## Инициализация базы данных

После настройки переменных окружения выполните инициализацию базы данных:

```bash
npm run db:init
```

Эта команда создаст все необходимые таблицы и заполнит их начальными данными.

## Проверка подключения

Для проверки подключения к базе данных выполните:

```bash
npm run db:check
```

## Резервное копирование и восстановление

### Создание резервной копии

```bash
npm run db:backup
```

### Восстановление из резервной копии

``bash
npm run db:restore

```

## Очистка базы данных (только для разработки)

``bash
npm run db:clear
```

## Миграция с локального хранилища на PostgreSQL

1. Убедитесь, что PostgreSQL настроен и база данных инициализирована
2. В приложении перейдите в "Админ-панель" → "База данных"
3. Выберите "PostgreSQL" в качестве типа базы данных
4. Проверьте подключение с помощью кнопки "Проверить подключение"
5. Создайте тестового пользователя для проверки работы

## Решение常见ых проблем

### Ошибка "password authentication failed"

Убедитесь, что пароль в переменных окружения совпадает с паролем пользователя PostgreSQL.

### Ошибка "database does not exist"

Убедитесь, что база данных создана в PostgreSQL.

### Ошибка "connection refused"

Проверьте, что PostgreSQL запущен и слушает правильный порт (по умолчанию 5432).

## Безопасность

1. Не храните файл `.env` в системе контроля версий
2. Используйте сильные пароли для пользователей базы данных
3. В production окружении используйте SSL-подключение к базе данных
4. Ограничьте права пользователей базы данных до необходимого минимума

## Поддержка

Если у вас возникли проблемы с настройкой или использованием PostgreSQL, обратитесь к документации или создайте issue в репозитории проекта.
