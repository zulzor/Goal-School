// src/services/TrainingResultsService.ts
// Сервис для работы с результатами тренировок через локальное хранилище

import AsyncStorage from '@react-native-async-storage/async-storage';

// Интерфейсы для типов данных
export interface Student {
  id: string;
  name: string;
  email: string;
  ageGroup: string;
  branchId: string;
}

export interface TrainingSession {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  ageGroup: string;
  coachId: string;
  branchId: string;
}

export interface TrainingResult {
  id: string;
  studentId: string;
  trainingId: string;
  coachId: string;
  technicalSkills: number; // 1-5
  physicalFitness: number; // 1-5
  teamwork: number; // 1-5
  attitude: number; // 1-5
  overallRating: number; // 1-5
  notes: string;
  dateRecorded: string;
  student?: Student;
  training?: TrainingSession;
}

export class TrainingResultsService {
  private static readonly RESULTS_KEY = 'training_results';
  private static readonly STUDENTS_KEY = 'students';
  private static readonly TRAININGS_KEY = 'training_sessions';

  // Получение всех результатов тренера
  static async getCoachResults(coachId: string): Promise<TrainingResult[]> {
    try {
      const resultsJson = await AsyncStorage.getItem(this.RESULTS_KEY);
      const results: TrainingResult[] = resultsJson ? JSON.parse(resultsJson) : [];

      // Фильтруем результаты по тренеру и добавляем данные учеников и тренировок
      const filteredResults = results.filter(result => result.coachId === coachId);

      // Добавляем данные учеников и тренировок к результатам
      for (const result of filteredResults) {
        if (result.studentId) {
          const student = await this.getStudentById(result.studentId);
          if (student) {
            result.student = student;
          }
        }
        if (result.trainingId) {
          const training = await this.getTrainingById(result.trainingId);
          if (training) {
            result.training = training;
          }
        }
      }

      return filteredResults;
    } catch (error) {
      console.error('Ошибка получения результатов тренера:', error);
      return [];
    }
  }

  // Добавление нового результата
  static async addResult(
    result: Omit<TrainingResult, 'id' | 'dateRecorded'>
  ): Promise<TrainingResult | null> {
    try {
      const resultsJson = await AsyncStorage.getItem(this.RESULTS_KEY);
      const results: TrainingResult[] = resultsJson ? JSON.parse(resultsJson) : [];

      const newResult: TrainingResult = {
        id: `result_${Date.now()}`,
        ...result,
        dateRecorded: new Date().toISOString(),
      };

      results.push(newResult);
      await AsyncStorage.setItem(this.RESULTS_KEY, JSON.stringify(results));

      return newResult;
    } catch (error) {
      console.error('Ошибка добавления результата:', error);
      return null;
    }
  }

  // Обновление результата
  static async updateResult(id: string, updates: Partial<TrainingResult>): Promise<boolean> {
    try {
      const resultsJson = await AsyncStorage.getItem(this.RESULTS_KEY);
      const results: TrainingResult[] = resultsJson ? JSON.parse(resultsJson) : [];

      const resultIndex = results.findIndex(r => r.id === id);
      if (resultIndex === -1) {
        return false;
      }

      results[resultIndex] = { ...results[resultIndex], ...updates };
      await AsyncStorage.setItem(this.RESULTS_KEY, JSON.stringify(results));

      return true;
    } catch (error) {
      console.error('Ошибка обновления результата:', error);
      return false;
    }
  }

  // Удаление результата
  static async deleteResult(id: string): Promise<boolean> {
    try {
      const resultsJson = await AsyncStorage.getItem(this.RESULTS_KEY);
      const results: TrainingResult[] = resultsJson ? JSON.parse(resultsJson) : [];

      const filteredResults = results.filter(r => r.id !== id);
      await AsyncStorage.setItem(this.RESULTS_KEY, JSON.stringify(filteredResults));

      return true;
    } catch (error) {
      console.error('Ошибка удаления результата:', error);
      return false;
    }
  }

  // Получение ученика по ID
  static async getStudentById(studentId: string): Promise<Student | null> {
    try {
      const studentsJson = await AsyncStorage.getItem(this.STUDENTS_KEY);
      const students: Student[] = studentsJson ? JSON.parse(studentsJson) : [];

      const student = students.find(s => s.id === studentId);
      return student || null;
    } catch (error) {
      console.error('Ошибка получения ученика:', error);
      return null;
    }
  }

  // Получение тренировки по ID
  static async getTrainingById(trainingId: string): Promise<TrainingSession | null> {
    try {
      const trainingsJson = await AsyncStorage.getItem(this.TRAININGS_KEY);
      const trainings: TrainingSession[] = trainingsJson ? JSON.parse(trainingsJson) : [];

      const training = trainings.find(t => t.id === trainingId);
      return training || null;
    } catch (error) {
      console.error('Ошибка получения тренировки:', error);
      return null;
    }
  }

  // Получение учеников филиала
  static async getStudentsByBranch(branchId: string): Promise<Student[]> {
    try {
      const studentsJson = await AsyncStorage.getItem(this.STUDENTS_KEY);
      const students: Student[] = studentsJson ? JSON.parse(studentsJson) : [];

      return students.filter(student => student.branchId === branchId);
    } catch (error) {
      console.error('Ошибка получения учеников филиала:', error);
      return [];
    }
  }

  // Получение тренировок тренера
  static async getTrainingsByCoach(coachId: string): Promise<TrainingSession[]> {
    try {
      const trainingsJson = await AsyncStorage.getItem(this.TRAININGS_KEY);
      const trainings: TrainingSession[] = trainingsJson ? JSON.parse(trainingsJson) : [];

      return trainings.filter(training => training.coachId === coachId);
    } catch (error) {
      console.error('Ошибка получения тренировок тренера:', error);
      return [];
    }
  }

  // Создание тестовых данных
  static async createTestData() {
    try {
      // Создаем тестовых учеников
      const students: Student[] = [
        {
          id: 'student1',
          name: 'Иванов Иван',
          email: 'ivanov@example.com',
          ageGroup: 'U-10',
          branchId: 'branch1',
        },
        {
          id: 'student2',
          name: 'Петров Петр',
          email: 'petrov@example.com',
          ageGroup: 'U-10',
          branchId: 'branch1',
        },
        {
          id: 'student3',
          name: 'Сидоров Сидор',
          email: 'sidorov@example.com',
          ageGroup: 'U-12',
          branchId: 'branch1',
        },
      ];

      await AsyncStorage.setItem(this.STUDENTS_KEY, JSON.stringify(students));

      // Создаем тестовые тренировки
      const trainings: TrainingSession[] = [
        {
          id: 'training1',
          title: 'Тренировка U-10',
          date: '2025-09-10',
          startTime: '10:00',
          endTime: '11:30',
          location: 'Главное поле',
          ageGroup: 'U-10',
          coachId: 'coach1',
          branchId: 'branch1',
        },
        {
          id: 'training2',
          title: 'Тренировка U-12',
          date: '2025-09-12',
          startTime: '14:00',
          endTime: '15:30',
          location: 'Поле A',
          ageGroup: 'U-12',
          coachId: 'coach1',
          branchId: 'branch1',
        },
      ];

      await AsyncStorage.setItem(this.TRAININGS_KEY, JSON.stringify(trainings));

      console.log('Тестовые данные созданы');
    } catch (error) {
      console.error('Ошибка создания тестовых данных:', error);
    }
  }
}

export const trainingResultsService = new TrainingResultsService();
