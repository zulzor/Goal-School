// src/context/DatabaseContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { checkMySQLConnection } from '../config/mysql';

type DatabaseType = 'local' | 'mysql';

interface DatabaseContextType {
  databaseType: DatabaseType;
  isMySQLAvailable: boolean;
  setDatabaseType: (type: DatabaseType) => void;
  checkMySQLAvailability: () => Promise<boolean>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // В веб-версии всегда используем local (который будет работать через API)
  const isWeb = typeof window !== 'undefined';
  // Всегда используем 'local' для веб-версии, независимо от доступности MySQL
  const [databaseType, setDatabaseType] = useState<DatabaseType>('local');
  const [isMySQLAvailable, setIsMySQLAvailable] = useState(false);

  // Загружаем тип базы данных из localStorage при инициализации
  useEffect(() => {
    if (isWeb) {
      // В веб-версии всегда используем local/API
      setDatabaseType('local');
      console.log('[Web] Используется API вместо прямого подключения к MySQL');
      return;
    }
    
    const savedDatabaseType = localStorage?.getItem('databaseType') as DatabaseType | null;
    if (savedDatabaseType) {
      setDatabaseType(savedDatabaseType);
    }

    // Проверяем доступность баз данных
    checkMySQLAvailability();
  }, []);

  // Сохраняем тип базы данных в localStorage при изменении
  useEffect(() => {
    if (!isWeb && localStorage) {
      localStorage.setItem('databaseType', databaseType);
    }
  }, [databaseType, isWeb]);

  const checkMySQLAvailability = async (): Promise<boolean> => {
    try {
      // В веб-версии всегда возвращаем false для MySQL
      if (isWeb) {
        setIsMySQLAvailable(false);
        return false;
      }
      
      const isConnected = await checkMySQLConnection();
      setIsMySQLAvailable(isConnected);
      return isConnected;
    } catch (error) {
      console.error('MySQL availability check failed:', error);
      setIsMySQLAvailable(false);
      return false;
    }
  };

  const value = {
    databaseType,
    isMySQLAvailable,
    setDatabaseType,
    checkMySQLAvailability,
  };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};