// src/services/__tests__/UserService.test.ts
import { UserService } from '../UserService';

// Мокаем AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    const mockGetItem = require('@react-native-async-storage/async-storage').getItem;
    const mockSetItem = require('@react-native-async-storage/async-storage').setItem;

    mockGetItem.mockResolvedValue(null);

    const userData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'student' as const,
    };

    const user = await UserService.createUser(userData);

    expect(user).toHaveProperty('id');
    expect(user.email).toBe(userData.email);
    expect(user.name).toBe(userData.name);
    expect(user.role).toBe(userData.role);
    expect(mockSetItem).toHaveBeenCalled();
  });

  it('should authenticate user with correct credentials', async () => {
    const mockGetItem = require('@react-native-async-storage/async-storage').getItem;

    const userData = {
      id: '1',
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'student',
      createdAt: new Date().toISOString(),
    };

    mockGetItem.mockResolvedValue(JSON.stringify([userData]));

    const user = await UserService.authenticateUser('test@example.com', 'password123');

    expect(user).not.toBeNull();
    expect(user?.email).toBe('test@example.com');
  });

  it('should return null for incorrect credentials', async () => {
    const mockGetItem = require('@react-native-async-storage/async-storage').getItem;

    const userData = {
      id: '1',
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: 'student',
      createdAt: new Date().toISOString(),
    };

    mockGetItem.mockResolvedValue(JSON.stringify([userData]));

    const user = await UserService.authenticateUser('test@example.com', 'wrongpassword');

    expect(user).toBeNull();
  });
});
