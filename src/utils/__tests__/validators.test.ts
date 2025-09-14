// src/utils/__tests__/validators.test.ts
// Тесты для системы валидации

import { Validator } from '../validators';

describe('Validator', () => {
  describe('Email validation', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com'
      ];

      validEmails.forEach(email => {
        const result = Validator.email(email);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        '',
        'invalid-email',
        '@example.com',
        'user@',
        'user@.com',
        'user..name@example.com',
        'user@example..com'
      ];

      invalidEmails.forEach(email => {
        const result = Validator.email(email);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    it('should reject emails that are too long', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const result = Validator.email(longEmail);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email слишком длинный');
    });
  });

  describe('Password validation', () => {
    it('should validate strong passwords', () => {
      const strongPasswords = [
        'Password123!',
        'MyStr0ng#Pass',
        'Test123@Pass',
        'Secure1$Pass'
      ];

      strongPasswords.forEach(password => {
        const result = Validator.password(password);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        '',
        '12345678',
        'password',
        'PASSWORD',
        'Password',
        'Password123',
        'Pass123!',
        'Password!'
      ];

      weakPasswords.forEach(password => {
        const result = Validator.password(password);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    it('should reject passwords that are too short', () => {
      const shortPassword = 'Pass1!';
      const result = Validator.password(shortPassword);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Пароль должен содержать минимум 8 символов');
    });

    it('should reject passwords that are too long', () => {
      const longPassword = 'A'.repeat(130) + '1!';
      const result = Validator.password(longPassword);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Пароль слишком длинный');
    });
  });

  describe('Name validation', () => {
    it('should validate correct names', () => {
      const validNames = [
        'John',
        'Mary Jane',
        'Jean-Pierre',
        'Александр',
        'Мария-Анна',
        'O\'Connor'
      ];

      validNames.forEach(name => {
        const result = Validator.name(name);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject invalid names', () => {
      const invalidNames = [
        '',
        'A',
        'John123',
        'John@Doe',
        'John.Doe',
        'John_Doe'
      ];

      invalidNames.forEach(name => {
        const result = Validator.name(name);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    it('should reject names that are too short', () => {
      const shortName = 'A';
      const result = Validator.name(shortName);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Имя должно содержать минимум 2 символа');
    });

    it('should reject names that are too long', () => {
      const longName = 'A'.repeat(51);
      const result = Validator.name(longName);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Имя слишком длинное');
    });
  });

  describe('Phone validation', () => {
    it('should validate correct phone numbers', () => {
      const validPhones = [
        '+7 (999) 123-45-67',
        '8-999-123-45-67',
        '9991234567',
        '+1-555-123-4567',
        '555.123.4567'
      ];

      validPhones.forEach(phone => {
        const result = Validator.phone(phone);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject invalid phone numbers', () => {
      const invalidPhones = [
        '',
        '123',
        'abc',
        '123-abc-4567',
        '1234567890123456' // Too long
      ];

      invalidPhones.forEach(phone => {
        const result = Validator.phone(phone);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Age validation', () => {
    it('should validate correct ages', () => {
      const validAges = [5, 10, 18, 25, 50, 100];

      validAges.forEach(age => {
        const result = Validator.age(age);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject invalid ages', () => {
      const invalidAges = [-1, 0, 1, 2, 121, 150];

      invalidAges.forEach(age => {
        const result = Validator.age(age);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    it('should reject ages that are too young for football', () => {
      const youngAges = [0, 1, 2];
      
      youngAges.forEach(age => {
        const result = Validator.age(age);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Возраст слишком мал для занятий футболом');
      });
    });
  });

  describe('Date validation', () => {
    it('should validate correct dates', () => {
      const validDates = [
        '2023-01-01',
        '2000-12-31',
        '1990-06-15',
        new Date('2023-01-01'),
        new Date('2000-12-31')
      ];

      validDates.forEach(date => {
        const result = Validator.date(date);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject invalid dates', () => {
      const invalidDates = [
        '',
        'invalid-date',
        '2023-13-01',
        '2023-01-32',
        new Date('invalid'),
        new Date('2025-01-01') // Future date
      ];

      invalidDates.forEach(date => {
        const result = Validator.date(date);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('URL validation', () => {
    it('should validate correct URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://example.com',
        'https://www.example.com/path',
        'https://example.com:8080/path?query=value'
      ];

      validUrls.forEach(url => {
        const result = Validator.url(url);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject invalid URLs', () => {
      const invalidUrls = [
        '',
        'not-a-url',
        'ftp://example.com',
        'example.com',
        'https://'
      ];

      invalidUrls.forEach(url => {
        const result = Validator.url(url);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Array validation', () => {
    it('should validate arrays with correct length', () => {
      const array = [1, 2, 3, 4, 5];
      const result = Validator.array(array, 3, 10);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject arrays that are too short', () => {
      const array = [1, 2];
      const result = Validator.array(array, 3, 10);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Массив должен содержать минимум 3 элементов');
    });

    it('should reject arrays that are too long', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const result = Validator.array(array, 3, 10);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Массив должен содержать максимум 10 элементов');
    });

    it('should validate array items with custom validator', () => {
      const array = ['valid@email.com', 'invalid-email'];
      const result = Validator.array(array, undefined, undefined, (item) => Validator.email(item));
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Элемент 2: Некорректный формат email');
    });
  });

  describe('Object validation', () => {
    it('should validate objects with correct properties', () => {
      const obj = { name: 'John', email: 'john@example.com' };
      const rules = {
        name: (value: unknown) => Validator.name(value as string),
        email: (value: unknown) => Validator.email(value as string)
      };
      
      const result = Validator.object(obj, rules);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject objects with invalid properties', () => {
      const obj = { name: 'J', email: 'invalid-email' };
      const rules = {
        name: (value: unknown) => Validator.name(value as string),
        email: (value: unknown) => Validator.email(value as string)
      };
      
      const result = Validator.object(obj, rules);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Combined validation', () => {
    it('should combine multiple validation results', () => {
      const emailResult = Validator.email('test@example.com');
      const passwordResult = Validator.password('Password123!');
      const combinedResult = Validator.combine(emailResult, passwordResult);
      
      expect(combinedResult.isValid).toBe(true);
      expect(combinedResult.errors).toHaveLength(0);
    });

    it('should combine validation results with errors', () => {
      const emailResult = Validator.email('invalid-email');
      const passwordResult = Validator.password('weak');
      const combinedResult = Validator.combine(emailResult, passwordResult);
      
      expect(combinedResult.isValid).toBe(false);
      expect(combinedResult.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Validation with error throwing', () => {
    it('should throw error for invalid validation', () => {
      expect(() => {
        Validator.validateAndThrow('invalid-email', Validator.email, 'Custom error message');
      }).toThrow('Custom error message');
    });

    it('should not throw error for valid validation', () => {
      expect(() => {
        Validator.validateAndThrow('valid@example.com', Validator.email);
      }).not.toThrow();
    });
  });
});