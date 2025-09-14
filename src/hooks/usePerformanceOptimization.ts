import { useState, useEffect, useCallback, useMemo } from 'react';

// Хук для оптимизации производительности
export const usePerformanceOptimization = () => {
  // Состояние для отслеживания производительности
  const [performanceMetrics, setPerformanceMetrics] = useState({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
  });

  // Функция для измерения времени выполнения
  const measurePerformance = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await fn();
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      setPerformanceMetrics(prev => {
        const newRenderCount = prev.renderCount + 1;
        const newAverage =
          (prev.averageRenderTime * prev.renderCount + renderTime) / newRenderCount;

        return {
          renderCount: newRenderCount,
          lastRenderTime: renderTime,
          averageRenderTime: newAverage,
        };
      });

      return result;
    } catch (error) {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      setPerformanceMetrics(prev => ({
        ...prev,
        lastRenderTime: renderTime,
      }));

      throw error;
    }
  }, []);

  // Функция для создания мемоизированного колбэка с отслеживанием производительности
  const createOptimizedCallback = useCallback(
    <T extends (...args: any[]) => any>(callback: T, deps: React.DependencyList): T => {
      return useCallback((...args: Parameters<T>): ReturnType<T> => {
        const startTime = performance.now();
        const result = callback(...args);
        const endTime = performance.now();

        setPerformanceMetrics(prev => {
          const renderTime = endTime - startTime;
          const newRenderCount = prev.renderCount + 1;
          const newAverage =
            (prev.averageRenderTime * prev.renderCount + renderTime) / newRenderCount;

          return {
            renderCount: newRenderCount,
            lastRenderTime: renderTime,
            averageRenderTime: newAverage,
          };
        });

        return result;
      }, deps) as T;
    },
    []
  );

  // Функция для создания мемоизированного значения с отслеживанием производительности
  const createOptimizedMemo = useCallback(<T>(factory: () => T, deps: React.DependencyList): T => {
    const startTime = performance.now();
    const result = useMemo(factory, deps);
    const endTime = performance.now();

    setPerformanceMetrics(prev => {
      const renderTime = endTime - startTime;
      const newRenderCount = prev.renderCount + 1;
      const newAverage = (prev.averageRenderTime * prev.renderCount + renderTime) / newRenderCount;

      return {
        renderCount: newRenderCount,
        lastRenderTime: renderTime,
        averageRenderTime: newAverage,
      };
    });

    return result;
  }, []);

  return {
    performanceMetrics,
    measurePerformance,
    createOptimizedCallback,
    createOptimizedMemo,
  };
};
