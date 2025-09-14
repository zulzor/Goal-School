// src/utils/performance.ts
// Утилиты для оптимизации производительности

import { logDebug, logWarning } from './logger';

export interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
  memoryUsage?: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private timers = new Map<string, number>();
  private maxMetrics = 1000;

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Начать измерение производительности
   */
  startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }

  /**
   * Завершить измерение производительности
   */
  endTimer(name: string): PerformanceMetrics | null {
    const startTime = this.timers.get(name);
    if (!startTime) {
      logWarning(`Timer ${name} was not started`);
      return null;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(name);

    const metric: PerformanceMetrics = {
      name,
      duration,
      timestamp: Date.now(),
      memoryUsage: this.getMemoryUsage(),
    };

    this.addMetric(metric);
    return metric;
  }

  /**
   * Измерение производительности функции
   */
  async measureFunction<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<{ result: T; metrics: PerformanceMetrics }> {
    this.startTimer(name);
    try {
      const result = await fn();
      const metrics = this.endTimer(name);
      return { result, metrics: metrics! };
    } catch (error) {
      this.endTimer(name);
      throw error;
    }
  }

  /**
   * Синхронное измерение производительности функции
   */
  measureSyncFunction<T>(
    name: string,
    fn: () => T
  ): { result: T; metrics: PerformanceMetrics } {
    this.startTimer(name);
    try {
      const result = fn();
      const metrics = this.endTimer(name);
      return { result, metrics: metrics! };
    } catch (error) {
      this.endTimer(name);
      throw error;
    }
  }

  /**
   * Получение метрик производительности
   */
  getMetrics(name?: string): PerformanceMetrics[] {
    if (name) {
      return this.metrics.filter(m => m.name === name);
    }
    return [...this.metrics];
  }

  /**
   * Получение средней производительности
   */
  getAverageMetrics(name: string): { average: number; count: number; min: number; max: number } {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) {
      return { average: 0, count: 0, min: 0, max: 0 };
    }

    const durations = metrics.map(m => m.duration);
    const average = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const min = Math.min(...durations);
    const max = Math.max(...durations);

    return { average, count: metrics.length, min, max };
  }

  /**
   * Очистка метрик
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Добавление метрики
   */
  private addMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // Ограничиваем количество метрик
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Логируем медленные операции
    if (metric.duration > 1000) { // Более 1 секунды
      logWarning(`Slow operation detected: ${metric.name} took ${metric.duration}ms`);
    }
  }

  /**
   * Получение использования памяти (если доступно)
   */
  private getMemoryUsage(): number | undefined {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return undefined;
  }
}

// Экспортируем singleton instance
const performanceMonitor = PerformanceMonitor.getInstance();

// Экспортируем удобные функции
export const startTimer = (name: string): void => {
  performanceMonitor.startTimer(name);
};

export const endTimer = (name: string): PerformanceMetrics | null => {
  return performanceMonitor.endTimer(name);
};

export const measureFunction = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<{ result: T; metrics: PerformanceMetrics }> => {
  return performanceMonitor.measureFunction(name, fn);
};

export const measureSyncFunction = <T>(
  name: string,
  fn: () => T
): { result: T; metrics: PerformanceMetrics } => {
  return performanceMonitor.measureSyncFunction(name, fn);
};

export const getMetrics = (name?: string): PerformanceMetrics[] => {
  return performanceMonitor.getMetrics(name);
};

export const getAverageMetrics = (name: string): { average: number; count: number; min: number; max: number } => {
  return performanceMonitor.getAverageMetrics(name);
};

export const clearMetrics = (): void => {
  performanceMonitor.clearMetrics();
};

// Декоратор для измерения производительности методов
export function measurePerformance(name?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const timerName = name || `${target.constructor.name}.${propertyName}`;

    descriptor.value = async function (...args: any[]) {
      const { result, metrics } = await measureFunction(timerName, () => method.apply(this, args));
      logDebug(`Performance: ${timerName} took ${metrics.duration}ms`);
      return result;
    };
  };
}

// Хук для измерения производительности React компонентов
export const usePerformanceMeasurement = (componentName: string) => {
  const startRender = () => {
    startTimer(`${componentName}_render`);
  };

  const endRender = () => {
    const metrics = endTimer(`${componentName}_render`);
    if (metrics && metrics.duration > 16) { // Более одного кадра (60fps)
      logWarning(`Slow render detected: ${componentName} took ${metrics.duration}ms`);
    }
  };

  return { startRender, endRender };
};

export { PerformanceMonitor };
export type { PerformanceMetrics };