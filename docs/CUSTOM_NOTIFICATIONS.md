# Система пользовательских уведомлений

## Обзор

Система пользовательских уведомлений представляет собой собственную реализацию механизма уведомлений через периодический опрос сервера. Эта система заменяет интеграцию с Firebase Cloud Messaging и предоставляет более гибкий подход к управлению уведомлениями в приложении.

## Архитектура

### Компоненты системы

1. **CustomNotificationService** - основной сервис для работы с уведомлениями
2. **useCustomNotifications** - React хук для интеграции уведомлений в компоненты
3. **PushNotificationService** - существующий сервис для локального хранения уведомлений

### Основные функции

- Регистрация токенов уведомлений для пользователей
- Отправка и получение уведомлений
- Периодический опрос сервера на наличие новых уведомлений
- Управление прочитанными/непрочитанными уведомлениями
- Очистка старых уведомлений

## Реализация

### CustomNotificationService

Сервис предоставляет следующие функции:

```typescript
// Регистрация токена уведомлений для пользователя
registerNotificationToken(userId: string, token: string): Promise<boolean>

// Получение токена уведомлений для пользователя
getNotificationToken(userId: string): Promise<string | null>

// Отправка уведомления пользователю
sendCustomNotification(
  userId: string,
  title: string,
  body: string,
  type: 'info' | 'success' | 'warning' | 'error',
  data?: Record<string, any>
): Promise<boolean>

// Сохранение пользовательского уведомления
saveCustomNotification(notification: CustomNotification): Promise<boolean>

// Получение всех уведомлений для пользователя
getUserNotifications(userId: string): Promise<CustomNotification[]>

// Получение непрочитанных уведомлений для пользователя
getUnreadNotifications(userId: string): Promise<CustomNotification[]>

// Отметка уведомления как прочитанного
markNotificationAsRead(notificationId: string): Promise<boolean>

// Удаление уведомления
deleteNotification(notificationId: string): Promise<boolean>

// Очистка старых уведомлений (старше 30 дней)
cleanupOldNotifications(): Promise<boolean>

// Периодический опрос сервера на наличие новых уведомлений
pollServerForNotifications(userId: string): Promise<boolean>
```

### useCustomNotifications

Хук предоставляет следующие функции для использования в компонентах:

```typescript
const {
  notifications, // Список уведомлений пользователя
  unreadCount, // Количество непрочитанных уведомлений
  loading, // Состояние загрузки
  markAsRead, // Функция для отметки уведомления как прочитанного
  deleteNotification, // Функция для удаления уведомления
  sendTestNotification, // Функция для отправки тестового уведомления
  refresh, // Функция для обновления списка уведомлений
  startPolling, // Функция для запуска периодического опроса
  stopPolling, // Функция для остановки периодического опроса
} = useCustomNotifications();
```

## Интеграция

### Подключение в AppNavigator

Хук [useCustomNotifications](file:///c:/Users/jolab/Desktop/Goal-School/src/hooks/useCustomNotifications.ts#L7-L100) подключается в [AppNavigator.tsx](file:///c:/Users/jolab/Desktop/Goal-School/src/navigation/AppNavigator.tsx):

```typescript
import { useCustomNotifications } from '../hooks/useCustomNotifications';

// В компоненте MainTabs
useCustomNotifications();
```

Это автоматически запускает периодический опрос сервера на наличие новых уведомлений каждые 5 минут.

## Периодический опрос сервера

Система реализует периодический опрос сервера для получения новых уведомлений:

1. Опрос происходит каждые 5 минут
2. Проверяется необходимость опроса (не чаще чем раз в 5 минут)
3. В реальном приложении здесь будет запрос к вашему API
4. Для демонстрации создаются случайные уведомления

## Локальное хранение

Уведомления хранятся локально с использованием AsyncStorage:

- Уведомления: `@arsenal_school_custom_notifications`
- Токены: `@arsenal_school_notification_tokens`
- Время последнего опроса: `@arsenal_school_last_poll_time`

## Преимущества

1. **Независимость от внешних сервисов** - не требует Firebase или других внешних сервисов
2. **Гибкость** - легко адаптируется под любые требования API
3. **Контроль** - полный контроль над механизмом уведомлений
4. **Офлайн-поддержка** - уведомления сохраняются локально
5. **Производительность** - оптимизированный периодический опрос

## Планируемые улучшения

1. **WebSocket интеграция** - добавление поддержки WebSocket для реального времени
2. **Приоритезация уведомлений** - система приоритетов для уведомлений
3. **Категории уведомлений** - фильтрация уведомлений по категориям
4. **Настройки уведомлений** - пользовательские настройки частоты и типов уведомлений
