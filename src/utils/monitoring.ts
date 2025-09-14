// src/utils/monitoring.ts
// Система мониторинга производительности и здоровья приложения

import { logError, logWarning, logInfo, logDebug, Logger } from './logger';
import { createError, ErrorType } from './errorHandler';

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  message: string;
  timestamp: number;
  duration?: number;
  details?: Record<string, unknown>;
}

export interface PerformanceMetrics {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface SystemInfo {
  platform: string;
  version: string;
  memoryUsage?: number;
  uptime: number;
  timestamp: number;
}

class MonitoringService {
  private static instance: MonitoringService;
  private healthChecks: HealthCheck[] = [];
  private performanceMetrics: PerformanceMetrics[] = [];
  private systemInfo: SystemInfo | null = null;
  private maxHealthChecks = 100;
  private maxMetrics = 1000;
  private logger: Logger;

  private constructor() {
    this.logger = Logger.getInstance();
    this.initializeSystemInfo();
    this.startPeriodicHealthChecks();
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  /**
   * Инициализация информации о системе
   */
  private initializeSystemInfo(): void {
    this.systemInfo = {
      platform: typeof window !== 'undefined' ? 'web' : 'mobile',
      version: '1.0.0',
      memoryUsage: this.getMemoryUsage(),
      uptime: Date.now(),
      timestamp: Date.now(),
    };
  }

  /**
   * Получение использования памяти
   */
  private getMemoryUsage(): number | undefined {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return undefined;
  }

  /**
   * Запуск периодических проверок здоровья
   */
  private startPeriodicHealthChecks(): void {
    // Проверяем каждые 30 секунд
    setInterval(() => {
      this.runHealthChecks();
    }, 30000);
  }

  /**
   * Выполнение проверок здоровья
   */
  async runHealthChecks(): Promise<void> {
    const checks = [
      this.checkMemoryUsage(),
      this.checkErrorRate(),
      this.checkResponseTime(),
      this.checkStorageHealth(),
    ];

    const results = await Promise.allSettled(checks);
    
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        logError('Health check failed', result.reason, { checkIndex: index });
      }
    });
  }

  /**
   * Проверка использования памяти
   */
  private async checkMemoryUsage(): Promise<HealthCheck> {
    const memoryUsage = this.getMemoryUsage();
    const timestamp = Date.now();
    
    let status: HealthCheck['status'] = 'healthy';
    let message = 'Memory usage is normal';
    
    if (memoryUsage) {
      const memoryMB = memoryUsage / (1024 * 1024);
      
      if (memoryMB > 100) {
        status = 'unhealthy';
        message = `High memory usage: ${memoryMB.toFixed(2)}MB`;
      } else if (memoryMB > 50) {
        status = 'degraded';
        message = `Elevated memory usage: ${memoryMB.toFixed(2)}MB`;
      }
    }

    const healthCheck: HealthCheck = {
      name: 'memory_usage',
      status,
      message,
      timestamp,
      details: { memoryUsage: memoryUsage ? memoryUsage / (1024 * 1024) : undefined }
    };

    this.addHealthCheck(healthCheck);
    return healthCheck;
  }

  /**
   * Проверка частоты ошибок
   */
  private async checkErrorRate(): Promise<HealthCheck> {
    const logs = this.logger.getLogs();
    const now = Date.now();
    const last5Minutes = logs.filter(log => now - log.timestamp < 5 * 60 * 1000);
    const errorCount = last5Minutes.filter(log => log.level === 3).length; // ERROR level
    
    let status: HealthCheck['status'] = 'healthy';
    let message = 'Error rate is normal';
    
    if (errorCount > 10) {
      status = 'unhealthy';
      message = `High error rate: ${errorCount} errors in last 5 minutes`;
    } else if (errorCount > 5) {
      status = 'degraded';
      message = `Elevated error rate: ${errorCount} errors in last 5 minutes`;
    }

    const healthCheck: HealthCheck = {
      name: 'error_rate',
      status,
      message,
      timestamp: now,
      details: { errorCount, timeWindow: '5 minutes' }
    };

    this.addHealthCheck(healthCheck);
    return healthCheck;
  }

  /**
   * Проверка времени отклика
   */
  private async checkResponseTime(): Promise<HealthCheck> {
    const startTime = performance.now();
    
    // Симулируем проверку отклика
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const duration = performance.now() - startTime;
    
    let status: HealthCheck['status'] = 'healthy';
    let message = 'Response time is normal';
    
    if (duration > 1000) {
      status = 'unhealthy';
      message = `Slow response time: ${duration.toFixed(2)}ms`;
    } else if (duration > 500) {
      status = 'degraded';
      message = `Elevated response time: ${duration.toFixed(2)}ms`;
    }

    const healthCheck: HealthCheck = {
      name: 'response_time',
      status,
      message,
      timestamp: Date.now(),
      duration,
      details: { responseTime: duration }
    };

    this.addHealthCheck(healthCheck);
    return healthCheck;
  }

  /**
   * Проверка здоровья хранилища
   */
  private async checkStorageHealth(): Promise<HealthCheck> {
    try {
      // Проверяем доступность AsyncStorage
      const testKey = '__health_check__';
      const testValue = Date.now().toString();
      
      const startTime = performance.now();
      await localStorage.setItem(testKey, testValue);
      const retrievedValue = localStorage.getItem(testKey);
      await localStorage.removeItem(testKey);
      const duration = performance.now() - startTime;
      
      if (retrievedValue !== testValue) {
        throw new Error('Storage read/write mismatch');
      }

      const healthCheck: HealthCheck = {
        name: 'storage_health',
        status: 'healthy',
        message: 'Storage is working correctly',
        timestamp: Date.now(),
        duration,
        details: { storageType: 'localStorage', testDuration: duration }
      };

      this.addHealthCheck(healthCheck);
      return healthCheck;
    } catch (error) {
      const healthCheck: HealthCheck = {
        name: 'storage_health',
        status: 'unhealthy',
        message: 'Storage is not working correctly',
        timestamp: Date.now(),
        details: { error: error instanceof Error ? error.message : String(error) }
      };

      this.addHealthCheck(healthCheck);
      return healthCheck;
    }
  }

  /**
   * Добавление проверки здоровья
   */
  private addHealthCheck(healthCheck: HealthCheck): void {
    this.healthChecks.push(healthCheck);
    
    // Ограничиваем количество проверок
    if (this.healthChecks.length > this.maxHealthChecks) {
      this.healthChecks = this.healthChecks.slice(-this.maxHealthChecks);
    }

    // Логируем нездоровые состояния
    if (healthCheck.status === 'unhealthy') {
      logError('Unhealthy system detected', healthCheck);
    } else if (healthCheck.status === 'degraded') {
      logWarning('Degraded system performance', healthCheck);
    }
  }

  /**
   * Добавление метрики производительности
   */
  addMetric(name: string, value: number, unit: string, tags?: Record<string, string>): void {
    const metric: PerformanceMetrics = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      tags
    };

    this.performanceMetrics.push(metric);
    
    // Ограничиваем количество метрик
    if (this.performanceMetrics.length > this.maxMetrics) {
      this.performanceMetrics = this.performanceMetrics.slice(-this.maxMetrics);
    }

    logDebug('Performance metric added', { name, value, unit, tags });
  }

  /**
   * Получение общего состояния здоровья
   */
  getOverallHealth(): {
    status: 'healthy' | 'unhealthy' | 'degraded';
    checks: HealthCheck[];
    summary: {
      total: number;
      healthy: number;
      degraded: number;
      unhealthy: number;
    };
  } {
    const recentChecks = this.healthChecks.filter(
      check => Date.now() - check.timestamp < 5 * 60 * 1000 // Последние 5 минут
    );

    const summary = {
      total: recentChecks.length,
      healthy: recentChecks.filter(check => check.status === 'healthy').length,
      degraded: recentChecks.filter(check => check.status === 'degraded').length,
      unhealthy: recentChecks.filter(check => check.status === 'unhealthy').length,
    };

    let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
    if (summary.unhealthy > 0) {
      status = 'unhealthy';
    } else if (summary.degraded > 0) {
      status = 'degraded';
    }

    return {
      status,
      checks: recentChecks,
      summary
    };
  }

  /**
   * Получение метрик производительности
   */
  getMetrics(name?: string, timeWindow?: number): PerformanceMetrics[] {
    let metrics = this.performanceMetrics;
    
    if (name) {
      metrics = metrics.filter(metric => metric.name === name);
    }
    
    if (timeWindow) {
      const cutoff = Date.now() - timeWindow;
      metrics = metrics.filter(metric => metric.timestamp > cutoff);
    }
    
    return [...metrics];
  }

  /**
   * Получение статистики производительности
   */
  getPerformanceStats(name: string, timeWindow?: number): {
    count: number;
    average: number;
    min: number;
    max: number;
    p95: number;
    p99: number;
  } | null {
    const metrics = this.getMetrics(name, timeWindow);
    
    if (metrics.length === 0) {
      return null;
    }

    const values = metrics.map(m => m.value).sort((a, b) => a - b);
    const count = values.length;
    const average = values.reduce((sum, val) => sum + val, 0) / count;
    const min = values[0];
    const max = values[count - 1];
    const p95Index = Math.floor(count * 0.95);
    const p99Index = Math.floor(count * 0.99);
    const p95 = values[p95Index];
    const p99 = values[p99Index];

    return { count, average, min, max, p95, p99 };
  }

  /**
   * Получение информации о системе
   */
  getSystemInfo(): SystemInfo | null {
    if (this.systemInfo) {
      return {
        ...this.systemInfo,
        memoryUsage: this.getMemoryUsage(),
        uptime: Date.now() - this.systemInfo.uptime,
        timestamp: Date.now(),
      };
    }
    return null;
  }

  /**
   * Очистка старых данных
   */
  cleanup(): void {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    // Очищаем старые проверки здоровья
    this.healthChecks = this.healthChecks.filter(check => check.timestamp > oneHourAgo);
    
    // Очищаем старые метрики
    this.performanceMetrics = this.performanceMetrics.filter(metric => metric.timestamp > oneHourAgo);
    
    logInfo('Monitoring cleanup completed', {
      remainingHealthChecks: this.healthChecks.length,
      remainingMetrics: this.performanceMetrics.length
    });
  }

  /**
   * Экспорт данных мониторинга
   */
  exportData(): {
    healthChecks: HealthCheck[];
    metrics: PerformanceMetrics[];
    systemInfo: SystemInfo | null;
    timestamp: number;
  } {
    return {
      healthChecks: [...this.healthChecks],
      metrics: [...this.performanceMetrics],
      systemInfo: this.getSystemInfo(),
      timestamp: Date.now(),
    };
  }
}

// Экспортируем singleton instance
const monitoringService = MonitoringService.getInstance();

// Экспортируем удобные функции
export const addMetric = (name: string, value: number, unit: string, tags?: Record<string, string>) => {
  monitoringService.addMetric(name, value, unit, tags);
};

export const getOverallHealth = () => {
  return monitoringService.getOverallHealth();
};

export const getMetrics = (name?: string, timeWindow?: number) => {
  return monitoringService.getMetrics(name, timeWindow);
};

export const getPerformanceStats = (name: string, timeWindow?: number) => {
  return monitoringService.getPerformanceStats(name, timeWindow);
};

export const getSystemInfo = () => {
  return monitoringService.getSystemInfo();
};

export const cleanupMonitoring = () => {
  monitoringService.cleanup();
};

export const exportMonitoringData = () => {
  return monitoringService.exportData();
};

export { MonitoringService };
export type { HealthCheck, PerformanceMetrics, SystemInfo };