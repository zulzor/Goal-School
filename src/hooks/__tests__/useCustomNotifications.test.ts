// src/hooks/__tests__/useCustomNotifications.test.ts
// Тесты для useCustomNotifications

import { renderHook, act } from '@testing-library/react-hooks';
import { useCustomNotifications } from '../useCustomNotifications';
import * as CustomNotificationService from '../../services/CustomNotificationService';
import * as LocalStorageAuthContext from '../../context/LocalStorageAuthContext';

// Мокаем контекст аутентификации
jest.mock('../../context/LocalStorageAuthContext', () => ({
  useAuth: jest.fn(),
}));

// Мокаем CustomNotificationService
jest.mock('../../services/CustomNotificationService', () => ({
  CustomNotificationService: {
    getUserNotifications: jest.fn(),
    markNotificationAsRead: jest.fn(),
    deleteNotification: jest.fn(),
    sendCustomNotification: jest.fn(),
    pollServerForNotifications: jest.fn(),
  },
  getUserNotifications: jest.fn(),
  markNotificationAsRead: jest.fn(),
  deleteNotification: jest.fn(),
  sendCustomNotification: jest.fn(),
  pollServerForNotifications: jest.fn(),
}));

describe('useCustomNotifications', () => {
  const mockUser = { id: 'user123', role: 'student' };
  const mockNotifications = [
    {
      id: 'notif123',
      title: 'Test Notification',
      body: 'This is a test notification',
      timestamp: new Date().toISOString(),
      read: false,
      userId: 'user123',
      type: 'info',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (LocalStorageAuthContext.useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
    });
  });

  it('должен возвращать начальное состояние', () => {
    (CustomNotificationService.getUserNotifications as jest.Mock).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useCustomNotifications());

    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.loading).toBe(false);
  });

  it('должен загружать уведомления при монтировании', async () => {
    (CustomNotificationService.getUserNotifications as jest.Mock).mockResolvedValueOnce(
      mockNotifications
    );

    const { result, waitForNextUpdate } = renderHook(() => useCustomNotifications());

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.notifications).toEqual(mockNotifications);
    expect(result.current.unreadCount).toBe(1);
    expect(result.current.loading).toBe(false);
  });

  it('должен отмечать уведомление как прочитанное', async () => {
    (CustomNotificationService.getUserNotifications as jest.Mock).mockResolvedValueOnce(
      mockNotifications
    );
    (CustomNotificationService.markNotificationAsRead as jest.Mock).mockResolvedValueOnce(
      undefined
    );

    const { result, waitForNextUpdate } = renderHook(() => useCustomNotifications());

    await waitForNextUpdate();

    await act(async () => {
      await result.current.markAsRead('notif123');
    });

    expect(CustomNotificationService.markNotificationAsRead).toHaveBeenCalledWith('notif123');
  });

  it('должен удалять уведомление', async () => {
    (CustomNotificationService.getUserNotifications as jest.Mock).mockResolvedValueOnce(
      mockNotifications
    );
    (CustomNotificationService.deleteNotification as jest.Mock).mockResolvedValueOnce(undefined);

    const { result, waitForNextUpdate } = renderHook(() => useCustomNotifications());

    await waitForNextUpdate();

    await act(async () => {
      await result.current.deleteNotification('notif123');
    });

    expect(CustomNotificationService.deleteNotification).toHaveBeenCalledWith('notif123');
  });

  it('должен отправлять тестовое уведомление', async () => {
    (CustomNotificationService.getUserNotifications as jest.Mock).mockResolvedValueOnce([]);
    (CustomNotificationService.sendCustomNotification as jest.Mock).mockResolvedValueOnce(
      undefined
    );

    const { result } = renderHook(() => useCustomNotifications());

    await act(async () => {
      await result.current.sendTestNotification();
    });

    expect(CustomNotificationService.sendCustomNotification).toHaveBeenCalledWith(
      mockUser.id,
      'Тестовое уведомление',
      'Это тестовое уведомление через пользовательскую систему',
      'info',
      { type: 'test', timestamp: expect.any(Number) }
    );
  });

  it('должен обновлять уведомления', async () => {
    (CustomNotificationService.getUserNotifications as jest.Mock)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce(mockNotifications);

    const { result, waitForNextUpdate } = renderHook(() => useCustomNotifications());

    await waitForNextUpdate();

    await act(async () => {
      await result.current.refresh();
    });

    await waitForNextUpdate();

    expect(CustomNotificationService.getUserNotifications).toHaveBeenCalledTimes(2);
  });

  it('не должен запускать опрос, если нет пользователя', () => {
    (LocalStorageAuthContext.useAuth as jest.Mock).mockReturnValue({
      user: null,
    });
    (CustomNotificationService.getUserNotifications as jest.Mock).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useCustomNotifications());

    expect(result.current.notifications).toEqual([]);
  });
});
