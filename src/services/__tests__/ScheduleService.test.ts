// src/services/__tests__/ScheduleService.test.ts
import { ScheduleService } from '../ScheduleService';

// Мокаем AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('ScheduleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new training', async () => {
    const mockGetItem = require('@react-native-async-storage/async-storage').getItem;
    const mockSetItem = require('@react-native-async-storage/async-storage').setItem;

    mockGetItem.mockResolvedValue(null);

    const trainingData = {
      title: 'Test Training',
      description: 'Test Description',
      date: '2025-01-01',
      startTime: '10:00',
      endTime: '11:00',
      location: 'Test Location',
      coachId: 'coach1',
      coachName: 'Test Coach',
      maxParticipants: 10,
      ageGroup: 'U-10',
      type: 'training' as const,
    };

    const training = await ScheduleService.createTraining(trainingData);

    expect(training).toHaveProperty('id');
    expect(training.title).toBe(trainingData.title);
    expect(training.description).toBe(trainingData.description);
    expect(training.date).toBe(trainingData.date);
    expect(mockSetItem).toHaveBeenCalled();
  });

  it('should register user for training', async () => {
    const mockGetItem = require('@react-native-async-storage/async-storage').getItem;
    const mockSetItem = require('@react-native-async-storage/async-storage').setItem;

    const training = {
      id: '1',
      title: 'Test Training',
      description: 'Test Description',
      date: '2025-01-01',
      startTime: '10:00',
      endTime: '11:00',
      location: 'Test Location',
      coachId: 'coach1',
      coachName: 'Test Coach',
      maxParticipants: 10,
      currentParticipants: [],
      ageGroup: 'U-10',
      type: 'training' as const,
      createdAt: new Date().toISOString(),
    };

    mockGetItem.mockResolvedValue(JSON.stringify([training]));

    const result = await ScheduleService.registerForTraining('1', 'user1');

    expect(result).toBe(true);
    expect(mockSetItem).toHaveBeenCalled();
  });

  it('should get trainings by date', async () => {
    const mockGetItem = require('@react-native-async-storage/async-storage').getItem;

    const trainings = [
      {
        id: '1',
        title: 'Test Training 1',
        description: 'Test Description 1',
        date: '2025-01-01',
        startTime: '10:00',
        endTime: '11:00',
        location: 'Test Location 1',
        coachId: 'coach1',
        coachName: 'Test Coach 1',
        maxParticipants: 10,
        currentParticipants: [],
        ageGroup: 'U-10',
        type: 'training' as const,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Test Training 2',
        description: 'Test Description 2',
        date: '2025-01-02',
        startTime: '10:00',
        endTime: '11:00',
        location: 'Test Location 2',
        coachId: 'coach2',
        coachName: 'Test Coach 2',
        maxParticipants: 10,
        currentParticipants: [],
        ageGroup: 'U-12',
        type: 'training' as const,
        createdAt: new Date().toISOString(),
      },
    ];

    mockGetItem.mockResolvedValue(JSON.stringify(trainings));

    const result = await ScheduleService.getTrainingsByDate('2025-01-01');

    expect(result).toHaveLength(1);
    expect(result[0].date).toBe('2025-01-01');
  });
});
