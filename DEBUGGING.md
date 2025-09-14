# Отладка приложения Goal School

## Обзор

Это руководство поможет вам настроить и использовать различные инструменты отладки для приложения Goal School.

## Отладка в VS Code

### Конфигурации отладки

В проекте настроены следующие конфигурации отладки в файле [.vscode/launch.json](.vscode/launch.json):

1. **Debug Expo** - отладка на всех платформах
2. **Debug Android** - отладка на Android
3. **Debug iOS** - отладка на iOS
4. **Debug Web** - отладка в вебе
5. **Debug Jest Tests** - отладка тестов

### Запуск отладки

1. Откройте проект в VS Code
2. Нажмите `F5` или перейдите в раздел "Run and Debug"
3. Выберите нужную конфигурацию
4. Нажмите "Start Debugging"

### Точки останова

Установите точки останова в коде, кликнув слева от номеров строк. При запуске отладки выполнение остановится в этих точках.

### Просмотр переменных

Во время отладки вы можете просматривать значения переменных в панели "Variables" и вычислять выражения в консоли отладки.

## Отладка в браузере

### Инструменты разработчика

При запуске веб-версии приложения вы можете использовать инструменты разработчика браузера:

1. Откройте приложение в браузере
2. Нажмите `F12` или `Ctrl+Shift+I` (Cmd+Option+I на macOS)
3. Перейдите на вкладку "Console" для просмотра логов
4. Перейдите на вкладку "Sources" для отладки JavaScript
5. Перейдите на вкладку "Network" для мониторинга сетевых запросов

### Логирование

Используйте console.log для отладки:

```typescript
// Простое логирование
console.log('User data:', user);

// Логирование ошибок
console.error('Failed to fetch data:', error);

// Логирование предупреждений
console.warn('Deprecated function used');

// Группировка логов
console.group('User Actions');
console.log('Login attempt');
console.log('Authentication success');
console.groupEnd();
```

## Отладка на мобильных устройствах

### Expo Developer Tools

При запуске Expo откроется Developer Tools в браузере по адресу http://localhost:19002.

Здесь вы можете:

- Просматривать логи приложения
- Перезапускать Metro bundler
- Очищать кэш
- Просматривать ошибки

### Отладка на устройстве

1. Установите приложение Expo на ваше устройство
2. Запустите приложение с помощью `npm start`
3. Отсканируйте QR-код в Developer Tools или введите URL в приложении Expo

### Отладка JavaScript на устройстве

1. В приложении Expo shake устройство (или нажмите Ctrl+D на Android или Cmd+D на iOS)
2. Выберите "Debug Remote JS"
3. Откроется новая вкладка в браузере с инструментами разработчика

## Отладка базы данных

### Логирование запросов

Все SQL запросы логгируются в консоль разработчика. Вы можете включить дополнительную отладку:

```env
# Добавьте в .env файл
DEBUG=sql*
```

### Проверка подключения

Проверьте подключение к базе данных:

```bash
npm run db:check
```

### Просмотр данных

Для просмотра данных в базе данных используйте psql:

```bash
# Подключение к базе данных
psql -U username -d database_name

# Просмотр таблиц
\dt

# Просмотр данных в таблице
SELECT * FROM users LIMIT 10;

# Выход
\q
```

## Отладка контекстов React

### React DevTools

Установите React DevTools для браузера:

1. Установите расширение React Developer Tools
2. Откройте инструменты разработчика браузера
3. Перейдите на вкладку "Components" для просмотра дерева компонентов
4. Перейдите на вкладку "Profiler" для анализа производительности

### Просмотр контекстов

В React DevTools вы можете просматривать значения контекстов:

1. Найдите компонент, использующий контекст
2. В правой панели найдите раздел "Context"
3. Просмотрите значения контекстов

## Отладка навигации

### React Navigation DevTools

Для отладки навигации используйте инструменты React Navigation:

