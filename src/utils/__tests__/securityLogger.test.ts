import { securityLogger } from '../securityLogger';

describe('securityLogger', () => {
  beforeEach(() => {
    // Мокаем console.log для захвата вывода логов
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Восстанавливаем console.log
    (console.log as jest.Mock).mockRestore();
  });

  describe('logEvent', () => {
    it('должен логировать события безопасности с правильным форматом', () => {
      const logSpy = jest.spyOn(console, 'log');

      securityLogger.logEvent('INFO', 'TEST_EVENT', 'Тестовое сообщение', { detail: 'test' });

      expect(logSpy).toHaveBeenCalledWith('[SECURITY INFO] TEST_EVENT: Тестовое сообщение', {
        detail: 'test',
      });
    });
  });

  describe('logLoginAttempt', () => {
    it('должен логировать успешные попытки входа', () => {
      const logSpy = jest.spyOn(console, 'log');

      securityLogger.logLoginAttempt(true, 'test@example.com');

      expect(logSpy).toHaveBeenCalledWith(
        '[SECURITY INFO] LOGIN_ATTEMPT: Успешный вход в систему',
        {
          email: 't*s*@example.com',
          success: true,
          ipAddress: undefined,
          userAgent: undefined,
        }
      );
    });

    it('должен логировать неудачные попытки входа', () => {
      const logSpy = jest.spyOn(console, 'log');

      securityLogger.logLoginAttempt(false, 'test@example.com');

      expect(logSpy).toHaveBeenCalledWith(
        '[SECURITY WARN] LOGIN_ATTEMPT: Неудачная попытка входа',
        {
          email: 't*s*@example.com',
          success: false,
          ipAddress: undefined,
          userAgent: undefined,
        }
      );
    });
  });

  describe('logRegistration', () => {
    it('должен логировать события регистрации пользователей', () => {
      const logSpy = jest.spyOn(console, 'log');

      securityLogger.logRegistration('test@example.com', 'parent');

      expect(logSpy).toHaveBeenCalledWith(
        '[SECURITY INFO] USER_REGISTRATION: Новая регистрация пользователя',
        {
          email: 't*s*@example.com',
          role: 'parent',
          ipAddress: undefined,
          userAgent: undefined,
        }
      );
    });
  });

  describe('logSuspiciousActivity', () => {
    it('должен логировать подозрительную активность', () => {
      const logSpy = jest.spyOn(console, 'log');

      securityLogger.logSuspiciousActivity('TEST_ACTIVITY', 'Тестовое описание', {
        detail: 'test',
      });

      expect(logSpy).toHaveBeenCalledWith(
        '[SECURITY WARN] SUSPICIOUS_ACTIVITY: Подозрительная активность: TEST_ACTIVITY',
        {
          activityType: 'TEST_ACTIVITY',
          description: 'Тестовое описание',
          detail: 'test',
        }
      );
    });
  });

  describe('maskEmail', () => {
    it('должен правильно маскировать email адреса', () => {
      expect(securityLogger.maskEmail('user@example.com')).toBe('u*s*@example.com');
      expect(securityLogger.maskEmail('a@b.com')).toBe('*@b.com');
      expect(securityLogger.maskEmail('test.user@domain.com')).toBe('t*s*.u*e*@domain.com');
    });

    it('должен обрабатывать некорректные email', () => {
      expect(securityLogger.maskEmail('')).toBe('***@***.***');
      expect(securityLogger.maskEmail('invalid')).toBe('***@***.***');
      expect(securityLogger.maskEmail(null as any)).toBe('***@***.***');
    });
  });

  describe('maskIP', () => {
    it('должен правильно маскировать IP адреса', () => {
      expect(securityLogger.maskIP('192.168.1.1')).toBe('192.168.***.***');
      expect(securityLogger.maskIP('10.0.0.1')).toBe('10.0.***.***');
    });

    it('должен обрабатывать некорректные IP', () => {
      expect(securityLogger.maskIP('')).toBe('***.***.***.***');
      expect(securityLogger.maskIP('invalid')).toBe('***.***.***.***');
      expect(securityLogger.maskIP(null as any)).toBe('***.***.***.***');
    });
  });
});
