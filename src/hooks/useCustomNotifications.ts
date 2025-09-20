// src/hooks/useCustomNotifications.ts
// Хук для работы с пользовательскими уведомлениями

import { useState, useEffect, useCallback, useRef } from 'react';
import { CustomNotificationService } from '../services/CustomNotificationService';
import { PushNotificationService } from '../services/PushNotificationService';
import { useAuth } from '../context/LocalStorageAuthContext';

export const useCustomNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  // Загрузка уведомлений пользователя
  const loadNotifications = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    try {
      setLoading(true);
      const userNotifications = await CustomNotificationService.getUserNotifications(user.id);
      setNotifications(userNotifications);

      // Подсчет непрочитанных уведомлений
      const unread = userNotifications.filter(notification => !notification.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Ошибка при загрузке уведомлений:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Отметка уведомления как прочитанного
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await CustomNotificationService.markNotificationAsRead(notificationId);
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
        await CustomNotificationService.deleteNotification(notificationId);
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
      await CustomNotificationService.sendCustomNotification(
        user.id,
        'Тестовое уведомление',
        'Это тестовое уведомление через пользовательскую систему',
        'info',
        { type: 'test', timestamp: Date.now() }
      );
      await loadNotifications(); // Перезагружаем уведомления
    } catch (error) {
      console.error('Ошибка при отправке тестового уведомления:', error);
    }
  }, [user?.id, loadNotifications]);

  // Периодический опрос сервера на наличие новых уведомлений
  const startPolling = useCallback(() => {
    if (!user?.id) {
      return;
    }

    // Останавливаем предыдущий интервал, если он есть
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
    }

    // Начинаем периодический опрос сервера (каждые 5 минут)
    pollInterval.current = setInterval(
      async () => {
        try {
          await CustomNotificationService.pollServerForNotifications(user.id);
          await loadNotifications(); // Перезагружаем уведомления
        } catch (error) {
          console.error('Ошибка при опросе сервера:', error);
        }
      },
      5 * 60 * 1000
    ); // 5 минут
  }, [user?.id, loadNotifications]);

  // Остановка периодического опроса
  const stopPolling = useCallback(() => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
      pollInterval.current = null;
    }
  }, []);

  // Эффект для загрузки уведомлений при монтировании и при изменении пользователя
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Эффект для запуска периодического опроса при изменении пользователя
  useEffect(() => {
    if (user?.id) {
      startPolling();
    } else {
      stopPolling();
    }

    // Очищаем интервал при размонтировании
    return () => {
      stopPolling();
    };
  }, [user?.id, startPolling, stopPolling]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    deleteNotification,
    sendTestNotification,
    refresh: loadNotifications,
    startPolling,
    stopPolling,
  };
};
