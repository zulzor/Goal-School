// src/services/__tests__/CustomNotificationService.test.ts
// Тесты для CustomNotificationService

import {
  CustomNotificationService,
  registerNotificationToken,
  getNotificationToken,
  sendCustomNotification,
  saveCustomNotification,
  getUserNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  deleteNotification,
  cleanupOldNotifications,
  pollServerForNotifications,
  getLastPollTime,
  saveLastPollTime,
  shouldPollServer,
} from '../CustomNotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Мокаем AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
}));

// Мокаем PushNotificationService
jest.mock('../PushNotificationService', () => ({
  PushNotificationService: {
    registerPushToken: jest.fn().mockResolvedValue(true),
    savePushNotification: jest.fn().mockResolvedValue(true),
    markNotificationAsRead: jest.fn().mockResolvedValue(true),
    deleteNotification: jest.fn().mockResolvedValue(true),
    cleanupOldNotifications: jest.fn().mockResolvedValue(true),
  },
}));

describe('CustomNotificationService', () => {
  const mockUserId = 'user123';
  const mockToken = 'token123';
  const mockNotification = {
    id: 'notif123',
    title: 'Test Notification',
    body: 'This is a test notification',
    timestamp: new Date().toISOString(),
    read: false,
    userId: mockUserId,
    type: 'info' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerNotificationToken', () => {
    it('должен успешно регистрировать токен уведомлений', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await registerNotificationToken(mockUserId, mockToken);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@arsenal_school_notification_tokens',
        JSON.stringify([{ token: mockToken, userId: mockUserId, timestamp: expect.any(String) }])
      );
    });

    it('должен обрабатывать ошибки при регистрации токена', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      const result = await registerNotificationToken(mockUserId, mockToken);

      expect(result).toBe(false);
    });
  });

  describe('getNotificationToken', () => {
    it('должен возвращать токен уведомлений для пользователя', async () => {
      const tokens = [
        { token: mockToken, userId: mockUserId, timestamp: new Date().toISOString() },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(tokens));

      const result = await getNotificationToken(mockUserId);

      expect(result).toBe(mockToken);
    });

    it('должен возвращать null, если токен не найден', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([]));

      const result = await getNotificationToken(mockUserId);

      expect(result).toBeNull();
    });

    it('должен обрабатывать ошибки при получении токена', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      const result = await getNotificationToken(mockUserId);

      expect(result).toBeNull();
    });
  });

  describe('sendCustomNotification', () => {
    it('должен успешно отправлять уведомление', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([
          { token: mockToken, userId: mockUserId, timestamp: new Date().toISOString() },
        ])
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await sendCustomNotification(mockUserId, 'Test Title', 'Test Body', 'info');

      expect(result).toBe(true);
    });

    it('должен возвращать false, если токен не найден', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([]));

      const result = await sendCustomNotification(mockUserId, 'Test Title', 'Test Body', 'info');

      expect(result).toBe(false);
    });
  });

  describe('saveCustomNotification', () => {
    it('должен успешно сохранять уведомление', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await saveCustomNotification(mockNotification);

      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@arsenal_school_custom_notifications',
        JSON.stringify([mockNotification])
      );
    });

    it('должен обрабатывать ошибки при сохранении уведомления', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      const result = await saveCustomNotification(mockNotification);

      expect(result).toBe(false);
    });
  });

  describe('getUserNotifications', () => {
    it('должен возвращать уведомления для пользователя', async () => {
      const notifications = [mockNotification];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(notifications));

      const result = await getUserNotifications(mockUserId);

      expect(result).toEqual(notifications);
    });

    it('должен обрабатывать ошибки при получении уведомлений', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      const result = await getUserNotifications(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('getUnreadNotifications', () => {
    it('должен возвращать непрочитанные уведомления для пользователя', async () => {
      const notifications = [mockNotification, { ...mockNotification, id: 'notif456', read: true }];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(notifications));

      const result = await getUnreadNotifications(mockUserId);

      expect(result).toEqual([mockNotification]);
    });
  });

  describe('markNotificationAsRead', () => {
    it('должен успешно отмечать уведомление как прочитанное', async () => {
      const notifications = [mockNotification];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(notifications));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await markNotificationAsRead(mockNotification.id);

      expect(result).toBe(true);
    });
  });

  describe('deleteNotification', () => {
    it('должен успешно удалять уведомление', async () => {
      const notifications = [mockNotification];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(notifications));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await deleteNotification(mockNotification.id);

      expect(result).toBe(true);
    });
  });

  describe('cleanupOldNotifications', () => {
    it('должен успешно очищать старые уведомления', async () => {
      const oldNotification = {
        ...mockNotification,
        id: 'old123',
        timestamp: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(), // 31 день назад
      };
      const notifications = [mockNotification, oldNotification];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(notifications));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await cleanupOldNotifications();

      expect(result).toBe(true);
    });
  });

  describe('getLastPollTime', () => {
    it('должен возвращать время последнего опроса', async () => {
      const lastPollTime = new Date().toISOString();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(lastPollTime);

      const result = await getLastPollTime();

      expect(result).toBe(lastPollTime);
    });
  });

  describe('saveLastPollTime', () => {
    it('должен успешно сохранять время последнего опроса', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await saveLastPollTime();

      expect(result).toBe(true);
    });
  });

  describe('shouldPollServer', () => {
    it('должен возвращать true, если время последнего опроса отсутствует', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await shouldPollServer();

      expect(result).toBe(true);
    });

    it('должен возвращать true, если прошло больше 5 минут с последнего опроса', async () => {
      const fiveMinutesAgo = new Date(Date.now() - 6 * 60 * 1000).toISOString();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(fiveMinutesAgo);

      const result = await shouldPollServer();

      expect(result).toBe(true);
    });

    it('должен возвращать false, если прошло меньше 5 минут с последнего опроса', async () => {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(twoMinutesAgo);

      const result = await shouldPollServer();

      expect(result).toBe(false);
    });
  });

  describe('pollServerForNotifications', () => {
    it('должен успешно выполнять опрос сервера', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null); // Нет времени последнего опроса

      const result = await pollServerForNotifications(mockUserId);

      expect(result).toBe(true);
    });

    it('должен возвращать false, если опрос не требуется', async () => {
      const recentPollTime = new Date().toISOString();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(recentPollTime);

      const result = await pollServerForNotifications(mockUserId);

      expect(result).toBe(false);
    });
  });
});
