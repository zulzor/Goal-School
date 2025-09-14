// src/services/NewsService.ts
// Сервис для работы с новостями

import AsyncStorage from '@react-native-async-storage/async-storage';

// Тип для новости
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  authorName: string;
  image: string | null;
  tags: string[];
  isImportant: boolean;
  publishedAt: string;
}

// Ключ для хранения новостей в AsyncStorage
const NEWS_STORAGE_KEY = '@arsenal_school_news';

/**
 * Получение всех новостей
 */
export const getAllNews = async (): Promise<NewsItem[]> => {
  try {
    const newsData = await AsyncStorage.getItem(NEWS_STORAGE_KEY);
    return newsData ? JSON.parse(newsData) : [];
  } catch (error) {
    console.error('Ошибка при получении новостей:', error);
    return [];
  }
};

/**
 * Создание новой новости
 */
export const createNews = async (
  newsItem: Omit<NewsItem, 'id' | 'publishedAt'>
): Promise<NewsItem> => {
  try {
    const allNews = await getAllNews();

    const newNewsItem: NewsItem = {
      ...newsItem,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString().split('T')[0],
    };

    const updatedNews = [newNewsItem, ...allNews];
    await AsyncStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(updatedNews));

    return newNewsItem;
  } catch (error) {
    console.error('Ошибка при создании новости:', error);
    throw new Error('Не удалось создать новость');
  }
};

/**
 * Обновление новости
 */
export const updateNews = async (
  id: string,
  updates: Partial<NewsItem>
): Promise<NewsItem | null> => {
  try {
    const allNews = await getAllNews();
    const newsIndex = allNews.findIndex(news => news.id === id);

    if (newsIndex === -1) {
      return null;
    }

    const updatedNewsItem = {
      ...allNews[newsIndex],
      ...updates,
    };

    allNews[newsIndex] = updatedNewsItem;
    await AsyncStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(allNews));

    return updatedNewsItem;
  } catch (error) {
    console.error('Ошибка при обновлении новости:', error);
    throw new Error('Не удалось обновить новость');
  }
};

/**
 * Удаление новости
 */
export const deleteNews = async (id: string): Promise<boolean> => {
  try {
    const allNews = await getAllNews();
    const filteredNews = allNews.filter(news => news.id !== id);

    await AsyncStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(filteredNews));
    return true;
  } catch (error) {
    console.error('Ошибка при удалении новости:', error);
    return false;
  }
};

/**
 * Получение важных новостей
 */
export const getImportantNews = async (): Promise<NewsItem[]> => {
  try {
    const allNews = await getAllNews();
    return allNews.filter(news => news.isImportant);
  } catch (error) {
    console.error('Ошибка при получении важных новостей:', error);
    return [];
  }
};

/**
 * Поиск новостей по тегу
 */
export const getNewsByTag = async (tag: string): Promise<NewsItem[]> => {
  try {
    const allNews = await getAllNews();
    return allNews.filter(news => news.tags.includes(tag));
  } catch (error) {
    console.error('Ошибка при поиске новостей по тегу:', error);
    return [];
  }
};

// Экспорт сервиса
export const NewsService = {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  getImportantNews,
  getNewsByTag,
};

// Экспорт NewsStorageService для совместимости
export const NewsStorageService = NewsService;
