# Стандарты кодирования

## Общие принципы

1. **Читаемость** - код должен быть легко читаемым и понятным
2. **Поддерживаемость** - код должен быть легко поддерживаемым и расширяемым
3. **Производительность** - код должен быть эффективным по использованию ресурсов
4. **Безопасность** - код должен следовать лучшим практикам безопасности

## TypeScript

### Типизация

- Используйте строгую типизацию везде, где это возможно
- Описывайте интерфейсы для всех объектов
- Используйте дженерики для универсальных функций

```typescript
// Хорошо
interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

// Плохо
const user: any = { ... };
```

### Функции

- Явно указывайте типы параметров и возвращаемых значений
- Используйте стрелочные функции для компонентов и коллбэков

```typescript
// Хорошо
const getUserById = (id: number): Promise<User | null> => {
  // ...
};

// Плохо
function getUserById(id) {
  // ...
}
```

## React и React Native

### Компоненты

- Используйте функциональные компоненты вместо классовых
- Применяйте хуки для управления состоянием и побочными эффектами
- Разделяйте логику и представление
- Используйте React.memo для оптимизации производительности

```typescript
// Хорошо
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
}

export const MyComponent: React.FC<Props> = React.memo(({ title, onPress }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Побочный эффект
  }, []);

  return (
    <View>
      <Text onPress={onPress}>{title}</Text>
    </View>
  );
});
```

### Состояние

- Используйте useState для локального состояния
- Используйте useContext для глобального состояния
- Используйте useReducer для сложного состояния

```typescript
// Хорошо
const [users, setUsers] = useState<User[]>([]);

// Плохо
let users = [];
```

## Стилизация

### StyleSheet

- Используйте StyleSheet.create для стилей
- Определяйте цвета в константах
- Используйте responsive design

```typescript
// Хорошо
import { StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});
```

## Асинхронность

### Обработка ошибок

- Всегда обрабатывайте ошибки в асинхронных операциях
- Используйте try/catch для async/await
- Предоставляйте пользователю понятные сообщения об ошибках

```typescript
// Хорошо
const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw new Error('Не удалось загрузить пользователей');
  }
};
```

## Комментарии и документация

### JSDoc

- Используйте JSDoc для документирования функций и классов
- Описывайте параметры и возвращаемые значения

```typescript
/**
 * Получает пользователя по ID
 * @param id - ID пользователя
 * @returns Пользователь или null, если не найден
 */
const getUserById = async (id: number): Promise<User | null> => {
  // ...
};
```

## Именование

### Переменные и функции

- Используйте camelCase для переменных и функций
- Используйте PascalCase для компонентов и классов
- Используйте UPPER_CASE для констант

```typescript
// Хорошо
const userName = 'John';
const UserProfile: React.FC = () => { ... };
const MAX_RETRY_COUNT = 3;

// Плохо
const user_name = 'John';
const userprofile = () => { ... };
const maxRetryCount = 3;
```

## Файловая структура

### Организация

- Группируйте связанные файлы в директории
- Используйте индексные файлы для экспорта
- Разделяйте тесты в директории `__tests__`

```
src/
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   └── __tests__/
│       ├── Button.test.tsx
│       └── Card.test.tsx
├── services/
│   ├── UserService.ts
│   └── __tests__/
│       └── UserService.test.ts
└── index.ts
```

## Тестирование

### Покрытие кода

- Стремитесь к покрытию кода не менее 80%
- Тестируйте граничные случаи
- Используйте моки для внешних зависимостей

```typescript
// Хорошо
it('should return null when user not found', async () => {
  mockGetItem.mockResolvedValue(null);

  const result = await UserService.getUserByEmail('nonexistent@example.com');

  expect(result).toBeNull();
});
```

## Безопасность

### Хранение данных

- Не храните чувствительные данные в коде
- Используйте переменные окружения для конфигурации
- Хешируйте пароли перед сохранением

### Ввод данных

- Всегда валидируйте пользовательский ввод
- Используйте параметризованные запросы к базе данных
- Экранируйте выводимые данные

## Производительность

### Оптимизация

- Используйте React.memo для предотвращения лишних рендеров
- Оптимизируйте рендеринг списков с помощью FlatList
- Минимизируйте количество перерисовок

### Асинхронные операции

- Используйте индикаторы загрузки для долгих операций
- Отменяйте запросы при размонтировании компонентов
- Кэшируйте результаты повторяющихся запросов

## Инструменты

### ESLint

- Следуйте правилам ESLint
- Используйте `npm run lint` для проверки кода
- Используйте `npm run lint:fix` для автоматического исправления

### Prettier

- Следуйте правилам форматирования Prettier
- Используйте `npm run format` для форматирования кода
- Используйте `npm run format:check` для проверки форматирования

### Husky и lint-staged

- Используйте pre-commit хуки для автоматической проверки кода
- Настройте lint-staged для проверки только измененных файлов

## Best Practices

### 1. Разделение ответственности

Каждый модуль должен иметь одну ответственность:

```typescript
// Хорошо
// UserService.ts - только работа с пользователями
// AttendanceService.ts - только работа с посещаемостью

// Плохо
// DataService.ts - работа со всеми данными
```

### 2. Композиция вместо наследования

Используйте композицию для повторного использования кода:

```typescript
// Хорошо
const useUserData = () => {
  // логика работы с данными пользователя
};

const UserProfile: React.FC = () => {
  const userData = useUserData();
  // ...
};

// Плохо
class UserProfile extends UserDataComponent {
  // ...
}
```

### 3. Иммутабельность

Избегайте мутации данных:

```typescript
// Хорошо
const newUser = { ...user, name: 'New Name' };

// Плохо
user.name = 'New Name';
```

### 4. Обработка ошибок

Всегда обрабатывайте возможные ошибки:

```typescript
// Хорошо
try {
  const result = await fetchData();
  setData(result);
} catch (error) {
  setError('Не удалось загрузить данные');
}

// Плохо
const result = await fetchData();
setData(result);
```
