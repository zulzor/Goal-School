// src/utils/__tests__/logger.test.ts
// Тесты для системы логирования

import { Logger, LogLevel, logError, logWarning, logInfo, logDebug } from '../logger';

// Мокаем console методы
const mockConsoleError = jest.fn();
const mockConsoleWarn = jest.fn();
const mockConsoleLog = jest.fn();

beforeAll(() => {
  global.console = {
    ...global.console,
    error: mockConsoleError,
    warn: mockConsoleWarn,
    log: mockConsoleLog,
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  // Очищаем логи перед каждым тестом
  Logger.getInstance().clearLogs();
});

describe('Logger', () => {
  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = Logger.getInstance();
      const instance2 = Logger.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Log levels', () => {
    it('should log debug messages in development', () => {
      const logger = Logger.getInstance();
      logger.setLogLevel(LogLevel.DEBUG);
      
      logDebug('Test debug message', { test: 'data' });
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG] Test debug message')
      );
    });

    it('should log info messages', () => {
      const logger = Logger.getInstance();
      logger.setLogLevel(LogLevel.INFO);
      
      logInfo('Test info message', { test: 'data' });
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] Test info message')
      );
    });

    it('should log warning messages', () => {
      const logger = Logger.getInstance();
      logger.setLogLevel(LogLevel.WARN);
      
      logWarning('Test warning message', { test: 'data' });
      
      expect(mockConsoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN] Test warning message')
      );
    });

    it('should log error messages', () => {
      const logger = Logger.getInstance();
      logger.setLogLevel(LogLevel.ERROR);
      
      const error = new Error('Test error');
      logError('Test error message', error, { test: 'data' });
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] Test error message')
      );
    });
  });

  describe('Log filtering', () => {
    it('should not log debug messages when level is WARN', () => {
      const logger = Logger.getInstance();
      logger.setLogLevel(LogLevel.WARN);
      
      logDebug('Test debug message');
      
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });

    it('should not log info messages when level is ERROR', () => {
      const logger = Logger.getInstance();
      logger.setLogLevel(LogLevel.ERROR);
      
      logInfo('Test info message');
      
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });
  });

  describe('Log storage', () => {
    it('should store logs in memory', () => {
      const logger = Logger.getInstance();
      logger.setLogLevel(LogLevel.DEBUG);
      
      logDebug('Test message');
      logInfo('Test info');
      logWarning('Test warning');
      
      const logs = logger.getLogs();
      expect(logs).toHaveLength(3);
      expect(logs[0].message).toBe('Test message');
      expect(logs[1].message).toBe('Test info');
      expect(logs[2].message).toBe('Test warning');
    });

    it('should filter logs by level', () => {
      const logger = Logger.getInstance();
      logger.setLogLevel(LogLevel.DEBUG);
      
      logDebug('Debug message');
      logInfo('Info message');
      logWarning('Warning message');
      logError('Error message');
      
      const errorLogs = logger.getLogs(LogLevel.ERROR);
      expect(errorLogs).toHaveLength(1);
      expect(errorLogs[0].message).toBe('Error message');
      
      const warningAndAbove = logger.getLogs(LogLevel.WARN);
      expect(warningAndAbove).toHaveLength(2);
    });

    it('should limit number of stored logs', () => {
      const logger = Logger.getInstance();
      logger.setLogLevel(LogLevel.DEBUG);
      
      // Создаем больше логов, чем максимальный размер
      for (let i = 0; i < 1500; i++) {
        logDebug(`Message ${i}`);
      }
      
      const logs = logger.getLogs();
      expect(logs.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('Log export', () => {
    it('should export logs as JSON', () => {
      const logger = Logger.getInstance();
      logger.setLogLevel(LogLevel.DEBUG);
      
      logDebug('Test message');
      logInfo('Test info');
      
      const exportedLogs = logger.exportLogs();
      const parsedLogs = JSON.parse(exportedLogs);
      
      expect(parsedLogs).toHaveLength(2);
      expect(parsedLogs[0].message).toBe('Test message');
      expect(parsedLogs[1].message).toBe('Test info');
    });
  });

  describe('Context logging', () => {
    it('should include context in log messages', () => {
      const logger = Logger.getInstance();
      logger.setLogLevel(LogLevel.DEBUG);
      
      logDebug('Test message', { userId: '123', action: 'test' });
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Context: {"userId":"123","action":"test"}')
      );
    });
  });

  describe('Error handling', () => {
    it('should handle non-Error objects', () => {
      const logger = Logger.getInstance();
      logger.setLogLevel(LogLevel.ERROR);
      
      logError('Test error', 'String error');
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('Error: String error')
      );
    });

    it('should handle Error objects', () => {
      const logger = Logger.getInstance();
      logger.setLogLevel(LogLevel.ERROR);
      
      const error = new Error('Test error message');
      logError('Test error', error);
      
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('Error: Test error message')
      );
    });
  });
});