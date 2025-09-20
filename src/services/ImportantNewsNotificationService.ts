import AsyncStorage from '@react-native-async-storage/async-storage';

interface ImportantNews {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  is_important: boolean;
  created_at: string;
}

interface DismissedNews {
  id: string;
  dismissed_at: string;
}

const DISMISSED_NEWS_KEY = 'dismissed_important_news';
const LAST_CHECK_KEY = 'last_important_news_check';

export class ImportantNewsNotificationService {
  // Получение списка отклоненных новостей
  static async getDismissedNews(): Promise<DismissedNews[]> {
    try {
      const dismissedNews = await AsyncStorage.getItem(DISMISSED_NEWS_KEY);
      return dismissedNews ? JSON.parse(dismissedNews) : [];
    } catch (error) {
      console.error('Ошибка при получении отклоненных новостей:', error);
      return [];
    }
  }

  // Добавление новости в список отклоненных
  static async dismissNews(newsId: string): Promise<void> {
    try {
      const dismissedNews = await this.getDismissedNews();
      const newDismissedNews: DismissedNews = {
        id: newsId,
        dismissed_at: new Date().toISOString(),
      };

      // Удаляем старую запись, если есть
      const filteredNews = dismissedNews.filter(item => item.id !== newsId);

      // Добавляем новую запись
      const updatedNews = [...filteredNews, newDismissedNews];

      await AsyncStorage.setItem(DISMISSED_NEWS_KEY, JSON.stringify(updatedNews));
    } catch (error) {
      console.error('Ошибка при отклонении новости:', error);
    }
  }

  // Проверка, была ли новость отклонена
  static async isNewsDismissed(newsId: string): Promise<boolean> {
    try {
      const dismissedNews = await this.getDismissedNews();
      return dismissedNews.some(item => item.id === newsId);
    } catch (error) {
      console.error('Ошибка при проверке отклоненной новости:', error);
      return false;
    }
  }

  // Очистка старых записей об отклоненных новостях (старше 30 дней)
  static async cleanupOldDismissedNews(): Promise<void> {
    try {
      const dismissedNews = await this.getDismissedNews();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const filteredNews = dismissedNews.filter(item => {
        const dismissedDate = new Date(item.dismissed_at);
        return dismissedDate > thirtyDaysAgo;
      });

      await AsyncStorage.setItem(DISMISSED_NEWS_KEY, JSON.stringify(filteredNews));
    } catch (error) {
      console.error('Ошибка при очистке старых отклоненных новостей:', error);
    }
  }

  // Сохранение времени последней проверки новостей
  static async saveLastCheckTime(): Promise<void> {
    try {
      const currentTime = new Date().toISOString();
      await AsyncStorage.setItem(LAST_CHECK_KEY, currentTime);
    } catch (error) {
      console.error('Ошибка при сохранении времени последней проверки:', error);
    }
  }

  // Получение времени последней проверки новостей
  static async getLastCheckTime(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(LAST_CHECK_KEY);
    } catch (error) {
      console.error('Ошибка при получении времени последней проверки:', error);
      return null;
    }
  }

  // Проверка, нужно ли проверять новости (прошло больше 10 минут)
  static async shouldCheckNews(): Promise<boolean> {
    try {
      const lastCheck = await this.getLastCheckTime();

      if (!lastCheck) {
        return true;
      }

      const lastCheckTime = new Date(lastCheck);
      const currentTime = new Date();
      const diffInMinutes = (currentTime.getTime() - lastCheckTime.getTime()) / (1000 * 60);

      return diffInMinutes >= 10;
    } catch (error) {
      console.error('Ошибка при проверке необходимости проверки новостей:', error);
      return true;
    }
  }
}
