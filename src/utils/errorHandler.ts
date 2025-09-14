// src/utils/errorHandler.ts
// Продвинутая система обработки ошибок

import { logError, logWarning, Logger } from './logger';

export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  DATABASE = 'DATABASE',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  stack?: string;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private logger: Logger;

  private constructor() {
    this.logger = Logger.getInstance();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Обработка ошибок с автоматической классификацией
   */
  handleError(error: unknown, context?: Record<string, unknown>): AppError {
    const appError = this.classifyError(error);
    
    // Логируем ошибку
    this.logger.error(appError.message, error, {
      ...context,
      errorType: appError.type,
      errorCode: appError.code,
    });

    // В production можно отправлять ошибки на сервер мониторинга
    if (!__DEV__) {
      this.sendErrorToMonitoring(appError, context);
    }

    return appError;
  }

  /**
   * Классификация ошибок по типу
   */
  private classifyError(error: unknown): AppError {
    const timestamp = new Date().toISOString();
    
    if (error instanceof Error) {
      // Сетевые ошибки
      if (error.message.includes('Network') || error.message.includes('fetch')) {
        return {
          type: ErrorType.NETWORK,
          message: 'Ошибка сети. Проверьте подключение к интернету.',
          code: 'NETWORK_ERROR',
          timestamp,
          stack: error.stack,
        };
      }

      // Ошибки аутентификации
      if (error.message.includes('auth') || error.message.includes('login')) {
        return {
          type: ErrorType.AUTHENTICATION,
          message: 'Ошибка аутентификации. Проверьте данные для входа.',
          code: 'AUTH_ERROR',
          timestamp,
          stack: error.stack,
        };
      }

      // Ошибки валидации
      if (error.message.includes('validation') || error.message.includes('invalid')) {
        return {
          type: ErrorType.VALIDATION,
          message: 'Ошибка валидации данных.',
          code: 'VALIDATION_ERROR',
          timestamp,
          stack: error.stack,
        };
      }

      // Ошибки базы данных
      if (error.message.includes('database') || error.message.includes('SQL')) {
        return {
          type: ErrorType.DATABASE,
          message: 'Ошибка базы данных.',
          code: 'DATABASE_ERROR',
          timestamp,
          stack: error.stack,
        };
      }

      // Общие ошибки
      return {
        type: ErrorType.UNKNOWN,
        message: error.message || 'Произошла неизвестная ошибка.',
        code: 'UNKNOWN_ERROR',
        timestamp,
        stack: error.stack,
      };
    }

    // Обработка не-Error объектов
    return {
      type: ErrorType.UNKNOWN,
      message: typeof error === 'string' ? error : 'Произошла неизвестная ошибка.',
      code: 'UNKNOWN_ERROR',
      timestamp,
    };
  }

  /**
   * Создание пользовательских ошибок
   */
  createError(
    type: ErrorType,
    message: string,
    code?: string,
    details?: Record<string, unknown>
  ): AppError {
    return {
      type,
      message,
      code,
      details,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Обработка асинхронных операций с автоматической обработкой ошибок
   */
  async handleAsync<T>(
    asyncFn: () => Promise<T>,
    context?: Record<string, unknown>
  ): Promise<{ data?: T; error?: AppError }> {
    try {
      const data = await asyncFn();
      return { data };
    } catch (error) {
      const appError = this.handleError(error, context);
      return { error: appError };
    }
  }

  /**
   * Обработка Promise с автоматической обработкой ошибок
   */
  handlePromise<T>(
    promise: Promise<T>,
    context?: Record<string, unknown>
  ): Promise<{ data?: T; error?: AppError }> {
    return promise
      .then(data => ({ data }))
      .catch(error => {
        const appError = this.handleError(error, context);
        return { error: appError };
      });
  }

  /**
   * Отправка ошибок в систему мониторинга
   */
  private async sendErrorToMonitoring(error: AppError, context?: Record<string, unknown>): Promise<void> {
    try {
      // Здесь можно добавить интеграцию с Sentry, LogRocket и т.д.
      console.log('Sending error to monitoring service:', { error, context });
    } catch (monitoringError) {
      this.logger.error('Failed to send error to monitoring service', monitoringError);
    }
  }

  /**
   * Получение пользовательского сообщения об ошибке
   */
  getUserMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.NETWORK:
        return 'Проблемы с подключением к интернету. Проверьте соединение и попробуйте снова.';
      case ErrorType.AUTHENTICATION:
        return 'Ошибка входа. Проверьте email и пароль.';
      case ErrorType.AUTHORIZATION:
        return 'Недостаточно прав для выполнения этого действия.';
      case ErrorType.VALIDATION:
        return 'Проверьте правильность введенных данных.';
      case ErrorType.DATABASE:
        return 'Временные проблемы с сервером. Попробуйте позже.';
      default:
        return 'Произошла ошибка. Попробуйте снова или обратитесь в поддержку.';
    }
  }

  /**
   * Проверка, является ли ошибка критической
   */
  isCriticalError(error: AppError): boolean {
    return error.type === ErrorType.DATABASE || 
           error.type === ErrorType.AUTHENTICATION ||
           (error.type === ErrorType.NETWORK && error.code === 'NETWORK_ERROR');
  }
}

// Экспортируем singleton instance
const errorHandler = ErrorHandler.getInstance();

// Экспортируем удобные функции
export const handleError = (error: unknown, context?: Record<string, unknown>): AppError => {
  return errorHandler.handleError(error, context);
};

export const createError = (
  type: ErrorType,
  message: string,
  code?: string,
  details?: Record<string, unknown>
): AppError => {
  return errorHandler.createError(type, message, code, details);
};

export const handleAsync = <T>(
  asyncFn: () => Promise<T>,
  context?: Record<string, unknown>
): Promise<{ data?: T; error?: AppError }> => {
  return errorHandler.handleAsync(asyncFn, context);
};

export const handlePromise = <T>(
  promise: Promise<T>,
  context?: Record<string, unknown>
): Promise<{ data?: T; error?: AppError }> => {
  return errorHandler.handlePromise(promise, context);
};

export const getUserMessage = (error: AppError): string => {
  return errorHandler.getUserMessage(error);
};

export const isCriticalError = (error: AppError): boolean => {
  return errorHandler.isCriticalError(error);
};

export { ErrorHandler };
export type { AppError };