1. Установите расширение React Navigation в Developer Tools
2. Используйте console.log для логирования навигационных событий:

```typescript
import { useNavigation } from '@react-navigation/native';

const MyComponent = () => {
  const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Screen focused');
    });

    return unsubscribe;
  }, [navigation]);

  return <View />;
};
```

## Отладка производительности

### Профилирование компонентов

Используйте React Profiler для анализа производительности:

1. Оберните приложение в Profiler
2. Выполните действия в приложении
3. Просмотрите результаты профилирования

```typescript
import { Profiler } from 'react';

const onRenderCallback = (
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number,
  interactions: Set<any>
) => {
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions,
  });
};

const App = () => (
  <Profiler id="App" onRender={onRenderCallback}>
    <MyComponent />
  </Profiler>
);
```

### Мониторинг памяти

Используйте инструменты разработчика браузера для мониторинга памяти:

1. Откройте вкладку "Memory" в инструментах разработчика
2. Сделайте снимок памяти
3. Выполните действия в приложении
4. Сделайте еще один снимок
5. Сравните снимки для поиска утечек памяти

## Отладка сетевых запросов

### Мониторинг запросов

Используйте вкладку "Network" в инструментах разработчика браузера:

1. Откройте вкладку "Network"
2. Выполните действия в приложении, вызывающие сетевые запросы
3. Просмотрите список запросов
4. Нажмите на запрос для просмотра деталей

### Логирование запросов

Добавьте логирование в сервисы для отладки сетевых запросов:

```typescript
const fetchData = async () => {
  console.log('Fetching data from API');
  try {
    const response = await fetch('/api/data');
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
```

## Отладка тестов

### Запуск тестов в режиме отладки

```bash
# Запуск тестов в режиме наблюдения
npm run test:watch

# Запуск конкретного теста
npm test -- src/services/__tests__/UserService.test.ts
```

### Отладка тестов в VS Code

1. Откройте файл теста
2. Установите точки останова
3. Выберите конфигурацию "Debug Jest Tests"
4. Нажмите "Start Debugging"

### Логирование в тестах

Используйте console.log в тестах для отладки:

```typescript
it('should handle user login', async () => {
  console.log('Starting login test');

  const result = await UserService.login('test@example.com', 'password');
  console.log('Login result:', result);

  expect(result).toBeDefined();
});
```

## Решение常见ых проблем

### Ошибка "Cannot connect to development server"

1. Проверьте, запущен ли Metro bundler
2. Перезапустите приложение: `npm start --reset-cache`
3. Проверьте порты в конфигурации

### Ошибка "Native module cannot be null"

1. Установите зависимости: `npm install`
2. Перезапустите Metro bundler
3. Очистите кэш: `npm start --reset-cache`

### Ошибка "Network request failed"

1. Проверьте подключение к интернету
2. Проверьте URL API
3. Проверьте CORS настройки сервера

### Ошибка "Invariant Violation: Element type is invalid"

1. Проверьте импорты компонентов
2. Убедитесь, что компоненты правильно экспортируются
3. Проверьте пути к компонентам

### Ошибка "TypeError: Cannot read property 'X' of undefined"

1. Проверьте, что объект не null или undefined
2. Используйте опциональную цепочку: `user?.name`
3. Добавьте проверки на существование объектов

## Best Practices

### 1. Систематический подход

- Используйте несколько инструментов отладки одновременно
- Добавляйте логирование в ключевых точках приложения
- Создавайте воспроизводимые сценарии для ошибок

### 2. Профилирование

- Регулярно профилируйте производительность
- Идентифицируйте узкие места в коде
- Оптимизируйте критические участки

### 3. Мониторинг

- Мониторьте использование памяти
- Отслеживайте сетевые запросы
- Анализируйте логи ошибок

### 4. Документирование

- Документируйте найденные ошибки и их решения
- Создавайте чек-листы для отладки
- Делитесь знаниями с командой
