// src/services/__tests__/LocalizationService.test.ts
// Тесты для сервиса локализации

import { LocalizationService } from '../index';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Мокаем AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('LocalizationService', () => {
  beforeEach(() => {
    // Очищаем моки перед каждым тестом
    jest.clearAllMocks();
  });

  describe('getCurrentLanguage', () => {
    it('должен возвращать сохраненный язык из AsyncStorage', async () => {
      // Мокаем сохраненный язык
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('en');

      const result = await LocalizationService.getCurrentLanguage();

      expect(result).toBe('en');
    });

    it('должен возвращать русский язык по умолчанию, если язык не сохранен', async () => {
      // Мокаем отсутствие сохраненного языка
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await LocalizationService.getCurrentLanguage();

      expect(result).toBe('ru');
    });

    it('должен возвращать русский язык по умолчанию при ошибке', async () => {
      // Мокаем ошибку
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Ошибка получения данных'));

      const result = await LocalizationService.getCurrentLanguage();

      expect(result).toBe('ru');
    });
  });

  describe('setLanguage', () => {
    it('должен успешно устанавливать поддерживаемый язык', async () => {
      const result = await LocalizationService.setLanguage('en');

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@arsenal_school_language', 'en');
    });

    it('должен возвращать false для неподдерживаемого языка', async () => {
      // Мокаем ошибку
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Язык не поддерживается'));

      const result = await LocalizationService.setLanguage('fr' as any);

      expect(result).toBe(false);
    });
  });

  describe('t', () => {
    it('должен возвращать перевод для существующего ключа', () => {
      const result = LocalizationService.t('welcome', 'en');

      expect(result).toBe('Welcome');
    });

    it('должен возвращать ключ, если перевод не найден', () => {
      const result = LocalizationService.t('nonexistent_key', 'en');

      expect(result).toBe('nonexistent_key');
    });

    it('должен использовать русский язык по умолчанию, если язык не указан', () => {
      const result = LocalizationService.t('welcome');

      expect(result).toBe('Добро пожаловать');
    });
  });

  describe('getTranslations', () => {
    it('должен возвращать переводы для указанного языка', () => {
      const result = LocalizationService.getTranslations('en');

      expect(result).toHaveProperty('welcome', 'Welcome');
    });

    it('должен возвращать русские переводы для неподдерживаемого языка', () => {
      const result = LocalizationService.getTranslations('fr' as any);

      expect(result).toHaveProperty('welcome', 'Добро пожаловать');
    });
  });
});
