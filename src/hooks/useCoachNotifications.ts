// Хук для уведомлений тренеров о новых записях посещаемости

import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotifications } from '../context/NotificationContext';
import { CoachNotificationService } from '../services/CoachNotificationService';
import { useAuth } from '../context/LocalStorageAuthContext';

export const useCoachNotifications = () => {
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  useEffect(() => {
    // Только для тренеров
    if (user?.role !== 'coach' || !user.id) {
      return;
    }

    // Функция для проверки новых записей посещаемости
    const checkForNewAttendanceRecords = async () => {
      try {
        // В реальном приложении здесь должна быть логика проверки новых записей
        // для конкретного тренера. Пока используем имитацию.

        // Проверяем, нужно ли проверять записи (не чаще чем раз в 10 минут)
        const lastNotificationTime = await CoachNotificationService.getLastNotificationTime();
        const now = new Date().getTime();

        if (lastNotificationTime) {
          const lastTime = parseInt(lastNotificationTime);
          const diffInMinutes = (now - lastTime) / (1000 * 60);

          if (diffInMinutes < 10) {
            return; // Слишком рано для проверки
          }
        }

        // Имитация новых записей
        const hasNewRecords = Math.random() > 0.7; // 30% шанс на наличие новых записей

        if (hasNewRecords) {
          // Добавляем уведомление
          addNotification({
            title: 'Новые записи посещаемости',
            message: 'Появились новые отметки посещаемости от ваших учеников',
            isImportant: false,
            type: 'info',
          });

          // Сохраняем время последнего уведомления
          await AsyncStorage.setItem('last_coach_notification_time', now.toString());
        }
      } catch (error) {
        console.error('Ошибка при проверке новых записей посещаемости:', error);
      }
    };

    // Проверяем новые записи при запуске
    checkForNewAttendanceRecords();

    // Устанавливаем интервал для периодической проверки (каждые 5 минут)
    const interval = setInterval(checkForNewAttendanceRecords, 5 * 60 * 1000);

    // Очищаем интервал при размонтировании
    return () => clearInterval(interval);
  }, [addNotification, user]);
};
