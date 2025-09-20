import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { EnhancedSecurityProvider, useEnhancedSecurity } from '../EnhancedSecurityContext';
import { UserRole } from '../../types';

// Мокаем внешние зависимости
jest.mock('../../utils/securityValidator', () => ({
  securityValidator: {
    containsXSS: jest.fn().mockReturnValue(false),
    containsSQLInjection: jest.fn().mockReturnValue(false),
    validateEmail: jest.fn().mockReturnValue(true),
    validatePassword: jest.fn().mockReturnValue({ isValid: true, errors: [] }),
    validateUsername: jest.fn().mockReturnValue(true),
    sanitizeString: jest.fn().mockImplementation(input => input),
  },
}));

jest.mock('../../utils/securityLogger', () => ({
  securityLogger: {
    logSuspiciousActivity: jest.fn(),
    logEvent: jest.fn(),
  },
}));

jest.mock('../../utils/encryptionUtils', () => ({
  encryptionUtils: {
    generateCSRFToken: jest.fn().mockReturnValue('mock-csrf-token'),
    hashPassword: jest.fn().mockImplementation(password => `hashed-${password}`),
    encryptData: jest.fn().mockImplementation(data => `encrypted-${data}`),
    decryptData: jest.fn().mockImplementation(data => data.replace('encrypted-', '')),
  },
}));

// Компонент-обертка для тестирования
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <EnhancedSecurityProvider>{children}</EnhancedSecurityProvider>
);

describe('EnhancedSecurityContext', () => {
  it('должен предоставлять значения по умолчанию', () => {
    const { result } = renderHook(() => useEnhancedSecurity(), { wrapper });

    expect(result.current).toBeDefined();
  });

  describe('validateInput', () => {
    it('должен правильно валидировать email', () => {
      const { result } = renderHook(() => useEnhancedSecurity(), { wrapper });

      const validation = result.current.validateInput('test@example.com', 'email');

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('должен обнаруживать XSS атаки', () => {
      const { result } = renderHook(() => useEnhancedSecurity(), { wrapper });

      // Мокаем обнаружение XSS
      const securityValidator = require('../../utils/securityValidator').securityValidator;
      securityValidator.containsXSS.mockReturnValueOnce(true);

      const validation = result.current.validateInput('<script>alert("xss")</script>', 'text');

      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Обнаружена потенциальная XSS-атака');
    });
  });

  describe('sanitizeInput', () => {
    it('должен очищать входные строки', () => {
      const { result } = renderHook(() => useEnhancedSecurity(), { wrapper });

      const sanitized = result.current.sanitizeInput('<script>alert("xss")</script>Hello World');

      expect(sanitized).toBe('<script>alert("xss")</script>Hello World');
    });
  });

  describe('функциональность блокировки аккаунта', () => {
    it('должен увеличивать счетчик неудачных попыток входа', () => {
      const { result } = renderHook(() => useEnhancedSecurity(), { wrapper });

      act(() => {
        result.current.incrementFailedLoginAttempts('user123');
      });

      // Проверяем статус блокировки
      const lockoutStatus = result.current.checkAccountLockout('user123');
      expect(lockoutStatus.isLocked).toBe(false);
    });

    it('должен сбрасывать счетчик неудачных попыток входа', () => {
      const { result } = renderHook(() => useEnhancedSecurity(), { wrapper });

      act(() => {
        result.current.incrementFailedLoginAttempts('user123');
        result.current.resetFailedLoginAttempts('user123');
      });

      const lockoutStatus = result.current.checkAccountLockout('user123');
      expect(lockoutStatus.isLocked).toBe(false);
    });
  });

  describe('функции шифрования', () => {
    it('должен шифровать чувствительные данные', () => {
      const { result } = renderHook(() => useEnhancedSecurity(), { wrapper });

      const encrypted = result.current.encryptSensitiveData('секретные данные');

      expect(encrypted).toBe('encrypted-секретные данные');
    });

    it('должен дешифровать чувствительные данные', () => {
      const { result } = renderHook(() => useEnhancedSecurity(), { wrapper });

      const decrypted = result.current.decryptSensitiveData('encrypted-секретные данные');

      expect(decrypted).toBe('секретные данные');
    });
  });

  describe('ролевая безопасность', () => {
    it('должен правильно проверять права доступа', () => {
      const { result } = renderHook(() => useEnhancedSecurity(), { wrapper });

      // Менеджер должен иметь права для действий тренера
      expect(result.current.checkPermission(UserRole.MANAGER, UserRole.COACH)).toBe(true);

      // Тренер не должен иметь права для действий менеджера
      expect(result.current.checkPermission(UserRole.COACH, UserRole.MANAGER)).toBe(false);
    });

    it('должен проверять иерархию ролей', () => {
      const { result } = renderHook(() => useEnhancedSecurity(), { wrapper });

      // Менеджер должен иметь доступ ко всем ролям
      expect(
        result.current.checkRoleHierarchy(UserRole.MANAGER, [UserRole.COACH, UserRole.PARENT])
      ).toBe(true);

      // Родитель не должен иметь доступ к действиям менеджера
      expect(result.current.checkRoleHierarchy(UserRole.PARENT, [UserRole.MANAGER])).toBe(false);
    });
  });

  describe('CSRF защита', () => {
    it('должен генерировать и валидировать CSRF токены', () => {
      const { result } = renderHook(() => useEnhancedSecurity(), { wrapper });

      const token = result.current.generateCSRFToken();
      const isValid = result.current.validateCSRFToken(token);

      expect(token).toBe('mock-csrf-token');
      expect(isValid).toBe(true);
    });
  });

  describe('аудит логов', () => {
    it('должен логировать события аудита', () => {
      const { result } = renderHook(() => useEnhancedSecurity(), { wrapper });

      act(() => {
        result.current.logAuditEvent('user123', 'LOGIN', 'auth', true, { method: 'email' });
      });

      // Получаем логи аудита
      const logs = result.current.getAuditLogs('user123');

      expect(logs).toHaveLength(1);
      expect(logs[0].userId).toBe('user123');
      expect(logs[0].action).toBe('LOGIN');
    });
  });

  describe('обнаружение подозрительной активности', () => {
    it('должен обнаруживать подозрительную активность', () => {
      const { result } = renderHook(() => useEnhancedSecurity(), { wrapper });

      const isSuspicious = result.current.detectSuspiciousActivity('user123', 'DROP TABLE users', {
        query: 'DROP TABLE users',
      });

      expect(isSuspicious).toBe(true);
    });

    it('не должен помечать нормальную активность как подозрительную', () => {
      const { result } = renderHook(() => useEnhancedSecurity(), { wrapper });

      const isSuspicious = result.current.detectSuspiciousActivity('user123', 'Просмотр профиля', {
        userId: 'user456',
      });

      expect(isSuspicious).toBe(false);
    });
  });

  describe('настройки безопасности пользователя', () => {
    it('должен получать и обновлять настройки безопасности пользователя', () => {
      const { result } = renderHook(() => useEnhancedSecurity(), { wrapper });

      // Изначально должны быть null
      expect(result.current.getUserSecuritySettings('user123')).toBeNull();

      // Обновляем настройки
      act(() => {
        result.current.updateUserSecuritySettings('user123', {
          twoFactorEnabled: true,
          failedLoginAttempts: 2,
        });
      });

      // Проверяем обновленные настройки
      const settings = result.current.getUserSecuritySettings('user123');
      expect(settings).not.toBeNull();
      expect(settings?.twoFactorEnabled).toBe(true);
      expect(settings?.failedLoginAttempts).toBe(2);
    });
  });
});
