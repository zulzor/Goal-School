import React, { createContext, useContext, useState, useEffect } from 'react';
import { securityValidator } from '../utils/securityValidator';

interface SecurityContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  loginAttempts: number;
  maxLoginAttempts: number;
  isLockedOut: boolean;
  lockoutEndTime: number | null;
  validateInput: (
    input: string,
    type: 'email' | 'password' | 'username' | 'text'
  ) => { isValid: boolean; errors: string[] };
  incrementLoginAttempts: () => void;
  resetLoginAttempts: () => void;
  checkLockoutStatus: () => boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null);

  const maxLoginAttempts = 5;
  const lockoutDuration = 15 * 60 * 1000; // 15 минут

  // Проверка статуса блокировки
  const checkLockoutStatus = (): boolean => {
    if (lockoutEndTime && Date.now() < lockoutEndTime) {
      return true;
    }

    if (lockoutEndTime && Date.now() >= lockoutEndTime) {
      // Сброс блокировки
      setLockoutEndTime(null);
      setLoginAttempts(0);
      return false;
    }

    return false;
  };

  // Увеличение счетчика попыток входа
  const incrementLoginAttempts = () => {
    setLoginAttempts(prev => {
      const newAttempts = prev + 1;

      if (newAttempts >= maxLoginAttempts) {
        // Блокировка на 15 минут
        setLockoutEndTime(Date.now() + lockoutDuration);
      }

      return newAttempts;
    });
  };

  // Сброс счетчика попыток входа
  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    setLockoutEndTime(null);
  };

  // Валидация входных данных
  const validateInput = (input: string, type: 'email' | 'password' | 'username' | 'text') => {
    const errors: string[] = [];

    // Проверка на XSS и SQL-инъекции
    if (securityValidator.containsXSS(input)) {
      errors.push('Обнаружена потенциальная XSS-атака');
    }

    if (securityValidator.containsSQLInjection(input)) {
      errors.push('Обнаружена потенциальная SQL-инъекция');
    }

    // Типовая валидация
    switch (type) {
      case 'email':
        if (!securityValidator.validateEmail(input)) {
          errors.push('Некорректный формат email');
        }
        break;
      case 'password':
        const passwordValidation = securityValidator.validatePassword(input);
        if (!passwordValidation.isValid) {
          errors.push(...passwordValidation.errors);
        }
        break;
      case 'username':
        if (!securityValidator.validateUsername(input)) {
          errors.push('Некорректное имя пользователя');
        }
        break;
      case 'text':
        // Для текстовых полей просто очищаем от опасных символов
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  // Проверка аутентификации при запуске
  useEffect(() => {
    // Вместо Supabase используем заглушку
    const checkAuth = async () => {
      // Здесь должна быть проверка аутентификации через локальное хранилище
      // Пока используем заглушку
      console.log('Проверка аутентификации через локальное хранилище (заглушка)');
      setIsAuthenticated(false);
      setUserRole(null);
    };

    checkAuth();
  }, []);

  return (
    <SecurityContext.Provider
      value={{
        isAuthenticated,
        userRole,
        loginAttempts,
        maxLoginAttempts,
        isLockedOut: checkLockoutStatus(),
        lockoutEndTime,
        validateInput,
        incrementLoginAttempts,
        resetLoginAttempts,
        checkLockoutStatus,
      }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
