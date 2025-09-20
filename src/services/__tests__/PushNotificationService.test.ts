// src/services/__tests__/PushNotificationService.test.ts
// Тесты для сервиса push-уведомлений

import { PushNotificationService } from '../index';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Мокаем AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('PushNotificationService', () => {
  const mockUserId = 'user123';
  const mockToken = 'token123';
  const mockNotification = {
    id: 'notification1',
    title: 'Тестовое уведомление',
    body: 'Тело тестового уведомления',
    data: { type: 'test' },
    timestamp: '2025-09-11T10:00:00Z',
    read: false,
    userId: mockUserId,
  };

  beforeEach(() => {
    // Очищаем моки перед каждым тестом
    jest.clearAllMocks();
  });

  describe('registerPushToken', () => {
    it('должен успешно регистрировать токен push-уведомлений для пользователя', async () => {
      // Мокаем отсутствие существующих токенов
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await PushNotificationService.registerPushToken(mockUserId, mockToken);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('должен обрабатывать ошибки при регистрации токена', async () => {
      // Мокаем ошибку
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Ошибка сохранения'));

      const result = await PushNotificationService.registerPushToken(mockUserId, mockToken);

      expect(result).toBe(false);
    });
  });

  describe('getPushToken', () => {
    it('должен возвращать токен push-уведомлений для пользователя', async () => {
      // Мокаем существующие токены
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ [mockUserId]: mockToken })
      );

      const result = await PushNotificationService.getPushToken(mockUserId);

      expect(result).toBe(mockToken);
    });

    it('должен возвращать null, если токен не найден', async () => {
      // Мокаем отсутствие токенов
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await PushNotificationService.getPushToken(mockUserId);

      expect(result).toBeNull();
    });
  });

  describe('sendPushNotification', () => {
    it('должен успешно отправлять push-уведомление пользователю', async () => {
      // Мокаем существующий токен
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify({ [mockUserId]: mockToken })) // Для getPushToken
        .mockResolvedValueOnce(JSON.stringify([])); // Для savePushNotification

      const result = await PushNotificationService.sendPushNotification(
        mockUserId,
        'Тест',
        'Тело уведомления'
      );

      expect(result).toBe(true);
    });

    it('должен возвращать false, если токен не найден', async () => {
      // Мокаем отсутствие токена
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await PushNotificationService.sendPushNotification(
        mockUserId,
        'Тест',
        'Тело уведомления'
      );

      expect(result).toBe(false);
    });
  });

  describe('savePushNotification', () => {
    it('должен успешно сохранять push-уведомление', async () => {
      // Мокаем отсутствие существующих уведомлений
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await PushNotificationService.savePushNotification(mockNotification);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('getUserPushNotifications', () => {
    it('должен возвращать уведомления для пользователя', async () => {
      // Мокаем существующие уведомления
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockNotification]));

      const result = await PushNotificationService.getUserPushNotifications(mockUserId);

      expect(result).toEqual([mockNotification]);
    });
  });

  describe('getUnreadPushNotifications', () => {
    it('должен возвращать непрочитанные уведомления для пользователя', async () => {
      // Мокаем существующие уведомления
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockNotification]));

      const result = await PushNotificationService.getUnreadPushNotifications(mockUserId);

      expect(result).toEqual([mockNotification]);
    });
  });

  describe('markNotificationAsRead', () => {
    it('должен успешно отмечать уведомление как прочитанное', async () => {
      // Мокаем существующие уведомления
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockNotification]));

      const result = await PushNotificationService.markNotificationAsRead(mockNotification.id);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('deleteNotification', () => {
    it('должен успешно удалять уведомление', async () => {
      // Мокаем существующие уведомления
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockNotification]));

      const result = await PushNotificationService.deleteNotification(mockNotification.id);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('cleanupOldNotifications', () => {
    it('должен успешно очищать старые уведомления', async () => {
      // Мокаем существующие уведомления
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([mockNotification]));

      const result = await PushNotificationService.cleanupOldNotifications();

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});
