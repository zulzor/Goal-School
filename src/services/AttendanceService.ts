// Сервис для работы с посещаемостью через API

import { apiRequest } from './api';

export interface AttendanceDetail {
  id: string;
  training_registration_id: string;
  training_id: string;
  student_id: string;
  coach_id: string;
  attendance_status: 'present' | 'absent' | 'late' | 'excused';
  arrival_time?: string;
  departure_time?: string;
  notes?: string;
  behavior_rating?: number;
  participation_rating?: number;
  marked_by: string;
  marked_at: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceStatistic {
  id: string;
  student_id: string;
  month: number;
  year: number;
  total_trainings: number;
  attended_trainings: number;
  missed_trainings: number;
  late_arrivals: number;
  excused_absences: number;
  attendance_percentage: number;
  avg_behavior_rating?: number;
  avg_participation_rating?: number;
}

export interface StudentWithAttendance {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  attendance_status?: 'present' | 'absent' | 'late' | 'excused';
  attendance_detail?: AttendanceDetail;
  is_registered: boolean;
}

class AttendanceService {
  // Получить список учеников для конкретной тренировки с их статусом посещаемости
  async getTrainingAttendance(trainingId: string): Promise<StudentWithAttendance[]> {
    try {
      const response = await apiRequest<StudentWithAttendance[]>(
        `/api/attendance/training/${trainingId}`,
        {
          method: 'GET',
        }
      );
      return response;
    } catch (error) {
      console.error('Ошибка при получении посещаемости тренировки:', error);
      throw error;
    }
  }

  // Отметить посещаемость ученика
  async markAttendance(
    trainingId: string,
    studentId: string,
    attendanceData: {
      attendance_status: 'present' | 'absent' | 'late' | 'excused';
      arrival_time?: string;
      departure_time?: string;
      notes?: string;
      behavior_rating?: number;
      participation_rating?: number;
    }
  ): Promise<AttendanceDetail> {
    try {
      const response = await apiRequest<AttendanceDetail>(`/api/attendance/mark`, {
        method: 'POST',
        body: JSON.stringify({
          trainingId,
          studentId,
          ...attendanceData,
        }),
      });
      return response;
    } catch (error) {
      console.error('Ошибка при отметке посещаемости:', error);
      throw error;
    }
  }

  // Массовая отметка посещаемости
  async markBulkAttendance(
    trainingId: string,
    attendanceData: Array<{
      studentId: string;
      attendance_status: 'present' | 'absent' | 'late' | 'excused';
      behavior_rating?: number;
      participation_rating?: number;
      notes?: string;
    }>
  ): Promise<AttendanceDetail[]> {
    try {
      const response = await apiRequest<AttendanceDetail[]>(`/api/attendance/bulk-mark`, {
        method: 'POST',
        body: JSON.stringify({
          trainingId,
          attendanceData,
        }),
      });
      return response;
    } catch (error) {
      console.error('Ошибка при массовой отметке посещаемости:', error);
      throw error;
    }
  }

  // Получить статистику посещаемости ученика
  async getStudentAttendanceStats(
    studentId: string,
    year?: number
  ): Promise<AttendanceStatistic[]> {
    try {
      const params = new URLSearchParams();
      params.append('studentId', studentId);
      if (year) params.append('year', year.toString());

      const response = await apiRequest<AttendanceStatistic[]>(
        `/api/attendance/stats?${params.toString()}`,
        {
          method: 'GET',
        }
      );
      return response;
    } catch (error) {
      console.error('Ошибка при получении статистики посещаемости:', error);
      throw error;
    }
  }

  // Получить общую статистику посещаемости
  async getOverallAttendanceStats(options?: {
    startDate?: string;
    endDate?: string;
    ageGroup?: string;
  }): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (options?.startDate) params.append('startDate', options.startDate);
      if (options?.endDate) params.append('endDate', options.endDate);
      if (options?.ageGroup) params.append('ageGroup', options.ageGroup);

      const response = await apiRequest<any>(
        `/api/attendance/overall-stats?${params.toString()}`,
        {
          method: 'GET',
        }
      );
      return response;
    } catch (error) {
      console.error('Ошибка при получении общей статистики посещаемости:', error);
      throw error;
    }
  }

  // Получить детали посещаемости для тренировки
  async getTrainingAttendanceDetails(trainingId: string): Promise<AttendanceDetail[]> {
    try {
      const response = await apiRequest<AttendanceDetail[]>(
        `/api/attendance/details/${trainingId}`,
        {
          method: 'GET',
        }
      );
      return response;
    } catch (error) {
      console.error('Ошибка при получении деталей посещаемости:', error);
      throw error;
    }
  }

  // Получить историю посещаемости ученика
  async getStudentAttendanceHistory(
    studentId: string,
    limit?: number
  ): Promise<AttendanceDetail[]> {
    try {
      const params = new URLSearchParams();
      params.append('studentId', studentId);
      if (limit) params.append('limit', limit.toString());

      const response = await apiRequest<AttendanceDetail[]>(
        `/api/attendance/history?${params.toString()}`,
        {
          method: 'GET',
        }
      );
      return response;
    } catch (error) {
      console.error('Ошибка при получении истории посещаемости:', error);
      throw error;
    }
  }

  // Экспортировать данные посещаемости
  async exportAttendanceData(options: {
    startDate: string;
    endDate: string;
    format: 'csv' | 'xlsx';
  }): Promise<Blob> {
    try {
      const response = await apiRequest<Blob>(`/api/attendance/export`, {
        method: 'POST',
        body: JSON.stringify(options),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      console.error('Ошибка при экспорте данных посещаемости:', error);
      throw error;
    }
  }

  // Получить тренировки тренера (для AttendanceManagementScreen)
  async getCoachTrainings(coachId: string): Promise<any[]> {
    try {
      const response = await apiRequest<any[]>(`/api/trainings/coach/${coachId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Ошибка при получении тренировок тренера:', error);
      throw error;
    }
  }
}

export const attendanceService = new AttendanceService();