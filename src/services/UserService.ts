// src/services/UserService.ts
// Сервис для работы с пользователями через локальное хранилище

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole } from '../types';

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
      const usersJson = await AsyncStorage.getItem(this.USERS_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      const user = users.find(u => u.email === email);
      return user || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  // Создание нового пользователя
  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    try {
      const usersJson = await AsyncStorage.getItem(this.USERS_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      // Проверяем, существует ли пользователь с таким email
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(users));

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Аутентификация пользователя
  static async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.getUserByEmail(email);

      if (user && user.password === password) {
        // Сохраняем текущего пользователя
        await AsyncStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
        return user;
      }

      return null;
    } catch (error) {
      console.error('Error authenticating user:', error);
      return null;
    }
  }

  // Выход из системы
  static async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CURRENT_USER_KEY);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  // Получение текущего пользователя
  static async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(this.CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Обновление профиля пользователя
  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      const usersJson = await AsyncStorage.getItem(this.USERS_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        throw new Error('User not found');
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

      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Получение всех пользователей (для админов)
  static async getAllUsers(): Promise<User[]> {
    try {
      const usersJson = await AsyncStorage.getItem(this.USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : [];
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  // Удаление пользователя
  static async deleteUser(userId: string): Promise<void> {
    try {
      const usersJson = await AsyncStorage.getItem(this.USERS_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      const filteredUsers = users.filter(u => u.id !== userId);
      await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(filteredUsers));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export { UserService };
