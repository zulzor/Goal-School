import TaskContextService, { TaskContext } from '../TaskContextService';

// Мокаем AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const AsyncStorage = require('@react-native-async-storage/async-storage').default;

describe('TaskContextService', () => {
  const mockTaskContexts: TaskContext[] = [
    {
      taskId: 'task1',
      taskTitle: 'Тестовая задача 1',
      status: 'pending',
      lastUpdated: '2025-01-01T00:00:00.000Z',
    },
    {
      taskId: 'task2',
      taskTitle: 'Тестовая задача 2',
      status: 'in_progress',
      progress: 50,
      lastUpdated: '2025-01-01T00:00:00.000Z',
    },
  ];

  const sessionId = 'test_session_123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveSessionContext', () => {
    it('должен сохранять контекст задач для сессии', async () => {
      await TaskContextService.saveSessionContext(sessionId, mockTaskContexts);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'task_context_sessions',
        expect.stringContaining('test_session_123')
      );

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('current_task_session', sessionId);
    });
  });

  describe('loadSessionContext', () => {
    it('должен загружать контекст задач для сессии', async () => {
      const mockSessions = {
        [sessionId]: {
          sessionId,
          taskContexts: mockTaskContexts,
          lastAccessed: '2025-01-01T00:00:00.000Z',
          chatHistory: [],
        },
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockSessions));

      const result = await TaskContextService.loadSessionContext(sessionId);

      expect(result).toEqual(mockTaskContexts);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('task_context_sessions');
    });

    it('должен возвращать null если сессия не найдена', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify({}));

      const result = await TaskContextService.loadSessionContext(sessionId);

      expect(result).toBeNull();
    });
  });

  describe('updateTaskStatus', () => {
    it('должен обновлять статус задачи', async () => {
      const mockSessions = {
        [sessionId]: {
          sessionId,
          taskContexts: [...mockTaskContexts],
          lastAccessed: '2025-01-01T00:00:00.000Z',
          chatHistory: [],
        },
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockSessions));

      await TaskContextService.updateTaskStatus(
        sessionId,
        'task1',
        'completed',
        100,
        'Задача выполнена'
      );

      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});
