// src/services/__tests__/NewsService.test.ts
// Тесты для сервиса новостей

import { NewsStorageService } from '../index';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Мокаем AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('NewsService', () => {
  const mockNewsData = [
    {
      id: '1',
      title: 'Тестовая новость 1',
      content: 'Содержание тестовой новости 1',
      excerpt: 'Отрывок тестовой новости 1',
      date: '2025-09-10',
      authorName: 'Тестовый автор',
      image: null,
      tags: ['тест', 'новости'],
      isImportant: true,
      publishedAt: '2025-09-10',
    },
    {
      id: '2',
      title: 'Тестовая новость 2',
      content: 'Содержание тестовой новости 2',
      excerpt: 'Отрывок тестовой новости 2',
      date: '2025-09-11',
      authorName: 'Тестовый автор 2',
      image: null,
      tags: ['важное'],
      isImportant: false,
      publishedAt: '2025-09-11',
    },
  ];

  beforeEach(() => {
    // Очищаем моки перед каждым тестом
    jest.clearAllMocks();
  });

  describe('getAllNews', () => {
    it('должен возвращать массив новостей при успешном получении', async () => {
      // Мокаем успешное получение данных
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockNewsData));

      const result = await NewsStorageService.getAllNews();

      expect(result).toEqual(mockNewsData);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@arsenal_school_news');
    });

    it('должен возвращать пустой массив при отсутствии данных', async () => {
      // Мокаем отсутствие данных
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await NewsStorageService.getAllNews();

      expect(result).toEqual([]);
    });

    it('должен возвращать пустой массив при ошибке получения данных', async () => {
      // Мокаем ошибку
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Ошибка получения данных'));

      const result = await NewsStorageService.getAllNews();

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('createNews', () => {
    it('должен успешно создавать новую новость', async () => {
      // Мокаем получение существующих новостей
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockNewsData[1]]));

      const newNews = {
        title: 'Новая тестовая новость',
        content: 'Содержание новой тестовой новости',
        excerpt: 'Отрывок новой тестовой новости',
        date: '2025-09-12',
        authorName: 'Новый автор',
        image: null,
        tags: ['новое'],
        isImportant: true,
      };

      const result = await NewsStorageService.createNews(newNews);

      expect(result).toMatchObject(newNews);
      expect(result.id).toBeDefined();
      expect(result.publishedAt).toBeDefined();
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('должен выбрасывать ошибку при неудачном создании новости', async () => {
      // Мокаем ошибку при сохранении
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Ошибка сохранения'));

      const newNews = {
        title: 'Новая тестовая новость',
        content: 'Содержание новой тестовой новости',
        excerpt: 'Отрывок новой тестовой новости',
        date: '2025-09-12',
        authorName: 'Новый автор',
        image: null,
        tags: ['новое'],
        isImportant: true,
      };

      await expect(NewsStorageService.createNews(newNews)).rejects.toThrow(
        'Не удалось создать новость'
      );
    });
  });

  describe('updateNews', () => {
    it('должен успешно обновлять существующую новость', async () => {
      // Мокаем получение существующих новостей
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockNewsData));

      const updates = {
        title: 'Обновленная новость',
        isImportant: false,
      };

      const result = await NewsStorageService.updateNews('1', updates);

      expect(result).toMatchObject({
        ...mockNewsData[0],
        ...updates,
      });
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('должен возвращать null при попытке обновления несуществующей новости', async () => {
      // Мокаем получение существующих новостей
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockNewsData));

      const updates = {
        title: 'Обновленная новость',
      };

      const result = await NewsStorageService.updateNews('999', updates);

      expect(result).toBeNull();
    });
  });

  describe('deleteNews', () => {
    it('должен успешно удалять новость', async () => {
      // Мокаем получение существующих новостей
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockNewsData));

      const result = await NewsStorageService.deleteNews('1');

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('должен возвращать true даже при попытке удаления несуществующей новости', async () => {
      // Мокаем получение существующих новостей
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockNewsData));

      const result = await NewsStorageService.deleteNews('999');

      expect(result).toBe(true);
    });
  });

  describe('getImportantNews', () => {
    it('должен возвращать только важные новости', async () => {
      // Мокаем получение новостей
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockNewsData));

      const result = await NewsStorageService.getImportantNews();

      expect(result).toHaveLength(1);
      expect(result[0].isImportant).toBe(true);
    });
  });

  describe('getNewsByTag', () => {
    it('должен возвращать новости по указанному тегу', async () => {
      // Мокаем получение новостей
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockNewsData));

      const result = await NewsStorageService.getNewsByTag('тест');

      expect(result).toHaveLength(1);
      expect(result[0].tags).toContain('тест');
    });
  });
});
