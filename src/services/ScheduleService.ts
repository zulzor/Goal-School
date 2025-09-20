// src/services/ScheduleService.ts
// Сервис для работы с расписанием через локальное хранилище

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Training {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location: string;
  coachId: string;
  coachName: string;
  maxParticipants: number;
  currentParticipants: string[]; // массив ID пользователей
  ageGroup: string;
  type: 'training' | 'match';
  createdAt: string;
}

class ScheduleService {
  private static readonly SCHEDULE_KEY = 'schedule';

  // Получение всех тренировок
  static async getTrainings(): Promise<Training[]> {
    try {
      const scheduleJson = await AsyncStorage.getItem(this.SCHEDULE_KEY);
      return scheduleJson ? JSON.parse(scheduleJson) : [];
    } catch (error) {
      console.error('Error getting trainings:', error);
      return [];
    }
  }

  // Получение тренировок по дате
  static async getTrainingsByDate(date: string): Promise<Training[]> {
    try {
      const allTrainings = await this.getTrainings();
      return allTrainings.filter(training => training.date === date);
    } catch (error) {
      console.error('Error getting trainings by date:', error);
      return [];
    }
  }

  // Получение тренировок по диапазону дат
  static async getTrainingsByDateRange(startDate: string, endDate: string): Promise<Training[]> {
    try {
      const allTrainings = await this.getTrainings();
      return allTrainings.filter(training => {
        return training.date >= startDate && training.date <= endDate;
      });
    } catch (error) {
      console.error('Error getting trainings by date range:', error);
      return [];
    }
  }

  // Получение тренировок для конкретного пользователя
  static async getUserTrainings(userId: string): Promise<Training[]> {
    try {
      const allTrainings = await this.getTrainings();
      return allTrainings.filter(training => training.currentParticipants.includes(userId));
    } catch (error) {
      console.error('Error getting user trainings:', error);
      return [];
    }
  }

  // Создание новой тренировки
  static async createTraining(
    trainingData: Omit<Training, 'id' | 'createdAt' | 'currentParticipants'>
  ): Promise<Training> {
    try {
      const trainings = await this.getTrainings();

      const newTraining: Training = {
        id: Date.now().toString(),
        ...trainingData,
        currentParticipants: [],
        createdAt: new Date().toISOString(),
      };

      trainings.push(newTraining);
      await AsyncStorage.setItem(this.SCHEDULE_KEY, JSON.stringify(trainings));

      return newTraining;
    } catch (error) {
      console.error('Error creating training:', error);
      throw error;
    }
  }

  // Обновление тренировки
  static async updateTraining(trainingId: string, updates: Partial<Training>): Promise<Training> {
    try {
      const trainings = await this.getTrainings();
      const trainingIndex = trainings.findIndex(t => t.id === trainingId);

      if (trainingIndex === -1) {
        throw new Error('Training not found');
      }

      const updatedTraining = {
        ...trainings[trainingIndex],
        ...updates,
      };

      trainings[trainingIndex] = updatedTraining;
      await AsyncStorage.setItem(this.SCHEDULE_KEY, JSON.stringify(trainings));

      return updatedTraining;
    } catch (error) {
      console.error('Error updating training:', error);
      throw error;
    }
  }

  // Удаление тренировки
  static async deleteTraining(trainingId: string): Promise<void> {
    try {
      const trainings = await this.getTrainings();
      const filteredTrainings = trainings.filter(t => t.id !== trainingId);
      await AsyncStorage.setItem(this.SCHEDULE_KEY, JSON.stringify(filteredTrainings));
    } catch (error) {
      console.error('Error deleting training:', error);
      throw error;
    }
  }

  // Регистрация пользователя на тренировку
  static async registerForTraining(trainingId: string, userId: string): Promise<boolean> {
    try {
      const trainings = await this.getTrainings();
      const trainingIndex = trainings.findIndex(t => t.id === trainingId);

      if (trainingIndex === -1) {
        throw new Error('Training not found');
      }

      const training = trainings[trainingIndex];

      // Проверяем, не зарегистрирован ли пользователь уже
      if (training.currentParticipants.includes(userId)) {
        return true; // Уже зарегистрирован
      }

      // Проверяем, есть ли свободные места
      if (training.currentParticipants.length >= training.maxParticipants) {
        throw new Error('Training is full');
      }

      training.currentParticipants.push(userId);
      trainings[trainingIndex] = training;
      await AsyncStorage.setItem(this.SCHEDULE_KEY, JSON.stringify(trainings));

      return true;
    } catch (error) {
      console.error('Error registering for training:', error);
      throw error;
    }
  }

  // Отмена регистрации пользователя с тренировки
  static async unregisterFromTraining(trainingId: string, userId: string): Promise<boolean> {
    try {
      const trainings = await this.getTrainings();
      const trainingIndex = trainings.findIndex(t => t.id === trainingId);

      if (trainingIndex === -1) {
        throw new Error('Training not found');
      }

      const training = trainings[trainingIndex];
      training.currentParticipants = training.currentParticipants.filter(id => id !== userId);

      trainings[trainingIndex] = training;
      await AsyncStorage.setItem(this.SCHEDULE_KEY, JSON.stringify(trainings));

      return true;
    } catch (error) {
      console.error('Error unregistering from training:', error);
      throw error;
    }
  }

  // Получение тренировок тренера
  static async getCoachTrainings(coachId: string): Promise<Training[]> {
    try {
      const allTrainings = await this.getTrainings();
      return allTrainings.filter(training => training.coachId === coachId);
    } catch (error) {
      console.error('Error getting coach trainings:', error);
      return [];
    }
  }
}

export { ScheduleService };
