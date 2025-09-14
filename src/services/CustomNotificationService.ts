// src/services/CustomNotificationService.ts
// Сервис для работы с собственной системой уведомлений через периодический опрос сервера

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PushNotificationService } from './PushNotificationService';

// Тип для пользовательского уведомления
export interface CustomNotification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: string;
  read: boolean;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// Тип для токена уведомлений
export interface NotificationToken {
  token: string;
  userId: string;
  timestamp: string;
}

// Ключи для хранения данных в AsyncStorage
const CUSTOM_NOTIFICATIONS_KEY = '@arsenal_school_custom_notifications';
const NOTIFICATION_TOKENS_KEY = '@arsenal_school_notification_tokens';
const LAST_POLL_KEY = '@arsenal_school_last_poll_time';

/**
 * Регистрация токена уведомлений для пользователя
 */
export const registerNotificationToken = async (
  userId: string,
  token: string
): Promise<boolean> => {
  try {
    // Регистрируем токен в основном сервисе push-уведомлений
    const pushServiceResult = await PushNotificationService.registerPushToken(userId, token);

    if (!pushServiceResult) {
      return false;
    }

    // Также сохраняем токен в отдельном хранилище
    const tokensData = await AsyncStorage.getItem(NOTIFICATION_TOKENS_KEY);
    const tokens: NotificationToken[] = tokensData ? JSON.parse(tokensData) : [];

    // Удаляем старые токены для этого пользователя
    const filteredTokens = tokens.filter(t => t.userId !== userId);

    // Добавляем новый токен
    const newToken: NotificationToken = {
      token,
      userId,
      timestamp: new Date().toISOString(),
    };

    filteredTokens.push(newToken);
    await AsyncStorage.setItem(NOTIFICATION_TOKENS_KEY, JSON.stringify(filteredTokens));

    return true;
  } catch (error) {
    console.error('Ошибка при регистрации токена уведомлений:', error);
    return false;
  }
};

/**
 * Получение токена уведомлений для пользователя
 */
export const getNotificationToken = async (userId: string): Promise<string | null> => {
  try {
    const tokensData = await AsyncStorage.getItem(NOTIFICATION_TOKENS_KEY);
    const tokens: NotificationToken[] = tokensData ? JSON.parse(tokensData) : [];

    const userToken = tokens.find(t => t.userId === userId);
    return userToken ? userToken.token : null;
  } catch (error) {
    console.error('Ошибка при получении токена уведомлений:', error);
    return null;
  }
};

/**
 * Отправка уведомления пользователю
 */
export const sendCustomNotification = async (
  userId: string,
  title: string,
  body: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  data?: Record<string, any>
): Promise<boolean> => {
  try {
    // Получаем токен уведомлений пользователя
    const token = await getNotificationToken(userId);
    if (!token) {
      console.warn('Токен уведомлений не найден для пользователя:', userId);
      return false;
    }

    // Создаем уведомление
    const notification: CustomNotification = {
      id: Date.now().toString(),
      title,
      body,
      data,
      timestamp: new Date().toISOString(),
      read: false,
      userId,
      type,
    };

    // Сохраняем уведомление
    await saveCustomNotification(notification);

    // Сохраняем уведомление через основной сервис
    const pushNotification = {
      id: notification.id,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      timestamp: notification.timestamp,
      read: notification.read,
      userId: notification.userId,
    };

    await PushNotificationService.savePushNotification(pushNotification);

    return true;
  } catch (error) {
    console.error('Ошибка при отправке уведомления:', error);
    return false;
  }
};

/**
 * Сохранение пользовательского уведомления
 */
export const saveCustomNotification = async (
  notification: CustomNotification
): Promise<boolean> => {
  try {
    const notificationsData = await AsyncStorage.getItem(CUSTOM_NOTIFICATIONS_KEY);
    const notifications = notificationsData ? JSON.parse(notificationsData) : [];

    notifications.push(notification);
    await AsyncStorage.setItem(CUSTOM_NOTIFICATIONS_KEY, JSON.stringify(notifications));

    return true;
  } catch (error) {
    console.error('Ошибка при сохранении уведомления:', error);
    return false;
  }
};

/**
 * Получение всех уведомлений для пользователя
 */
export const getUserNotifications = async (userId: string): Promise<CustomNotification[]> => {
  try {
    const notificationsData = await AsyncStorage.getItem(CUSTOM_NOTIFICATIONS_KEY);
    const notifications = notificationsData ? JSON.parse(notificationsData) : [];

    return notifications.filter(
      (notification: CustomNotification) => notification.userId === userId
    );
  } catch (error) {
    console.error('Ошибка при получении уведомлений:', error);
    return [];
  }
};

/**
 * Получение непрочитанных уведомлений для пользователя
 */
export const getUnreadNotifications = async (userId: string): Promise<CustomNotification[]> => {
  try {
    const notifications = await getUserNotifications(userId);
    return notifications.filter(notification => !notification.read);
  } catch (error) {
    console.error('Ошибка при получении непрочитанных уведомлений:', error);
    return [];
  }
};

