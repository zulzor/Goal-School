# Тестирование приложения Goal School

## Обзор

Приложение Goal School использует Jest и Testing Library для unit и интеграционного тестирования.

## Структура тестов

Тесты организованы следующим образом:

```
src/
├── components/
│   └── __tests__/
├── context/
│   └── __tests__/
├── hooks/
│   └── __tests__/
├── screens/
│   └── __tests__/
├── services/
│   └── __tests__/
└── utils/
    └── __tests__/
```

## Запуск тестов

### Все тесты

```bash
npm test
```

### Тесты в режиме наблюдения

```bash
npm run test:watch
```

### Тесты с покрытием кода

```bash
npm run test:coverage
```

## Написание тестов

### Unit тесты для сервисов

Сервисы тестируются с помощью моков зависимостей:

```typescript
// src/services/__tests__/UserService.test.ts
import { UserService } from '../UserService';

// Мокаем AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get user by email', async () => {
    const mockGetItem = require('@react-native-async-storage/async-storage').getItem;
    mockGetItem.mockResolvedValue(JSON.stringify({ email: 'test@example.com' }));

    const user = await UserService.getUserByEmail('test@example.com');

    expect(user).toEqual({ email: 'test@example.com' });
    expect(mockGetItem).toHaveBeenCalledWith('users');
  });
});
```

### Тесты для контекстов

Контексты тестируются с помощью тестовых компонентов:

```typescript
// src/context/__tests__/AuthContext.test.tsx
import React from 'react';
import { render, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';

const TestComponent: React.FC = () => {
  const { user, login } = useAuth();

  return (
    <div>
      <div data-testid="user">{user ? user.email : 'null'}</div>
      <button data-testid="login" onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  it('should handle login', async () => {
    let getByTestId: any;

    await act(async () => {
      const result = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      getByTestId = result.getByTestId;
    });

    await act(async () => {
      getByTestId('login').click();
    });

    expect(getByTestId('user').textContent).toBe('test@example.com');
  });
});
```

### Тесты для компонентов

Компоненты тестируются с помощью Testing Library:

```typescript
// src/components/__tests__/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ArsenalButton } from '../ArsenalButton';

describe('ArsenalButton', () => {
  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ArsenalButton onPress={onPress}>
        Click me
      </ArsenalButton>
    );

    fireEvent.press(getByText('Click me'));

    expect(onPress).toHaveBeenCalled();
  });
});
```

## Моки

### Моки внешних зависимостей

Все внешние зависимости мокаются в тестах:

```typescript
// Мокаем AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Мокаем нативные модули
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
```

### Моки сервисов

Сервисы мокаются для изоляции тестов:

```typescript
// Мокаем UserService
jest.mock('../../services/UserService', () => ({
  UserService: {
    login: jest.fn(),
    register: jest.fn(),
  },
}));
```

## Покрытие кода

### Просмотр покрытия

После запуска тестов с покрытием, отчет будет доступен в директории `coverage/`.

### Минимальное покрытие

Целевое покрытие кода: 80%

Конфигурация в `jest.config.js`:

```javascript
module.exports = {
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## Best Practices

### 1. Описательные названия тестов

```typescript
// Хорошо
it('should return user when found by email', () => { ... });

// Плохо
it('should work', () => { ... });
```

### 2. Изолированные тесты

Каждый тест должен быть независимым и не полагаться на состояние других тестов.

### 3. Чистка моков

Очищайте моки перед каждым тестом:

```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

### 4. Тестирование граничных случаев

```typescript
it('should handle null user', () => {
  // Тест когда пользователь null
});

it('should handle empty email', () => {
  // Тест когда email пустой
});
```

### 5. Асинхронное тестирование

Используйте async/await для асинхронных тестов:

```typescript
it('should fetch user data', async () => {
  const user = await UserService.getUserById(1);
  expect(user).toBeDefined();
});
```

## Решение常见ых проблем

### Ошибка "Cannot find module"

Убедитесь, что все зависимости установлены:

```bash
npm install
```

### Ошибка "TypeError: Cannot read property 'getItem' of undefined"

Проверьте, что AsyncStorage правильно замокан:

```typescript
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));
```

### Ошибка "Test environment jest-environment-jsdom cannot be found"

Установите правильное тестовое окружение:

```bash
npm install --save-dev jest-environment-node
```

И обновите конфигурацию:

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  // ...
};
```

## CI/CD интеграция

Тесты автоматически запускаются в CI/CD pipeline (см. [.github/workflows/ci.yml](.github/workflows/ci.yml)).

## Расширение тестов

### Добавление новых тестов

1. Создайте файл теста в соответствующей директории `__tests__`
2. Используйте шаблоны из существующих тестов
3. Запустите тесты для проверки

### Обновление существующих тестов

1. Обновите тесты при изменении функциональности
2. Добавьте тесты для новых функций
3. Убедитесь, что все тесты проходят
