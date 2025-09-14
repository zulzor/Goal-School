// src/utils/cache.ts
// Система кэширования для оптимизации производительности

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logDebug, logWarning } from './logger';

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items in cache
  persist?: boolean; // Whether to persist to AsyncStorage
}

class CacheManager {
  private static instance: CacheManager;
  private memoryCache = new Map<string, CacheItem<unknown>>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes
  private readonly defaultMaxSize = 100;
  private readonly storageKey = '@arsenal_school_cache';

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  /**
   * Получение данных из кэша
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      // Сначала проверяем память
      const memoryItem = this.memoryCache.get(key);
      if (memoryItem && this.isValid(memoryItem)) {
        logDebug(`Cache hit (memory): ${key}`);
        return memoryItem.data as T;
      }

      // Если не в памяти, проверяем AsyncStorage
      if (this.memoryCache.has(key)) {
        this.memoryCache.delete(key);
      }

      const storageItem = await this.getFromStorage<T>(key);
      if (storageItem && this.isValid(storageItem)) {
        // Возвращаем в память
        this.memoryCache.set(key, storageItem);
        logDebug(`Cache hit (storage): ${key}`);
        return storageItem.data;
      }

      logDebug(`Cache miss: ${key}`);
      return null;
    } catch (error) {
      logWarning(`Cache get error for key ${key}:`, { error });
      return null;
    }
  }

  /**
   * Сохранение данных в кэш
   */
  async set<T>(key: string, data: T, options: CacheOptions = {}): Promise<void> {
    try {
      const ttl = options.ttl || this.defaultTTL;
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };

      // Сохраняем в память
      this.memoryCache.set(key, item);

      // Если нужно, сохраняем в AsyncStorage
      if (options.persist) {
        await this.saveToStorage(key, item);
      }

      // Проверяем размер кэша
      if (this.memoryCache.size > (options.maxSize || this.defaultMaxSize)) {
        this.cleanup();
      }

      logDebug(`Cache set: ${key}`, { ttl, persist: options.persist });
    } catch (error) {
      logWarning(`Cache set error for key ${key}:`, { error });
    }
  }

  /**
   * Удаление данных из кэша
   */
  async delete(key: string): Promise<void> {
    try {
      this.memoryCache.delete(key);
      await AsyncStorage.removeItem(`${this.storageKey}_${key}`);
      logDebug(`Cache delete: ${key}`);
    } catch (error) {
      logWarning(`Cache delete error for key ${key}:`, { error });
    }
  }

  /**
   * Очистка всего кэша
   */
  async clear(): Promise<void> {
    try {
      this.memoryCache.clear();
      
      // Очищаем AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.storageKey));
      await AsyncStorage.multiRemove(cacheKeys);
      
      logDebug('Cache cleared');
    } catch (error) {
      logWarning('Cache clear error:', { error });
    }
  }

  /**
   * Проверка валидности элемента кэша
   */
  private isValid(item: CacheItem<unknown>): boolean {
    return Date.now() - item.timestamp < item.ttl;
  }

  /**
   * Очистка устаревших элементов
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.memoryCache.forEach((item, key) => {
      if (!this.isValid(item)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.memoryCache.delete(key);
    });

    logDebug(`Cache cleanup: removed ${keysToDelete.length} expired items`);
  }

  /**
   * Сохранение в AsyncStorage
   */
  private async saveToStorage<T>(key: string, item: CacheItem<T>): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${this.storageKey}_${key}`,
        JSON.stringify(item)
      );
    } catch (error) {
      logWarning(`Failed to save to storage: ${key}`, { error });
    }
  }

  /**
   * Загрузка из AsyncStorage
   */
  private async getFromStorage<T>(key: string): Promise<CacheItem<T> | null> {
    try {
      const item = await AsyncStorage.getItem(`${this.storageKey}_${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      logWarning(`Failed to load from storage: ${key}`, { error });
      return null;
    }
  }

  /**
   * Загрузка всех данных из AsyncStorage при инициализации
   */
  private async loadFromStorage(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(this.storageKey));
      
      for (const key of cacheKeys) {
        const item = await this.getFromStorage(key);
        if (item && this.isValid(item)) {
          const cacheKey = key.replace(`${this.storageKey}_`, '');
          this.memoryCache.set(cacheKey, item);
        }
      }
      
      logDebug(`Loaded ${this.memoryCache.size} items from storage`);
    } catch (error) {
      logWarning('Failed to load cache from storage:', { error });
    }
  }

  /**
   * Получение статистики кэша
   */
  getStats(): {
    memorySize: number;
    memoryItems: number;
    hitRate?: number;
  } {
    return {
      memorySize: this.memoryCache.size,
      memoryItems: this.memoryCache.size,
    };
  }

  /**
   * Создание кэшированной функции
   */
  createCachedFunction<TArgs extends unknown[], TReturn>(
    fn: (...args: TArgs) => Promise<TReturn>,
    keyGenerator: (...args: TArgs) => string,
    options: CacheOptions = {}
  ): (...args: TArgs) => Promise<TReturn> {
    return async (...args: TArgs): Promise<TReturn> => {
      const key = keyGenerator(...args);
      
      // Пытаемся получить из кэша
      const cached = await this.get<TReturn>(key);
      if (cached !== null) {
        return cached;
      }

      // Выполняем функцию и кэшируем результат
      const result = await fn(...args);
      await this.set(key, result, options);
      
      return result;
    };
  }
}

// Экспортируем singleton instance
const cacheManager = CacheManager.getInstance();

// Экспортируем удобные функции
export const getCache = <T>(key: string): Promise<T | null> => {
  return cacheManager.get<T>(key);
};

export const setCache = <T>(key: string, data: T, options?: CacheOptions): Promise<void> => {
  return cacheManager.set(key, data, options);
};

export const deleteCache = (key: string): Promise<void> => {
  return cacheManager.delete(key);
};

export const clearCache = (): Promise<void> => {
  return cacheManager.clear();
};

export const createCachedFunction = <TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  keyGenerator: (...args: TArgs) => string,
  options?: CacheOptions
): (...args: TArgs) => Promise<TReturn> => {
  return cacheManager.createCachedFunction(fn, keyGenerator, options);
};

export { CacheManager };
export type { CacheItem, CacheOptions };