import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { securityValidator } from '../utils/securityValidator';
import { securityLogger } from '../utils/securityLogger';
import { encryptionUtils } from '../utils/encryptionUtils';
import { UserRole } from '../types';

// Интерфейс для записи аудита
interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  details?: Record<string, any>;
}

// Интерфейс для настроек безопасности пользователя
interface UserSecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: Date;
  failedLoginAttempts: number;
  lastFailedLogin: Date | null;
  trustedDevices: string[];
  securityQuestions: Array<{
    question: string;
    answerHash: string;
  }>;
}

interface EnhancedSecurityContextType {
  // Базовые функции безопасности
  validateInput: (
    input: string,
    type: 'email' | 'password' | 'username' | 'text'
  ) => { isValid: boolean; errors: string[] };
  sanitizeInput: (input: string) => string;

  // Функции аутентификации
  incrementFailedLoginAttempts: (userId: string) => void;
  resetFailedLoginAttempts: (userId: string) => void;
  checkAccountLockout: (userId: string) => { isLocked: boolean; remainingTime?: number };

  // Функции шифрования
  encryptSensitiveData: (data: string) => string;
  decryptSensitiveData: (encryptedData: string) => string;

  // Функции ролевой безопасности
  checkPermission: (userRole: UserRole, requiredRole: UserRole) => boolean;
  checkRoleHierarchy: (userRole: UserRole, requiredRoles: UserRole[]) => boolean;

  // Функции аудита
  logAuditEvent: (
    userId: string,
    action: string,
    resource: string,
    success: boolean,
    details?: Record<string, any>
  ) => void;
  getAuditLogs: (userId: string, limit?: number) => AuditLog[];

  // Функции безопасности сессии
  generateCSRFToken: () => string;
  validateCSRFToken: (token: string) => boolean;

  // Функции мониторинга безопасности
  detectSuspiciousActivity: (
    userId: string,
    activity: string,
    details?: Record<string, any>
  ) => boolean;

  // Настройки безопасности пользователя
  getUserSecuritySettings: (userId: string) => UserSecuritySettings | null;
  updateUserSecuritySettings: (userId: string, settings: Partial<UserSecuritySettings>) => void;
}

const EnhancedSecurityContext = createContext<EnhancedSecurityContextType | undefined>(undefined);

interface EnhancedSecurityProviderProps {
  children: React.ReactNode;
}

