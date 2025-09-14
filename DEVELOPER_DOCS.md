# Документация для разработчиков

## Архитектура приложения

### Основные компоненты

1. **Контексты** - управление глобальным состоянием приложения
2. **Сервисы** - работа с данными и бизнес-логика
3. **Компоненты** - переиспользуемые UI элементы
4. **Экраны** - основные страницы приложения
5. **Навигация** - маршрутизация между экранами

### Контексты

- [LocalStorageAuthContext](src/context/LocalStorageAuthContext.tsx) - аутентификация с использованием локального хранилища
- [MySQLAuthContext](src/context/MySQLAuthContext.tsx) - аутентификация с использованием MySQL
- [DatabaseContext](src/context/DatabaseContext.tsx) - управление типом базы данных
- [NetworkContext](src/context/NetworkContext.tsx) - управление состоянием сети
- [NotificationContext](src/context/NotificationContext.tsx) - система уведомлений

### Сервисы

#### Локальное хранилище

- [UserService](src/services/UserService.ts) - управление пользователями
- [AttendanceService](src/services/AttendanceService.ts) - посещаемость
- [ProgressService](src/services/ProgressService.ts) - прогресс учеников
- [NutritionService](src/services/NutritionService.ts) - план питания
- [NewsService](src/services/NewsService.ts) - новости
- [ScheduleService](src/services/ScheduleService.ts) - расписание
- [SkillService](src/services/SkillService.ts) - навыки
- [AchievementService](src/services/AchievementService.ts) - достижения

#### MySQL

- [MySQLUserService](src/services/MySQLUserService.ts) - управление пользователями в MySQL

#### Инициализация базы данных

- [DatabaseInitService](src/services/DatabaseInitService.ts) - создание таблиц и начальное заполнение

## Работа с базами данных

### Поддерживаемые типы баз данных

1. **Локальное хранилище** - используется по умолчанию, данные хранятся на устройстве
2. **MySQL** - облачная база данных, поддерживает синхронизацию между устройствами

### Переключение между базами данных

Переключение осуществляется через [DatabaseContext](src/context/DatabaseContext.tsx), который определяет, какой тип базы данных использовать.

### Добавление нового сервиса для MySQL

1. Создайте новый файл сервиса в [src/services/](src/services/)
2. Экспортируйте его в [src/services/mysql.ts](src/services/mysql.ts)
3. Обновите [src/services/index.ts](src/services/index.ts)
4. Добавьте необходимые таблицы в [DatabaseInitService](src/services/DatabaseInitService.ts)

### Конфигурация базы данных

Конфигурация базы данных находится в [src/config/mysql.ts](src/config/mysql.ts) и использует переменные окружения из файла `.env`.

## Стиль кода

### TypeScript

- Используйте строгую типизацию
- Описывайте интерфейсы для всех объектов
- Используйте дженерики где это возможно

### Компоненты

- Используйте функциональные компоненты
- Применяйте хуки вместо классовых компонентов
- Разделяйте логику и представление
- Используйте React.memo для оптимизации

### Стилизация

- Используйте StyleSheet для стилей
- Определяйте цвета в [src/constants/colors.ts](src/constants/colors.ts)
- Используйте responsive design

### Стандарты кодирования

Подробная информация о стандартах кодирования находится в файле [CODING_STANDARDS.md](CODING_STANDARDS.md).

## Инструменты разработки

### Линтинг и форматирование

Подробная информация об инструментах линтинга и форматирования находится в файле [DEVELOPMENT_TOOLS.md](DEVELOPMENT_TOOLS.md).

### Тестирование

Подробная информация о тестировании находится в файле [TESTING.md](TESTING.md).

### Отладка

Подробная информация об отладке находится в файле [DEBUGGING.md](DEBUGGING.md).

## Развертывание

### Веб-версия

```bash
npm run build
```

### Мобильная версия

```bash
# Android
npm run android

# iOS
npm run ios
```

### Docker

Для локальной разработки с Docker:

```bash
docker-compose up
```

Для продакшн сборки:

```bash
docker build -t goalschool .
```

## Безопасность

- Не храните чувствительные данные в коде
- Используйте переменные окружения для конфигурации
- Хешируйте пароли перед сохранением
- Используйте HTTPS в production

## Производительность

- Оптимизируйте рендеринг списков
- Используйте React.memo для предотвращения лишних рендеров
- Минимизируйте количество перерисовок
- Используйте код-сплиттинг где возможно

## Работа с сетью

- Обрабатывайте ошибки сети
- Предоставляйте offline возможности
- Используйте кэширование данных
- Показывайте индикаторы загрузки

## Локализация

(Пока не реализована)

## Доступность

- Используйте семантические компоненты
- Обеспечьте поддержку клавиатуры
- Предоставьте альтернативный текст для изображений

## Поддержка разных платформ

- Используйте Platform API для платформо-специфичного кода
- Тестируйте на всех поддерживаемых платформах
- Учитывайте различия в UI/UX между платформами

## Работа с MySQL

### Установка и настройка

Подробная инструкция по установке и настройке MySQL находится в файле [MYSQL_SETUP.md](MYSQL_SETUP.md).

### Инициализация базы данных

Для инициализации базы данных выполните:

```bash
npm run db:init
```

### Скрипты управления базой данных

Все скрипты для управления базой данных находятся в директории [scripts/](scripts/):

- [init-mysql-database.js](scripts/init-mysql-database.js) - инициализация базы данных
- [check-database.js](scripts/check-database.js) - проверка подключения
- [backup-database.js](scripts/backup-database.js) - резервное копирование
- [restore-database.js](scripts/restore-database.js) - восстановление из резервной копии
- [clear-database.js](scripts/clear-database.js) - очистка базы данных (только для разработки)

Подробнее о скриптах в файле [DATABASE_SCRIPTS.md](DATABASE_SCRIPTS.md).

### Миграция данных

Инструкция по миграции с локального хранилища на MySQL находится в файле [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md).

### Хуки уведомлений

- [useCoachNotifications](file:///c:/Users/jolab/Desktop/Goal-School/src/hooks/useCoachNotifications.ts#L8-L65) - уведомления для тренеров о новых записях посещаемости
- [useNewsNotifications](file:///c:/Users/jolab/Desktop/Goal-School/src/hooks/useNewsNotifications.ts#L13-L86) - уведомления о новых важных новостях
- [useImportantNewsNotifications](file:///c:/Users/jolab/Desktop/Goal-School/src/hooks/useImportantNewsNotifications.ts#L12-L100) - уведомления о важных новостях
- [useAchievementNotifications](file:///c:/Users/jolab/Desktop/Goal-School/src/hooks/useAchievementNotifications.ts#L7-L60) - уведомления о новых достижениях
- [useCustomNotifications](file:///c:/Users/jolab/Desktop/Goal-School/src/hooks/useCustomNotifications.ts#L7-L100) - пользовательская система уведомлений через периодический опрос сервера
