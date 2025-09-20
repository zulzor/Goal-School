import { useEffect, useRef } from 'react';
import { useAuth } from '../context/LocalStorageAuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Achievement } from '../types';
import AchievementService from '../services/AchievementService';

// Хук для отслеживания новых достижений и отправки уведомлений
export const useAchievementNotifications = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const previousAchievements = useRef<Achievement[]>([]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (user) {
      // Проверяем новые достижения каждые 30 секунд
      intervalId = setInterval(checkForNewAchievements, 30000);

      // Проверяем сразу при загрузке
      checkForNewAchievements();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user]);

  const checkForNewAchievements = async () => {
    try {
      if (!user) return;

      const currentAchievements = await AchievementService.getStudentAchievements(user.id);

      // Проверяем, есть ли новые разблокированные достижения
      const newUnlocked = currentAchievements.filter(current => {
        // Проверяем, что достижение разблокировано
        if (!current.isUnlocked) return false;

        // Проверяем, было ли оно разблокировано ранее
        const previous = previousAchievements.current.find(prev => prev.id === current.id);
        return !previous || !previous.isUnlocked;
      });

      // Отправляем уведомления для новых достижений
      newUnlocked.forEach(achievement => {
        addNotification({
          title: 'Новое достижение!',
          message: `Поздравляем! Вы разблокировали достижение "${achievement.title}".`,
          isImportant: true,
          type: 'success',
        });
      });

      // Обновляем предыдущие достижения
      previousAchievements.current = currentAchievements;
    } catch (error) {
      console.error('Ошибка проверки достижений:', error);
    }
  };
};
