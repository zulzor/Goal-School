import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthContextType, UserRole, Branch } from '../types';

// Экспортируем UserRole
export { UserRole };

const AUTH_STORAGE_KEY = 'auth_user';
const SESSION_STORAGE_KEY = 'auth_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any | null>(null);

  // Добавляем отладочный вывод при изменении состояния
  console.log('AuthProvider: состояние контекста изменено', {
    hasUser: !!user,
    userId: user?.id,
    isLoading,
    hasSession: !!session,
  });

  // Загрузка сохраненного состояния при запуске
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('AuthProvider useEffect: Инициализация контекста аутентификации');

        // Пытаемся восстановить сессию из локального хранилища
        const savedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        const savedSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);

        console.log('AuthProvider useEffect: Данные из хранилища', {
          hasSavedUser: !!savedUser,
          hasSavedSession: !!savedSession,
          savedUser: savedUser ? JSON.parse(savedUser) : null,
        });

        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            console.log('AuthProvider useEffect: Пользователь восстановлен из хранилища', userData);
          } catch (parseError) {
            console.error(
              'AuthProvider useEffect: Ошибка парсинга данных пользователя:',
              parseError
            );
            // Если данные повреждены, удаляем их
            await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }

        if (savedSession) {
          try {
            setSession(JSON.parse(savedSession));
            console.log('AuthProvider useEffect: Сессия восстановлена из хранилища');
          } catch (parseError) {
            console.error('AuthProvider useEffect: Ошибка парсинга сессии:', parseError);
            // Если данные повреждены, удаляем их
            await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
          }
        }

        // Создаем тестовых пользователей по умолчанию, если их еще нет
        await createDefaultTestUsers();
      } catch (error) {
        console.error('AuthProvider useEffect: Ошибка инициализации:', error);
        // В случае ошибки все равно завершаем загрузку
      } finally {
        setIsLoading(false);
        console.log('AuthProvider useEffect: Завершена инициализация, isLoading = false');
      }
    };

    // Функция для создания тестовых пользователей по умолчанию
    const createDefaultTestUsers = async () => {
      try {
        const usersData = await AsyncStorage.getItem('app_users');
        const users = usersData ? JSON.parse(usersData) : [];

        // Проверяем, существуют ли тестовые пользователи
        const testUsersExist = users.some(
          (u: any) => u.email.startsWith('admin') && u.email.endsWith('@gs.com')
        );

        console.log('AuthProvider: Проверка существования тестовых пользователей', {
          totalUsers: users.length,
          testUsersExist,
        });

        // Если тестовые пользователи не существуют, создаем их
        if (!testUsersExist) {
          console.log('AuthProvider: Создание тестовых пользователей по умолчанию');

          const roles = [
            UserRole.CHILD,
            UserRole.PARENT,
            UserRole.MANAGER,
            UserRole.COACH,
            UserRole.SMM_MANAGER,
          ];

          for (const role of roles) {
            // Определяем номер администратора и email в зависимости от роли
            let adminNumber: number;
            switch (role) {
              case UserRole.CHILD:
                adminNumber = 1;
                break;
              case UserRole.PARENT:
                adminNumber = 2;
                break;
              case UserRole.MANAGER:
                adminNumber = 3;
                break;
              case UserRole.COACH:
                adminNumber = 4;
                break;
              case UserRole.SMM_MANAGER:
                adminNumber = 5;
                break;
              default:
                adminNumber = 2; // По умолчанию родитель
            }

            const email = `admin${adminNumber}@gs.com`;
            const name = `Админ ${adminNumber} (${USER_ROLE_NAMES[role]})`;

            // Проверяем, существует ли уже такой пользователь
            const existingUser = users.find((u: any) => u.email === email);
            if (!existingUser) {
              // Создаем нового тестового пользователя
              const newUser = {
                id: `test_user_${role}_${Date.now()}`,
                email: email,
                name: name,
                role: role,
                passwordHash: hashPassword('admin'), // Используем правильный пароль из документации
                createdAt: new Date().toISOString(),
              };

              users.push(newUser);
              console.log(`AuthProvider: Создан тестовый пользователь ${email}`);
            }
          }

          // Сохраняем пользователей
          await AsyncStorage.setItem('app_users', JSON.stringify(users));
          console.log('AuthProvider: Тестовые пользователи сохранены', users.length);
        }
      } catch (error) {
        console.error('AuthProvider: Ошибка создания тестовых пользователей по умолчанию:', error);
        // Не критическая ошибка, продолжаем работу
      }
    };

    initializeAuth();
  }, []);

  // Сохранение пользователя при изменении
  useEffect(() => {
    const saveUser = async () => {
      console.log('AuthProvider: useEffect для сохранения пользователя сработал', {
        hasUser: !!user,
        userId: user?.id,
      });

      if (user) {
        try {
          await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
          console.log('AuthProvider: Пользователь сохранен в хранилище', user);
        } catch (error) {
          console.error('AuthProvider: Ошибка сохранения пользователя:', error);
        }
      } else {
        // Удаляем данные при выходе
        try {
          console.log('AuthProvider: Удаление данных пользователя из хранилища');
          await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
          await AsyncStorage.removeItem(SESSION_STORAGE_KEY);

          // Проверяем, что данные удалены
          const userAfterRemoval = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
          const sessionAfterRemoval = await AsyncStorage.getItem(SESSION_STORAGE_KEY);

          console.log('AuthProvider: Данные после удаления', {
            userAfterRemoval,
            sessionAfterRemoval,
          });
        } catch (error) {
          console.error('AuthProvider: Ошибка удаления данных пользователя:', error);
        }
      }
    };

    saveUser();
  }, [user]);

  // Функция для создания хэша пароля (упрощенная реализация)
  const hashPassword = (password: string): string => {
    // В реальном приложении используйте криптографическую хэш-функцию
    return btoa(password); // Base64 для демонстрации
  };

  // Функция для проверки хэша пароля
  const verifyPassword = (password: string, hash: string): boolean => {
    return btoa(password) === hash;
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Получаем сохраненных пользователей
      const usersData = await AsyncStorage.getItem('app_users');
      const users = usersData ? JSON.parse(usersData) : [];

      // Ищем пользователя по email
      const foundUser = users.find((u: any) => u.email === email);

      if (foundUser && verifyPassword(password, foundUser.passwordHash)) {
        // Убираем хэш пароля из объекта пользователя
        const { passwordHash, ...userWithoutPassword } = foundUser;

        setUser(userWithoutPassword);
        setSession({ user: userWithoutPassword, timestamp: new Date().toISOString() });

        // Сохраняем сессию
        await AsyncStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify({
            user: userWithoutPassword,
            timestamp: new Date().toISOString(),
          })
        );

        return { success: true, message: 'Вход выполнен успешно' };
      } else {
        throw new Error('Неверный email или пароль');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: string,
    branchId?: string
  ) => {
    try {
      setIsLoading(true);

      // Получаем сохраненных пользователей
      const usersData = await AsyncStorage.getItem('app_users');
      let users = usersData ? JSON.parse(usersData) : [];

      // Проверяем, существует ли пользователь с таким email
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
      }

      // Создаем нового пользователя
      const newUser = {
        id: `user_${Date.now()}`,
        email: email,
        name: name,
        role: role,
        branchId: branchId, // Добавляем привязку к филиалу
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
      };

      // Добавляем пользователя в список
      users = [...users, newUser];
      await AsyncStorage.setItem('app_users', JSON.stringify(users));

      // Убираем хэш пароля из объекта пользователя
      const { passwordHash, ...userWithoutPassword } = newUser;

      // Устанавливаем текущего пользователя
      setUser(userWithoutPassword as User);
      setSession({ user: userWithoutPassword, timestamp: new Date().toISOString() });

      // Сохраняем сессию
      await AsyncStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({
          user: userWithoutPassword,
          timestamp: new Date().toISOString(),
        })
      );

      return { success: true, message: 'Регистрация выполнена успешно' };
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Начало процесса выхода из аккаунта');

      // Удаляем данные из хранилища
      console.log('logout: Удаление данных из хранилища');
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);

      // Проверяем, что данные удалены
      const userAfterRemoval = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      const sessionAfterRemoval = await AsyncStorage.getItem(SESSION_STORAGE_KEY);

      console.log('logout: Данные после удаления', {
        userAfterRemoval,
        sessionAfterRemoval,
      });

      // Принудительно очищаем состояние пользователя
      console.log('logout: Очистка состояния пользователя');
      setUser(null);
      setSession(null);

      console.log('Выход из аккаунта выполнен успешно, пользователь очищен');

      // Добавляем небольшую задержку для гарантии обновления состояния
      await new Promise(resolve => setTimeout(resolve, 100));

      // Проверяем, что состояние действительно изменилось
      const savedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      const savedSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);

      console.log('Проверка состояния после выхода:', {
        userInStorage: !!savedUser,
        sessionInStorage: !!savedSession,
      });

      // Принудительно вызываем обновление состояния
      console.log('logout: Принудительное обновление состояния завершено');

      // Возвращаем результат в виде объекта с промисом
      return Promise.resolve({ success: true, message: 'Выход выполнен успешно' });
    } catch (error) {
      console.error('Ошибка в функции logout:', error);
      // Даже в случае ошибки пробуем очистить состояние
      setUser(null);
      setSession(null);
      // Возвращаем отклоненный промис с ошибкой
      return Promise.reject(error);
    }
  };

  // Новая функция для повторной отправки письма подтверждения
  const resendConfirmationEmail = async (email: string) => {
    try {
      // В реальном приложении здесь должна быть отправка письма
      // Пока используем заглушку для демонстрации
      return { success: true, message: 'Письмо подтверждения отправлено повторно' };
    } catch (error) {
      console.error('Ошибка повторной отправки письма:', error);
      throw error;
    }
  };

  // Новая функция для создания тестовых пользователей с разными ролями
  const createTestUser = async (role: UserRole) => {
    try {
      setIsLoading(true);

      // Определяем номер администратора и email в зависимости от роли
      let adminNumber: number;
      switch (role) {
        case UserRole.CHILD:
          adminNumber = 1;
          break;
        case UserRole.PARENT:
          adminNumber = 2;
          break;
        case UserRole.MANAGER:
          adminNumber = 3;
          break;
        case UserRole.COACH:
          adminNumber = 4;
          break;
        case UserRole.SMM_MANAGER:
          adminNumber = 5;
          break;
        default:
          adminNumber = 2; // По умолчанию родитель
      }

      const email = `admin${adminNumber}@gs.com`;
      const name = `Админ ${adminNumber} (${USER_ROLE_NAMES[role]})`;

      // Проверяем, существует ли уже такой пользователь
      const usersData = await AsyncStorage.getItem('app_users');
      let users = usersData ? JSON.parse(usersData) : [];

      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        // Если пользователь уже существует, просто возвращаем успех
        return {
          success: true,
          message: `Тестовый пользователь ${USER_ROLE_NAMES[role]} уже существует`,
        };
      }

      // Создаем нового тестового пользователя
      const newUser = {
        id: `test_user_${role}_${Date.now()}`,
        email: email,
        name: name,
        role: role,
        passwordHash: hashPassword('admin'), // Используем правильный пароль из документации
        createdAt: new Date().toISOString(),
      };

      // Добавляем пользователя в список
      users = [...users, newUser];
      await AsyncStorage.setItem('app_users', JSON.stringify(users));

      return {
        success: true,
        message: `Тестовый пользователь ${USER_ROLE_NAMES[role]} создан. Email: ${email}, Пароль: admin`,
      };
    } catch (error) {
      console.error('Ошибка создания тестового пользователя:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) {
        return;
      }

      // Обновляем локальное состояние
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);

      // Обновляем пользователя в списке
      const usersData = await AsyncStorage.getItem('app_users');
      if (usersData) {
        let users = JSON.parse(usersData);
        users = users.map((u: any) => (u.id === user.id ? { ...u, ...updates } : u));
        await AsyncStorage.setItem('app_users', JSON.stringify(users));
      }
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      throw error;
    }
  };

  // Названия ролей для отображения
  const USER_ROLE_NAMES: Record<UserRole, string> = {
    [UserRole.CHILD]: 'Ребенок',
    [UserRole.PARENT]: 'Родитель',
    [UserRole.MANAGER]: 'Управляющий',
    [UserRole.COACH]: 'Тренер',
    [UserRole.SMM_MANAGER]: 'SMM Менеджер',
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    resendConfirmationEmail,
    createTestUser,
    session,
  };

  // Добавляем отладочный вывод
  console.log('AuthProvider state:', {
    user: user ? 'authenticated' : 'not authenticated',
    userId: user?.id,
    userRole: user?.role,
    isLoading,
    session: session ? 'exists' : 'null',
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider as LocalStorageAuthProvider };
