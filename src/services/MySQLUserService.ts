// src/services/MySQLUserService.ts
// Сервис для работы с пользователями через MySQL
import { mysqlQuery } from '../config/mysql';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  branchId?: string; // Добавляем свойство branchId
  created_at: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role: string;
}

export class MySQLUserService {
  // Получение пользователя по email
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await mysqlQuery('SELECT * FROM users WHERE email = ?', [email]);

      // Fix TypeScript error: accessing result.rows[0]
      if (Array.isArray(result.rows) && result.rows.length > 0) {
        return result.rows[0] as User;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  // Создание нового пользователя
  static async createUser(userData: CreateUserInput): Promise<User> {
    try {
      // Хешируем пароль
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      await mysqlQuery('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', [
        userData.email,
        hashedPassword,
        userData.name,
        userData.role,
      ]);

      // Получаем созданного пользователя
      const newUser = await this.getUserByEmail(userData.email);
      if (!newUser) {
        throw new Error('Failed to create user');
      }

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

      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }

      return null;
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  // Получение пользователя по ID
  static async getUserById(id: number): Promise<User | null> {
    try {
      const result = await mysqlQuery('SELECT * FROM users WHERE id = ?', [id]);

      // Fix TypeScript error: accessing result.rows[0]
      if (Array.isArray(result.rows) && result.rows.length > 0) {
        return result.rows[0] as User;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  // Обновление профиля пользователя
  static async updateUserProfile(id: number, updates: Partial<User>): Promise<User> {
    try {
      const fields = [];
      const values = [];

      // Динамически строим запрос на основе переданных обновлений
      for (const [key, value] of Object.entries(updates)) {
        if (key !== 'id' && key !== 'created_at') {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id); // Добавляем ID для WHERE clause
      await mysqlQuery(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);

      // Получаем обновленного пользователя
      const updatedUser = await this.getUserById(id);
      if (!updatedUser) {
        throw new Error('Failed to update user');
      }

      return updatedUser;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Создание тестового пользователя
  static async createTestUser(): Promise<User> {
    try {
      const testUserData: CreateUserInput = {
        email: 'test@example.com',
        password: 'test123',
        name: 'Test User',
        role: 'student',
      };

      return await this.createUser(testUserData);
    } catch (error) {
      console.error('Error creating test user:', error);
      throw error;
    }
  }
}
