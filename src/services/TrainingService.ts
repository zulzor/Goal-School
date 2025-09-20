// Сервис для работы с тренировками через локальное хранилище
import { Training, TrainingRegistration } from '../types';

// Имитация локальных данных
const LOCAL_TRAININGS: Training[] = [
  {
    id: '1',
    title: 'Тренировка U-10',
    description: 'Техника владения мячом и базовые упражнения',
    date: '2025-09-03',
    startTime: '10:00',
    endTime: '11:30',
    location: 'Поле A',
    coachId: 'coach1',
    coachName: 'Иванов Сергей',
    maxParticipants: 15,
    currentParticipants: ['1', '2', '3'],
    ageGroup: 'U-10',
    type: 'training',
  },
  {
    id: '2',
    title: 'Матч U-12',
    description: 'Товарищеский матч против команды "Спартак"',
    date: '2025-09-05',
    startTime: '15:00',
    endTime: '17:00',
    location: 'Главное поле',
    coachId: 'coach2',
    coachName: 'Петров Александр',
    maxParticipants: 18,
    currentParticipants: ['4', '5', '6', '7'],
    ageGroup: 'U-12',
    type: 'match',
  },
];

const LOCAL_REGISTRATIONS: TrainingRegistration[] = [
  {
    id: 'reg1',
    trainingId: '1',
    userId: 'user1',
    status: 'registered',
    registeredAt: new Date().toISOString(),
  },
];

export class TrainingService {
  // Получение всех тренировок
  static async getTrainings(): Promise<Training[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение тренировок из локального хранилища');
      return LOCAL_TRAININGS;
    } catch (error) {
      console.error('Ошибка получения тренировок:', error);
      return [];
    }
  }

  // Получение тренировок по дате
  static async getTrainingsByDate(date: string): Promise<Training[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение тренировок по дате из локального хранилища:', date);
      return LOCAL_TRAININGS.filter(training => training.date === date);
    } catch (error) {
      console.error('Ошибка получения тренировок по дате:', error);
      return [];
    }
  }

  // Регистрация на тренировку
  static async registerForTraining(trainingId: string, userId: string): Promise<boolean> {
    try {
      // В реальном приложении здесь будет создание в локальном хранилище
      console.log('Регистрация на тренировку в локальном хранилище:', { trainingId, userId });
      return true;
    } catch (error) {
      console.error('Ошибка регистрации на тренировку:', error);
      return false;
    }
  }

  // Отмена регистрации
  static async unregisterFromTraining(trainingId: string, userId: string): Promise<boolean> {
    try {
      // В реальном приложении здесь будет удаление из локального хранилища
      console.log('Отмена регистрации в локальном хранилище:', { trainingId, userId });
      return true;
    } catch (error) {
      console.error('Ошибка отмены регистрации:', error);
      return false;
    }
  }

  // Получение регистраций пользователя
  static async getUserRegistrations(userId: string): Promise<string[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение регистраций пользователя из локального хранилища:', userId);
      return LOCAL_REGISTRATIONS.filter(
        reg => reg.userId === userId && reg.status === 'registered'
      ).map(reg => reg.trainingId);
    } catch (error) {
      console.error('Ошибка получения регистраций:', error);
      return [];
    }
  }

  // Создание новой тренировки (для тренеров/админов)
  static async createTraining(
    trainingData: Omit<Training, 'id' | 'coachName' | 'currentParticipants'>
  ): Promise<boolean> {
    try {
      // В реальном приложении здесь будет создание в локальном хранилище
      console.log('Создание тренировки в локальном хранилище:', trainingData);
      return true;
    } catch (error) {
      console.error('Ошибка создания тренировки:', error);
      return false;
    }
  }
}
