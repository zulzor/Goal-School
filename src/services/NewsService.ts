// src/services/NewsService.ts
// Сервис для работы с новостями

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logError, logInfo, logDebug } from '../utils/logger';
import { handleError, createError, ErrorType } from '../utils/errorHandler';
import { Validator } from '../utils/validators';

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
    logDebug('Getting all news');
    const newsData = await AsyncStorage.getItem(NEWS_STORAGE_KEY);
    const news = newsData ? JSON.parse(newsData) : [];
    
    logInfo('All news retrieved', { count: news.length });
    return news;
  } catch (error) {
    const appError = handleError(error, { operation: 'getAllNews' });
    logError('Error getting all news', appError);
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
    // Валидация данных новости
    if (!newsItem.title || newsItem.title.trim().length === 0) {
      throw createError(ErrorType.VALIDATION, 'Заголовок новости обязателен');
    }

    if (!newsItem.content || newsItem.content.trim().length === 0) {
      throw createError(ErrorType.VALIDATION, 'Содержимое новости обязательно');
    }

    if (newsItem.title.length > 200) {
      throw createError(ErrorType.VALIDATION, 'Заголовок новости слишком длинный');
    }

    if (newsItem.content.length > 5000) {
      throw createError(ErrorType.VALIDATION, 'Содержимое новости слишком длинное');
    }

    logDebug('Creating new news item', { title: newsItem.title });
    
    const allNews = await getAllNews();

    const newNewsItem: NewsItem = {
      ...newsItem,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString().split('T')[0],
    };

    const updatedNews = [newNewsItem, ...allNews];
    await AsyncStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(updatedNews));

    logInfo('News item created successfully', { id: newNewsItem.id, title: newNewsItem.title });
    return newNewsItem;
  } catch (error) {
    const appError = handleError(error, { title: newsItem.title, operation: 'createNews' });
    logError('Error creating news item', appError, { title: newsItem.title });
    throw appError;
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
    logDebug('Updating news item', { id, updates });
    
    // Валидация обновлений
    if (updates.title !== undefined && (!updates.title || updates.title.trim().length === 0)) {
      throw createError(ErrorType.VALIDATION, 'Заголовок новости не может быть пустым');
    }

    if (updates.content !== undefined && (!updates.content || updates.content.trim().length === 0)) {
      throw createError(ErrorType.VALIDATION, 'Содержимое новости не может быть пустым');
    }

    if (updates.title && updates.title.length > 200) {
      throw createError(ErrorType.VALIDATION, 'Заголовок новости слишком длинный');
    }

    if (updates.content && updates.content.length > 5000) {
      throw createError(ErrorType.VALIDATION, 'Содержимое новости слишком длинное');
    }
    
    const allNews = await getAllNews();
    const newsIndex = allNews.findIndex(news => news.id === id);

    if (newsIndex === -1) {
      logDebug('News item not found', { id });
      return null;
    }

    const updatedNewsItem = {
      ...allNews[newsIndex],
      ...updates,
    };

    allNews[newsIndex] = updatedNewsItem;
    await AsyncStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(allNews));

    logInfo('News item updated successfully', { id });
    return updatedNewsItem;
  } catch (error) {
    const appError = handleError(error, { id, operation: 'updateNews' });
    logError('Error updating news item', appError, { id });
    throw appError;
  }
};

/**
 * Удаление новости
 */
export const deleteNews = async (id: string): Promise<boolean> => {
  try {
    logDebug('Deleting news item', { id });
    
    const allNews = await getAllNews();
    const newsExists = allNews.some(news => news.id === id);
    
    if (!newsExists) {
      logDebug('News item not found for deletion', { id });
      return false;
    }
    
    const filteredNews = allNews.filter(news => news.id !== id);
    await AsyncStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(filteredNews));
    
    logInfo('News item deleted successfully', { id });
    return true;
  } catch (error) {
    const appError = handleError(error, { id, operation: 'deleteNews' });
    logError('Error deleting news item', appError, { id });
    return false;
  }
};

/**
 * Получение важных новостей
 */
export const getImportantNews = async (): Promise<NewsItem[]> => {
  try {
    logDebug('Getting important news');
    const allNews = await getAllNews();
    const importantNews = allNews.filter(news => news.isImportant);
    
    logInfo('Important news retrieved', { count: importantNews.length });
    return importantNews;
  } catch (error) {
    const appError = handleError(error, { operation: 'getImportantNews' });
    logError('Error getting important news', appError);
    return [];
  }
};

/**
 * Поиск новостей по тегу
 */
export const getNewsByTag = async (tag: string): Promise<NewsItem[]> => {
  try {
    logDebug('Getting news by tag', { tag });
    const allNews = await getAllNews();
    const filteredNews = allNews.filter(news => news.tags.includes(tag));
    
    logInfo('News by tag retrieved', { tag, count: filteredNews.length });
    return filteredNews;
  } catch (error) {
    const appError = handleError(error, { tag, operation: 'getNewsByTag' });
    logError('Error getting news by tag', appError, { tag });
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
