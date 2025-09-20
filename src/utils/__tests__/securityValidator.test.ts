import { securityValidator } from '../securityValidator';

describe('securityValidator', () => {
  describe('sanitizeString', () => {
    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello World';
      const result = securityValidator.sanitizeString(input);
      expect(result).toBe('Hello World');
    });

    it('should remove dangerous characters', () => {
      const input = 'Hello <World>';
      const result = securityValidator.sanitizeString(input);
      expect(result).toBe('Hello World');
    });

    it('should limit string length', () => {
      const input = 'A'.repeat(1500);
      const result = securityValidator.sanitizeString(input);
      expect(result.length).toBe(1000);
    });

    it('should handle non-string input', () => {
      const result = securityValidator.sanitizeString(123 as any);
      expect(result).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      const result = securityValidator.validateEmail('test@example.com');
      expect(result).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = securityValidator.validateEmail('invalid-email');
      expect(result).toBe(false);
    });

    it('should reject too long email', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const result = securityValidator.validateEmail(longEmail);
      expect(result).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate correct password', () => {
      const result = securityValidator.validatePassword('password123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject too short password', () => {
      const result = securityValidator.validatePassword('pass');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Пароль должен содержать минимум 6 символов');
    });

    it('should reject too long password', () => {
      const result = securityValidator.validatePassword('A'.repeat(150));
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Пароль слишком длинный');
    });
  });

  describe('validateUsername', () => {
    it('should validate correct username', () => {
      const result = securityValidator.validateUsername('test_user');
      expect(result).toBe(true);
    });

    it('should reject invalid username with special characters', () => {
      const result = securityValidator.validateUsername('test$user');
      expect(result).toBe(false);
    });

    it('should reject too short username', () => {
      const result = securityValidator.validateUsername('ab');
      expect(result).toBe(false);
    });

    it('should reject too long username', () => {
      const result = securityValidator.validateUsername('A'.repeat(35));
      expect(result).toBe(false);
    });
  });

  describe('validateAge', () => {
    it('should validate correct age', () => {
      const result = securityValidator.validateAge(25);
      expect(result).toBe(true);
    });

    it('should reject invalid age', () => {
      const result = securityValidator.validateAge(150);
      expect(result).toBe(false);
    });

    it('should reject non-integer age', () => {
      const result = securityValidator.validateAge(25.5);
      expect(result).toBe(false);
    });
  });

  describe('containsSQLInjection', () => {
    it('should detect SQL injection patterns', () => {
      const result = securityValidator.containsSQLInjection('SELECT * FROM users');
      expect(result).toBe(true);
    });

    it('should not detect normal text as SQL injection', () => {
      const result = securityValidator.containsSQLInjection('Hello World');
      expect(result).toBe(false);
    });
  });

  describe('containsXSS', () => {
    it('should detect XSS patterns', () => {
      const result = securityValidator.containsXSS('<script>alert("xss")</script>');
      expect(result).toBe(true);
    });

    it('should not detect normal text as XSS', () => {
      const result = securityValidator.containsXSS('Hello World');
      expect(result).toBe(false);
    });
  });
});
