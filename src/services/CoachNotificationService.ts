// Сервис для уведомлений тренеров о новых записях посещаемости

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotifications } from '../context/NotificationContext';

interface AttendanceRecord {
  id: string;
  trainingId: string;
  studentId: string;
  timestamp: string;
}

const ATTENDANCE_RECORDS_KEY = 'coach_attendance_records';
const LAST_NOTIFICATION_KEY = 'last_coach_notification_time';

export class CoachNotificationService {
  // Сохранение новой записи посещаемости
  static async saveAttendanceRecord(
    record: Omit<AttendanceRecord, 'id' | 'timestamp'>
  ): Promise<void> {
    try {
      const records = await this.getAttendanceRecords();
      const newRecord: AttendanceRecord = {
        id: Math.random().toString(36).substr(2, 9),
        trainingId: record.trainingId,
        studentId: record.studentId,
        timestamp: new Date().toISOString(),
      };

      const updatedRecords = [...records, newRecord];
      await AsyncStorage.setItem(ATTENDANCE_RECORDS_KEY, JSON.stringify(updatedRecords));
    } catch (error) {
      console.error('Ошибка при сохранении записи посещаемости:', error);
    }
  }

  // Получение всех записей посещаемости
  static async getAttendanceRecords(): Promise<AttendanceRecord[]> {
    try {
      const records = await AsyncStorage.getItem(ATTENDANCE_RECORDS_KEY);
      return records ? JSON.parse(records) : [];
    } catch (error) {
      console.error('Ошибка при получении записей посещаемости:', error);
      return [];
    }
  }

  // Проверка наличия новых записей и создание уведомлений
  static async checkForNewAttendanceRecords(coachId: string): Promise<void> {
    try {
      // В реальном приложении здесь должна быть логика проверки новых записей
      // для конкретного тренера. Пока используем имитацию.

      // Проверяем, нужно ли отправлять уведомление (не чаще чем раз в 10 минут)
      const lastNotificationTime = await AsyncStorage.getItem(LAST_NOTIFICATION_KEY);
      const now = new Date().getTime();

      if (lastNotificationTime) {
        const lastTime = parseInt(lastNotificationTime);
        const diffInMinutes = (now - lastTime) / (1000 * 60);

        if (diffInMinutes < 10) {
          return; // Слишком рано для нового уведомления
        }
      }

      // Имитация новых записей
      const hasNewRecords = Math.random() > 0.7; // 30% шанс на наличие новых записей

      if (hasNewRecords) {
        // Здесь будет логика создания уведомления
        console.log(`Новые записи посещаемости для тренера ${coachId}`);

        // Сохраняем время последнего уведомления
        await AsyncStorage.setItem(LAST_NOTIFICATION_KEY, now.toString());
      }
    } catch (error) {
      console.error('Ошибка при проверке новых записей посещаемости:', error);
    }
  }

  // Получение времени последнего уведомления
  static async getLastNotificationTime(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(LAST_NOTIFICATION_KEY);
    } catch (error) {
      console.error('Ошибка при получении времени последнего уведомления:', error);
      return null;
    }
  }

  // Очистка старых записей (старше 30 дней)
  static async cleanupOldRecords(): Promise<void> {
    try {
      const records = await this.getAttendanceRecords();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const filteredRecords = records.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate > thirtyDaysAgo;
      });

      await AsyncStorage.setItem(ATTENDANCE_RECORDS_KEY, JSON.stringify(filteredRecords));
    } catch (error) {
      console.error('Ошибка при очистке старых записей:', error);
    }
  }
}
