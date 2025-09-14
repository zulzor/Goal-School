// src/utils/__tests__/errorHandler.test.ts
// Тесты для системы обработки ошибок

import { 
  ErrorHandler, 
  ErrorType, 
  handleError, 
  createError, 
  handleAsync, 
  handlePromise,
  getUserMessage,
  isCriticalError
} from '../errorHandler';

describe('ErrorHandler', () => {
  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ErrorHandler.getInstance();
      const instance2 = ErrorHandler.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Error classification', () => {
    it('should classify network errors', () => {
      const error = new Error('Network request failed');
      const appError = handleError(error);
      
      expect(appError.type).toBe(ErrorType.NETWORK);
      expect(appError.message).toContain('сети');
    });

    it('should classify authentication errors', () => {
      const error = new Error('Authentication failed');
      const appError = handleError(error);
      
      expect(appError.type).toBe(ErrorType.AUTHENTICATION);
      expect(appError.message).toContain('аутентификации');
    });

    it('should classify validation errors', () => {
      const error = new Error('Invalid input validation');
      const appError = handleError(error);
      
      expect(appError.type).toBe(ErrorType.VALIDATION);
      expect(appError.message).toContain('валидации');
    });

    it('should classify database errors', () => {
      const error = new Error('Database connection failed');
      const appError = handleError(error);
      
      expect(appError.type).toBe(ErrorType.DATABASE);
      expect(appError.message).toContain('базы данных');
    });

    it('should classify unknown errors', () => {
      const error = new Error('Some random error');
      const appError = handleError(error);
      
      expect(appError.type).toBe(ErrorType.UNKNOWN);
      expect(appError.message).toContain('неизвестная ошибка');
    });

    it('should handle non-Error objects', () => {
      const error = 'String error';
      const appError = handleError(error);
      
      expect(appError.type).toBe(ErrorType.UNKNOWN);
      expect(appError.message).toBe('String error');
    });
  });

  describe('Error creation', () => {
    it('should create custom errors', () => {
      const error = createError(
        ErrorType.VALIDATION,
        'Custom validation error',
        'CUSTOM_ERROR',
        { field: 'email' }
      );
      
      expect(error.type).toBe(ErrorType.VALIDATION);
      expect(error.message).toBe('Custom validation error');
      expect(error.code).toBe('CUSTOM_ERROR');
      expect(error.details).toEqual({ field: 'email' });
      expect(error.timestamp).toBeDefined();
    });
  });

  describe('Async error handling', () => {
    it('should handle successful async operations', async () => {
      const asyncFn = async () => 'success';
      const result = await handleAsync(asyncFn);
      
      expect(result.data).toBe('success');
      expect(result.error).toBeUndefined();
    });

    it('should handle failed async operations', async () => {
      const asyncFn = async () => {
        throw new Error('Test error');
      };
      const result = await handleAsync(asyncFn);
      
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe(ErrorType.UNKNOWN);
    });

    it('should handle successful promises', async () => {
      const promise = Promise.resolve('success');
      const result = await handlePromise(promise);
      
      expect(result.data).toBe('success');
      expect(result.error).toBeUndefined();
    });

    it('should handle failed promises', async () => {
      const promise = Promise.reject(new Error('Test error'));
      const result = await handlePromise(promise);
      
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe(ErrorType.UNKNOWN);
    });
  });

  describe('User messages', () => {
    it('should return appropriate user messages for different error types', () => {
      const networkError = createError(ErrorType.NETWORK, 'Network error');
      const authError = createError(ErrorType.AUTHENTICATION, 'Auth error');
      const validationError = createError(ErrorType.VALIDATION, 'Validation error');
      const databaseError = createError(ErrorType.DATABASE, 'Database error');
      const unknownError = createError(ErrorType.UNKNOWN, 'Unknown error');
      
      expect(getUserMessage(networkError)).toContain('подключением');
      expect(getUserMessage(authError)).toContain('входа');
      expect(getUserMessage(validationError)).toContain('данных');
      expect(getUserMessage(databaseError)).toContain('сервером');
      expect(getUserMessage(unknownError)).toContain('поддержку');
    });
  });

  describe('Critical error detection', () => {
    it('should identify critical errors', () => {
      const databaseError = createError(ErrorType.DATABASE, 'Database error');
      const authError = createError(ErrorType.AUTHENTICATION, 'Auth error');
      const networkError = createError(ErrorType.NETWORK, 'Network error');
      const validationError = createError(ErrorType.VALIDATION, 'Validation error');
      
      expect(isCriticalError(databaseError)).toBe(true);
      expect(isCriticalError(authError)).toBe(true);
      expect(isCriticalError(networkError)).toBe(true);
      expect(isCriticalError(validationError)).toBe(false);
    });
  });

  describe('Error context', () => {
    it('should include context in error handling', () => {
      const error = new Error('Test error');
      const context = { userId: '123', operation: 'test' };
      const appError = handleError(error, context);
      
      expect(appError.timestamp).toBeDefined();
      expect(appError.type).toBe(ErrorType.UNKNOWN);
    });
  });

  describe('Error stack traces', () => {
    it('should preserve stack traces for Error objects', () => {
      const error = new Error('Test error');
      const appError = handleError(error);
      
      expect(appError.stack).toBeDefined();
      expect(appError.stack).toContain('Test error');
    });

    it('should not have stack traces for non-Error objects', () => {
      const error = 'String error';
      const appError = handleError(error);
      
      expect(appError.stack).toBeUndefined();
    });
  });
});