export const EnhancedSecurityProvider: React.FC<EnhancedSecurityProviderProps> = ({ children }) => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [userSecuritySettings, setUserSecuritySettings] = useState<
    Record<string, UserSecuritySettings>
  >({});
  const [csrfTokens, setCsrfTokens] = useState<string[]>([]);

  // Валидация входных данных
  const validateInput = useCallback(
    (input: string, type: 'email' | 'password' | 'username' | 'text') => {
      const errors: string[] = [];

      // Проверка на XSS и SQL-инъекции
      if (securityValidator.containsXSS(input)) {
        errors.push('Обнаружена потенциальная XSS-атака');
        securityLogger.logSuspiciousActivity('XSS_ATTEMPT', 'Попытка XSS-атаки', { input });
      }

      if (securityValidator.containsSQLInjection(input)) {
        errors.push('Обнаружена потенциальная SQL-инъекция');
        securityLogger.logSuspiciousActivity('SQL_INJECTION_ATTEMPT', 'Попытка SQL-инъекции', {
          input,
        });
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
    },
    []
  );

  // Очистка входных данных
  const sanitizeInput = useCallback((input: string): string => {
    return securityValidator.sanitizeString(input);
  }, []);

  // Увеличение счетчика неудачных попыток входа
  const incrementFailedLoginAttempts = useCallback((userId: string) => {
    setUserSecuritySettings(prev => {
      const currentUserSettings = prev[userId] || {
        twoFactorEnabled: false,
        lastPasswordChange: new Date(),
        failedLoginAttempts: 0,
        lastFailedLogin: null,
        trustedDevices: [],
        securityQuestions: [],
      };

      return {
        ...prev,
        [userId]: {
          ...currentUserSettings,
          failedLoginAttempts: currentUserSettings.failedLoginAttempts + 1,
          lastFailedLogin: new Date(),
        },
      };
    });
  }, []);

  // Сброс счетчика неудачных попыток входа
  const resetFailedLoginAttempts = useCallback((userId: string) => {
    setUserSecuritySettings(prev => {
      const currentUserSettings = prev[userId];
      if (!currentUserSettings) return prev;

      return {
        ...prev,
        [userId]: {
          ...currentUserSettings,
          failedLoginAttempts: 0,
          lastFailedLogin: null,
        },
      };
    });
  }, []);

  // Проверка блокировки аккаунта
  const checkAccountLockout = useCallback(
    (userId: string) => {
      const userSettings = userSecuritySettings[userId];
      if (!userSettings) return { isLocked: false };

      // Блокировка после 5 неудачных попыток в течение 15 минут
      if (userSettings.failedLoginAttempts >= 5 && userSettings.lastFailedLogin) {
        const timeSinceLastFailed = Date.now() - userSettings.lastFailedLogin.getTime();
        const lockoutDuration = 15 * 60 * 1000; // 15 минут

        if (timeSinceLastFailed < lockoutDuration) {
          const remainingTime = Math.ceil((lockoutDuration - timeSinceLastFailed) / 60000);
          return { isLocked: true, remainingTime };
        } else {
          // Сброс блокировки если прошло больше времени
          resetFailedLoginAttempts(userId);
          return { isLocked: false };
        }
      }

      return { isLocked: false };
    },
    [userSecuritySettings, resetFailedLoginAttempts]
  );

  // Шифрование чувствительных данных
  const encryptSensitiveData = useCallback((data: string): string => {
    const encryptionKey = process.env.EXPO_PUBLIC_ENCRYPTION_KEY || 'default_key';
    return encryptionUtils.encryptData(data, encryptionKey);
  }, []);

  // Дешифрование данных
  const decryptSensitiveData = useCallback((encryptedData: string): string => {
    const encryptionKey = process.env.EXPO_PUBLIC_ENCRYPTION_KEY || 'default_key';
    return encryptionUtils.decryptData(encryptedData, encryptionKey);
  }, []);

  // Проверка прав доступа
  const checkPermission = useCallback((userRole: UserRole, requiredRole: UserRole): boolean => {
    // Иерархия ролей: CHILD < PARENT < COACH < MANAGER < SMM_MANAGER
    const roleHierarchy: Record<UserRole, number> = {
      [UserRole.CHILD]: 1,
      [UserRole.PARENT]: 2,
      [UserRole.COACH]: 3,
      [UserRole.MANAGER]: 4,
      [UserRole.SMM_MANAGER]: 5,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }, []);

  // Проверка иерархии ролей
  const checkRoleHierarchy = useCallback(
    (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
      return requiredRoles.some(role => checkPermission(userRole, role));
    },
    [checkPermission]
  );

  // Логирование событий аудита
  const logAuditEvent = useCallback(
    (
      userId: string,
      action: string,
      resource: string,
      success: boolean,
      details?: Record<string, any>
    ) => {
      const newLog: AuditLog = {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        action,
        resource,
        timestamp: new Date(),
        success,
        details,
      };

      setAuditLogs(prev => [newLog, ...prev].slice(0, 1000)); // Храним только последние 1000 записей

      // Логируем в систему безопасности
      securityLogger.logEvent(
        success ? 'INFO' : 'WARN',
        'AUDIT_EVENT',
        `${action} на ${resource}`,
        {
          userId,
          success,
          ...details,
        }
      );
    },
    []
  );

  // Получение логов аудита
  const getAuditLogs = useCallback(
    (userId: string, limit: number = 50): AuditLog[] => {
      return auditLogs.filter(log => log.userId === userId).slice(0, limit);
    },
    [auditLogs]
  );

  // Генерация CSRF токена
  const generateCSRFToken = useCallback((): string => {
    const token = encryptionUtils.generateCSRFToken();
    setCsrfTokens(prev => [...prev, token].slice(-10)); // Храним только последние 10 токенов
    return token;
  }, []);

  // Валидация CSRF токена
  const validateCSRFToken = useCallback(
    (token: string): boolean => {
      const isValid = csrfTokens.includes(token);
      if (isValid) {
        // Удаляем использованный токен
        setCsrfTokens(prev => prev.filter(t => t !== token));
      }
      return isValid;
    },
    [csrfTokens]
  );

  // Обнаружение подозрительной активности
  const detectSuspiciousActivity = useCallback(
    (userId: string, activity: string, details?: Record<string, any>): boolean => {
      // Простая реализация детектора подозрительной активности
      // В реальном приложении здесь будет более сложная логика

      const suspiciousPatterns = [
        'DROP TABLE',
        'DELETE FROM',
        'UNION SELECT',
        'javascript:',
        'onerror=',
        'onload=',
      ];

      const activityString = JSON.stringify({ activity, ...details }).toUpperCase();

      const isSuspicious = suspiciousPatterns.some(pattern => activityString.includes(pattern));

      if (isSuspicious) {
        securityLogger.logSuspiciousActivity(
          'SUSPICIOUS_ACTIVITY_DETECTED',
          `Подозрительная активность пользователя ${userId}`,
          { activity, ...details }
        );
      }

      return isSuspicious;
    },
    []
  );

  // Получение настроек безопасности пользователя
  const getUserSecuritySettings = useCallback(
    (userId: string): UserSecuritySettings | null => {
      return userSecuritySettings[userId] || null;
    },
    [userSecuritySettings]
  );

  // Обновление настроек безопасности пользователя
  const updateUserSecuritySettings = useCallback(
    (userId: string, settings: Partial<UserSecuritySettings>) => {
      setUserSecuritySettings(prev => ({
        ...prev,
        [userId]: {
          ...(prev[userId] || {
            twoFactorEnabled: false,
            lastPasswordChange: new Date(),
            failedLoginAttempts: 0,
            lastFailedLogin: null,
            trustedDevices: [],
            securityQuestions: [],
          }),
          ...settings,
        },
      }));
    },
    []
  );

  return (
    <EnhancedSecurityContext.Provider
      value={{
        validateInput,
        sanitizeInput,
        incrementFailedLoginAttempts,
        resetFailedLoginAttempts,
        checkAccountLockout,
        encryptSensitiveData,
        decryptSensitiveData,
        checkPermission,
        checkRoleHierarchy,
        logAuditEvent,
        getAuditLogs,
        generateCSRFToken,
        validateCSRFToken,
        detectSuspiciousActivity,
        getUserSecuritySettings,
        updateUserSecuritySettings,
      }}>
      {children}
    </EnhancedSecurityContext.Provider>
  );
};

export const useEnhancedSecurity = () => {
  const context = useContext(EnhancedSecurityContext);
  if (context === undefined) {
    throw new Error('useEnhancedSecurity must be used within an EnhancedSecurityProvider');
  }
  return context;
};
