// src/services/PushNotificationService.ts
// Сервис для работы с push-уведомлениями

import AsyncStorage from '@react-native-async-storage/async-storage';

// Тип для push-уведомления
export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: string;
  read: boolean;
  userId: string;
}

// Ключ для хранения токенов push-уведомлений в AsyncStorage
const PUSH_TOKEN_KEY = '@arsenal_school_push_tokens';

// Ключ для хранения уведомлений в AsyncStorage
const PUSH_NOTIFICATIONS_KEY = '@arsenal_school_push_notifications';

/**
 * Регистрация токена push-уведомлений для пользователя
 */
export const registerPushToken = async (userId: string, token: string): Promise<boolean> => {
  try {
    const tokensData = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
    const tokens = tokensData ? JSON.parse(tokensData) : {};

    tokens[userId] = token;
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, JSON.stringify(tokens));

    return true;
  } catch (error) {
    console.error('Ошибка при регистрации токена push-уведомлений:', error);
    return false;
  }
};

/**
 * Получение токена push-уведомлений для пользователя
 */
export const getPushToken = async (userId: string): Promise<string | null> => {
  try {
    const tokensData = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
    const tokens = tokensData ? JSON.parse(tokensData) : {};

    return tokens[userId] || null;
  } catch (error) {
    console.error('Ошибка при получении токена push-уведомлений:', error);
    return null;
  }
};

/**
 * Отправка push-уведомления пользователю
 */
export const sendPushNotification = async (
  userId: string,
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<boolean> => {
  try {
    // В реальном приложении здесь будет вызов сервиса push-уведомлений
    // Для демонстрации просто сохраняем уведомление локально

    const token = await getPushToken(userId);
    if (!token) {
      console.warn('Токен push-уведомлений не найден для пользователя:', userId);
      return false;
    }

    // Создаем уведомление
    const notification: PushNotification = {
      id: Date.now().toString(),
      title,
      body,
      data,
      timestamp: new Date().toISOString(),
      read: false,
      userId,
    };

    // Сохраняем уведомление
    await savePushNotification(notification);

    // В реальном приложении здесь будет отправка через сервис push-уведомлений
    console.log(`Отправка push-уведомления пользователю ${userId}:`, { title, body, data });

    return true;
  } catch (error) {
    console.error('Ошибка при отправке push-уведомления:', error);
    return false;
  }
};

/**
 * Сохранение push-уведомления
 */
export const savePushNotification = async (notification: PushNotification): Promise<boolean> => {
  try {
    const notificationsData = await AsyncStorage.getItem(PUSH_NOTIFICATIONS_KEY);
    const notifications = notificationsData ? JSON.parse(notificationsData) : [];

    notifications.push(notification);
    await AsyncStorage.setItem(PUSH_NOTIFICATIONS_KEY, JSON.stringify(notifications));

    return true;
  } catch (error) {
    console.error('Ошибка при сохранении push-уведомления:', error);
    return false;
  }
};

/**
 * Получение всех push-уведомлений для пользователя
 */
export const getUserPushNotifications = async (userId: string): Promise<PushNotification[]> => {
  try {
    const notificationsData = await AsyncStorage.getItem(PUSH_NOTIFICATIONS_KEY);
    const notifications = notificationsData ? JSON.parse(notificationsData) : [];

    return notifications.filter((notification: PushNotification) => notification.userId === userId);
  } catch (error) {
    console.error('Ошибка при получении push-уведомлений:', error);
    return [];
  }
};

/**
 * Получение непрочитанных push-уведомлений для пользователя
 */
export const getUnreadPushNotifications = async (userId: string): Promise<PushNotification[]> => {
  try {
    const notifications = await getUserPushNotifications(userId);
    return notifications.filter(notification => !notification.read);
  } catch (error) {
    console.error('Ошибка при получении непрочитанных push-уведомлений:', error);
    return [];
  }
};

/**
 * Отметка уведомления как прочитанного
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const notificationsData = await AsyncStorage.getItem(PUSH_NOTIFICATIONS_KEY);
    const notifications = notificationsData ? JSON.parse(notificationsData) : [];

    const updatedNotifications = notifications.map((notification: PushNotification) => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    });

    await AsyncStorage.setItem(PUSH_NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));

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
    const notificationsData = await AsyncStorage.getItem(PUSH_NOTIFICATIONS_KEY);
    const notifications = notificationsData ? JSON.parse(notificationsData) : [];

    const updatedNotifications = notifications.filter(
      (notification: PushNotification) => notification.id !== notificationId
    );

    await AsyncStorage.setItem(PUSH_NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));

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
    const notificationsData = await AsyncStorage.getItem(PUSH_NOTIFICATIONS_KEY);
    const notifications = notificationsData ? JSON.parse(notificationsData) : [];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const updatedNotifications = notifications.filter((notification: PushNotification) => {
      const notificationDate = new Date(notification.timestamp);
      return notificationDate > thirtyDaysAgo;
    });

    await AsyncStorage.setItem(PUSH_NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));

    return true;
  } catch (error) {
    console.error('Ошибка при очистке старых уведомлений:', error);
    return false;
  }
};

/**
 * Инициализация сервиса push-уведомлений
 */
export const initializePushNotifications = async (): Promise<boolean> => {
  try {
    // В реальном приложении здесь будет инициализация сервиса push-уведомлений
    console.log('Инициализация сервиса push-уведомлений');

    // Очищаем старые уведомления при запуске
    await cleanupOldNotifications();

    return true;
  } catch (error) {
    console.error('Ошибка при инициализации сервиса push-уведомлений:', error);
    return false;
  }
};

// Экспорт сервиса
export const PushNotificationService = {
  registerPushToken,
  getPushToken,
  sendPushNotification,
  savePushNotification,
  getUserPushNotifications,
  getUnreadPushNotifications,
  markNotificationAsRead,
  deleteNotification,
  cleanupOldNotifications,
  initializePushNotifications,
};
