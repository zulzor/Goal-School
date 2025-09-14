import AsyncStorage from '@react-native-async-storage/async-storage';

// Типы для контекста задач
export interface TaskContext {
  taskId: string;
  taskTitle: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  lastUpdated: string;
  progress?: number;
  notes?: string;
}

export interface ChatSessionContext {
  sessionId: string;
  taskContexts: TaskContext[];
  lastAccessed: string;
  chatHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}

class TaskContextService {
  private static readonly TASK_CONTEXT_KEY = 'task_context_sessions';
  private static readonly CURRENT_SESSION_KEY = 'current_task_session';

  /**
   * Сохраняет контекст задач для сессии чата
   */
  static async saveSessionContext(sessionId: string, context: TaskContext[]): Promise<void> {
    try {
      const sessionContext: ChatSessionContext = {
        sessionId,
        taskContexts: context,
        lastAccessed: new Date().toISOString(),
        chatHistory: [], // История чата может быть добавлена отдельно
      };

      // Получаем все сессии
      const existingSessions = await this.getAllSessions();

      // Обновляем или добавляем текущую сессию
      const updatedSessions = {
        ...existingSessions,
        [sessionId]: sessionContext,
      };

      // Сохраняем в AsyncStorage
      await AsyncStorage.setItem(this.TASK_CONTEXT_KEY, JSON.stringify(updatedSessions));

      // Также сохраняем ID текущей сессии
      await AsyncStorage.setItem(this.CURRENT_SESSION_KEY, sessionId);
    } catch (error) {
      console.error('Ошибка сохранения контекста задач:', error);
      throw new Error('Не удалось сохранить контекст задач');
    }
  }

  /**
   * Загружает контекст задач для указанной сессии
   */
  static async loadSessionContext(sessionId: string): Promise<TaskContext[] | null> {
    try {
      const sessionsJson = await AsyncStorage.getItem(this.TASK_CONTEXT_KEY);
      if (!sessionsJson) return null;

      const sessions: Record<string, ChatSessionContext> = JSON.parse(sessionsJson);
      const session = sessions[sessionId];

      if (!session) return null;

      // Обновляем время последнего доступа
      session.lastAccessed = new Date().toISOString();
      sessions[sessionId] = session;

      await AsyncStorage.setItem(this.TASK_CONTEXT_KEY, JSON.stringify(sessions));

      return session.taskContexts;
    } catch (error) {
      console.error('Ошибка загрузки контекста задач:', error);
      return null;
    }
  }

  /**
   * Получает ID текущей сессии
   */
  static async getCurrentSessionId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.CURRENT_SESSION_KEY);
    } catch (error) {
      console.error('Ошибка получения ID текущей сессии:', error);
      return null;
    }
  }

  /**
   * Устанавливает ID текущей сессии
   */
  static async setCurrentSessionId(sessionId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.CURRENT_SESSION_KEY, sessionId);
    } catch (error) {
      console.error('Ошибка установки ID текущей сессии:', error);
      throw new Error('Не удалось установить ID текущей сессии');
    }
  }

  /**
   * Получает все сохраненные сессии
   */
  static async getAllSessions(): Promise<Record<string, ChatSessionContext>> {
    try {
      const sessionsJson = await AsyncStorage.getItem(this.TASK_CONTEXT_KEY);
      return sessionsJson ? JSON.parse(sessionsJson) : {};
    } catch (error) {
      console.error('Ошибка получения всех сессий:', error);
      return {};
    }
  }

  /**
   * Удаляет контекст задач для указанной сессии
   */
  static async clearSessionContext(sessionId: string): Promise<void> {
    try {
      const sessions = await this.getAllSessions();
      delete sessions[sessionId];

      await AsyncStorage.setItem(this.TASK_CONTEXT_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Ошибка удаления контекста задач:', error);
      throw new Error('Не удалось удалить контекст задач');
    }
  }

  /**
   * Очищает весь контекст задач
   */
  static async clearAllContexts(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.TASK_CONTEXT_KEY);
      await AsyncStorage.removeItem(this.CURRENT_SESSION_KEY);
    } catch (error) {
      console.error('Ошибка очистки всего контекста задач:', error);
      throw new Error('Не удалось очистить контекст задач');
    }
  }

  /**
   * Обновляет статус конкретной задачи в сессии
   */
  static async updateTaskStatus(
    sessionId: string,
    taskId: string,
    status: TaskContext['status'],
    progress?: number,
    notes?: string
  ): Promise<void> {
    try {
      const context = await this.loadSessionContext(sessionId);
      if (!context) {
        throw new Error('Контекст задач для указанной сессии не найден');
      }

      // Находим задачу и обновляем её статус
      const taskIndex = context.findIndex(task => task.taskId === taskId);
      if (taskIndex !== -1) {
        context[taskIndex] = {
          ...context[taskIndex],
          status,
          progress,
          notes,
          lastUpdated: new Date().toISOString(),
        };

        // Сохраняем обновленный контекст
        await this.saveSessionContext(sessionId, context);
      } else {
        throw new Error(`Задача с ID ${taskId} не найдена в контексте`);
      }
    } catch (error) {
      console.error('Ошибка обновления статуса задачи:', error);
      throw error;
    }
  }

  /**
   * Добавляет новую задачу в контекст сессии
   */
  static async addTaskToContext(
    sessionId: string,
    task: Omit<TaskContext, 'lastUpdated'>
  ): Promise<void> {
    try {
      const context = (await this.loadSessionContext(sessionId)) || [];

      // Проверяем, существует ли уже задача с таким ID
      const existingTaskIndex = context.findIndex(t => t.taskId === task.taskId);

      if (existingTaskIndex !== -1) {
        // Обновляем существующую задачу
        context[existingTaskIndex] = {
          ...task,
          lastUpdated: new Date().toISOString(),
        };
      } else {
        // Добавляем новую задачу
        context.push({
          ...task,
          lastUpdated: new Date().toISOString(),
        });
      }

      // Сохраняем обновленный контекст
      await this.saveSessionContext(sessionId, context);
    } catch (error) {
      console.error('Ошибка добавления задачи в контекст:', error);
      throw error;
    }
  }
}

export default TaskContextService;
