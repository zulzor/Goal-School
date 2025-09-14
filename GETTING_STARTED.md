# Начало работы с приложением Goal School

## Системные требования

- Node.js 16+
- npm или yarn
- PostgreSQL 16.4 (опционально, для облачного хранения данных)
- Git

## Установка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd goal-school
```

### 2. Установка зависимостей

```bash
npm install
```

## Быстрый старт

### Использование локального хранилища (по умолчанию)

1. Инициализация приложения:

   ```bash
   npm run app:init
   ```

2. Запуск приложения:

   ```bash
   npm start
   ```

3. Откройте приложение в браузере по адресу http://localhost:19006

### Использование PostgreSQL

1. Установите и настройте PostgreSQL (см. [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md))

2. Создайте файл `.env` с параметрами подключения:

   ```env
   DATABASE_TYPE=postgresql
   DATABASE_URL=postgresql://username:password@localhost:5432/goalschool
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=goalschool
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

3. Инициализация приложения:

   ```bash
   npm run app:init
   ```

4. Запуск приложения:
   ```bash
   npm start
   ```

## Тестовые учетные записи

После инициализации приложения будут созданы следующие тестовые учетные записи:

### Администратор

- Email: admin@example.com
- Пароль: admin123

### Менеджер

- Email: manager@example.com
- Пароль: manager123

### Тренер

- Email: coach@example.com
- Пароль: coach123

### Родитель

- Email: parent@example.com
- Пароль: parent123

### Ученик

- Email: student@example.com
- Пароль: student123

## Структура проекта

```
goal-school/
├── src/
│   ├── components/     # Переиспользуемые компоненты
│   ├── context/        # Контексты React
│   ├── hooks/          # Пользовательские хуки
│   ├── navigation/     # Конфигурация навигации
│   ├── screens/        # Экраны приложения
│   ├── services/       # Сервисы для работы с данными
│   ├── config/         # Конфигурационные файлы
│   ├── constants/      # Константы приложения
│   └── utils/          # Вспомогательные функции
├── scripts/            # Скрипты управления приложением
├── web-build/          # Собранные файлы веб-версии
├── backups/            # Резервные копии базы данных
├── .env                # Переменные окружения
├── package.json        # Зависимости и скрипты
└── README.md           # Документация
```

## Основные команды

### Разработка

```bash
# Запуск приложения в режиме разработки
npm start

# Запуск на Android
npm run android

# Запуск на iOS
npm run ios

# Запуск в вебе
npm run web
```

### Тестирование

```bash
# Запуск unit тестов
npm test

# Запуск линтера
npm run lint
```

### Сборка

```bash
# Сборка веб-версии
npm run build
```

### Управление базой данных

```bash
# Инициализация базы данных
npm run db:init

# Проверка подключения к базе данных
npm run db:check

# Создание резервной копии
npm run db:backup

# Восстановление из резервной копии
npm run db:restore

# Очистка базы данных (только для разработки)
npm run db:clear

# Создание тестовых пользователей
npm run db:create-test-users
```

### Инициализация всего приложения

```bash
npm run app:init
```

## Конфигурация

### Переменные окружения

Создайте файл `.env` в корне проекта с необходимыми переменными:

```env
# Тип базы данных (local или postgresql)
DATABASE_TYPE=local

# Параметры подключения к PostgreSQL (если используется)
DATABASE_URL=postgresql://username:password@localhost:5432/database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=database_name
DB_USER=username
DB_PASSWORD=password
DB_SSL=false

# Параметры приложения
NODE_ENV=development
PORT=19006

# Параметры безопасности
JWT_SECRET=your_jwt_secret
BCRYPT_SALT_ROUNDS=10
```

## Решение常见ых проблем

### Приложение не запускается

1. Убедитесь, что все зависимости установлены:

   ```bash
   npm install
   ```

2. Проверьте переменные окружения:

   ```bash
   node scripts/check-env.js
   ```

3. Перезапустите Metro bundler:
   ```bash
   npm start --reset-cache
   ```

### Ошибка подключения к базе данных

1. Проверьте параметры подключения в файле `.env`
2. Убедитесь, что PostgreSQL запущен
3. Проверьте, что база данных существует

### Тестовые пользователи не создаются

1. Проверьте, что база данных инициализирована:

   ```bash
   npm run db:init
   ```

2. Проверьте логи создания пользователей:
   ```bash
   npm run db:create-test-users
   ```

## Дальнейшие шаги

1. Ознакомьтесь с [документацией для разработчиков](DEVELOPER_DOCS.md)
2. Изучите [руководство по миграции](MIGRATION_GUIDE.md) для перехода с локального хранилища на PostgreSQL
3. Настройте [CI/CD pipeline](CI_CD.md) для автоматической сборки и деплоя
4. Ознакомьтесь с [рекомендациями по безопасности](SECURITY.md)

## Поддержка

Если у вас возникли вопросы или проблемы, обратитесь к документации или свяжитесь с командой разработчиков.
