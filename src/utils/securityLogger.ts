// Утилита для логирования событий безопасности
export const securityLogger = {
  // Уровни логирования
  LEVELS: {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    CRITICAL: 'CRITICAL',
  } as const,

  // Логирование событий безопасности
  logEvent(
    level: keyof typeof this.LEVELS,
    eventType: string,
    message: string,
    details?: Record<string, any>
  ) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: this.LEVELS[level],
      eventType,
      message,
      details,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      platform: typeof window !== 'undefined' ? window.navigator.platform : 'Unknown',
    };

    // В production среде здесь можно отправлять логи на сервер
    if (__DEV__) {
      console.log(`[SECURITY ${logEntry.level}] ${eventType}: ${message}`, details);
    }

    // Здесь можно добавить отправку логов на сервер для анализа
    // this.sendToServer(logEntry);
  },

  // Логирование попыток входа
  logLoginAttempt(success: boolean, email: string, ipAddress?: string, userAgent?: string) {
    this.logEvent(
      success ? 'INFO' : 'WARN',
      'LOGIN_ATTEMPT',
      success ? 'Успешный вход в систему' : 'Неудачная попытка входа',
      {
        email: this.maskEmail(email),
        success,
        ipAddress,
        userAgent,
      }
    );
  },

  // Логирование регистрации
  logRegistration(email: string, role: string, ipAddress?: string, userAgent?: string) {
    this.logEvent('INFO', 'USER_REGISTRATION', 'Новая регистрация пользователя', {
      email: this.maskEmail(email),
      role,
      ipAddress,
      userAgent,
    });
  },

  // Логирование подозрительной активности
  logSuspiciousActivity(activityType: string, description: string, details?: Record<string, any>) {
    this.logEvent('WARN', 'SUSPICIOUS_ACTIVITY', `Подозрительная активность: ${activityType}`, {
      activityType,
      description,
      ...details,
    });
  },

  // Логирование ошибок безопасности
  logSecurityError(errorType: string, message: string, details?: Record<string, any>) {
    this.logEvent('ERROR', 'SECURITY_ERROR', `Ошибка безопасности: ${errorType}`, {
      errorType,
      message,
      ...details,
    });
  },

  // Логирование критических событий
  logCriticalEvent(eventType: string, message: string, details?: Record<string, any>) {
    this.logEvent('CRITICAL', eventType, message, details);
  },

  // Маскировка email для логов
  maskEmail(email: string): string {
    if (!email || typeof email !== 'string') {
      return '***@***.***';
    }

    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) {
      return '***@***.***';
    }

    // Маскируем локальную часть email
    const maskedLocalPart =
      localPart.length > 2
        ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1]
        : '*'.repeat(localPart.length);

    // Маскируем домен
    const domainParts = domain.split('.');
    if (domainParts.length < 2) {
      return `${maskedLocalPart}@***.***`;
    }

    const maskedDomain = domainParts
      .map((part, index) => {
        if (index === domainParts.length - 1) {
          // Расширение домена оставляем как есть
          return part;
        }
        return part.length > 2
          ? part[0] + '*'.repeat(part.length - 2) + part[part.length - 1]
          : '*'.repeat(part.length);
      })
      .join('.');

    return `${maskedLocalPart}@${maskedDomain}`;
  },

  // Маскировка IP адреса
  maskIP(ip: string): string {
    if (!ip || typeof ip !== 'string') {
      return '***.***.***.***';
    }

    const parts = ip.split('.');
    if (parts.length !== 4) {
      return '***.***.***.***';
    }

    // Маскируем последние два октета
    return `${parts[0]}.${parts[1]}.***.***`;
  },

  // Отправка логов на сервер (заглушка)
  async sendToServer(logEntry: any) {
    try {
      // В реальном приложении здесь будет отправка на сервер
      // await fetch('/api/security/logs', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(logEntry),
      // });
    } catch (error) {
      console.error('Ошибка отправки логов безопасности:', error);
    }
  },
};
