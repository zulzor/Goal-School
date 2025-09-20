// Контекст аутентификации для работы с MySQL
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { MySQLUserService, User } from '../services/MySQLUserService';
import { checkMySQLConnection } from '../config/mysql';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  createTestUser: () => Promise<boolean>;
  isDatabaseAvailable: boolean;
}

const MySQLAuthContext = createContext<AuthContextType | undefined>(undefined);

export const MySQLAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDatabaseAvailable, setIsDatabaseAvailable] = useState(false);

  // Проверяем подключение к базе данных при инициализации
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const isConnected = await checkMySQLConnection();
        setIsDatabaseAvailable(isConnected);
        if (!isConnected) {
          setError('Нет подключения к базе данных');
        }
      } catch (err) {
        console.error('Database connection check failed:', err);
        setIsDatabaseAvailable(false);
        setError('Ошибка проверки подключения к базе данных');
      } finally {
        setIsLoading(false);
      }
    };

    checkDatabase();
  }, []);

  // Проверяем, есть ли сохраненные данные пользователя
  useEffect(() => {
    const storedUser = localStorage.getItem('mysql_user');
    if (storedUser && isDatabaseAvailable) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('mysql_user');
      }
    }
    setIsLoading(false);
  }, [isDatabaseAvailable]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isDatabaseAvailable) {
        throw new Error('Нет подключения к базе данных');
      }

      const authenticatedUser = await MySQLUserService.authenticateUser(email, password);

      if (authenticatedUser) {
        setUser(authenticatedUser);
        localStorage.setItem('mysql_user', JSON.stringify(authenticatedUser));
        return true;
      } else {
        setError('Неверный email или пароль');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ошибка входа в систему');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isDatabaseAvailable) {
        throw new Error('Нет подключения к базе данных');
      }

      // Проверяем, существует ли пользователь с таким email
      const existingUser = await MySQLUserService.getUserByEmail(email);

      if (existingUser) {
        setError('Пользователь с таким email уже существует');
        return false;
      }

      const newUser = await MySQLUserService.createUser({ email, password, name, role });
      setUser(newUser);
      localStorage.setItem('mysql_user', JSON.stringify(newUser));
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      setError('Ошибка регистрации');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mysql_user');
  };

  const createTestUser = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isDatabaseAvailable) {
        throw new Error('Нет подключения к базе данных');
      }

      const testUser = await MySQLUserService.createTestUser();
      setUser(testUser);
      localStorage.setItem('mysql_user', JSON.stringify(testUser));
      return true;
    } catch (err) {
      console.error('Test user creation error:', err);
      setError('Ошибка создания тестового пользователя');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    error,
    createTestUser,
    isDatabaseAvailable,
  };

  return <MySQLAuthContext.Provider value={value}>{children}</MySQLAuthContext.Provider>;
};

export const useMySQLAuth = () => {
  const context = useContext(MySQLAuthContext);
  if (context === undefined) {
    throw new Error('useMySQLAuth must be used within a MySQLAuthProvider');
  }
  return context;
};
