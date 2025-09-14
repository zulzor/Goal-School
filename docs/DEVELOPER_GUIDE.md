# 🛠️ Руководство разработчика

Полное руководство по разработке и поддержке приложения "Футбольная школа Арсенал".

## 📋 Содержание

1. [Настройка окружения](#настройка-окружения)
2. [Архитектура приложения](#архитектура-приложения)
3. [Стандарты кодирования](#стандарты-кодирования)
4. [Система логирования](#система-логирования)
5. [Обработка ошибок](#обработка-ошибок)
6. [Тестирование](#тестирование)
7. [Производительность](#производительность)
8. [Безопасность](#безопасность)
9. [Мониторинг](#мониторинг)
10. [Развертывание](#развертывание)

## 🚀 Настройка окружения

### Требования
- Node.js 16+ 
- npm 8+
- Expo CLI
- Android Studio (для Android)
- Xcode (для iOS, только macOS)

### Установка
```bash
# Клонирование репозитория
git clone <repository-url>
cd goalschoolapp

# Установка зависимостей
npm install

# Настройка окружения
cp .env.example .env
# Отредактируйте .env файл

# Запуск в режиме разработки
npm run web
```

### Структура проекта
```
src/
├── components/          # UI компоненты
│   ├── __tests__/      # Тесты компонентов
│   ├── common/         # Общие компоненты
│   ├── forms/          # Формы
│   └── layout/         # Компоненты макета
├── context/            # React контексты
│   ├── __tests__/      # Тесты контекстов
│   └── ...
├── hooks/              # Пользовательские хуки
│   ├── __tests__/      # Тесты хуков
│   └── ...
├── navigation/         # Навигация
├── screens/            # Экраны приложения
├── services/           # Бизнес-логика
│   ├── __tests__/      # Тесты сервисов
│   └── ...
├── types/              # TypeScript типы
├── utils/              # Утилиты
│   ├── __tests__/      # Тесты утилит
│   ├── cache.ts        # Кэширование
│   ├── errorHandler.ts # Обработка ошибок
│   ├── logger.ts       # Логирование
│   ├── monitoring.ts   # Мониторинг
│   ├── performance.ts  # Производительность
│   ├── security.ts     # Безопасность
│   └── validators.ts   # Валидация
└── constants/          # Константы
```

## 🏗️ Архитектура приложения

### Принципы архитектуры
- **Модульность** - каждый модуль имеет четкую ответственность
- **Переиспользование** - общие компоненты и утилиты
- **Тестируемость** - все модули покрыты тестами
- **Производительность** - оптимизация на всех уровнях
- **Безопасность** - защита на всех уровнях

### Слои приложения
```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│  (Screens, Components, Navigation)  │
├─────────────────────────────────────┤
│           Business Layer            │
│     (Hooks, Context, Services)      │
├─────────────────────────────────────┤
│            Data Layer               │
│    (Storage, API, Cache, Utils)     │
├─────────────────────────────────────┤
│          Infrastructure             │
│  (Logging, Monitoring, Security)    │
└─────────────────────────────────────┘
```

### Паттерны проектирования
- **Singleton** - для утилит (Logger, SecurityManager)
- **Factory** - для создания объектов
- **Observer** - для событий и уведомлений
- **Strategy** - для различных алгоритмов
- **Decorator** - для расширения функциональности

## 📝 Стандарты кодирования

### TypeScript
```typescript
// Используйте строгую типизацию
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

// Избегайте any
const processUser = (user: User): ProcessedUser => {
  // ...
};

// Используйте generic типы
const createApiResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
  timestamp: Date.now()
});
```

### React компоненты
```typescript
// Функциональные компоненты с TypeScript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, styles[variant]]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};
```

### Хуки
```typescript
// Пользовательские хуки
export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await UserService.getUser(userId);
        setUser(userData);
      } catch (err) {
        setError(handleError(err, { userId }));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
};
```

### Сервисы
```typescript
// Сервисы с обработкой ошибок
class UserService {
  static async createUser(userData: CreateUserData): Promise<User> {
    try {
      // Валидация
      Validator.validateAndThrow(userData.email, Validator.email);
      Validator.validateAndThrow(userData.password, Validator.password);
      
      // Логирование
      logDebug('Creating user', { email: userData.email });
      
      // Бизнес-логика
      const user = await this.performCreateUser(userData);
      
      // Логирование успеха
      logInfo('User created successfully', { userId: user.id });
      
      return user;
    } catch (error) {
      const appError = handleError(error, { 
        operation: 'createUser',
        email: userData.email 
      });
      logError('Failed to create user', appError);
      throw appError;
    }
  }
}
```

## 📊 Система логирования

### Уровни логирования
```typescript
import { logDebug, logInfo, logWarning, logError, LogLevel } from './utils/logger';

// Debug - отладочная информация
logDebug('Component rendered', { component: 'UserProfile' });

// Info - общая информация
logInfo('User logged in', { userId: '123', email: 'user@example.com' });

// Warning - предупреждения
logWarning('Slow API response', { endpoint: '/users', duration: 2000 });

// Error - ошибки
logError('Database connection failed', error, { operation: 'getUsers' });
```

### Контекст логирования
```typescript
// Всегда добавляйте контекст
logInfo('User action', { 
  userId: user.id,
  action: 'updateProfile',
  changes: ['name', 'email'],
  timestamp: Date.now()
});
```

### Настройка логирования
```typescript
import { Logger, LogLevel } from './utils/logger';

const logger = Logger.getInstance();

// Установка уровня логирования
logger.setLogLevel(LogLevel.INFO);

// Получение логов
const errorLogs = logger.getLogs(LogLevel.ERROR);
const allLogs = logger.getLogs();

// Экспорт логов
const exportedLogs = logger.exportLogs();
```

## ⚠️ Обработка ошибок

### Типы ошибок
```typescript
import { ErrorType, createError } from './utils/errorHandler';

// Создание ошибок
const validationError = createError(
  ErrorType.VALIDATION,
  'Invalid email format',
  'INVALID_EMAIL',
  { field: 'email', value: 'invalid-email' }
);

const networkError = createError(
  ErrorType.NETWORK,
  'Connection timeout',
  'CONNECTION_TIMEOUT',
  { endpoint: '/api/users', timeout: 5000 }
);
```

### Обработка в компонентах
```typescript
const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<AppError | null>(null);

  const handleUpdateUser = async (updates: Partial<User>) => {
    try {
      const updatedUser = await UserService.updateUser(user!.id, updates);
      setUser(updatedUser);
      setError(null);
    } catch (err) {
      const appError = handleError(err, { userId: user!.id });
      setError(appError);
      logError('Failed to update user', appError);
    }
  };

  if (error) {
    return <ErrorScreen error={error} onRetry={() => setError(null)} />;
  }

  return <UserForm user={user} onSave={handleUpdateUser} />;
};
```

### Обработка в сервисах
```typescript
class ApiService {
  static async request<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw createError(
          ErrorType.NETWORK,
          `HTTP ${response.status}: ${response.statusText}`,
          'HTTP_ERROR',
          { url, status: response.status }
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      throw handleError(error, { url, operation: 'apiRequest' });
    }
  }
}
```

## 🧪 Тестирование

### Unit тесты
```typescript
// utils/__tests__/validators.test.ts
import { Validator } from '../validators';

describe('Validator', () => {
  describe('email validation', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org'
      ];

      validEmails.forEach(email => {
        const result = Validator.email(email);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = ['', 'invalid-email', '@example.com'];

      invalidEmails.forEach(email => {
        const result = Validator.email(email);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });
});
```

### Integration тесты
```typescript
// services/__tests__/UserService.test.ts
import { UserService } from '../UserService';

describe('UserService', () => {
  beforeEach(() => {
    // Очистка AsyncStorage перед каждым тестом
    AsyncStorage.clear();
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
        role: 'student' as UserRole
      };

      const user = await UserService.createUser(userData);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
    });

    it('should throw error for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'Password123!',
        name: 'Test User',
        role: 'student' as UserRole
      };

      await expect(UserService.createUser(userData)).rejects.toThrow();
    });
  });
});
```

### Component тесты
```typescript
// components/__tests__/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={jest.fn()} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={jest.fn()} disabled={true} />
    );
    
    const button = getByText('Test Button').parent;
    expect(button?.props.disabled).toBe(true);
  });
});
```

### Запуск тестов
```bash
# Все тесты
npm test

# Конкретный файл
npm test -- validators.test.ts

# С покрытием
npm run test:coverage

# В режиме наблюдения
npm run test:watch

# CI/CD
npm run test:ci
```

## ⚡ Производительность

### Мемоизация
```typescript
import { useMemo, useCallback } from 'react';
import { memoize, useExpensiveComputation } from './utils/memoization';

// Мемоизация компонентов
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  const processedData = useExpensiveComputation(() => {
    return data.map(item => processItem(item));
  }, [data]);

  const handleUpdate = useCallback((id: string) => {
    onUpdate(id);
  }, [onUpdate]);

  return <div>{/* render */}</div>;
});

// Мемоизация функций
const expensiveCalculation = memoize((input: number) => {
  return input * input * input;
});
```

### Кэширование
```typescript
import { setCache, getCache, createCachedFunction } from './utils/cache';

// Простое кэширование
const fetchUser = async (id: string) => {
  const cached = await getCache<User>(`user:${id}`);
  if (cached) return cached;

  const user = await UserService.getUser(id);
  await setCache(`user:${id}`, user, { ttl: 300000 }); // 5 минут
  return user;
};

// Кэшированная функция
const cachedFetchUser = createCachedFunction(
  UserService.getUser,
  (id: string) => `user:${id}`,
  { ttl: 300000 }
);
```

### Оптимизация рендеринга
```typescript
// Виртуализация длинных списков
import { VirtualizedList } from 'react-native';

const UserList: React.FC<{ users: User[] }> = ({ users }) => {
  const renderItem = useCallback(({ item }: { item: User }) => (
    <UserItem user={item} />
  ), []);

  return (
    <VirtualizedList
      data={users}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      getItemCount={() => users.length}
      getItem={(data, index) => data[index]}
    />
  );
};
```

### Мониторинг производительности
```typescript
import { addMetric, measureFunction } from './utils/performance';

// Измерение производительности
const { result, metrics } = await measureFunction('fetchUsers', async () => {
  return await UserService.getAllUsers();
});

console.log(`Operation took ${metrics.duration}ms`);

// Добавление метрик
addMetric('api_response_time', 150, 'ms', { endpoint: '/users' });
addMetric('memory_usage', 50, 'MB');
```

## 🔒 Безопасность

### Валидация входных данных
```typescript
import { Validator, sanitizeInput } from './utils/security';

// Валидация всех входных данных
const validateUserInput = (input: any) => {
  const email = Validator.email(input.email);
  const password = Validator.password(input.password);
  const name = Validator.name(input.name);

  if (!email.isValid || !password.isValid || !name.isValid) {
    throw createError(ErrorType.VALIDATION, 'Invalid input data');
  }

  return {
    email: sanitizeInput(input.email),
    password: input.password, // Не санитизируем пароли
    name: sanitizeInput(input.name)
  };
};
```

### Защита от атак
```typescript
import { checkLoginAttempt, recordLoginSuccess, recordLoginFailure } from './utils/security';

// Проверка попыток входа
const handleLogin = async (email: string, password: string) => {
  const { allowed, remainingAttempts } = checkLoginAttempt(email);
  
  if (!allowed) {
    throw createError(ErrorType.AUTHENTICATION, 'Too many login attempts');
  }

  try {
    const user = await UserService.authenticateUser(email, password);
    recordLoginSuccess(email, user.id);
    return user;
  } catch (error) {
    recordLoginFailure(email, 'Invalid credentials');
    throw error;
  }
};
```

### Rate limiting
```typescript
import { checkRateLimit } from './utils/security';

// Ограничение частоты запросов
const handleApiRequest = async (userId: string, request: () => Promise<any>) => {
  if (!checkRateLimit(userId, 100, 60000)) { // 100 запросов в минуту
    throw createError(ErrorType.VALIDATION, 'Rate limit exceeded');
  }

  return await request();
};
```

## 📊 Мониторинг

### Health checks
```typescript
import { getOverallHealth, addMetric } from './utils/monitoring';

// Проверка состояния системы
const checkSystemHealth = () => {
  const health = getOverallHealth();
  
  if (health.status === 'unhealthy') {
    logError('System is unhealthy', { health });
    // Отправить уведомление администратору
  }
  
  return health;
};
```

### Метрики
```typescript
// Добавление пользовательских метрик
addMetric('user_registration', 1, 'count', { source: 'mobile' });
addMetric('api_error_rate', 0.05, 'percent', { endpoint: '/users' });
addMetric('memory_usage', 45, 'MB');
```

### Логирование событий
```typescript
import { logInfo, logError } from './utils/logger';

// Логирование важных событий
const handleUserRegistration = async (userData: CreateUserData) => {
  try {
    const user = await UserService.createUser(userData);
    
    logInfo('User registered successfully', {
      userId: user.id,
      email: user.email,
      role: user.role,
      timestamp: Date.now()
    });
    
    return user;
  } catch (error) {
    logError('User registration failed', error, {
      email: userData.email,
      role: userData.role
    });
    throw error;
  }
};
```

## 🚀 Развертывание

### Веб-версия
```bash
# Сборка
npm run build-web

# Запуск сервера
npm run serve

# Docker
docker build -t goalschoolapp .
docker run -p 3000:3000 goalschoolapp
```

### Мобильная версия
```bash
# Android
npm run build-apk

# iOS (требуется macOS)
npm run ios
```

### CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run test:ci
      - run: npm run build-web

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Деплой на продакшн
```

## 📚 Полезные ресурсы

### Документация
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)

### Инструменты
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)

### Лучшие практики
- [React Native Performance](https://reactnative.dev/docs/performance)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Testing Best Practices](https://testing-library.com/docs/guiding-principles)

---

**Версия документации**: 2.0.0  
**Последнее обновление**: Сентябрь 2024