// src/context/__tests__/DatabaseContext.test.tsx
import React from 'react';
import { render, act } from '@testing-library/react-native';
import { DatabaseProvider, useDatabase } from '../DatabaseContext';

// Мокаем AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Мокаем checkMySQLConnection
jest.mock('../../config/mysql', () => ({
  checkMySQLConnection: jest.fn(),
}));

const mockGetItem = require('@react-native-async-storage/async-storage').getItem;
const mockSetItem = require('@react-native-async-storage/async-storage').setItem;
const mockCheckMySQLConnection = require('../../config/mysql').checkMySQLConnection;

// Тестовый компонент для использования контекста
const TestComponent: React.FC = () => {
  const { databaseType, isMySQLAvailable, setDatabaseType, checkMySQLAvailability } = useDatabase();

  return (
    <div>
      <div data-testid="databaseType">{databaseType}</div>
      <div data-testid="isMySQLAvailable">{isMySQLAvailable.toString()}</div>
      <button data-testid="setLocal" onClick={() => setDatabaseType('local')}>
        Set Local
      </button>
      <button data-testid="setMySQL" onClick={() => setDatabaseType('mysql')}>
        Set MySQL
      </button>
      <button data-testid="checkMySQL" onClick={() => checkMySQLAvailability()}>
        Check MySQL
      </button>
    </div>
  );
};

describe('DatabaseContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide default values', () => {
    mockGetItem.mockResolvedValue(null);
    mockCheckMySQLConnection.mockResolvedValue(false);

    const { getByTestId } = render(
      <DatabaseProvider>
        <TestComponent />
      </DatabaseProvider>
    );

    expect(getByTestId('databaseType').textContent).toBe('local');
    expect(getByTestId('isMySQLAvailable').textContent).toBe('false');
  });

  it('should load database type from localStorage', async () => {
    mockGetItem.mockResolvedValue('mysql');
    mockCheckMySQLConnection.mockResolvedValue(true);

    let getByTestId: any;

    await act(async () => {
      const result = render(
        <DatabaseProvider>
          <TestComponent />
        </DatabaseProvider>
      );
      getByTestId = result.getByTestId;
    });

    expect(getByTestId('databaseType').textContent).toBe('mysql');
    expect(getByTestId('isMySQLAvailable').textContent).toBe('true');
  });

  it('should save database type to localStorage when changed', async () => {
    mockGetItem.mockResolvedValue(null);
    mockCheckMySQLConnection.mockResolvedValue(false);

    let getByTestId: any;

    await act(async () => {
      const result = render(
        <DatabaseProvider>
          <TestComponent />
        </DatabaseProvider>
      );
      getByTestId = result.getByTestId;
    });

    // Изначально local
    expect(getByTestId('databaseType').textContent).toBe('local');

    // Меняем на mysql
    await act(async () => {
      getByTestId('setMySQL').click();
    });

    // Проверяем, что значение изменилось
    expect(getByTestId('databaseType').textContent).toBe('mysql');

    // Проверяем, что значение сохранено в localStorage
    expect(mockSetItem).toHaveBeenCalledWith('databaseType', 'mysql');
  });

  it('should check MySQL availability', async () => {
    mockGetItem.mockResolvedValue(null);
    mockCheckMySQLConnection.mockResolvedValue(true);

    let getByTestId: any;

    await act(async () => {
      const result = render(
        <DatabaseProvider>
          <TestComponent />
        </DatabaseProvider>
      );
      getByTestId = result.getByTestId;
    });

    // Проверяем доступность MySQL
    await act(async () => {
      getByTestId('checkMySQL').click();
    });

    // Проверяем, что функция была вызвана
    expect(mockCheckMySQLConnection).toHaveBeenCalled();
  });
});
