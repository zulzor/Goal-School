import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { checkNetworkState, saveNetworkState, getSavedNetworkState } from '../utils/networkUtils';

// Для веб-версии используем полифил
let NetInfoWeb: any;
if (Platform.OS === 'web') {
  import('../utils/netinfo.web')
    .then(module => {
      NetInfoWeb = module.default;
      // @ts-ignore
      NetInfo.fetch = NetInfoWeb.fetch.bind(NetInfoWeb);
      // @ts-ignore
      NetInfo.addEventListener = NetInfoWeb.addEventListener.bind(NetInfoWeb);
    })
    .catch(error => {
      console.error('Ошибка загрузки netinfo.web:', error);
    });
}

// Типы для контекста
interface NetworkContextType {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  networkType: string | null;
  isChecking: boolean;
  lastChecked: Date | null;
  checkConnection: () => Promise<void>;
}

// Создаем контекст
const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

// Хук для использования контекста
export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork должен использоваться внутри NetworkProvider');
  }
  return context;
};

// Типы для провайдера
interface NetworkProviderProps {
  children: React.ReactNode;
}

// Провайдер контекста
export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);
  const [networkType, setNetworkType] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Функция для проверки соединения
  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const state = await checkNetworkState();

      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
      setNetworkType(state.type);
      setLastChecked(new Date());

      // Сохраняем состояние сети
      await saveNetworkState(state);
    } catch (error) {
      console.error('Ошибка проверки соединения:', error);
    } finally {
      setIsChecking(false);
    }
  };

  // Инициализация при запуске
  useEffect(() => {
    const initializeNetworkState = async () => {
      // Сначала загружаем сохраненное состояние
      const savedState = await getSavedNetworkState();
      if (savedState) {
        setIsConnected(savedState.isConnected);
        setIsInternetReachable(savedState.isInternetReachable);
        setNetworkType(savedState.type);
      }

      // Затем проверяем текущее состояние
      await checkConnection();
    };

    initializeNetworkState();
  }, []);

  // Подписка на изменения состояния сети
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (Platform.OS === 'web' && NetInfoWeb) {
      // Для веб-версии используем наш полифил
      unsubscribe = NetInfoWeb.addEventListener((state: any) => {
        setIsConnected(state.isConnected || false);
        setIsInternetReachable(state.isInternetReachable);
        setNetworkType(state.type);
        setLastChecked(new Date());

        // Сохраняем состояние сети
        saveNetworkState({
          isConnected: state.isConnected || false,
          isInternetReachable: state.isInternetReachable,
          type: state.type,
        }).catch(error => {
          console.error('Ошибка сохранения состояния сети:', error);
        });
      });
    } else {
      // Для мобильных платформ используем оригинальный NetInfo
      const subscription = NetInfo.addEventListener(state => {
        setIsConnected(state.isConnected || false);
        setIsInternetReachable(state.isInternetReachable);
        setNetworkType(state.type);
        setLastChecked(new Date());

        // Сохраняем состояние сети
        saveNetworkState({
          isConnected: state.isConnected || false,
          isInternetReachable: state.isInternetReachable,
          type: state.type,
        }).catch(error => {
          console.error('Ошибка сохранения состояния сети:', error);
        });
      });

      // Обрабатываем Promise, возвращаемый addEventListener
      if (subscription && typeof subscription.then === 'function') {
        subscription.then(unsub => {
          unsubscribe = unsub;
        });
      } else {
        unsubscribe = subscription as (() => void) | undefined;
      }
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Периодическая проверка соединения
  useEffect(() => {
    const interval = setInterval(() => {
      checkConnection();
    }, 30000); // Проверяем каждые 30 секунд

    return () => clearInterval(interval);
  }, []);

  const value: NetworkContextType = {
    isConnected,
    isInternetReachable,
    networkType,
    isChecking,
    lastChecked,
    checkConnection,
  };

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
};
