import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Типы для состояния сети
export interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
}

// Типы для кэшированных данных
export interface CachedData {
  timestamp: number;
  data: any;
  endpoint: string;
}

// Ключи для AsyncStorage
const CACHE_PREFIX = 'offline_cache_';
const NETWORK_STATE_KEY = 'network_state';

/**
 * Проверяет текущее состояние сети
 */
export const checkNetworkState = async (): Promise<NetworkState> => {
  try {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected || false,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
    };
  } catch (error) {
    console.error('Ошибка проверки состояния сети:', error);
    // В случае ошибки возвращаем значения по умолчанию
    return {
      isConnected: false,
      isInternetReachable: false,
      type: null,
    };
  }
};

/**
 * Подписывается на изменения состояния сети
 */
export const subscribeToNetworkChanges = (callback: (state: NetworkState) => void) => {
  return NetInfo.addEventListener(state => {
    callback({
      isConnected: state.isConnected || false,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
    });
  });
};

/**
 * Сохраняет данные в кэш для offline-использования
 */
export const cacheData = async (endpoint: string, data: any): Promise<void> => {
  try {
    const cachedData: CachedData = {
      timestamp: Date.now(),
      data,
      endpoint,
    };

    await AsyncStorage.setItem(`${CACHE_PREFIX}${endpoint}`, JSON.stringify(cachedData));
  } catch (error) {
    console.error('Ошибка кэширования данных:', error);
  }
};

/**
 * Получает данные из кэша
 */
export const getCachedData = async <T>(
  endpoint: string,
  maxAgeMinutes: number = 60
): Promise<T | null> => {
  try {
    const cachedDataStr = await AsyncStorage.getItem(`${CACHE_PREFIX}${endpoint}`);
    if (!cachedDataStr) return null;

    const cachedData: CachedData = JSON.parse(cachedDataStr);
    const ageInMinutes = (Date.now() - cachedData.timestamp) / (1000 * 60);

    // Проверяем, не устарели ли данные
    if (ageInMinutes > maxAgeMinutes) {
      // Удаляем устаревшие данные
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${endpoint}`);
      return null;
    }

    return cachedData.data as T;
  } catch (error) {
    console.error('Ошибка получения кэшированных данных:', error);
    return null;
  }
};

/**
 * Очищает кэш для конкретного endpoint
 */
export const clearCacheForEndpoint = async (endpoint: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`${CACHE_PREFIX}${endpoint}`);
  } catch (error) {
    console.error('Ошибка очистки кэша:', error);
  }
};

/**
 * Очищает весь кэш offline-данных
 */
export const clearAllCache = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (error) {
    console.error('Ошибка очистки всего кэша:', error);
  }
};

/**
 * Сохраняет состояние сети
 */
export const saveNetworkState = async (state: NetworkState): Promise<void> => {
  try {
    await AsyncStorage.setItem(NETWORK_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Ошибка сохранения состояния сети:', error);
  }
};

/**
 * Получает сохраненное состояние сети
 */
export const getSavedNetworkState = async (): Promise<NetworkState | null> => {
  try {
    const stateStr = await AsyncStorage.getItem(NETWORK_STATE_KEY);
    return stateStr ? JSON.parse(stateStr) : null;
  } catch (error) {
    console.error('Ошибка получения сохраненного состояния сети:', error);
    return null;
  }
};

/**
 * Проверяет, доступен ли интернет
 */
export const isOnline = async (): Promise<boolean> => {
  const networkState = await checkNetworkState();
  return networkState.isConnected && networkState.isInternetReachable === true;
};

/**
 * Выполняет сетевой запрос с fallback на кэш
 */
export const fetchWithOfflineFallback = async <T>(
  endpoint: string,
  fetchFunction: () => Promise<T>,
  maxCacheAgeMinutes: number = 60
): Promise<{ data: T | null; isFromCache: boolean; error: any }> => {
  try {
    // Сначала пробуем выполнить сетевой запрос
    const data = await fetchFunction();

    // Если запрос успешен, кэшируем данные
    await cacheData(endpoint, data);

    return {
      data,
      isFromCache: false,
      error: null,
    };
  } catch (error) {
    console.error(`Ошибка сетевого запроса к ${endpoint}:`, error);

    // Если сетевой запрос не удался, пробуем получить данные из кэша
    const cachedData = await getCachedData<T>(endpoint, maxCacheAgeMinutes);

    if (cachedData) {
      console.log(`Использованы кэшированные данные для ${endpoint}`);
      return {
        data: cachedData,
        isFromCache: true,
        error: null,
      };
    }

    // Если и кэш пуст, возвращаем ошибку
    return {
      data: null,
      isFromCache: false,
      error,
    };
  }
};

export default {
  checkNetworkState,
  subscribeToNetworkChanges,
  cacheData,
  getCachedData,
  clearCacheForEndpoint,
  clearAllCache,
  saveNetworkState,
  getSavedNetworkState,
  isOnline,
  fetchWithOfflineFallback,
};
