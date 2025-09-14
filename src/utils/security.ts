// src/utils/security.ts
// Продвинутая система безопасности

import { logError, logWarning, logInfo } from './logger';
import { createError, ErrorType } from './errorHandler';

export interface SecurityConfig {
  maxLoginAttempts: number;
  lockoutDuration: number; // в миллисекундах
  passwordMinLength: number;
  passwordMaxLength: number;
  sessionTimeout: number; // в миллисекундах
  enableRateLimiting: boolean;
  enableInputSanitization: boolean;
}

export interface SecurityEvent {
  type: 'login_attempt' | 'login_success' | 'login_failure' | 'suspicious_activity' | 'rate_limit_exceeded';
  userId?: string;
  ip?: string;
  userAgent?: string;
  timestamp: number;
  details?: Record<string, unknown>;
}

class SecurityManager {
  private static instance: SecurityManager;
  private config: SecurityConfig;
  private loginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil?: number }>();
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  private securityEvents: SecurityEvent[] = [];
  private maxEvents = 1000;

  private constructor() {
    this.config = {
      maxLoginAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15 минут
      passwordMinLength: 8,
      passwordMaxLength: 128,
      sessionTimeout: 24 * 60 * 60 * 1000, // 24 часа
      enableRateLimiting: true,
      enableInputSanitization: true,
    };
  }

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  /**
   * Настройка конфигурации безопасности
   */
  setConfig(config: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...config };
    logInfo('Security config updated', { config: this.config });
  }

  /**
   * Проверка попытки входа
   */
  checkLoginAttempt(identifier: string, ip?: string): { allowed: boolean; remainingAttempts: number; lockoutTime?: number } {
    const now = Date.now();
    const attempt = this.loginAttempts.get(identifier);

    if (!attempt) {
      this.loginAttempts.set(identifier, { count: 1, lastAttempt: now });
      this.logSecurityEvent('login_attempt', { identifier, ip });
      return { allowed: true, remainingAttempts: this.config.maxLoginAttempts - 1 };
    }

    // Проверяем, не заблокирован ли пользователь
    if (attempt.lockedUntil && now < attempt.lockedUntil) {
      this.logSecurityEvent('login_attempt', { identifier, ip, blocked: true });
      return { 
        allowed: false, 
        remainingAttempts: 0, 
        lockoutTime: attempt.lockedUntil 
      };
    }

    // Сбрасываем счетчик, если прошло достаточно времени
    if (now - attempt.lastAttempt > this.config.lockoutDuration) {
      this.loginAttempts.set(identifier, { count: 1, lastAttempt: now });
      this.logSecurityEvent('login_attempt', { identifier, ip });
      return { allowed: true, remainingAttempts: this.config.maxLoginAttempts - 1 };
    }

    // Проверяем лимит попыток
    if (attempt.count >= this.config.maxLoginAttempts) {
      const lockedUntil = now + this.config.lockoutDuration;
      this.loginAttempts.set(identifier, { 
        ...attempt, 
        lockedUntil,
        count: attempt.count + 1 
      });
      
      this.logSecurityEvent('suspicious_activity', { 
        identifier, 
        ip, 
        reason: 'max_login_attempts_exceeded',
        lockoutDuration: this.config.lockoutDuration 
      });
      
      return { 
        allowed: false, 
        remainingAttempts: 0, 
        lockoutTime: lockedUntil 
      };
    }

    // Увеличиваем счетчик попыток
    this.loginAttempts.set(identifier, { 
      ...attempt, 
      count: attempt.count + 1, 
      lastAttempt: now 
    });

    this.logSecurityEvent('login_attempt', { identifier, ip });
    return { 
      allowed: true, 
      remainingAttempts: this.config.maxLoginAttempts - attempt.count - 1 
    };
  }

  /**
   * Успешный вход
   */
  recordLoginSuccess(identifier: string, userId: string, ip?: string): void {
    this.loginAttempts.delete(identifier);
    this.logSecurityEvent('login_success', { identifier, userId, ip });
    logInfo('Login successful', { identifier, userId, ip });
  }

  /**
   * Неудачный вход
   */
  recordLoginFailure(identifier: string, reason: string, ip?: string): void {
    const attempt = this.loginAttempts.get(identifier);
    if (attempt) {
      attempt.count += 1;
      this.loginAttempts.set(identifier, attempt);
    }
    
    this.logSecurityEvent('login_failure', { identifier, reason, ip });
    logWarning('Login failed', { identifier, reason, ip });
  }

  /**
   * Проверка rate limiting
   */
  checkRateLimit(identifier: string, limit: number = 100, windowMs: number = 60000): boolean {
    if (!this.config.enableRateLimiting) {
      return true;
    }

    const now = Date.now();
    const rateLimit = this.rateLimitMap.get(identifier);

    if (!rateLimit || now > rateLimit.resetTime) {
      this.rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (rateLimit.count >= limit) {
      this.logSecurityEvent('rate_limit_exceeded', { identifier, limit, windowMs });
      return false;
    }

    rateLimit.count += 1;
    this.rateLimitMap.set(identifier, rateLimit);
    return true;
  }

  /**
   * Санитизация входных данных
   */
  sanitizeInput(input: string): string {
    if (!this.config.enableInputSanitization) {
      return input;
    }

    return input
      .replace(/[<>]/g, '') // Удаляем HTML теги
      .replace(/javascript:/gi, '') // Удаляем javascript: ссылки
      .replace(/on\w+=/gi, '') // Удаляем event handlers
      .trim();
  }

  /**
   * Проверка силы пароля
   */
  validatePasswordStrength(password: string): { 
    isValid: boolean; 
    score: number; 
    suggestions: string[] 
  } {
    const suggestions: string[] = [];
    let score = 0;

    // Длина пароля
    if (password.length < this.config.passwordMinLength) {
      suggestions.push(`Пароль должен содержать минимум ${this.config.passwordMinLength} символов`);
    } else if (password.length >= 12) {
      score += 2;
    } else {
      score += 1;
    }

    // Заглавные буквы
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      suggestions.push('Добавьте заглавные буквы');
    }

    // Строчные буквы
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      suggestions.push('Добавьте строчные буквы');
    }

    // Цифры
    if (/\d/.test(password)) {
      score += 1;
    } else {
      suggestions.push('Добавьте цифры');
    }

    // Специальные символы
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      suggestions.push('Добавьте специальные символы');
    }

    // Проверка на общие пароли
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      score -= 2;
      suggestions.push('Избегайте общих слов в пароле');
    }

    // Проверка на повторяющиеся символы
    if (/(.)\1{2,}/.test(password)) {
      score -= 1;
      suggestions.push('Избегайте повторяющихся символов');
    }

    return {
      isValid: score >= 4 && password.length >= this.config.passwordMinLength,
      score: Math.max(0, Math.min(5, score)),
      suggestions
    };
  }

  /**
   * Проверка сессии
   */
  isSessionValid(sessionStart: number): boolean {
    const now = Date.now();
    return (now - sessionStart) < this.config.sessionTimeout;
  }

  /**
   * Логирование событий безопасности
   */
  private logSecurityEvent(
    type: SecurityEvent['type'], 
    details: Record<string, unknown> = {}
  ): void {
    const event: SecurityEvent = {
      type,
      timestamp: Date.now(),
      ...details
    };

    this.securityEvents.push(event);

    // Ограничиваем количество событий
    if (this.securityEvents.length > this.maxEvents) {
      this.securityEvents = this.securityEvents.slice(-this.maxEvents);
    }

    // Логируем подозрительные события
    if (type === 'suspicious_activity' || type === 'rate_limit_exceeded') {
      logWarning('Security event detected', { type, details });
    }
  }

  /**
   * Получение событий безопасности
   */
  getSecurityEvents(type?: SecurityEvent['type']): SecurityEvent[] {
    if (type) {
      return this.securityEvents.filter(event => event.type === type);
    }
    return [...this.securityEvents];
  }

  /**
   * Очистка старых данных
   */
  cleanup(): void {
    const now = Date.now();
    
    // Очищаем старые попытки входа
    for (const [key, attempt] of this.loginAttempts.entries()) {
      if (now - attempt.lastAttempt > this.config.lockoutDuration * 2) {
        this.loginAttempts.delete(key);
      }
    }

    // Очищаем старые rate limit данные
    for (const [key, rateLimit] of this.rateLimitMap.entries()) {
      if (now > rateLimit.resetTime) {
        this.rateLimitMap.delete(key);
      }
    }

    // Очищаем старые события (старше 7 дней)
    const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
    this.securityEvents = this.securityEvents.filter(event => event.timestamp > weekAgo);

    logInfo('Security cleanup completed', { 
      remainingLoginAttempts: this.loginAttempts.size,
      remainingRateLimits: this.rateLimitMap.size,
      remainingEvents: this.securityEvents.length
    });
  }

  /**
   * Получение статистики безопасности
   */
  getSecurityStats(): {
    totalEvents: number;
    suspiciousEvents: number;
    activeLockouts: number;
    activeRateLimits: number;
  } {
    const now = Date.now();
    const suspiciousEvents = this.securityEvents.filter(
      event => event.type === 'suspicious_activity' || event.type === 'rate_limit_exceeded'
    ).length;

    const activeLockouts = Array.from(this.loginAttempts.values()).filter(
      attempt => attempt.lockedUntil && now < attempt.lockedUntil
    ).length;

    const activeRateLimits = Array.from(this.rateLimitMap.values()).filter(
      rateLimit => now <= rateLimit.resetTime
    ).length;

    return {
      totalEvents: this.securityEvents.length,
      suspiciousEvents,
      activeLockouts,
      activeRateLimits
    };
  }
}

