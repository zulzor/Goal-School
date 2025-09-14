// src/services/UserService.ts
// Сервис для работы с пользователями через локальное хранилище

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole } from '../types';
import { logError, logInfo, logDebug } from '../utils/logger';
import { handleError, createError, ErrorType } from '../utils/errorHandler';
import { Validator } from '../utils/validators';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

class UserService {
  private static readonly USERS_KEY = 'users';
  private static readonly CURRENT_USER_KEY = 'current_user';

  // Получение пользователя по email
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      // Валидация email
      const emailValidation = Validator.email(email);
      if (!emailValidation.isValid) {
        throw createError(ErrorType.VALIDATION, emailValidation.errors.join(', '));
      }

      logDebug('Getting user by email', { email });
      
      const usersJson = await AsyncStorage.getItem(this.USERS_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      const user = users.find(u => u.email === email);
      
      if (user) {
        logInfo('User found', { userId: user.id, email });
      } else {
        logDebug('User not found', { email });
      }
      
      return user || null;
    } catch (error) {
      const appError = handleError(error, { email, operation: 'getUserByEmail' });
      logError('Error getting user by email', appError, { email });
      return null;
    }
  }

  // Создание нового пользователя
  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    try {
      // Валидация данных пользователя
      const emailValidation = Validator.email(userData.email);
      if (!emailValidation.isValid) {
        throw createError(ErrorType.VALIDATION, emailValidation.errors.join(', '));
      }

      const passwordValidation = Validator.password(userData.password);
      if (!passwordValidation.isValid) {
        throw createError(ErrorType.VALIDATION, passwordValidation.errors.join(', '));
      }

      const nameValidation = Validator.name(userData.name);
      if (!nameValidation.isValid) {
        throw createError(ErrorType.VALIDATION, nameValidation.errors.join(', '));
      }

      logDebug('Creating new user', { email: userData.email, role: userData.role });
      
      const usersJson = await AsyncStorage.getItem(this.USERS_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      // Проверяем, существует ли пользователь с таким email
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        throw createError(ErrorType.VALIDATION, 'User with this email already exists');
      }

      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(users));

      logInfo('User created successfully', { userId: newUser.id, email: newUser.email });
      return newUser;
    } catch (error) {
      const appError = handleError(error, { email: userData.email, operation: 'createUser' });
      logError('Error creating user', appError, { email: userData.email });
      throw appError;
    }
  }

  // Аутентификация пользователя
  static async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      logDebug('Authenticating user', { email });
      
      const user = await this.getUserByEmail(email);

      if (user && user.password === password) {
        // Сохраняем текущего пользователя
        await AsyncStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
        logInfo('User authenticated successfully', { userId: user.id, email });
        return user;
      }

      logDebug('Authentication failed', { email, reason: 'Invalid credentials' });
      return null;
    } catch (error) {
      const appError = handleError(error, { email, operation: 'authenticateUser' });
      logError('Error authenticating user', appError, { email });
      return null;
    }
  }

  // Выход из системы
  static async logout(): Promise<void> {
    try {
      logDebug('User logging out');
      await AsyncStorage.removeItem(this.CURRENT_USER_KEY);
      logInfo('User logged out successfully');
    } catch (error) {
      const appError = handleError(error, { operation: 'logout' });
      logError('Error logging out', appError);
      throw appError;
    }
  }

  // Получение текущего пользователя
  static async getCurrentUser(): Promise<User | null> {
    try {
      logDebug('Getting current user');
      const userJson = await AsyncStorage.getItem(this.CURRENT_USER_KEY);
      const user = userJson ? JSON.parse(userJson) : null;
      
      if (user) {
        logDebug('Current user found', { userId: user.id, email: user.email });
      } else {
        logDebug('No current user found');
      }
      
      return user;
    } catch (error) {
      const appError = handleError(error, { operation: 'getCurrentUser' });
      logError('Error getting current user', appError);
      return null;
    }
  }

  // Обновление профиля пользователя
  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      logDebug('Updating user profile', { userId, updates });
      
      // Валидация обновлений
      if (updates.email) {
        const emailValidation = Validator.email(updates.email);
        if (!emailValidation.isValid) {
          throw createError(ErrorType.VALIDATION, emailValidation.errors.join(', '));
        }
      }

      if (updates.password) {
        const passwordValidation = Validator.password(updates.password);
        if (!passwordValidation.isValid) {
          throw createError(ErrorType.VALIDATION, passwordValidation.errors.join(', '));
        }
      }

      if (updates.name) {
        const nameValidation = Validator.name(updates.name);
        if (!nameValidation.isValid) {
          throw createError(ErrorType.VALIDATION, nameValidation.errors.join(', '));
        }
      }
      
      const usersJson = await AsyncStorage.getItem(this.USERS_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw createError(ErrorType.VALIDATION, 'User not found');
      }

      const updatedUser = {
        ...users[userIndex],
        ...updates,
      };

      users[userIndex] = updatedUser;
      await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(users));

      // Если это текущий пользователь, обновляем его данные
      const currentUser = await this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        await AsyncStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedUser));
      }

      logInfo('User profile updated successfully', { userId });
      return updatedUser;
    } catch (error) {
      const appError = handleError(error, { userId, operation: 'updateUserProfile' });
      logError('Error updating user profile', appError, { userId });
      throw appError;
    }
  }

  // Получение всех пользователей (для админов)
  static async getAllUsers(): Promise<User[]> {
    try {
      logDebug('Getting all users');
      const usersJson = await AsyncStorage.getItem(this.USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      logInfo('All users retrieved', { count: users.length });
      return users;
    } catch (error) {
      const appError = handleError(error, { operation: 'getAllUsers' });
      logError('Error getting all users', appError);
      return [];
    }
  }

  // Удаление пользователя
  static async deleteUser(userId: string): Promise<void> {
    try {
      logDebug('Deleting user', { userId });
      
      const usersJson = await AsyncStorage.getItem(this.USERS_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      const userExists = users.some(u => u.id === userId);
      if (!userExists) {
        throw createError(ErrorType.VALIDATION, 'User not found');
      }

      const filteredUsers = users.filter(u => u.id !== userId);
      await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(filteredUsers));
      
      logInfo('User deleted successfully', { userId });
    } catch (error) {
      const appError = handleError(error, { userId, operation: 'deleteUser' });
      logError('Error deleting user', appError, { userId });
      throw appError;
    }
  }
}

export { UserService };
