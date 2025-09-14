import { useState, useEffect } from 'react';
import TaskContextService, { TaskContext } from '../services/TaskContextService';

interface UseTaskContextReturn {
  taskContexts: TaskContext[] | null;
  loading: boolean;
  error: string | null;
  saveContext: (sessionId: string, contexts: TaskContext[]) => Promise<void>;
  loadContext: (sessionId: string) => Promise<void>;
  updateTaskStatus: (
    sessionId: string,
    taskId: string,
    status: TaskContext['status'],
    progress?: number,
    notes?: string
  ) => Promise<void>;
  addTaskToContext: (sessionId: string, task: Omit<TaskContext, 'lastUpdated'>) => Promise<void>;
  clearContext: (sessionId: string) => Promise<void>;
}

/**
 * Хук для управления контекстом задач в сессиях чата
 */
export const useTaskContext = (): UseTaskContextReturn => {
  const [taskContexts, setTaskContexts] = useState<TaskContext[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Сохраняет контекст задач для сессии
   */
  const saveContext = async (sessionId: string, contexts: TaskContext[]): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await TaskContextService.saveSessionContext(sessionId, contexts);
      setTaskContexts(contexts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('Ошибка сохранения контекста:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Загружает контекст задач для сессии
   */
  const loadContext = async (sessionId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const contexts = await TaskContextService.loadSessionContext(sessionId);
      setTaskContexts(contexts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('Ошибка загрузки контекста:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Обновляет статус задачи
   */
  const updateTaskStatus = async (
    sessionId: string,
    taskId: string,
    status: TaskContext['status'],
    progress?: number,
    notes?: string
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await TaskContextService.updateTaskStatus(sessionId, taskId, status, progress, notes);

      // После обновления перезагружаем контекст
      await loadContext(sessionId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('Ошибка обновления статуса задачи:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Добавляет задачу в контекст
   */
  const addTaskToContext = async (
    sessionId: string,
    task: Omit<TaskContext, 'lastUpdated'>
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await TaskContextService.addTaskToContext(sessionId, task);

      // После добавления перезагружаем контекст
      await loadContext(sessionId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('Ошибка добавления задачи в контекст:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Очищает контекст задач для сессии
   */
  const clearContext = async (sessionId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await TaskContextService.clearSessionContext(sessionId);
      setTaskContexts(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      setError(errorMessage);
      console.error('Ошибка очистки контекста:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    taskContexts,
    loading,
    error,
    saveContext,
    loadContext,
    updateTaskStatus,
    addTaskToContext,
    clearContext,
  };
};
