# Документация для разработчиков приложения "Футбольная Школа"

## Содержание

1. [Обзор проекта](#обзор-проекта)
2. [Архитектура приложения](#архитектура-приложения)
3. [Технологический стек](#технологический-стек)
4. [Структура проекта](#структура-проекта)
5. [Настройка среды разработки](#настройка-среды-разработки)
6. [Работа с базой данных](#работа-с-базой-данных)
7. [API и сервисы](#api-и-сервисы)
8. [Тестирование](#тестирование)
9. [Развертывание](#развертывание)
10. [Руководство по кодированию](#руководство-по-кодированию)
11. [Работа с задачами и функциями](#работа-с-задачами-и-функциями)

## Обзор проекта

Приложение "Футбольная Школа" - это кроссплатформенное мобильное приложение, разработанное с использованием React Native и Expo. Приложение предоставляет функционал для управления тренировками, отслеживания прогресса учеников, управления пользователями и другими аспектами футбольной школы.

### Основные функции:

- Регистрация и аутентификация пользователей
- Управление расписанием тренировок
- Публикация новостей и объявлений
- Рекомендации по питанию
- Отслеживание прогресса учеников
- Управление посещаемостью
- Аналитика и отчеты

## Архитектура приложения

### Общая архитектура

Приложение следует архитектуре клиент-сервер с использованием следующих компонентов:

```
┌─────────────────────────────────────────────────────────────┐
│                    Клиент (React Native)                    │
├─────────────────────────────────────────────────────────────┤
│  Экраны (Screens)                                           │
│  Компоненты (Components)                                    │
│  Навигация (Navigation)                                     │
│  Контексты (Contexts)                                       │
├─────────────────────────────────────────────────────────────┤
│  Сервисы (Services)                                         │
│  Утилиты (Utils)                                            │
│  Хуки (Hooks)                                               │
├─────────────────────────────────────────────────────────────┤
│  Конфигурация (Config)                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Сервер (Supabase)                        │
├─────────────────────────────────────────────────────────────┤
│  База данных (PostgreSQL)                                   │
│  Аутентификация (Auth)                                      │
│  Хранилище файлов (Storage)                                 │
│  Функции (Functions)                                        │
└─────────────────────────────────────────────────────────────┘
```

### Основные слои приложения

1. **Представление (Presentation Layer)**
   - Экраны (Screens)
   - Компоненты (Components)
   - Навигация (Navigation)

2. **Бизнес-логика (Business Logic Layer)**
   - Сервисы (Services)
   - Контексты (Contexts)
   - Хуки (Hooks)

3. **Доступ к данным (Data Access Layer)**
   - Конфигурация Supabase
   - Утилиты для работы с API

4. **Внешние зависимости (External Dependencies)**
   - Supabase (база данных, аутентификация)
   - React Native Paper (UI компоненты)

## Технологический стек

### Основные технологии

- **React Native** - кроссплатформенная разработка мобильных приложений
- **Expo** - платформа для разработки React Native приложений
- **TypeScript** - типизированная версия JavaScript
- **React Navigation** - навигация в приложении
- **React Native Paper** - библиотека UI компонентов в стиле Material Design
- **Supabase** - бэкенд как сервис (база данных, аутентификация, хранилище)

### Вспомогательные технологии

- **Jest** - фреймворк для unit-тестирования
- **ts-jest** - преобразователь TypeScript для Jest
- **React Native Calendars** - компоненты календаря

## Структура проекта

```
src/
├── components/          # Переиспользуемые компоненты
├── config/              # Конфигурационные файлы
├── context/             # React контексты
├── hooks/               # Пользовательские хуки
├── navigation/          # Конфигурация навигации
├── screens/             # Экраны приложения
├── services/            # Сервисы для работы с API
├── types/               # TypeScript типы
├── utils/               # Вспомогательные утилиты
└── constants/           # Константы приложения
```

### Детализация структуры

#### components/

Содержит переиспользуемые компоненты, такие как:

- Уведомления
- Диалоговые окна
- Пользовательские элементы интерфейса

#### config/

Содержит конфигурационные файлы:

- Подключение к Supabase
- Константы конфигурации

#### context/

Содержит React контексты:

- Аутентификация (SupabaseAuthContext)
- Уведомления (NotificationContext)
- Безопасность (SecurityContext)

#### hooks/

Содержит пользовательские хуки:

- useNewsNotifications - проверка новых новостей
- usePerformanceOptimization - оптимизация производительности

#### navigation/

Содержит конфигурацию навигации:

- AppNavigator - основной навигатор
- Типы навигации

#### screens/

Содержит экраны приложения:

- LoginScreen - экран входа
- HomeScreen - главный экран
- ScheduleScreen - расписание тренировок
- NewsScreen - новости
- NutritionScreen - питание
- ProfileScreen - профиль пользователя
- AdminPanel - панель управления
- И другие экраны

#### services/

Содержит сервисы для работы с API:

- AttendanceService - посещаемость
- DisciplineService - дисциплины и результаты
- NewsService - новости
- NutritionService - питание
- ProgressService - прогресс учеников
- TrainingService - тренировки

#### types/

Содержит TypeScript типы:

- Типы пользователей
- Типы данных
- Типы навигации

#### utils/

Содержит вспомогательные утилиты:

- securityValidator - валидация и очистка данных
- securityLogger - логирование безопасности
- imageOptimizer - оптимизация изображений

#### constants/

Содержит константы приложения:

- Цвета (COLORS)
- Размеры (SIZES)
- Роли пользователей (USER_ROLES)

## Настройка среды разработки

### Требования

- Node.js 18.x или выше
- npm 8.x или выше
- Expo CLI (устанавливается автоматически с проектом)

### Установка зависимостей

```bash
cd GoalSchoolApp
npm install
```

### Запуск приложения

#### Веб-версия

```bash
npm run web
```

#### Мобильное приложение (Android)

```bash
npm run android
```

#### Мобильное приложение (iOS)

```bash
npm run ios
```

### Переменные окружения

Создайте файл `.env` в корне проекта:

```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Работа с базой данных

### Структура базы данных

Приложение использует Supabase как бэкенд. Основные таблицы:

1. **profiles** - профили пользователей
2. **trainings** - тренировки
3. **training_registrations** - регистрация на тренировки
4. **news** - новости
5. **nutrition_recommendations** - рекомендации по питанию
6. **disciplines** - дисциплины
7. **discipline_results** - результаты по дисциплинам
8. **student_progress** - прогресс учеников
9. **coach_feedback** - обратная связь от тренеров
10. **attendance** - посещаемость

### Подключение к базе данных

Подключение осуществляется через файл `src/config/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'your_default_url';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your_default_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## API и сервисы

### AttendanceService

Сервис для работы с посещаемостью:

```typescript
// Получение посещаемости ученика
const attendance = await attendanceService.getStudentAttendance(studentId);

// Отметка посещаемости
await attendanceService.markAttendance(attendanceData);

// Массовая отметка посещаемости
await attendanceService.markBulkAttendance(trainingId, attendanceData);
```

### DisciplineService

Сервис для работы с дисциплинами и результатами:

```typescript
// Получение дисциплин
const disciplines = await disciplineService.getDisciplines();

// Получение результатов ученика
const results = await disciplineService.getStudentResults(studentId);

// Добавление результата
await disciplineService.addDisciplineResult(resultData);
```

### NewsService

Сервис для работы с новостями:

```typescript
// Получение новостей
const news = await newsService.getNews(limit);

// Получение важных новостей
const importantNews = await newsService.getImportantNews(limit);

// Поиск новостей
const searchResults = await newsService.searchNews(query, limit);
```

### NutritionService

Сервис для работы с рекомендациями по питанию:

```typescript
// Получение рекомендаций
const recommendations = await nutritionService.getRecommendations();

// Получение рекомендаций по категории
const categoryRecommendations = await nutritionService.getRecommendationsByCategory(category);

// Получение рекомендаций по возрастной группе
const ageGroupRecommendations = await nutritionService.getRecommendationsByAgeGroup(ageGroup);
```

### ProgressService

Сервис для работы с прогрессом учеников:

```typescript
// Получение прогресса ученика
const progress = await progressService.getStudentProgress(studentId);

// Обновление прогресса
await progressService.updateProgress(progressData);

// Получение обратной связи от тренера
const feedback = await progressService.getCoachFeedback(studentId);
```

### TrainingService

Сервис для работы с тренировками:

```typescript
// Получение тренировок
const trainings = await trainingService.getTrainings();

// Получение тренировок ученика
const studentTrainings = await trainingService.getStudentTrainings(studentId);

// Регистрация на тренировку
await trainingService.registerForTraining(trainingId, studentId);
```

## Работа с сетью и offline-режимом

### Архитектура offline-режима

Приложение поддерживает работу в offline-режиме благодаря следующим компонентам:

1. **NetworkUtils** - утилиты для работы с сетью и кэширования
2. **NetworkContext** - контекст для управления состоянием сети
3. **NetworkStatusIndicator** - компонент для отображения состояния сети

### Использование сетевых функций

#### Базовые операции

```typescript
import {
  checkNetworkState,
  fetchWithOfflineFallback,
  cacheData,
  getCachedData,
} from '../utils/networkUtils';

// Проверка состояния сети
const networkState = await checkNetworkState();

// Выполнение запроса с fallback на кэш
const { data, isFromCache, error } = await fetchWithOfflineFallback<News[]>(
  'news',
  fetchNewsFunction,
  120 // Кэш действует 2 часа
);

// Кэширование данных
await cacheData('news', newsData);

// Получение кэшированных данных
const cachedNews = await getCachedData<News[]>('news', 120);
```

#### Работа с контекстом сети

```typescript
import { useNetwork } from '../context/NetworkContext';

const MyComponent = () => {
  const { isConnected, isInternetReachable, networkType, checkConnection } = useNetwork();

  // Проверка соединения
  const handleCheckConnection = async () => {
    await checkConnection();
  };

  return (
    <View>
      <Text>Состояние: {isConnected ? 'Подключен' : 'Не подключен'}</Text>
      <Text>Тип сети: {networkType}</Text>
      <Button onPress={handleCheckConnection} title="Проверить соединение" />
    </View>
  );
};
```

### Добавление offline-поддержки в новые сервисы

Для добавления offline-поддержки в новый сервис:

1. Импортируйте необходимые функции:

   ```typescript
   import { fetchWithOfflineFallback, cacheData } from '../utils/networkUtils';
   ```

2. Оберните сетевые запросы в `fetchWithOfflineFallback`:

   ```typescript
   static async getMyData(): Promise<MyDataType[]> {
     const { data, isFromCache, error } = await fetchWithOfflineFallback<MyDataType[]>(
       'mydata', // уникальный ключ для кэширования
       async () => {
         // Ваша функция для выполнения сетевого запроса
         const { data, error } = await supabase.from('my_table').select('*');
         if (error) throw error;
         return data;
       },
       120 // Время жизни кэша в минутах
     );

     if (error) throw error;
     return data || [];
   }
   ```

3. Очищайте кэш при изменении данных:
   ```typescript
   static async updateMyData(id: string, updates: Partial<MyDataType>): Promise<boolean> {
     try {
       const { error } = await supabase.from('my_table').update(updates).eq('id', id);
       if (error) throw error;

       // Очищаем кэш после обновления
       await cacheData('mydata', null);

       return true;
     } catch (error) {
       console.error('Ошибка обновления данных:', error);
       return false;
     }
   }
   ```

### Работа с NetworkStatusIndicator

Для отображения состояния сети в компонентах используйте `NetworkStatusIndicator`:

```typescript
import { NetworkStatusIndicator } from '../components/NetworkStatusIndicator';

const MyScreen = () => {
  return (
    <View>
      <NetworkStatusIndicator />
      {/* Остальной контент */}
    </View>
  );
};
```

### Настройка времени жизни кэша

Время жизни кэша настраивается индивидуально для каждого типа данных:

- **Новости:** 120 минут (2 часа)
- **Питание:** 180 минут (3 часа)
- **Расписание:** 60 минут (1 час)
- **Профиль:** 30 минут (30 минут)

Выбирайте время жизни кэша в зависимости от частоты обновления данных.

## Тестирование

### Unit-тесты

Приложение включает unit-тесты для основных сервисов и утилит. Тесты написаны с использованием Jest.

#### Запуск тестов

```
# Запуск всех тестов
npm test

# Запуск тестов в режиме наблюдения
npm run test:watch

# Запуск тестов с генерацией отчета о покрытии
npm run test:coverage
```

#### Структура тестов

```
src/
├── services/
│   ├── __tests__/
│   │   ├── AttendanceService.test.ts
│   │   ├── DisciplineService.test.ts
│   │   ├── NewsService.test.ts
│   │   ├── NutritionService.test.ts
│   │   ├── ProgressService.test.ts
│   │   └── TrainingService.test.ts
│   └── *.ts
├── utils/
│   ├── __tests__/
│   │   └── securityValidator.test.ts
│   └── *.ts
```

## Развертывание

### Веб-версия

Для развертывания веб-версии приложения:

1. Соберите приложение:

   ```bash
   npm run build
   ```

2. Разверните на Vercel:
   ```bash
   npm install -g vercel
   vercel --prod
   ```

### Мобильное приложение (APK)

Для создания APK файла:

1. Установите EAS CLI:

   ```bash
   npm install -g @expo/eas-cli
   ```

2. Авторизуйтесь:

   ```bash
   eas login
   ```

3. Создайте APK:
   ```bash
   eas build --platform android --profile preview
   ```

## Руководство по кодированию

### Стиль кодирования

Приложение следует стандартам TypeScript и React:

1. Используйте строгую типизацию
2. Следуйте принципам функционального программирования
3. Используйте хуки вместо классовых компонентов
4. Применяйте мемоизацию для оптимизации производительности

### Именование

1. Используйте PascalCase для компонентов и классов
2. Используйте camelCase для переменных и функций
3. Используйте UPPER_CASE для констант
4. Используйте описательные имена

### Комментарии

1. Комментируйте сложную бизнес-логику
2. Используйте JSDoc для документирования функций
3. Удаляйте закомментированный код перед коммитом

## Работа с задачами и функциями

### Добавление новой функции

1. Создайте ветку для новой функции
2. Реализуйте функцию в соответствии с архитектурой
3. Напишите unit-тесты
4. Обновите документацию
5. Создайте pull request

### Исправление ошибок

1. Создайте ветку для исправления
2. Напишите тест, воспроизводящий ошибку
3. Исправьте ошибку
4. Убедитесь, что тест проходит
5. Создайте pull request

---

_Документация обновлена: September 5, 2025_
