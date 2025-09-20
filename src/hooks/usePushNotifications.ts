// src/hooks/usePushNotifications.ts
// Хук для работы с push-уведомлениями

import { useState, useEffect, useCallback } from 'react';
import { PushNotificationService } from '../services/PushNotificationService';
import { useAuth } from '../context/LocalStorageAuthContext';

export const usePushNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Загрузка уведомлений пользователя
  const loadNotifications = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    try {
      setLoading(true);
      const userNotifications = await PushNotificationService.getUserPushNotifications(user.id);
      setNotifications(userNotifications);

      // Подсчет непрочитанных уведомлений
      const unread = userNotifications.filter(notification => !notification.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Ошибка при загрузке push-уведомлений:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Отметка уведомления как прочитанного
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await PushNotificationService.markNotificationAsRead(notificationId);
        await loadNotifications(); // Перезагружаем уведомления
      } catch (error) {
        console.error('Ошибка при отметке уведомления как прочитанного:', error);
      }
    },
    [loadNotifications]
  );

  // Удаление уведомления
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        await PushNotificationService.deleteNotification(notificationId);
        await loadNotifications(); // Перезагружаем уведомления
      } catch (error) {
        console.error('Ошибка при удалении уведомления:', error);
      }
    },
    [loadNotifications]
  );

  // Отправка тестового уведомления
  const sendTestNotification = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    try {
      await PushNotificationService.sendPushNotification(
        user.id,
        'Тестовое уведомление',
        'Это тестовое push-уведомление',
        { type: 'test' }
      );
      await loadNotifications(); // Перезагружаем уведомления
    } catch (error) {
      console.error('Ошибка при отправке тестового уведомления:', error);
    }
  }, [user?.id, loadNotifications]);

  // Эффект для загрузки уведомлений при монтировании и при изменении пользователя
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    deleteNotification,
    sendTestNotification,
    refresh: loadNotifications,
  };
};
