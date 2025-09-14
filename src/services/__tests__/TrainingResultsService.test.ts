// src/services/__tests__/TrainingResultsService.test.ts
// Тесты для сервиса результатов тренировок

import { TrainingResultsService } from '../TrainingResultsService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Мокаем AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('TrainingResultsService', () => {
  const mockStudents = [
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
  ];

  const mockTrainings = [
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
  ];

  const mockResults = [
    {
      id: 'result1',
      studentId: 'student1',
      trainingId: 'training1',
      coachId: 'coach1',
      technicalSkills: 4,
      physicalFitness: 3,
      teamwork: 5,
      attitude: 4,
      overallRating: 4,
      notes: 'Хорошие технические навыки',
      dateRecorded: '2025-09-10T11:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCoachResults', () => {
    it('should return results for a coach', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(mockResults))
        .mockResolvedValueOnce(JSON.stringify(mockStudents))
        .mockResolvedValueOnce(JSON.stringify(mockTrainings));

      const results = await TrainingResultsService.getCoachResults('coach1');

      expect(results).toHaveLength(1);
      expect(results[0].student).toEqual(mockStudents[0]);
      expect(results[0].training).toEqual(mockTrainings[0]);
    });

    it('should return empty array if no results found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([]));

      const results = await TrainingResultsService.getCoachResults('coach2');

      expect(results).toHaveLength(0);
    });

    it('should handle errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      const results = await TrainingResultsService.getCoachResults('coach1');

      expect(results).toHaveLength(0);
    });
  });

  describe('addResult', () => {
    it('should add a new result', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      const resultData = {
        studentId: 'student1',
        trainingId: 'training1',
        coachId: 'coach1',
        technicalSkills: 4,
        physicalFitness: 3,
        teamwork: 5,
        attitude: 4,
        overallRating: 4,
        notes: 'Хорошие технические навыки',
      };

      const result = await TrainingResultsService.addResult(resultData);

      expect(result).not.toBeNull();
      expect(result?.id).toBeDefined();
      expect(result?.dateRecorded).toBeDefined();
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      const resultData = {
        studentId: 'student1',
        trainingId: 'training1',
        coachId: 'coach1',
        technicalSkills: 4,
        physicalFitness: 3,
        teamwork: 5,
        attitude: 4,
        overallRating: 4,
        notes: 'Хорошие технические навыки',
      };

      const result = await TrainingResultsService.addResult(resultData);

      expect(result).toBeNull();
    });
  });

  describe('deleteResult', () => {
    it('should delete a result', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockResults));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      const success = await TrainingResultsService.deleteResult('result1');

      expect(success).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it('should return true even if result does not exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      const success = await TrainingResultsService.deleteResult('nonexistent');

      expect(success).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      const success = await TrainingResultsService.deleteResult('result1');

      expect(success).toBe(false);
    });
  });

  describe('getStudentsByBranch', () => {
    it('should return students for a branch', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockStudents));

      const students = await TrainingResultsService.getStudentsByBranch('branch1');

      expect(students).toHaveLength(2);
    });

    it('should return empty array if no students found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([]));

      const students = await TrainingResultsService.getStudentsByBranch('branch2');

      expect(students).toHaveLength(0);
    });
  });

  describe('getTrainingsByCoach', () => {
    it('should return trainings for a coach', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockTrainings));

      const trainings = await TrainingResultsService.getTrainingsByCoach('coach1');

      expect(trainings).toHaveLength(1);
    });

    it('should return empty array if no trainings found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify([]));

      const trainings = await TrainingResultsService.getTrainingsByCoach('coach2');

      expect(trainings).toHaveLength(0);
    });
  });
});
