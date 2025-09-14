// src/utils/logger.ts
// Продвинутая система логирования для приложения

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: unknown;
  context?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = __DEV__ ? LogLevel.DEBUG : LogLevel.WARN;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Ограничиваем количество логов в памяти
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  private formatMessage(level: LogLevel, message: string, error?: unknown, context?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    const errorStr = error ? ` | Error: ${error instanceof Error ? error.message : String(error)}` : '';
    
    return `[${timestamp}] [${levelName}] ${message}${contextStr}${errorStr}`;
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      message,
      context,
    };
    
    this.addLog(entry);
    
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(this.formatMessage(LogLevel.DEBUG, message, undefined, context));
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      message,
      context,
    };
    
    this.addLog(entry);
    
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(this.formatMessage(LogLevel.INFO, message, undefined, context));
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      message,
      context,
    };
    
    this.addLog(entry);
    
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn(this.formatMessage(LogLevel.WARN, message, undefined, context));
    }
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      message,
      error,
      context,
    };
    
    this.addLog(entry);
    
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error(this.formatMessage(LogLevel.ERROR, message, error, context));
    } else {
      // В production можно отправлять ошибки на сервер
      this.sendErrorToServer(entry);
    }
  }

  private async sendErrorToServer(entry: LogEntry): Promise<void> {
    try {
      // Здесь можно добавить отправку ошибок на сервер мониторинга
      // Например, Sentry, LogRocket, или собственный API
      console.log('Sending error to server:', entry);
    } catch (error) {
      console.error('Failed to send error to server:', error);
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Экспортируем singleton instance
const logger = Logger.getInstance();

// Экспортируем удобные функции
export const logError = (message: string, error?: unknown, context?: Record<string, unknown>): void => {
  logger.error(message, error, context);
};

export const logWarning = (message: string, context?: Record<string, unknown>): void => {
  logger.warn(message, context);
};

export const logInfo = (message: string, context?: Record<string, unknown>): void => {
  logger.info(message, context);
};

export const logDebug = (message: string, context?: Record<string, unknown>): void => {
  logger.debug(message, context);
};

export { Logger, LogLevel };
export type { LogEntry };
