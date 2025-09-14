// src/utils/memoization.ts
// Утилиты для мемоизации и оптимизации React компонентов

import { useMemo, useCallback, useRef, useEffect } from 'react';
import { logDebug } from './logger';

/**
 * Мемоизация функции с кэшированием результатов
 */
export function memoize<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  keyGenerator?: (...args: TArgs) => string
): (...args: TArgs) => TReturn {
  const cache = new Map<string, TReturn>();

  return (...args: TArgs): TReturn => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      logDebug(`Memoization cache hit for key: ${key}`);
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    logDebug(`Memoization cache miss for key: ${key}`);
    
    return result;
  };
}

/**
 * Мемоизация асинхронной функции
 */
export function memoizeAsync<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  keyGenerator?: (...args: TArgs) => string
): (...args: TArgs) => Promise<TReturn> {
  const cache = new Map<string, Promise<TReturn>>();

  return async (...args: TArgs): Promise<TReturn> => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      logDebug(`Async memoization cache hit for key: ${key}`);
      return cache.get(key)!;
    }

    const promise = fn(...args);
    cache.set(key, promise);
    logDebug(`Async memoization cache miss for key: ${key}`);
    
    return promise;
  };
}

/**
 * Хук для мемоизации дорогих вычислений
 */
export function useExpensiveComputation<T>(
  computation: () => T,
  deps: React.DependencyList
): T {
  return useMemo(() => {
    logDebug('Expensive computation executed');
    return computation();
  }, deps);
}

/**
 * Хук для мемоизации функций с зависимостями
 */
export function useStableCallback<TArgs extends unknown[], TReturn>(
  callback: (...args: TArgs) => TReturn,
  deps: React.DependencyList
): (...args: TArgs) => TReturn {
  return useCallback(callback, deps);
}

/**
 * Хук для мемоизации объектов
 */
export function useStableObject<T extends Record<string, unknown>>(
  obj: T,
  deps: React.DependencyList
): T {
  return useMemo(() => obj, deps);
}

/**
 * Хук для мемоизации массивов
 */
export function useStableArray<T>(
  array: T[],
  deps: React.DependencyList
): T[] {
  return useMemo(() => array, deps);
}

/**
 * Хук для дебаунса значений
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Хук для троттлинга функций
 */
export function useThrottle<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number
): (...args: TArgs) => void {
  const lastCallTime = useRef(0);

  return useCallback((...args: TArgs) => {
    const now = Date.now();
    if (now - lastCallTime.current >= delay) {
      lastCallTime.current = now;
      callback(...args);
    }
  }, [callback, delay]);
}

/**
 * Хук для дебаунса функций
 */
export function useDebounceCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay: number
): (...args: TArgs) => void {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: TArgs) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

/**
 * Хук для мемоизации с глубоким сравнением
 */
export function useDeepMemo<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  const ref = useRef<{ deps: React.DependencyList; value: T }>();

  if (!ref.current || !deepEqual(ref.current.deps, deps)) {
    ref.current = {
      deps,
      value: factory(),
    };
  }

  return ref.current.value;
}

/**
 * Глубокое сравнение объектов
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (typeof a === 'object') {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((item, index) => deepEqual(item, b[index]));
    }

    if (Array.isArray(a) || Array.isArray(b)) return false;

    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);

    if (keysA.length !== keysB.length) return false;

    return keysA.every(key => 
      keysB.includes(key) && 
      deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
    );
  }

  return false;
}

/**
 * Хук для мемоизации с кэшированием по ключу
 */
export function useKeyedMemo<T>(
  key: string,
  factory: () => T,
  deps: React.DependencyList
): T {
  const cacheRef = useRef<Map<string, T>>(new Map());

  return useMemo(() => {
    if (!cacheRef.current.has(key)) {
      cacheRef.current.set(key, factory());
    }
    return cacheRef.current.get(key)!;
  }, [key, ...deps]);
}

/**
 * Хук для мемоизации с TTL (время жизни)
 */
export function useTTLMemo<T>(
  factory: () => T,
  ttl: number,
  deps: React.DependencyList
): T {
  const cacheRef = useRef<{ value: T; timestamp: number }>();

  return useMemo(() => {
    const now = Date.now();
    
    if (!cacheRef.current || now - cacheRef.current.timestamp > ttl) {
      cacheRef.current = {
        value: factory(),
        timestamp: now,
      };
    }

    return cacheRef.current.value;
  }, deps);
}

/**
 * Хук для мемоизации с размером кэша
 */
export function useBoundedMemo<T>(
  factory: () => T,
  maxSize: number,
  deps: React.DependencyList
): T {
  const cacheRef = useRef<Map<string, T>>(new Map());
  const keyRef = useRef(0);

  return useMemo(() => {
    const key = keyRef.current.toString();
    
    if (cacheRef.current.size >= maxSize) {
      const firstKey = cacheRef.current.keys().next().value;
      cacheRef.current.delete(firstKey);
    }

    if (!cacheRef.current.has(key)) {
      cacheRef.current.set(key, factory());
    }

    keyRef.current = (keyRef.current + 1) % maxSize;
    return cacheRef.current.get(key)!;
  }, deps);
}

// Экспортируем все утилиты
export {
  memoize,
  memoizeAsync,
  useExpensiveComputation,
  useStableCallback,
  useStableObject,
  useStableArray,
  useDebounce,
  useThrottle,
  useDebounceCallback,
  useDeepMemo,
  useKeyedMemo,
  useTTLMemo,
  useBoundedMemo,
};