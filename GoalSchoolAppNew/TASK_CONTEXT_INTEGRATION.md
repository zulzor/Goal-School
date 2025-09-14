# 📋 ИНТЕГРАЦИЯ СИСТЕМЫ СОХРАНЕНИЯ КОНТЕКСТА ЗАДАЧ

## 🎯 ОПИСАНИЕ

Эта документация описывает интеграцию системы сохранения контекста задач между сессиями чата в мобильное приложение футбольной школы. Система позволяет сохранять состояние задач и восстанавливать его при повторном открытии чата.

## 🏗️ АРХИТЕКТУРА

### Сервисы

- `TaskContextService` - основной сервис для работы с контекстом задач
- `useTaskContext` - React хук для использования сервиса в компонентах

### Компоненты

- `TaskContextPanel` - компонент для отображения панели контекста задач
- `ChatScreen` - пример экрана чата с интеграцией контекста задач

## 📁 СТРУКТУРА ФАЙЛОВ

```
src/
├── services/
│   └── TaskContextService.ts
├── hooks/
│   └── useTaskContext.ts
├── components/
│   └── TaskContextPanel.tsx
├── screens/
│   └── ChatScreen.tsx
└── navigation/
    └── AppNavigator.tsx (обновлен)
```

## 🧠 ОСНОВНЫЕ КОНЦЕПЦИИ

### Контекст задачи (TaskContext)

```typescript
interface TaskContext {
  taskId: string;
  taskTitle: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  lastUpdated: string;
  progress?: number;
  notes?: string;
}
```

### Контекст сессии (ChatSessionContext)

```typescript
interface ChatSessionContext {
  sessionId: string;
  taskContexts: TaskContext[];
  lastAccessed: string;
  chatHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
}
```

## 🚀 ИСПОЛЬЗОВАНИЕ

### 1. Использование TaskContextService

```typescript
import TaskContextService from '../services/TaskContextService';

// Сохранение контекста задач для сессии
await TaskContextService.saveSessionContext(sessionId, taskContexts);

// Загрузка контекста задач для сессии
const contexts = await TaskContextService.loadSessionContext(sessionId);

// Обновление статуса задачи
await TaskContextService.updateTaskStatus(
  sessionId,
  taskId,
  'completed',
  100,
  'Задача выполнена успешно'
);

// Добавление новой задачи в контекст
await TaskContextService.addTaskToContext(sessionId, {
  taskId: 'new_task',
  taskTitle: 'Новая задача',
  status: 'pending',
});
```

### 2. Использование хука useTaskContext

```typescript
import { useTaskContext } from '../hooks/useTaskContext';

const MyComponent = () => {
  const {
    taskContexts,
    loading,
    error,
    saveContext,
    loadContext,
    updateTaskStatus,
    addTaskToContext
  } = useTaskContext();

  // Загрузка контекста при монтировании
  useEffect(() => {
    loadContext('session_12345');
  }, []);

  // Рендеринг
  if (loading) return <Text>Загрузка...</Text>;
  if (error) return <Text>Ошибка: {error}</Text>;

  return (
    <TaskContextPanel
      sessionId="session_12345"
      onTaskSelect={(task) => console.log('Выбрана задача:', task)}
    />
  );
};
```

### 3. Использование компонента TaskContextPanel

```typescript
import { TaskContextPanel } from '../components/TaskContextPanel';

const ChatInterface = () => {
  return (
    <View>
      <TaskContextPanel
        sessionId="session_12345"
        onTaskSelect={(task) => {
          // Обработка выбора задачи
          console.log('Пользователь выбрал задачу:', task.taskTitle);
        }}
      />
      {/* Другие компоненты чата */}
    </View>
  );
};
```

## 🧪 ТЕСТИРОВАНИЕ

### Моковые данные

Система поставляется с моковыми данными для тестирования:

```typescript
const MOCK_TASKS: Omit<TaskContext, 'lastUpdated'>[] = [
  {
    taskId: 'task1',
    taskTitle: 'Проверка функциональности всех экранов приложения',
    status: 'completed',
    progress: 100,
    notes: 'Все экраны протестированы и работают корректно',
  },
  // ... другие задачи
];
```

### Пример использования в ChatScreen

Экран [ChatScreen.tsx](file:///C:/Users/jolab/Desktop/Goal-School/GoalSchoolApp/src/screens/ChatScreen.tsx) демонстрирует полную интеграцию системы:

- Инициализация моковых данных
- Сохранение и загрузка контекста
- Обработка выбора задач
- Отправка сообщений

## 🔧 ИНТЕГРАЦИЯ С ВНЕШНИМ ЧАТОМ

Для интеграции с внешним чатом (например, веб-интерфейсом Qoder):

1. **Генерация Session ID**: Создайте уникальный идентификатор сессии для каждого диалога
2. **Сохранение контекста**: При каждом изменении статуса задачи вызывайте:
   ```javascript
   await TaskContextService.saveSessionContext(sessionId, currentTaskContexts);
   ```
3. **Загрузка контекста**: При открытии нового диалога загружайте сохраненный контекст:
   ```javascript
   const savedContext = await TaskContextService.loadSessionContext(sessionId);
   ```
4. **Обновление статусов**: При выполнении задач через внешний интерфейс обновляйте статусы:
   ```javascript
   await TaskContextService.updateTaskStatus(sessionId, taskId, 'completed', 100);
   ```

## 🛠️ НАСТРОЙКА

### Требования

- `@react-native-async-storage/async-storage` для хранения данных
- React Navigation для навигации (опционально)

### Установка зависимостей

```bash
npm install @react-native-async-storage/async-storage
# или
yarn add @react-native-async-storage/async-storage
```

### Импорты в навигатор

Убедитесь, что добавлен импорт экрана чата в [AppNavigator.tsx](file:///C:/Users/jolab/Desktop/Goal-School/GoalSchoolApp/src/navigation/AppNavigator.tsx):

```typescript
import { ChatScreen } from '../screens/ChatScreen';
```

## 📈 ПРОИЗВОДИТЕЛЬНОСТЬ

### Ограничения

- AsyncStorage имеет ограничения по объему хранимых данных (зависит от платформы)
- Рекомендуется хранить не более 1000 задач в контексте одной сессии

### Оптимизации

- Данные сжимаются в формате JSON перед сохранением
- Автоматическое обновление времени последнего доступа
- Эффективная работа с отдельными задачами

## 🔒 БЕЗОПАСНОСТЬ

### Хранение данных

- Данные хранятся локально на устройстве пользователя
- Не передаются на сервер без согласия пользователя
- Не содержат персональных данных

### Рекомендации

- Регулярно очищайте устаревшие сессии
- Используйте уникальные идентификаторы сессий
- Не храните конфиденциальную информацию в контексте задач

## 🐛 ОТЛАДКА

### Логирование

Все ошибки логируются в консоль разработчика:

```javascript
console.error('Ошибка сохранения контекста задач:', error);
```

### Частые проблемы

1. **Не сохраняются данные**: Проверьте установку AsyncStorage
2. **Пустой контекст**: Убедитесь, что используется правильный sessionId
3. **Ошибки загрузки**: Проверьте формат данных в хранилище

## 📚 ДОПОЛНИТЕЛЬНЫЕ РЕСУРСЫ

- [Документация React Native Async Storage](https://react-native-async-storage.github.io/async-storage/)
- [Документация React Navigation](https://reactnavigation.org/)
- [Документация React Native Paper](https://callstack.github.io/react-native-paper/)

---

_Последнее обновление: 2025-09-05_
