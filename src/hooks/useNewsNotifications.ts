import { useEffect, useRef } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { ImportantNewsNotificationService } from '../services/ImportantNewsNotificationService';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  is_important: boolean;
  created_at: string;
}

export const useNewsNotifications = () => {
  const { addNotification, notifications } = useNotifications();
  const hasAddedNotification = useRef(false);

  useEffect(() => {
    // Функция для проверки новых важных новостей
    const checkForImportantNews = async () => {
      try {
        // Проверяем, нужно ли проверять новости
        const shouldCheck = await ImportantNewsNotificationService.shouldCheckNews();

        if (!shouldCheck) {
          return;
        }

        // Вместо Supabase используем заглушку
        // В реальном приложении здесь должен быть запрос к локальному хранилищу
        console.log('Проверка новых важных новостей (заглушка)');

        // Имитация получения новостей
        const mockNews: NewsItem[] = [
          {
            id: '1',
            title: 'Важная новость',
            content: 'Добро пожаловать в футбольную школу Arsenal!',
            excerpt: 'Добро пожаловать в футбольную школу Arsenal!',
            is_important: true,
            created_at: new Date().toISOString(),
          },
        ];

        // Проверяем каждую важную новость
        for (const newsItem of mockNews) {
          if (newsItem.is_important) {
            // Проверяем, не была ли новость отклонена
            const isDismissed = await ImportantNewsNotificationService.isNewsDismissed(newsItem.id);

            if (isDismissed) {
              continue;
            }

            // Проверяем, есть ли уже уведомление об этой новости
            const existingNotification = notifications.find(
              notification => notification.title === newsItem.title && notification.isImportant
            );

            // Если уведомления еще нет и мы еще не добавляли его, добавляем его
            if (!existingNotification && !hasAddedNotification.current) {
              addNotification({
                title: newsItem.title,
                message: newsItem.excerpt,
                isImportant: true,
                type: 'warning',
              });
              hasAddedNotification.current = true;
            }
          }
        }

        // Сохраняем время последней проверки
        await ImportantNewsNotificationService.saveLastCheckTime();
      } catch (error) {
        console.error('Ошибка при проверке новостей:', error);
      }
    };

    // Проверяем новости при запуске
    checkForImportantNews();

    // Устанавливаем интервал для периодической проверки (каждые 5 минут)
    const interval = setInterval(checkForImportantNews, 5 * 60 * 1000);

    // Очищаем интервал при размонтировании
    return () => clearInterval(interval);
  }, [addNotification, notifications]);
};
