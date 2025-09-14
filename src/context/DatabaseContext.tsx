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
  const [databaseType, setDatabaseType] = useState<DatabaseType>('local');
  const [isMySQLAvailable, setIsMySQLAvailable] = useState(false);

  // Загружаем тип базы данных из localStorage при инициализации
  useEffect(() => {
    const savedDatabaseType = localStorage.getItem('databaseType') as DatabaseType | null;
    if (savedDatabaseType) {
      setDatabaseType(savedDatabaseType);
    }

    // Проверяем доступность баз данных
    checkMySQLAvailability();
  }, []);

  // Сохраняем тип базы данных в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('databaseType', databaseType);
  }, [databaseType]);

  const checkMySQLAvailability = async (): Promise<boolean> => {
    try {
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