/**
 * Отметка уведомления как прочитанного
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const notificationsData = await AsyncStorage.getItem(CUSTOM_NOTIFICATIONS_KEY);
    const notifications = notificationsData ? JSON.parse(notificationsData) : [];

    const updatedNotifications = notifications.map((notification: CustomNotification) => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });

    await AsyncStorage.setItem(CUSTOM_NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));

    // Также обновляем в основном сервисе
    await PushNotificationService.markNotificationAsRead(notificationId);

    return true;
  } catch (error) {
    console.error('Ошибка при отметке уведомления как прочитанного:', error);
    return false;
  }
};

/**
 * Удаление уведомления
 */
export const deleteNotification = async (notificationId: string): Promise<boolean> => {
  try {
    const notificationsData = await AsyncStorage.getItem(CUSTOM_NOTIFICATIONS_KEY);
    const notifications = notificationsData ? JSON.parse(notificationsData) : [];

    const updatedNotifications = notifications.filter(
      (notification: CustomNotification) => notification.id !== notificationId
    );

    await AsyncStorage.setItem(CUSTOM_NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));

    // Также удаляем в основном сервисе
    await PushNotificationService.deleteNotification(notificationId);

    return true;
  } catch (error) {
    console.error('Ошибка при удалении уведомления:', error);
    return false;
  }
};

/**
 * Очистка старых уведомлений (старше 30 дней)
 */
export const cleanupOldNotifications = async (): Promise<boolean> => {
  try {
    const notificationsData = await AsyncStorage.getItem(CUSTOM_NOTIFICATIONS_KEY);
    const notifications = notificationsData ? JSON.parse(notificationsData) : [];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const updatedNotifications = notifications.filter((notification: CustomNotification) => {
      const notificationDate = new Date(notification.timestamp);
      return notificationDate > thirtyDaysAgo;
    });

    await AsyncStorage.setItem(CUSTOM_NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));

    // Также очищаем в основном сервисе
    await PushNotificationService.cleanupOldNotifications();

    return true;
  } catch (error) {
    console.error('Ошибка при очистке старых уведомлений:', error);
    return false;
  }
};

/**
 * Получение времени последнего опроса сервера
 */
export const getLastPollTime = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LAST_POLL_KEY);
  } catch (error) {
    console.error('Ошибка при получении времени последнего опроса:', error);
    return null;
  }
};

/**
 * Сохранение времени последнего опроса сервера
 */
export const saveLastPollTime = async (): Promise<boolean> => {
  try {
    const currentTime = new Date().toISOString();
    await AsyncStorage.setItem(LAST_POLL_KEY, currentTime);
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении времени последнего опроса:', error);
    return false;
  }
};

/**
 * Проверка, нужно ли выполнять опрос сервера (не чаще чем раз в 5 минут)
 */
export const shouldPollServer = async (): Promise<boolean> => {
  try {
    const lastPoll = await getLastPollTime();

    if (!lastPoll) {
      return true;
    }

    const lastPollTime = new Date(lastPoll);
    const currentTime = new Date();
    const diffInMinutes = (currentTime.getTime() - lastPollTime.getTime()) / (1000 * 60);

    return diffInMinutes >= 5;
  } catch (error) {
    console.error('Ошибка при проверке необходимости опроса сервера:', error);
    return true;
  }
};

/**
 * Имитация опроса сервера на наличие новых уведомлений
 * В реальном приложении здесь будет запрос к вашему API
 */
export const pollServerForNotifications = async (userId: string): Promise<boolean> => {
  try {
    // Проверяем, нужно ли выполнять опрос
    const shouldPoll = await shouldPollServer();
    if (!shouldPoll) {
      return false;
    }

    // В реальном приложении здесь будет запрос к вашему API
    // Например:
    // const response = await fetch(`https://your-api.com/notifications?userId=${userId}&since=${lastPollTime}`);
    // const newNotifications = await response.json();

    // Для демонстрации создаем случайные уведомления
    const shouldCreateNotification = Math.random() > 0.8; // 20% шанс на создание уведомления

    if (shouldCreateNotification) {
      const notificationTypes: Array<'info' | 'success' | 'warning' | 'error'> = [
        'info',
        'success',
        'warning',
        'error',
      ];
      const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];

      const notificationTitles = [
        'Новое сообщение',
        'Обновление расписания',
        'Новость школы',
        'Достижение разблокировано',
        'Напоминание о тренировке',
      ];

      const notificationBodies = [
        'У вас новое сообщение от тренера',
        'Расписание на завтра обновлено',
        'Опубликована новая новость школы',
        'Поздравляем! Вы разблокировали новое достижение',
        'Напоминаем о предстоящей тренировке',
      ];

      const randomTitle = notificationTitles[Math.floor(Math.random() * notificationTitles.length)];
      const randomBody = notificationBodies[Math.floor(Math.random() * notificationBodies.length)];

      await sendCustomNotification(userId, randomTitle, randomBody, randomType, {
        source: 'server_poll',
      });
    }

    // Сохраняем время последнего опроса
    await saveLastPollTime();

    return true;
  } catch (error) {
    console.error('Ошибка при опросе сервера:', error);
    return false;
  }
};

// Экспорт сервиса
export const CustomNotificationService = {
  registerNotificationToken,
  getNotificationToken,
  sendCustomNotification,
  saveCustomNotification,
  getUserNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  deleteNotification,
  cleanupOldNotifications,
  pollServerForNotifications,
  getLastPollTime,
  saveLastPollTime,
  shouldPollServer,
};
