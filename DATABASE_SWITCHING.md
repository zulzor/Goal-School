# Переключение между базами данных

## Введение

Приложение Goal School поддерживает два типа баз данных:

1. **Локальное хранилище** - используется по умолчанию, данные хранятся на устройстве с помощью AsyncStorage
2. **PostgreSQL** - облачная база данных, поддерживает синхронизацию между устройствами

## Переключение через интерфейс

### Для администраторов

1. Войдите в приложение с учетной записью администратора
2. Перейдите в "Админ-панель" → "База данных"
3. Выберите нужный тип базы данных:
   - "Локальная база данных" - для использования локального хранилища
   - "PostgreSQL" - для использования облачной базы данных
4. При выборе PostgreSQL:
   - Проверьте подключение с помощью кнопки "Проверить подключение"
   - При необходимости создайте тестового пользователя

### Для обычных пользователей

Обычные пользователи не могут переключать тип базы данных. Это может сделать только администратор через админ-панель.

## Переключение через переменные окружения

### Установка типа базы данных

Установите переменную окружения `DATABASE_TYPE`:

```env
# Для локального хранилища
DATABASE_TYPE=local

# Для PostgreSQL
DATABASE_TYPE=postgresql
```

### Конфигурация PostgreSQL

При использовании PostgreSQL необходимо настроить параметры подключения:

```env
# PostgreSQL Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_SSL=true
```

## Техническая реализация

### DatabaseContext

Переключение между базами данных реализовано через [DatabaseContext](src/context/DatabaseContext.tsx):

```typescript
// src/context/DatabaseContext.tsx
type DatabaseType = 'local' | 'postgresql';

interface DatabaseContextType {
  databaseType: DatabaseType;
  isPostgreSQLAvailable: boolean;
  setDatabaseType: (type: DatabaseType) => void;
  checkPostgreSQLAvailability: () => Promise<boolean>;
}
```

### AuthProviderSelector

В [App.tsx](App.tsx) используется компонент [AuthProviderSelector](App.tsx), который выбирает правильный провайдер аутентификации в зависимости от типа базы данных:

```typescript
// App.tsx
const AuthProviderSelector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { databaseType } = useDatabase();

  if (databaseType === 'postgresql') {
    return <PostgreSQLAuthProvider>{children}</PostgreSQLAuthProvider>;
  }

  return <LocalStorageAuthProvider>{children}</LocalStorageAuthProvider>;
};
```

### Условная навигация

В [AppNavigator.tsx](src/navigation/AppNavigator.tsx) экран настроек базы данных отображается только для администраторов:

```typescript
// src/navigation/AppNavigator.tsx
{(currentUser?.role === 'manager' || currentUser?.role === 'admin') && (
  <Tab.Screen
    name="Database"
    component={DatabaseSettingsScreen}
    options={{ title: 'База данных' }}
  />
)}
```

## Миграция данных

### С локального хранилища на PostgreSQL

1. Убедитесь, что PostgreSQL настроен и доступен
2. Переключите тип базы данных на PostgreSQL через админ-панель
3. Приложение автоматически создаст необходимые таблицы
4. Существующие данные останутся в локальном хранилище

Для переноса данных создайте скрипт миграции:

```javascript
// scripts/migrate-to-postgresql.js
const { PostgreSQLUserService } = require('../src/services/PostgreSQLUserService');
// Импортируйте другие сервисы по необходимости

async function migrateData() {
  // Получите данные из локального хранилища
  // Перенесите их в PostgreSQL
}
```

### С PostgreSQL на локальное хранилище

1. Переключите тип базы данных на "Локальная база данных" через админ-панель
2. Приложение начнет использовать локальное хранилище
3. Данные, созданные в PostgreSQL, не будут доступны в локальном хранилище

## Проверка доступности

### PostgreSQL

При выборе PostgreSQL приложение автоматически проверяет доступность базы данных:

```typescript
// src/context/DatabaseContext.tsx
const checkPostgreSQLAvailability = async (): Promise<boolean> => {
  try {
    const isConnected = await checkDatabaseConnection();
    setIsPostgreSQLAvailable(isConnected);
    return isConnected;
  } catch (error) {
    console.error('PostgreSQL availability check failed:', error);
    setIsPostgreSQLAvailable(false);
    return false;
  }
};
```

### Локальное хранилище

Локальное хранилище всегда доступно, так как использует AsyncStorage устройства.

## Обработка ошибок

### Недоступность PostgreSQL

Если PostgreSQL становится недоступным:

1. Приложение показывает сообщение об ошибке
2. Предлагает переключиться на локальное хранилище
3. Сохраняет данные в локальном хранилище до восстановления подключения

### Ошибки переключения

При ошибках переключения:

1. Приложение откатывает изменения
2. Показывает сообщение об ошибке
3. Предлагает повторить попытку или выбрать другой тип базы данных

## Best Practices

### При разработке

1. Тестируйте приложение с обоими типами баз данных
2. Убедитесь, что все функции работают корректно при переключении
3. Проверяйте обработку ошибок подключения

### При развертывании

1. Убедитесь, что переменные окружения правильно настроены
2. Проверьте подключение к базе данных перед переключением
3. Создайте резервные копии данных перед переключением

### Для пользователей

1. Уведомляйте пользователей о переключении типа базы данных
2. Объясните преимущества каждого типа
3. Предоставьте поддержку при возникновении проблем

## Решение常见ых проблем

### PostgreSQL недоступен

1. Проверьте параметры подключения в переменных окружения
2. Убедитесь, что PostgreSQL сервер запущен и доступен
3. Проверьте сетевые настройки и брандмауэр

### Ошибка переключения

1. Проверьте логи приложения
2. Убедитесь, что выбран правильный тип базы данных
3. Попробуйте перезапустить приложение

### Потеря данных

1. Создайте резервные копии перед переключением
2. Используйте скрипты миграции для переноса данных
3. Проверяйте целостность данных после переключения

## Мониторинг

### Логирование

Все операции переключения логгируются:

```typescript
// src/context/DatabaseContext.tsx
useEffect(() => {
  localStorage.setItem('databaseType', databaseType);
  console.log(`Database type switched to: ${databaseType}`);
}, [databaseType]);
```

### Метрики

Мониторятся следующие метрики:

- Частота переключений
- Время переключения
- Ошибки переключения
- Доступность баз данных

## Расширение функциональности

### Добавление новых типов баз данных

1. Создайте новый контекст аутентификации
2. Добавьте новый тип в DatabaseContext
3. Обновите AuthProviderSelector
4. Добавьте новый экран настроек (если необходимо)

### Автоматическое переключение

Реализуйте автоматическое переключение при недоступности текущей базы данных:

```typescript
// src/context/DatabaseContext.tsx
useEffect(() => {
  const checkAvailability = async () => {
    if (databaseType === 'postgresql') {
      const isAvailable = await checkPostgreSQLAvailability();
      if (!isAvailable) {
        // Автоматически переключаемся на локальное хранилище
        setDatabaseType('local');
      }
    }
  };

  const interval = setInterval(checkAvailability, 30000); // Проверяем каждые 30 секунд
  return () => clearInterval(interval);
}, [databaseType]);
```