// Экспортируем singleton instance
const securityManager = SecurityManager.getInstance();

// Экспортируем удобные функции
export const checkLoginAttempt = (identifier: string, ip?: string) => {
  return securityManager.checkLoginAttempt(identifier, ip);
};

export const recordLoginSuccess = (identifier: string, userId: string, ip?: string) => {
  securityManager.recordLoginSuccess(identifier, userId, ip);
};

export const recordLoginFailure = (identifier: string, reason: string, ip?: string) => {
  securityManager.recordLoginFailure(identifier, reason, ip);
};

export const checkRateLimit = (identifier: string, limit?: number, windowMs?: number) => {
  return securityManager.checkRateLimit(identifier, limit, windowMs);
};

export const sanitizeInput = (input: string) => {
  return securityManager.sanitizeInput(input);
};

export const validatePasswordStrength = (password: string) => {
  return securityManager.validatePasswordStrength(password);
};

export const isSessionValid = (sessionStart: number) => {
  return securityManager.isSessionValid(sessionStart);
};

export const getSecurityEvents = (type?: SecurityEvent['type']) => {
  return securityManager.getSecurityEvents(type);
};

export const cleanupSecurity = () => {
  securityManager.cleanup();
};

export const getSecurityStats = () => {
  return securityManager.getSecurityStats();
};

export { SecurityManager };
export type { SecurityConfig, SecurityEvent };