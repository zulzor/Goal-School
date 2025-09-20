# Консолидированная документация проекта футбольной школы "Арсенал"

## Общая информация о проекте

Проект футбольной школы "Арсенал" представляет собой кроссплатформенное приложение (Web + Android APK) с единым кодом на React Native и серверной частью на PHP + MySQL. Приложение разработано в фирменных цветах клуба "Арсенал" (красный #EF0107 и синий #023474).

### О проекте

Проект представляет собой полнофункциональное приложение для управления футбольной школой, включающее:
- Веб-версию, доступную через браузер
- Мобильное приложение для Android (APK)
- Единую кодовую базу на React Native
- Серверную часть на PHP с REST API
- Базу данных MySQL

### Архитектура проекта

#### Фронтенд
- **Технология**: React Native (Web + Android)
- **UI библиотека**: React Native Paper
- **Навигация**: React Navigation
- **Управление состоянием**: React Context API
- **Локальное хранилище**: AsyncStorage
- **Сетевой статус**: NetInfo
- **Иконки**: Expo Vector Icons

#### Бэкенд
- **Технология**: PHP (REST API)
- **База данных**: MySQL
- **Аутентификация**: JWT (в разработке)
- **Хостинг**: Beget

#### Сервер
- **Технология**: Node.js + Express
- **Проксирование**: http-proxy-middleware
- **Статические файлы**: express.static
- **Порты**: 3004 (основной), 8080 (PHP)

## Роли пользователей

1. **Управляющий (Manager/Admin)**
   - Управление филиалами (CRUD)
   - Управление расписаниями тренировок
   - Назначение тренеров
   - Управление пользователями
   - Управление балансом тренировок у семей
   - Управление дисциплинами (CRUD)
   - Просмотр/редактирование данных успеваемости
   - Аналитика посещаемости
   - Управление новостями (для СММ-менеджера)

2. **Тренер (Coach)**
   - Отмечать посещаемость
   - Подтверждать участие ребёнка в тренировке
   - Вносить показатели по дисциплинам
   - Добавлять дисциплины
   - Вводить результаты тренировок
   - Получать уведомления о новых записях

3. **Родители / Дети (Family/Child)**
   - Просматривать баланс тренировок
   - Записываться на тренировку
   - Видеть расписание
   - Просматривать прогресс детей
   - Получать уведомления о посещаемости
   - Просматривать рекомендации по питанию
   - Просматривать новости

4. **СММ-менеджер (SMM Manager)**
   - Создание и публикация новостей
   - Управление контентом
   - Аналитика по просмотрам новостей
   - Планирование публикаций

## Функциональные модули

### 1. Система регистрации и аутентификации

#### Фронтенд (React Native)
- **LocalStorageAuthProvider** (`src/context/LocalStorageAuthContext.tsx`): Основной провайдер аутентификации для веб-версии, использующий AsyncStorage для хранения данных пользователя
- **MySQLAuthProvider** (`src/context/MySQLAuthContext.tsx`): Провайдер аутентификации для нативной версии, работающий с MySQL базой данных
- **AuthContext**: Предоставляет функции login, register, logout, updateProfile и другие методы управления учетными записями

#### Бэкенд (PHP)
- **Auth API** (`backend/api/index.php`): Обработка запросов аутентификации (login, register)
- **Auth Class** (`backend/config/auth.php`): Логика аутентификации с использованием JWT
- **User Model** (`backend/models/User.php`): Модель пользователя с методами для работы с данными

### 2. Управление базами данных

#### Конфигурация
- **MySQL Config** (`src/config/mysql.ts`): Конфигурация подключения к MySQL для нативной версии
- **MySQL Web Config** (`src/config/mysql.web.ts`): Заглушка для веб-версии, которая перенаправляет запросы через API
- **Database Context** (`src/context/DatabaseContext.tsx`): Контекст для управления типом базы данных (local или mysql)

#### Инициализация
- **DatabaseInitService** (`src/services/DatabaseInitService.ts`): Сервис инициализации базы данных
- **MySQL Initialization** (`src/config/mysql.ts`): Создание таблиц и индексов при запуске

### 3. Навигация

#### Мобильная версия
- **AppNavigator** (`src/navigation/AppNavigator.tsx`): Основная навигация с табами и стеками
- **Role-based Routing**: Разные экраны для разных ролей пользователей

#### Веб-версия
- **AppNavigator.web** (`src/navigation/AppNavigator.web.tsx`): Специализированная навигация для веб-версии
- **Test Users**: Встроенная система тестовых пользователей для демонстрации

### 4. Управление пользователями

#### Фронтенд
- **UserService** (`src/services/UserService.ts`): Сервис для работы с пользователями через локальное хранилище
- **MySQLUserService** (`src/services/MySQLUserService.ts`): Сервис для работы с пользователями через MySQL
- **User Management Screen** (`src/screens/UserManagementScreen.tsx`): Экран управления пользователями для администраторов

#### Бэкенд
- **User API** (`backend/api/index.php`): REST API для управления пользователями
- **User Model** (`backend/models/User.php`): Модель данных пользователя

### 5. Управление тренировками

#### Фронтенд
- **TrainingService** (`src/services/TrainingService.ts`): Сервис для работы с тренировками
- **ScheduleScreen** (`src/screens/ScheduleScreen.tsx`): Экран расписания тренировок
- **TrainingCalendar** (`src/components/TrainingCalendar.tsx`): Компонент календаря тренировок
- **TrainingList** (`src/components/TrainingList.tsx`): Компонент списка тренировок

#### Бэкенд
- **Training API** (`backend/api/index.php`): REST API для управления тренировками
- **Training Model** (`backend/models/Training.php`): Модель данных тренировки

### 6. Система посещаемости

#### Фронтенд
- **AttendanceService** (`src/services/AttendanceService.ts`): Сервис для работы с посещаемостью
- **MySQLAttendanceService** (`src/services/MySQLAttendanceService.ts`): Сервис для работы с посещаемостью через MySQL
- **AttendanceManagementScreen** (`src/screens/AttendanceManagementScreen.tsx`): Экран управления посещаемостью для тренеров
- **AttendanceAnalyticsScreen** (`src/screens/AttendanceAnalyticsScreen.tsx`): Экран аналитики посещаемости для менеджеров

#### Бэкенд
- **Attendance API** (`backend/api/index.php`): REST API для управления посещаемостью
- **Attendance Model** (`backend/models/Attendance.php`): Модель данных посещаемости

### 7. Система прогресса

#### Фронтенд
- **ProgressService** (`src/services/ProgressService.ts`): Сервис для работы с прогрессом учеников
- **StudentProgressScreen** (`src/screens/StudentProgressScreen.tsx`): Экран отслеживания прогресса
- **ProgressChart** (`src/components/ProgressChart.tsx`): Компонент графика прогресса

#### Бэкенд
- **Progress API** (`backend/api/index.php`): REST API для управления прогрессом
- **Progress Model** (`backend/models/Progress.php`): Модель данных прогресса

### 8. Система достижений и навыков

#### Фронтенд
- **AchievementService** (`src/services/AchievementService.ts`): Сервис для работы с достижениями
- **AchievementsScreen** (`src/screens/AchievementsScreen.tsx`): Экран достижений
- **AchievementsList** (`src/components/AchievementsList.tsx`): Компонент списка достижений
- **AchievementCard** (`src/components/AchievementCard.tsx`): Компонент карточки достижения

#### Данные
- **Skills Data** (`skills_achievements_data.sql`): Тестовые данные для навыков и достижений
- **Achievement Types**: Тренировочные, навыковые, прогрессные, посещаемостные и специальные достижения

### 9. Система новостей

#### Фронтенд
- **NewsService** (`src/services/NewsService.ts`): Сервис для работы с новостями
- **NewsScreen** (`src/screens/NewsScreen.tsx`): Экран новостей
- **NewsList** (`src/components/NewsList.tsx`): Компонент списка новостей
- **NewsItem** (`src/components/NewsItem.tsx`): Компонент элемента новости

#### Бэкенд
- **News API** (`backend/api/index.php`): REST API для управления новостями
- **News Model** (`backend/models/News.php`): Модель данных новости

### 10. Система питания

#### Фронтенд
- **NutritionService** (`src/services/NutritionService.ts`): Сервис для работы с рекомендациями по питанию
- **NutritionScreen** (`src/screens/NutritionScreen.tsx`): Экран питания
- **NutritionList** (`src/components/NutritionList.tsx`): Компонент списка рекомендаций

#### Бэкенд
- **Nutrition API** (`backend/api/index.php`): REST API для управления рекомендациями по питанию
- **Nutrition Model** (`backend/models/Nutrition.php`): Модель данных рекомендаций по питанию

### 11. Управление филиалами

#### Фронтенд
- **BranchService** (`src/services/BranchService.ts`): Сервис для работы с филиалами
- **BranchManagementScreen** (`src/screens/BranchManagementScreen.tsx`): Экран управления филиалами
- **BranchSelector** (`src/components/BranchSelector.tsx`): Компонент выбора филиала

#### Бэкенд
- **Branch API** (`backend/api/index.php`): REST API для управления филиалами
- **Branch Model** (`backend/models/Branch.php`): Модель данных филиала

### 12. Система уведомлений

#### Фронтенд
- **NotificationContext** (`src/context/NotificationContext.tsx`): Контекст для управления уведомлениями
- **Notification Hooks** (`src/hooks/use*.ts`): Хуки для различных типов уведомлений
- **Notification Components** (`src/components/Notification*.tsx`): Компоненты уведомлений

#### Сервисы
- **PushNotificationService** (`src/services/PushNotificationService.ts`): Сервис push-уведомлений
- **CustomNotificationService** (`src/services/CustomNotificationService.ts`): Сервис пользовательских уведомлений

## Техническая архитектура

### Структура проекта

```
├── backend/                    # PHP бэкенд
│   ├── api/                    # REST API endpoints
│   │   └── index.php           # Главная точка входа API
│   ├── config/                 # Конфигурационные файлы
│   │   ├── database.php        # Конфигурация базы данных
│   │   ├── auth.php            # Аутентификация
│   │   └── env.php             # Загрузка переменных окружения
│   ├── models/                 # Модели данных
│   │   ├── User.php            # Модель пользователя
│   │   ├── Family.php          # Модель семьи
│   │   ├── Child.php           # Модель ребенка
│   │   ├── Branch.php          # Модель филиала
│   │   ├── Trainer.php         # Модель тренера
│   │   ├── Training.php        # Модель тренировки
│   │   ├── Discipline.php      # Модель дисциплины
│   │   ├── Attendance.php      # Модель посещаемости
│   │   └── Progress.php        # Модель прогресса
│   └── database_schema.sql     # Схема базы данных
├── src/                        # Исходный код React Native
│   ├── components/             # Переиспользуемые компоненты
│   ├── screens/                # Экраны приложения
│   ├── context/                # Контексты React
│   │   ├── DatabaseContext.tsx # Контекст базы данных
│   │   ├── LocalStorageAuthContext.tsx # Контекст аутентификации через локальное хранилище
│   │   ├── MySQLAuthContext.tsx # Контекст аутентификации через MySQL
│   │   ├── BranchContext.tsx   # Контекст филиалов
│   │   ├── NetworkContext.tsx  # Контекст сетевого статуса
│   │   ├── NotificationContext.tsx # Контекст уведомлений
│   │   └── TaskContext.tsx     # Контекст задач
│   ├── services/               # Сервисы и API клиенты
│   │   ├── UserService.ts      # Сервис пользователей (локальное хранилище)
│   │   ├── MySQLUserService.ts # Сервис пользователей (MySQL)
│   │   ├── AttendanceService.ts # Сервис посещаемости (локальное хранилище)
│   │   ├── MySQLAttendanceService.ts # Сервис посещаемости (MySQL)
│   │   ├── ProgressService.ts  # Сервис прогресса
│   │   ├── NewsService.ts      # Сервис новостей
│   │   ├── NutritionService.ts # Сервис питания
│   │   ├── ScheduleService.ts  # Сервис расписания
│   │   ├── SkillService.ts     # Сервис навыков
│   │   ├── AchievementService.ts # Сервис достижений
│   │   ├── BranchService.ts    # Сервис филиалов
│   │   ├── DisciplineService.ts # Сервис дисциплин
│   │   ├── TrainingService.ts  # Сервис тренировок
│   │   ├── DatabaseInitService.ts # Сервис инициализации базы данных
│   │   ├── PushNotificationService.ts # Сервис push-уведомлений
│   │   ├── CustomNotificationService.ts # Сервис пользовательских уведомлений
│   │   ├── CoachNotificationService.ts # Сервис уведомлений тренеров
│   │   ├── ImportantNewsNotificationService.ts # Сервис важных новостей
│   │   └── api.ts              # Утилита API запросов
│   ├── hooks/                  # Пользовательские хуки
│   │   ├── useCoachNotifications.ts # Хук уведомлений тренеров
│   │   ├── useCustomNotifications.ts # Хук пользовательских уведомлений
│   │   ├── useAchievementNotifications.ts # Хук уведомлений достижений
│   │   └── useImportantNewsNotifications.ts # Хук уведомлений новостей
│   ├── utils/                  # Вспомогательные функции
│   ├── types/                  # TypeScript типы
│   │   └── index.ts            # Основные типы приложения
│   ├── navigation/             # Навигация
│   │   ├── AppNavigator.tsx    # Навигатор для мобильной версии
│   │   └── AppNavigator.web.tsx # Навигатор для веб-версии
│   ├── config/                 # Конфигурационные файлы
│   │   ├── mysql.ts            # Конфигурация MySQL (нативная версия)
│   │   ├── mysql.web.ts        # Конфигурация MySQL (веб-версия)
│   │   ├── react-navigation.web.ts # Заглушки для React Navigation (веб)
│   │   ├── loadEnv.js          # Загрузка переменных окружения
│   │   └── mockDatabase.js     # Моковая база данных для разработки
│   └── constants/              # Константы приложения
│       ├── index.ts            # Основные константы
│       ├── arsenalColors.ts    # Цвета Arsenal
│       └── icons.ts            # Иконки приложения
├── web-export/                 # Собранные веб-файлы
├── scripts/                    # Вспомогательные скрипты
├── assets/                     # Ассеты приложения
├── android/                    # Конфигурация Android
├── App.tsx                     # Точка входа для мобильной версии
├── App.web.tsx                 # Точка входа для веб-версии
├── index.ts                    # Точка входа для мобильной версии
├── index.web.ts                # Точка входа для веб-версии
├── main-server.js              # Главный сервер Node.js
├── webpack.config.js           # Конфигурация Webpack для разработки
├── webpack.prod.config.js      # Конфигурация Webpack для продакшена
├── package.json                # Зависимости и скрипты
├── .env                        # Переменные окружения
└── database_schema.sql         # Схема базы данных (Supabase)

### Ключевые технологии

#### Фронтенд
- **React Native**: Кроссплатформенная разработка для Web и мобильных устройств
- **React Navigation**: Навигация между экранами
- **React Native Paper**: UI компоненты в стиле Material Design
- **TypeScript**: Строгая типизация для повышения надежности кода
- **Context API**: Управление состоянием приложения
- **AsyncStorage**: Локальное хранилище данных
- **Expo Vector Icons**: Иконки приложения
- **Webpack**: Сборка веб-версии

#### Бэкенд
- **PHP**: Серверная логика REST API
- **MySQL**: Реляционная база данных
- **PDO**: Работа с базой данных
- **JWT**: Аутентификация через токены
- **BCrypt**: Хеширование паролей

#### Сервер
- **Node.js**: Серверная среда выполнения
- **Express**: Веб-фреймворк
- **http-proxy-middleware**: Проксирование запросов к PHP API

### Сборка и развертывание

#### Веб-версия
- **Сборка**: `npm run build-web` или `expo export:web`
- **Запуск**: `npm run serve-web` или `node serve-web.js`
- **Порт**: 3004 (по умолчанию)

#### Мобильная версия (Android)
- **Сборка APK**: `npm run build-apk` или `node build-apk.js`
- **Разработка**: `npm run android` или `expo run:android`

#### Сервер
- **Запуск**: `npm run server` или `node main-server.js`
- **Порт**: 3004 (основной сервер), 8080 (PHP бэкенд)

## Переменные окружения

``env
# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3006
MYSQL_DATABASE=goalschool
MYSQL_USER=root
MYSQL_PASSWORD=root

DB_HOST=localhost
DB_PORT=3006
DB_NAME=goalschool
DB_USER=root
DB_PASSWORD=root

# Server Configuration
PORT=3003

# Security
JWT_SECRET=goalschool_secret_key
BCRYPT_SALT_ROUNDS=10

# Database URL (for compatibility)
DATABASE_URL=mysql://root:root@localhost:3006/goalschool
```

## Структура базы данных

### Основные таблицы

1. **users**: Пользователи системы (администраторы, тренеры, родители, дети)
2. **families**: Семьи
3. **children**: Дети
4. **branches**: Филиалы
5. **trainers**: Тренеры
6. **trainings**: Тренировки
7. **disciplines**: Дисциплины
8. **attendance**: Посещаемость
9. **progress**: Прогресс по дисциплинам
10. **news**: Новости
11. **nutrition_recommendations**: Рекомендации по питанию

### Дополнительные таблицы

1. **subscriptions**: Абонементы
2. **subscription_purchases**: Покупки абонементов
3. **family_transfers**: Переводы семей между филиалами
4. **trainer_transfers**: Переводы тренеров между филиалами
5. **cancelled_trainings**: Отмененные тренировки

## Проблемы и решения

### Проблемы веб-версии

1. **MySQL в браузере**: MySQL не работает в браузерной среде
   - **Решение**: Использование заглушек и перенаправление запросов через API

2. **Vector Icons**: Проблемы с отображением иконок в веб-версии
   - **Решение**: Настройка webpack.config.js с правильными алиасами

3. **React Navigation**: Проблемы с навигацией в веб-версии
   - **Решение**: Создание специализированных заглушек в react-navigation.web.ts

### Проблемы сборки

1. **Зависимости**: Некоторые пакеты требуют специальной настройки для веб-версии
   - **Решение**: Настройка webpack.config.js с fallbacks для Node.js модулей

2. **Размер бандла**: Большой размер собранного приложения
   - **Решение**: Оптимизация webpack конфигурации и разделение кода на чанки

## Рекомендации по дальнейшей разработке

### 1. Улучшение архитектуры

1. **Единый API клиент**: Создать централизованный API клиент для всех запросов
2. **Улучшенная типизация**: Добавить более строгую типизацию для всех сервисов
3. **Модульная структура**: Разделить код на более мелкие, независимые модули

### 2. Улучшение безопасности

1. **Валидация данных**: Добавить валидацию всех входных данных на фронтенде и бэкенде
2. **Защита от XSS**: Реализовать дополнительные меры защиты от XSS атак
3. **Rate limiting**: Добавить ограничение количества запросов для предотвращения DoS атак

### 3. Улучшение производительности

1. **Кэширование**: Реализовать кэширование часто запрашиваемых данных
2. **Ленивая загрузка**: Добавить ленивую загрузку для экранов и компонентов
3. **Оптимизация изображений**: Добавить оптимизацию изображений для веб-версии

### 4. Улучшение пользовательского опыта

1. **Адаптивный дизайн**: Добавить лучшую адаптацию для разных размеров экранов
2. **Анимации**: Добавить плавные переходы и анимации
3. **Офлайн режим**: Реализовать базовую функциональность в офлайн режиме

## Заключение

Проект футбольной школы "Арсенал" представляет собой полнофункциональное кроссплатформенное приложение с комплексной архитектурой, включающей фронтенд на React Native, бэкенд на PHP и базу данных MySQL. Приложение успешно решает задачи управления тренировками, посещаемостью, прогрессом учеников и другими аспектами работы футбольной школы.

Основные достижения проекта:
- Единая кодовая база для веб и мобильных платформ
- Полнофункциональная система ролей и прав доступа
- Комплексная система управления данными
- Готовность к развертыванию и использованию в реальных условиях

Дальнейшее развитие проекта требует фокусировки на улучшении архитектуры, безопасности и пользовательского опыта, что обеспечит долгосрочную поддержку и масштабируемость приложения.
