// src/utils/validators.ts
// Система валидации данных

import { createError, ErrorType } from './errorHandler';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

class Validator {
  /**
   * Валидация email
   */
  static email(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email) {
      errors.push('Email обязателен');
      return { isValid: false, errors };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Некорректный формат email');
    }

    if (email.length > 254) {
      errors.push('Email слишком длинный');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Валидация пароля
   */
  static password(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Пароль обязателен');
      return { isValid: false, errors };
    }

    if (password.length < 8) {
      errors.push('Пароль должен содержать минимум 8 символов');
    }

    if (password.length > 128) {
      errors.push('Пароль слишком длинный');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Пароль должен содержать заглавную букву');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Пароль должен содержать строчную букву');
    }

    if (!/\d/.test(password)) {
      errors.push('Пароль должен содержать цифру');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Пароль должен содержать специальный символ');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Валидация имени
   */
  static name(name: string): ValidationResult {
    const errors: string[] = [];
    
    if (!name) {
      errors.push('Имя обязательно');
      return { isValid: false, errors };
    }

    if (name.length < 2) {
      errors.push('Имя должно содержать минимум 2 символа');
    }

    if (name.length > 50) {
      errors.push('Имя слишком длинное');
    }

    if (!/^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(name)) {
      errors.push('Имя может содержать только буквы, пробелы и дефисы');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Валидация телефона
   */
  static phone(phone: string): ValidationResult {
    const errors: string[] = [];
    
    if (!phone) {
      errors.push('Телефон обязателен');
      return { isValid: false, errors };
    }

    // Убираем все символы кроме цифр
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length < 10) {
      errors.push('Некорректный номер телефона');
    }

    if (cleanPhone.length > 15) {
      errors.push('Номер телефона слишком длинный');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Валидация возраста
   */
  static age(age: number): ValidationResult {
    const errors: string[] = [];
    
    if (age < 0) {
      errors.push('Возраст не может быть отрицательным');
    }

    if (age > 120) {
      errors.push('Некорректный возраст');
    }

    if (age < 3) {
      errors.push('Возраст слишком мал для занятий футболом');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Валидация даты
   */
  static date(date: string | Date): ValidationResult {
    const errors: string[] = [];
    
    if (!date) {
      errors.push('Дата обязательна');
      return { isValid: false, errors };
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      errors.push('Некорректная дата');
    }

    const now = new Date();
    if (dateObj > now) {
      errors.push('Дата не может быть в будущем');
    }

    const minDate = new Date(1900, 0, 1);
    if (dateObj < minDate) {
      errors.push('Дата слишком старая');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Валидация URL
   */
  static url(url: string): ValidationResult {
    const errors: string[] = [];
    
    if (!url) {
      errors.push('URL обязателен');
      return { isValid: false, errors };
    }

    try {
      new URL(url);
    } catch {
      errors.push('Некорректный URL');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Валидация массива
   */
  static array<T>(
    array: T[],
    minLength?: number,
    maxLength?: number,
    itemValidator?: (item: T) => ValidationResult
  ): ValidationResult {
    const errors: string[] = [];
    
    if (!Array.isArray(array)) {
      errors.push('Значение должно быть массивом');
      return { isValid: false, errors };
    }

    if (minLength !== undefined && array.length < minLength) {
      errors.push(`Массив должен содержать минимум ${minLength} элементов`);
    }

    if (maxLength !== undefined && array.length > maxLength) {
      errors.push(`Массив должен содержать максимум ${maxLength} элементов`);
    }

    if (itemValidator) {
      array.forEach((item, index) => {
        const itemResult = itemValidator(item);
        if (!itemResult.isValid) {
          errors.push(`Элемент ${index + 1}: ${itemResult.errors.join(', ')}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Валидация объекта
   */
  static object<T extends Record<string, unknown>>(
    obj: T,
    rules: Partial<Record<keyof T, (value: unknown) => ValidationResult>>
  ): ValidationResult {
    const errors: string[] = [];
    
    if (!obj || typeof obj !== 'object') {
      errors.push('Значение должно быть объектом');
      return { isValid: false, errors };
    }

    Object.entries(rules).forEach(([key, validator]) => {
      if (validator) {
        const result = validator(obj[key]);
        if (!result.isValid) {
          errors.push(`${key}: ${result.errors.join(', ')}`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Комбинированная валидация
   */
  static combine(...validators: ValidationResult[]): ValidationResult {
    const allErrors = validators.flatMap(v => v.errors);
    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  }

  /**
   * Валидация с созданием ошибки
   */
  static validateAndThrow<T>(
    value: T,
    validator: (value: T) => ValidationResult,
    errorMessage?: string
  ): void {
    const result = validator(value);
    if (!result.isValid) {
      throw createError(
        ErrorType.VALIDATION,
        errorMessage || result.errors.join(', '),
        'VALIDATION_ERROR',
        { errors: result.errors }
      );
    }
  }
}

export { Validator };
export type { ValidationResult, ValidationRule };