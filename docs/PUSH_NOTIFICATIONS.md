# Система Push-уведомлений

## Обзор

Этот документ описывает реализацию системы push-уведомлений в приложении футбольной школы Arsenal. Система позволяет отправлять пользователям уведомления в реальном времени о важных событиях, таких как:

- Новые новости
- Изменения в расписании
- Результаты тренировок
- Достижения учеников
- Напоминания о тренировках

## Архитектура

### Сервис push-уведомлений

Система реализована через сервис `PushNotificationService`, который предоставляет следующие функции:

1. **Регистрация токенов** - регистрация токенов устройств пользователей
2. **Отправка уведомлений** - отправка push-уведомлений пользователям
3. **Хранение уведомлений** - локальное хранение истории уведомлений
4. **Управление уведомлениями** - отметка как прочитанные, удаление, очистка старых

### Hook для React

Для удобного использования в компонентах React создан hook `usePushNotifications`, который предоставляет:

- Загрузку уведомлений пользователя
- Подсчет непрочитанных уведомлений
- Функции для управления уведомлениями

## Реализация

### Сервис PushNotificationService

Сервис находится в файле `src/services/PushNotificationService.ts` и включает следующие функции:

```typescript
// Регистрация токена push-уведомлений для пользователя
registerPushToken(userId: string, token: string): Promise<boolean>

// Получение токена push-уведомлений для пользователя
getPushToken(userId: string): Promise<string | null>

// Отправка push-уведомления пользователю
sendPushNotification(userId: string, title: string, body: string, data?: Record<string, any>): Promise<boolean>

// Сохранение push-уведомления
savePushNotification(notification: PushNotification): Promise<boolean>

// Получение всех push-уведомлений для пользователя
getUserPushNotifications(userId: string): Promise<PushNotification[]>

// Получение непрочитанных push-уведомлений для пользователя
getUnreadPushNotifications(userId: string): Promise<PushNotification[]>

// Отметка уведомления как прочитанного
markNotificationAsRead(notificationId: string): Promise<boolean>

// Удаление уведомления
deleteNotification(notificationId: string): Promise<boolean>

// Очистка старых уведомлений (старше 30 дней)
cleanupOldNotifications(): Promise<boolean>
```

### Hook usePushNotifications

Hook находится в файле `src/hooks/usePushNotifications.ts` и предоставляет следующий интерфейс:

```typescript
const {
  notifications, // Список уведомлений пользователя
  unreadCount, // Количество непрочитанных уведомлений
  loading, // Состояние загрузки
  markAsRead, // Функция для отметки уведомления как прочитанного
  deleteNotification, // Функция для удаления уведомления
  sendTestNotification, // Функция для отправки тестового уведомления
  refresh, // Функция для обновления списка уведомлений
} = usePushNotifications();
```

## Использование

### Регистрация токена устройства

Для регистрации токена устройства пользователя необходимо вызвать функцию `registerPushToken`:

```typescript
import { PushNotificationService } from '../services';

// После получения токена от устройства
const token = 'device_push_token';
const userId = 'user123';

await PushNotificationService.registerPushToken(userId, token);
```

### Отправка уведомления

Для отправки уведомления пользователю используется функция `sendPushNotification`:

```typescript
import { PushNotificationService } from '../services';

await PushNotificationService.sendPushNotification(
  userId,
  'Новая новость',
  'Опубликована новая новость в школе',
  { type: 'news', newsId: 'news123' }
);
```

### Использование в компонентах React

Для использования в компонентах React рекомендуется использовать hook `usePushNotifications`:

```typescript
import React from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';

const NotificationComponent: React.FC = () => {
  const { notifications, unreadCount, markAsRead, deleteNotification } = usePushNotifications();

  return (
    <div>
      <h2>Уведомления ({unreadCount} непрочитанных)</h2>
      {notifications.map(notification => (
        <div key={notification.id}>
          <h3>{notification.title}</h3>
          <p>{notification.body}</p>
          <button onClick={() => markAsRead(notification.id)}>
            Отметить как прочитанное
          </button>
          <button onClick={() => deleteNotification(notification.id)}>
            Удалить
          </button>
        </div>
      ))}
    </div>
  );
};
```

## Тестирование

Для сервиса push-уведомлений созданы unit-тесты, которые проверяют все основные функции сервиса. Тесты находятся в файле `src/services/__tests__/PushNotificationService.test.ts`.

### Запуск тестов

```bash
npm test src/services/__tests__/PushNotificationService.test.ts
```

## Планы по улучшению

1. **Интеграция с Firebase Cloud Messaging** - для реальной отправки push-уведомлений через облачный сервис
2. **Категоризация уведомлений** - возможность настройки типов уведомлений, которые пользователь хочет получать
3. **Расписание уведомлений** - возможность планирования уведомлений на определенное время
4. **Локализация** - поддержка разных языков для уведомлений
5. **Аналитика** - сбор статистики по открытию уведомлений

## Безопасность

Система push-уведомлений реализует следующие меры безопасности:

1. **Валидация токенов** - проверка корректности токенов перед регистрацией
2. **Ограничение по пользователю** - уведомления отправляются только конкретному пользователю
3. **Очистка старых данных** - автоматическая очистка уведомлений старше 30 дней
4. **Логирование ошибок** - запись ошибок в лог для последующего анализа

## Производительность

Для обеспечения высокой производительности реализованы следующие оптимизации:

1. **Локальное хранение** - уведомления хранятся локально на устройстве пользователя
2. **Ограничение по количеству** - автоматическая очистка старых уведомлений
3. **Ленивая загрузка** - уведомления загружаются только при необходимости
4. **Мемоизация** - оптимизация повторных вызовов функций

## Совместимость

Система push-уведомлений совместима со следующими платформами:

- iOS
- Android
- Web (через Service Workers)

Для каждой платформы требуется соответствующая настройка сервиса push-уведомлений.
