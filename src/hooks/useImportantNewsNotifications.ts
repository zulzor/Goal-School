import { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../context/NotificationContext';

interface ImportantNews {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  is_important: boolean;
  created_at: string;
}

export const useImportantNewsNotifications = () => {
  const { addNotification, notifications } = useNotifications();
  const [importantNews, setImportantNews] = useState<ImportantNews[]>([]);
  const [dismissedNews, setDismissedNews] = useState<string[]>([]);
  const hasCheckedNews = useRef(false);

  // Функция для получения важных новостей (в реальном приложении здесь будет запрос к API)
  const fetchImportantNews = async (): Promise<ImportantNews[]> => {
    // Имитация получения данных
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            title: 'Важное объявление',
            content:
              'Сегодня состоится общее собрание всех учеников и родителей в 18:00 в главном зале.',
            excerpt:
              'Сегодня состоится общее собрание всех учеников и родителей в 18:00 в главном зале.',
            is_important: true,
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Изменение расписания',
            content:
              'Завтра тренировки U-10 и U-12 переносятся на 15:00 из-за технических работ на поле.',
            excerpt:
              'Завтра тренировки U-10 и U-12 переносятся на 15:00 из-за технических работ на поле.',
            is_important: true,
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Вчерашняя новость
          },
        ]);
      }, 500);
    });
  };

  // Проверка новых важных новостей
  const checkForNewImportantNews = async () => {
    try {
      const news = await fetchImportantNews();
      const importantNewsItems = news.filter(item => item.is_important);

      setImportantNews(importantNewsItems);

      // Проверяем каждую важную новость
      for (const newsItem of importantNewsItems) {
        // Проверяем, не было ли уже уведомления об этой новости
        const existingNotification = notifications.find(
          notification => notification.title === newsItem.title
        );

        // Проверяем, не была ли новость отклонена пользователем
        const isDismissed = dismissedNews.includes(newsItem.id);

        // Если уведомления еще нет и новость не отклонена, создаем уведомление
        if (!existingNotification && !isDismissed) {
          addNotification({
            title: newsItem.title,
            message: newsItem.excerpt,
            isImportant: true,
            type: 'warning',
          });
        }
      }
    } catch (error) {
      console.error('Ошибка при проверке важных новостей:', error);
    }
  };

  // Отклонение новости
  const dismissNews = (newsId: string) => {
    setDismissedNews(prev => [...prev, newsId]);
  };

  useEffect(() => {
    // Проверяем новости только один раз при запуске
    if (!hasCheckedNews.current) {
      checkForNewImportantNews();
      hasCheckedNews.current = true;
    }

    // Устанавливаем интервал для периодической проверки (каждые 10 минут)
    const interval = setInterval(checkForNewImportantNews, 10 * 60 * 1000);

    // Очищаем интервал при размонтировании
    return () => clearInterval(interval);
  }, [addNotification, notifications, dismissedNews]);

  return {
    importantNews,
    dismissNews,
    checkForNewImportantNews,
  };
};
