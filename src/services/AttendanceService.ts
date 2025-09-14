// Сервис для работы с посещаемостью через локальное хранилище

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

// Имитация локальных данных
const LOCAL_ATTENDANCE: AttendanceDetail[] = [
  {
    id: 'attendance1',
    training_registration_id: 'reg1',
    training_id: 'training1',
    student_id: 'student1',
    coach_id: 'coach1',
    attendance_status: 'present',
    arrival_time: '10:05',
    departure_time: '11:30',
    notes: 'Хорошая активность',
    behavior_rating: 5,
    participation_rating: 5,
    marked_by: 'coach1',
    marked_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const LOCAL_STATISTICS: AttendanceStatistic[] = [
  {
    id: 'stat1',
    student_id: 'student1',
    month: 9,
    year: 2025,
    total_trainings: 8,
    attended_trainings: 7,
    missed_trainings: 1,
    late_arrivals: 1,
    excused_absences: 0,
    attendance_percentage: 87.5,
    avg_behavior_rating: 4.5,
    avg_participation_rating: 4.8,
  },
];

const LOCAL_STUDENTS: StudentWithAttendance[] = [
  {
    id: 'student1',
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    attendance_status: 'present',
    attendance_detail: LOCAL_ATTENDANCE[0],
    is_registered: true,
  },
];

class AttendanceService {
  // Получить список учеников для конкретной тренировки с их статусом посещаемости
  async getTrainingAttendance(trainingId: string): Promise<StudentWithAttendance[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение посещаемости тренировки из локального хранилища:', trainingId);
      return LOCAL_STUDENTS;
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
      // В реальном приложении здесь будет создание в локальном хранилище
      console.log('Отметка посещаемости в локальном хранилище:', {
        trainingId,
        studentId,
        attendanceData,
      });

      const newAttendance: AttendanceDetail = {
        id: `attendance-${Date.now()}`,
        training_registration_id: `reg-${trainingId}-${studentId}`,
        training_id: trainingId,
        student_id: studentId,
        coach_id: 'coach1',
        marked_by: 'coach1',
        marked_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...attendanceData,
      };

      return newAttendance;
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
      // В реальном приложении здесь будет массовое создание в локальном хранилище
      console.log('Массовая отметка посещаемости в локальном хранилище:', {
        trainingId,
        attendanceData,
      });

      const results: AttendanceDetail[] = [];
      for (const item of attendanceData) {
        const result = await this.markAttendance(trainingId, item.studentId, {
          attendance_status: item.attendance_status,
          behavior_rating: item.behavior_rating,
          participation_rating: item.participation_rating,
          notes: item.notes,
        });
        results.push(result);
      }

      return results;
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
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение статистики посещаемости ученика из локального хранилища:', {
        studentId,
        year,
      });
      return LOCAL_STATISTICS.filter(stat => stat.student_id === studentId);
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
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение общей статистики посещаемости из локального хранилища:', options);

      return {
        totalStudents: 25,
        averageAttendance: 85.5,
        topAttenders: [
          { student_name: 'Иван Петров', attendance_percentage: 98.0 },
          { student_name: 'Михаил Сидоров', attendance_percentage: 96.5 },
          { student_name: 'Алексей Козлов', attendance_percentage: 95.0 },
        ],
        lowAttenders: [
          { student_name: 'Дмитрий Волков', attendance_percentage: 65.0 },
          { student_name: 'Сергей Новиков', attendance_percentage: 68.5 },
          { student_name: 'Андрей Морозов', attendance_percentage: 72.0 },
        ],
      };
    } catch (error) {
      console.error('Ошибка при получении общей статистики посещаемости:', error);
      throw error;
    }
  }

  // Получить детали посещаемости для тренировки
  async getTrainingAttendanceDetails(trainingId: string): Promise<AttendanceDetail[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение деталей посещаемости тренировки из локального хранилища:', trainingId);
      return LOCAL_ATTENDANCE.filter(a => a.training_id === trainingId);
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
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение истории посещаемости ученика из локального хранилища:', {
        studentId,
        limit,
      });
      return LOCAL_ATTENDANCE.filter(a => a.student_id === studentId).slice(0, limit);
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
      // В реальном приложении здесь будет экспорт данных из локального хранилища
      console.log('Экспорт данных посещаемости из локального хранилища:', options);

      // Создаем фиктивный Blob для демонстрации
      const data = 'Student,Date,Status\nIvan Ivanov,2025-09-01,Present\n';
      return new Blob([data], { type: 'text/csv' });
    } catch (error) {
      console.error('Ошибка при экспорте данных посещаемости:', error);
      throw error;
    }
  }

  // Получить тренировки тренера (для AttendanceManagementScreen)
  async getCoachTrainings(coachId: string): Promise<any[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение тренировок тренера из локального хранилища:', coachId);
      // Пока возвращаем пустой массив
      return [];
    } catch (error) {
      console.error('Ошибка при получении тренировок тренера:', error);
      throw error;
    }
  }
}

export const attendanceService = new AttendanceService();
