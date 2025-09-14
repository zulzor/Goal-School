// Тесты для CoachNotificationService

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CoachNotificationService } from '../CoachNotificationService';

// Мокаем AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
}));

describe('CoachNotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveAttendanceRecord', () => {
    it('должен сохранять новую запись посещаемости', async () => {
      // Мокаем получение существующих записей
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([]));

      // Вызываем тестируемую функцию
      await CoachNotificationService.saveAttendanceRecord({
        trainingId: 'training1',
        studentId: 'student1',
      });

      // Проверяем, что был вызван getItem для получения существующих записей
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('coach_attendance_records');

      // Проверяем, что был вызван setItem для сохранения обновленных записей
      expect(AsyncStorage.setItem).toHaveBeenCalled();

      // Проверяем, что запись была сохранена с правильными данными
      const setItemCall = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
      expect(setItemCall[0]).toBe('coach_attendance_records');

      const savedRecords = JSON.parse(setItemCall[1]);
      expect(savedRecords).toHaveLength(1);
      expect(savedRecords[0]).toMatchObject({
        trainingId: 'training1',
        studentId: 'student1',
      });
      expect(savedRecords[0].id).toBeDefined();
      expect(savedRecords[0].timestamp).toBeDefined();
    });
  });

  describe('getAttendanceRecords', () => {
    it('должен возвращать массив записей посещаемости', async () => {
      const mockRecords = [
        {
          id: '1',
          trainingId: 'training1',
          studentId: 'student1',
          timestamp: new Date().toISOString(),
        },
      ];

      // Мокаем получение записей
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockRecords));

      // Вызываем тестируемую функцию
      const records = await CoachNotificationService.getAttendanceRecords();

      // Проверяем результат
      expect(records).toEqual(mockRecords);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('coach_attendance_records');
    });

    it('должен возвращать пустой массив, если нет записей', async () => {
      // Мокаем отсутствие записей
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      // Вызываем тестируемую функцию
      const records = await CoachNotificationService.getAttendanceRecords();

      // Проверяем результат
      expect(records).toEqual([]);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('coach_attendance_records');
    });
  });

  describe('getLastNotificationTime', () => {
    it('должен возвращать время последнего уведомления', async () => {
      const mockTime = Date.now().toString();

      // Мокаем получение времени
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(mockTime);

      // Вызываем тестируемую функцию
      const time = await CoachNotificationService.getLastNotificationTime();

      // Проверяем результат
      expect(time).toBe(mockTime);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('last_coach_notification_time');
    });

    it('должен возвращать null, если время не установлено', async () => {
      // Мокаем отсутствие времени
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      // Вызываем тестируемую функцию
      const time = await CoachNotificationService.getLastNotificationTime();

      // Проверяем результат
      expect(time).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('last_coach_notification_time');
    });
  });

  describe('cleanupOldRecords', () => {
    it('должен удалять старые записи (старше 30 дней)', async () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 31);

      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 15);

      const mockRecords = [
        {
          id: '1',
          trainingId: 'training1',
          studentId: 'student1',
          timestamp: oldDate.toISOString(),
        },
        {
          id: '2',
          trainingId: 'training2',
          studentId: 'student2',
          timestamp: recentDate.toISOString(),
        },
      ];

      // Мокаем получение записей
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockRecords));

      // Вызываем тестируемую функцию
      await CoachNotificationService.cleanupOldRecords();

      // Проверяем, что был вызван setItem для сохранения обновленных записей
      expect(AsyncStorage.setItem).toHaveBeenCalled();

      // Проверяем, что только свежие записи остались
      const setItemCall = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
      const savedRecords = JSON.parse(setItemCall[1]);
      expect(savedRecords).toHaveLength(1);
      expect(savedRecords[0].id).toBe('2');
    });
  });
});
