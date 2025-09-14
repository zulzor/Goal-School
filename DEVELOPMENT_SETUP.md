# Настройка среды разработки

## Обзор

Это руководство поможет вам настроить среду разработки для работы с приложением Goal School.

## Требования

### Операционная система

- Windows 10/11
- macOS 10.15 или выше
- Linux (Ubuntu 20.04 или выше рекомендуется)

### Основные инструменты

- Node.js 16+ ([https://nodejs.org](https://nodejs.org))
- npm или yarn
- Git ([https://git-scm.com](https://git-scm.com))
- Редактор кода (VS Code рекомендуется)

## Установка Node.js

### Windows/macOS

1. Перейдите на [https://nodejs.org](https://nodejs.org)
2. Скачайте LTS версию
3. Запустите установщик и следуйте инструкциям

### Linux (Ubuntu/Debian)

```bash
# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка установки
node --version
npm --version
```

## Установка Git

### Windows

1. Перейдите на [https://git-scm.com](https://git-scm.com)
2. Скачайте установщик
3. Запустите установщик и следуйте инструкциям

### macOS

```bash
# Установка через Homebrew
brew install git

# Или через MacPorts
sudo port install git
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install git
```

## Установка редактора кода

### Visual Studio Code (рекомендуется)

1. Перейдите на [https://code.visualstudio.com](https://code.visualstudio.com)
2. Скачайте установщик для вашей ОС
3. Установите VS Code

### Расширения VS Code

После установки VS Code, рекомендуется установить следующие расширения:

1. **ESLint** - для линтинга кода
2. **Prettier** - для форматирования кода
3. **TypeScript Importer** - для автоматического импорта
4. **Path Intellisense** - для автозавершения путей
5. **GitLens** - для расширенной работы с Git
6. **React Native Tools** - для разработки React Native
7. **Docker** - для работы с Docker
8. **Jest** - для тестирования

Рекомендованные расширения также указаны в файле [.vscode/extensions.json](.vscode/extensions.json).

## Клонирование репозитория

```bash
git clone <repository-url>
cd goal-school
```

## Установка зависимостей

```bash
npm install
```

## Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# Development environment configuration
NODE_ENV=development
PORT=19006

# PostgreSQL Database Configuration (если используется)
DATABASE_URL=postgresql://username:password@localhost:5432/goalschool_dev
DB_HOST=localhost
DB_PORT=5432
DB_NAME=goalschool_dev
DB_USER=dev_user
DB_PASSWORD=dev_password
DB_SSL=false

# MySQL Database Configuration (если используется)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=goalschool
MYSQL_USER=root
MYSQL_PASSWORD=

# Security
JWT_SECRET=development_jwt_secret
BCRYPT_SALT_ROUNDS=10
```

## Инициализация приложения

```bash
npm run app:init
```

Эта команда выполнит:

1. Проверку переменных окружения
2. Инициализацию базы данных (если используется PostgreSQL или MySQL)
3. Создание тестовых пользователей
4. Установку зависимостей

## Запуск приложения

### В режиме разработки

```bash
npm start
```

### На конкретной платформе

```bash
# Android
npm run android

# iOS
npm run ios

# Веб
npm run web
```

## Настройка базы данных (опционально)

Приложение поддерживает три типа баз данных:

1. Локальное хранилище (по умолчанию) - использует AsyncStorage
2. PostgreSQL 16.4 - для облачного хранения данных
3. MySQL 8.0 - для облачного хранения данных

### Установка PostgreSQL

#### Windows

1. Перейдите на [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Скачайте установщик
3. Запустите установщик и следуйте инструкциям

#### macOS

```bash
# Установка через Homebrew
brew install postgresql

# Запуск PostgreSQL
brew services start postgresql
```

#### Linux (Ubuntu/Debian)

```bash
# Установка PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Запуск PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Создание базы данных PostgreSQL

```bash
# Подключение к PostgreSQL
psql -U postgres

# Создание базы данных
CREATE DATABASE goalschool_dev;

# Создание пользователя
CREATE USER dev_user WITH PASSWORD 'dev_password';

# Предоставление прав
GRANT ALL PRIVILEGES ON DATABASE goalschool_dev TO dev_user;

# Выход
\q
```

### Установка MySQL

#### Windows

1. Перейдите на [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
2. Скачайте установщик
3. Запустите установщик и следуйте инструкциям

#### macOS

```bash
# Установка через Homebrew
brew install mysql

# Запуск MySQL
brew services start mysql
```

#### Linux (Ubuntu/Debian)

```bash
# Установка MySQL
sudo apt update
sudo apt install mysql-server

# Запуск MySQL
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Создание базы данных MySQL

```bash
# Подключение к MySQL
mysql -u root -p

# Создание базы данных
CREATE DATABASE goalschool;

# Выход
exit
```

## Docker (рекомендуется)

Если вы предпочитаете использовать Docker для разработки, в проекте есть готовый docker-compose файл:

### Установка Docker

#### Windows/macOS

1. Перейдите на [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Скачайте Docker Desktop
3. Установите и запустите Docker Desktop

#### Linux

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose

# Запуск Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### Запуск с Docker

```bash
# Запуск всех сервисов (включая MySQL)
docker-compose up

# Запуск в фоновом режиме
docker-compose up -d
```

После запуска Docker контейнеров, база данных MySQL будет доступна на порту 3306.

## Тестирование

### Запуск тестов

```bash
# Все тесты
npm test

# Тесты в режиме наблюдения
npm run test:watch

# Тесты с покрытием кода
npm run test:coverage
```

### Линтинг и форматирование

```bash
# Проверка кода
npm run lint

# Исправление ошибок
npm run lint:fix

# Форматирование кода
npm run format

# Проверка форматирования
npm run format:check
```

## Отладка

### Отладка в VS Code

В проекте настроены конфигурации отладки для VS Code. Вы можете найти их в файле [.vscode/launch.json](.vscode/launch.json).

### Логирование

Для отладки используйте console.log и специализированные логгеры:

```typescript
// Простое логирование
console.log('Debug message');

// Логирование ошибок
console.error('Error message');

// Логирование предупреждений
console.warn('Warning message');
```

## Решение常见ых проблем

### Ошибка "node: command not found"

Убедитесь, что Node.js установлен правильно:

```bash
node --version
```

Если команда не распознана, переустановите Node.js.

### Ошибка "npm: command not found"

Убедитесь, что npm установлен:

```bash
npm --version
```

Если команда не распознана, переустановите Node.js (npm входит в состав Node.js).

### Ошибка "git: command not found"

Убедитесь, что Git установлен:

```bash
git --version
```

Если команда не распознана, установите Git.

### Ошибка "Module not found"

Установите зависимости:

```bash
npm install
```

### Ошибка "EACCES: permission denied"

Используйте nvm для управления версиями Node.js:

```bash
# Установка nvm (macOS/Linux)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Установка Node.js через nvm
nvm install node
nvm use node
```

### Ошибка "ENOSPC: System limit for number of file watchers reached"

Увеличьте лимит файловых наблюдателей:

```bash
# Linux
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Best Practices

### 1. Регулярное обновление

Регулярно обновляйте зависимости:

```bash
# Проверка устаревших зависимостей
npm outdated

# Обновление зависимостей
npm update
```

### 2. Использование Git

- Создавайте ветки для новых функций
- Делайте коммиты часто с понятными сообщениями
- Используйте pull requests для code review

### 3. Код-стайл

- Следуйте стандартам кодирования
- Используйте автоматическое форматирование
- Пишите понятные комментарии

### 4. Тестирование

- Пишите тесты для нового функционала
- Запускайте тесты перед коммитом
- Поддерживайте высокое покрытие кода тестами

## Дополнительные ресурсы

- [Документация React Native](https://reactnative.dev/docs/getting-started)
- [Документация Expo](https://docs.expo.dev/)
- [Документация TypeScript](https://www.typescriptlang.org/docs/)
- [Документация PostgreSQL](https://www.postgresql.org/docs/)
- [Документация MySQL](https://dev.mysql.com/doc/)
- [Документация Docker](https://docs.docker.com/)
