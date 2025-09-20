// src/services/MySQLUserService.ts
// Сервис для работы с пользователями через MySQL
import { mysqlQuery } from '../config/mysql';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  branchId?: string; // Добавляем свойство branchId
  created_at: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export class MySQLUserService {
  // Map database roles to frontend roles
  private static mapDatabaseRoleToUserRole(dbRole: string): UserRole {
    switch (dbRole) {
      case 'admin':
        return UserRole.MANAGER; // In database it's 'admin', in frontend it's 'MANAGER'
      case 'manager':
        return UserRole.MANAGER;
      case 'coach':
        return UserRole.COACH;
      case 'parent':
        return UserRole.PARENT;
      case 'child':
        return UserRole.CHILD;
      case 'smm_manager':
        return UserRole.SMM_MANAGER;
      default:
        return UserRole.CHILD; // Default fallback
    }
  }

  // Map frontend roles to database roles
  private static mapUserRoleToDatabaseRole(userRole: UserRole): string {
    switch (userRole) {
      case UserRole.MANAGER:
        return 'manager'; // In frontend it's 'MANAGER', in database it's 'manager'
      case UserRole.COACH:
        return 'coach';
      case UserRole.PARENT:
        return 'parent';
      case UserRole.CHILD:
        return 'child';
      case UserRole.SMM_MANAGER:
        return 'smm_manager';
      default:
        return 'child'; // Default fallback
    }
  }

  // Получение пользователя по email
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await mysqlQuery('SELECT * FROM users WHERE email = ?', [email]);

      // Fix TypeScript error: accessing result.rows[0]
      if (Array.isArray(result.rows) && result.rows.length > 0) {
        const dbUser = result.rows[0];
        return {
          ...dbUser,
          role: this.mapDatabaseRoleToUserRole(dbUser.role),
        } as User;
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

      await mysqlQuery('INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)', [
        userData.email,
        hashedPassword,
        userData.name,
        this.mapUserRoleToDatabaseRole(userData.role),
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
        const dbUser = result.rows[0];
        return {
          ...dbUser,
          role: this.mapDatabaseRoleToUserRole(dbUser.role),
        } as User;
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
          // Handle role mapping
          if (key === 'role') {
            fields.push(`${key} = ?`);
            values.push(this.mapUserRoleToDatabaseRole(value as UserRole));
          } else {
            fields.push(`${key} = ?`);
            values.push(value);
          }
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

  // Получение всех пользователей
  static async getAllUsers(): Promise<User[]> {
    try {
      const result = await mysqlQuery('SELECT * FROM users ORDER BY name');

      if (Array.isArray(result.rows)) {
        return result.rows.map(dbUser => ({
          ...dbUser,
          role: this.mapDatabaseRoleToUserRole(dbUser.role),
        })) as User[];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  // Создание тестового пользователя
  static async createTestUser(): Promise<User> {
    try {
      const testUserData: CreateUserInput = {
        email: 'test@example.com',
        password: 'test123',
        name: 'Test User',
        role: UserRole.CHILD,
      };

      return await this.createUser(testUserData);
    } catch (error) {
      console.error('Error creating test user:', error);
      throw error;
    }
  }
}