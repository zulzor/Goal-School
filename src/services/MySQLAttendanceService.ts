// src/services/MySQLAttendanceService.ts
// Сервис для работы с посещаемостью через MySQL
import { mysqlQuery } from '../config/mysql';

export interface AttendanceRecord {
  id: number;
  user_id: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  created_at: Date;
}

export class MySQLAttendanceService {
  // Получение посещаемости пользователя
  static async getUserAttendance(userId: number): Promise<AttendanceRecord[]> {
    try {
      const result = await mysqlQuery(
        'SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC',
        [userId]
      );

      // Fix TypeScript error: result.rows might be an array or an object
      if (Array.isArray(result.rows)) {
        return result.rows as AttendanceRecord[];
      } else {
        // Handle case where result.rows is not an array (e.g., OkPacket)
        return [];
      }
    } catch (error) {
      console.error('Error getting user attendance:', error);
      throw error;
    }
  }

  // Добавление записи о посещаемости
  static async markAttendance(
    userId: number,
    date: string,
    status: 'present' | 'absent' | 'late' | 'excused'
  ): Promise<AttendanceRecord> {
    try {
      // Проверяем, существует ли уже запись на эту дату
      const existing = await mysqlQuery('SELECT * FROM attendance WHERE user_id = ? AND date = ?', [
        userId,
        date,
      ]);

      if (Array.isArray(existing.rows) && existing.rows.length > 0) {
        // Обновляем существующую запись
        await mysqlQuery('UPDATE attendance SET status = ? WHERE user_id = ? AND date = ?', [
          status,
          userId,
          date,
        ]);
      } else {
        // Создаем новую запись
        await mysqlQuery('INSERT INTO attendance (user_id, date, status) VALUES (?, ?, ?)', [
          userId,
          date,
          status,
        ]);
      }

      // Получаем созданную/обновленную запись
      const result = await mysqlQuery('SELECT * FROM attendance WHERE user_id = ? AND date = ?', [
        userId,
        date,
      ]);

      // Fix TypeScript error: accessing result.rows[0]
      if (Array.isArray(result.rows) && result.rows.length > 0) {
        return result.rows[0] as AttendanceRecord;
      } else {
        throw new Error('Failed to retrieve attendance record');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  }

  // Получение статистики посещаемости
  static async getAttendanceStatistics(userId: number): Promise<any> {
    try {
      const result = await mysqlQuery(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
          SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent,
          SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late,
          SUM(CASE WHEN status = 'excused' THEN 1 ELSE 0 END) as excused
        FROM attendance WHERE user_id = ?`,
        [userId]
      );

      // Fix TypeScript error: accessing result.rows[0]
      if (Array.isArray(result.rows) && result.rows.length > 0) {
        return result.rows[0];
      } else {
        return {};
      }
    } catch (error) {
      console.error('Error getting attendance statistics:', error);
      throw error;
    }
  }
}
