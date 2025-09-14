# Использование Docker для разработки и развертывания

## Описание

Это руководство описывает, как использовать Docker и Docker Compose для локальной разработки и развертывания приложения футбольной школы с PostgreSQL.

## Требования

- Docker Engine 20.10 или выше
- Docker Compose 1.29 или выше
- Минимум 4 ГБ свободной оперативной памяти

## Структура Docker конфигурации

### docker-compose.yml

Основной файл конфигурации Docker Compose, определяющий следующие сервисы:

1. **postgres** - PostgreSQL база данных версии 16.4
2. **pgadmin** - Веб-интерфейс для управления PostgreSQL
3. **app** - Приложение для разработки

### Dockerfile.dev

Dockerfile для разработки приложения:

- Использует Node.js 18 Alpine
- Устанавливает зависимости для Expo
- Настраивает горячую перезагрузку кода

### Dockerfile

Dockerfile для продакшена:

- Двухступенчатая сборка (builder + production)
- Минимизированный образ для продакшена
- Non-root пользователь для безопасности

## Запуск с помощью Docker Compose

### Первый запуск

1. Клонируйте репозиторий:

```bash
git clone https://github.com/ваш_репозиторий/goalschool.git
cd goalschool
```

2. Запустите все сервисы:

```bash
docker-compose up -d
```

3. Инициализируйте базу данных:

```bash
docker-compose exec app npm run db:init
```

### Работа с сервисами

#### PostgreSQL

- **Порт:** 5432
- **База данных:** goalschool_dev
- **Пользователь:** postgres
- **Пароль:** postgres

Подключение через psql:

```bash
docker-compose exec postgres psql -U postgres -d goalschool_dev
```

#### pgAdmin

- **URL:** http://localhost:5050
- **Email:** admin@goalschool.com
- **Пароль:** admin

Настройка подключения в pgAdmin:

1. Откройте http://localhost:5050
2. Войдите с учетными данными выше
3. Добавьте новый сервер:
   - **Host name/address:** postgres
   - **Port:** 5432
   - **Maintenance database:** goalschool_dev
   - **Username:** postgres
   - **Password:** postgres

#### Приложение

- **Expo DevTools:** http://localhost:19002
- **Локальная сеть:** http://ваш_ip:19000
- **Туннель:** https://туннель.expo.dev

### Остановка сервисов

Остановка всех сервисов:

```bash
docker-compose down
```

Остановка с удалением данных (включая базу данных):

```bash
docker-compose down -v
```

## Разработка с Docker

### Горячая перезагрузка кода

Приложение автоматически перезагружается при изменении кода благодаря монтированию volumes:

```yaml
volumes:
  - .:/app
  - /app/node_modules
```

### Выполнение команд в контейнере

Выполнение npm команд:

```bash
docker-compose exec app npm run db:check
docker-compose exec app npm test
docker-compose exec app npm run build
```

Выполнение shell команд:

```bash
docker-compose exec app sh
```

### Просмотр логов

Просмотр логов всех сервисов:

```bash
docker-compose logs -f
```

Просмотр логов конкретного сервиса:

```bash
docker-compose logs -f app
docker-compose logs -f postgres
```

## Тестирование с Docker

### Запуск тестов

```bash
docker-compose exec app npm test
```

### Запуск тестов в режиме наблюдения

```bash
docker-compose exec app npm run test:watch
```

## Работа с базой данных

### Создание резервной копии

```bash
docker-compose exec postgres pg_dump -U postgres -d goalschool_dev > backup.sql
```

### Восстановление из резервной копии

```bash
docker-compose exec -T postgres psql -U postgres -d goalschool_dev < backup.sql
```

### Подключение к базе данных

```bash
docker-compose exec postgres psql -U postgres -d goalschool_dev
```

## Продакшен развертывание

### Сборка продакшен образа

```bash
docker build -t goalschool-app .
```

### Запуск продакшен контейнера

```bash
docker run -d \
  --name goalschool-production \
  -p 3000:3000 \
  -e POSTGRES_HOST=ваш_хост \
  -e POSTGRES_PORT=5432 \
  -e POSTGRES_DATABASE=goalschool_production \
  -e POSTGRES_USER=ваш_пользователь \
  -e POSTGRES_PASSWORD=ваш_пароль \
  goalschool-app
```

## Переменные окружения

### Для разработки

```env
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DATABASE=goalschool_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
NODE_ENV=development
```

### Для продакшена

```env
POSTGRES_HOST=ваш_хост
POSTGRES_PORT=5432
POSTGRES_DATABASE=goalschool_production
POSTGRES_USER=ваш_пользователь
POSTGRES_PASSWORD=ваш_пароль
NODE_ENV=production
```

## Устранение неполадок

### Ошибка "port is already allocated"

1. Проверьте, какие порты используются:

```bash
docker-compose ps
```

2. Остановите конфликтующие сервисы или измените порты в docker-compose.yml

### Ошибка подключения к базе данных

1. Проверьте статус контейнера PostgreSQL:

```bash
docker-compose ps postgres
```

2. Проверьте логи PostgreSQL:

```bash
docker-compose logs postgres
```

3. Убедитесь, что переменные окружения заданы правильно

### Приложение не запускается

1. Проверьте логи приложения:

```bash
docker-compose logs app
```

2. Убедитесь, что все зависимости установлены:

```bash
docker-compose exec app npm install
```

3. Проверьте конфигурацию портов в docker-compose.yml

### Медленная производительность

1. Убедитесь, что у Docker достаточно ресурсов (в Docker Desktop: Settings → Resources)
2. Проверьте, не монтируются ли большие директории ненужно
3. Оптимизируйте .dockerignore для исключения ненужных файлов

## Оптимизация

### .dockerignore

Создайте файл `.dockerignore` для ускорения сборки:

```
node_modules
.git
.gitignore
README.md
.env
.env.*
web-build
backups
*.log
```

### Кэширование зависимостей

Dockerfile оптимизирован для кэширования зависимостей:

```dockerfile
COPY package*.json ./
RUN npm ci
COPY . .
```

### Multi-stage build

Использование двухступенчатой сборки уменьшает размер финального образа:

1. **Builder stage:** Сборка приложения
2. **Production stage:** Минимальный образ для запуска

## Безопасность

### Non-root пользователь

В продакшен образе используется non-root пользователь:

```dockerfile
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs
```

### Минимизация образа

- Использование Alpine Linux
- Удаление ненужных пакетов после установки
- Только production зависимости в финальном образе

## Поддержка

Если у вас возникли проблемы с использованием Docker, обратитесь к документации Docker или создайте issue в репозитории проекта.
