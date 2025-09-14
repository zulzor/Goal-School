# 📶 РЕАЛИЗАЦИЯ OFFLINE-РЕЖИМА

## 🎯 ЦЕЛЬ

Реализация offline-режима в приложении футбольной школы для обеспечения доступности контента при отсутствии интернет-соединения.

## 🏗️ АРХИТЕКТУРА

### Компоненты

1. **NetworkUtils** - утилиты для работы с сетью и кэширования
2. **NetworkContext** - контекст для управления состоянием сети
3. **NetworkStatusIndicator** - компонент для отображения состояния сети
4. **Обновленные сервисы** - сервисы с поддержкой offline-кэширования

### Зависимости

- `@react-native-community/netinfo` - для проверки состояния сети
- `@react-native-async-storage/async-storage` - для локального хранения данных

## 📁 СТРУКТУРА ФАЙЛОВ

```
src/
├── utils/
│   └── networkUtils.ts
├── context/
│   └── NetworkContext.tsx
├── components/
│   └── NetworkStatusIndicator.tsx
├── services/
│   ├── NewsService.ts (обновлен)
│   └── NutritionService.ts (обновлен)
└── screens/
    ├── NewsScreen.tsx (обновлен)
    └── NutritionScreen.tsx (обновлен)
```

## 🔧 РЕАЛИЗАЦИЯ

### 1. NetworkUtils

Реализует функции для:

- Проверки состояния сети
- Кэширования данных
- Получения кэшированных данных
- Выполнения сетевых запросов с fallback на кэш

#### Основные функции:

```typescript
// Проверка состояния сети
const networkState = await checkNetworkState();

// Кэширование данных
await cacheData('news', newsData);

// Получение кэшированных данных
const cachedNews = await getCachedData<News[]>('news', 120); // 120 минут

// Выполнение запроса с fallback на кэш
const { data, isFromCache, error } = await fetchWithOfflineFallback<News[]>(
  'news',
  fetchNewsFunction,
  120 // Кэш действует 2 часа
);
```

### 2. NetworkContext

Контекст предоставляет:

- Текущее состояние сети (подключен/не подключен)
- Тип соединения (Wi-Fi, мобильная сеть и т.д.)
- Возможность ручной проверки соединения
- Автоматическое обновление состояния при изменениях

#### Использование:

```typescript
import { useNetwork } from '../context/NetworkContext';

const MyComponent = () => {
  const { isConnected, isInternetReachable, networkType, checkConnection } = useNetwork();

  // Проверка соединения
  const handleCheckConnection = async () => {
    await checkConnection();
  };

  return (
    <View>
      <Text>Состояние: {isConnected ? 'Подключен' : 'Не подключен'}</Text>
      <Text>Тип сети: {networkType}</Text>
      <Button onPress={handleCheckConnection} title="Проверить соединение" />
    </View>
  );
};
```

### 3. NetworkStatusIndicator

Компонент для визуального отображения состояния сети:

- Цветовая индикация (зеленый - подключено, красный - нет соединения)
- Тип соединения
- Анимация при проверке соединения

#### Использование:

```typescript
import { NetworkStatusIndicator } from '../components/NetworkStatusIndicator';

const MyScreen = () => {
  return (
    <View>
      <NetworkStatusIndicator />
      {/* Остальной контент */}
    </View>
  );
};
```

### 4. Обновленные сервисы

Сервисы теперь используют механизм offline-кэширования:

#### NewsService

```typescript
// Получение новостей с fallback на кэш
static async getNews(): Promise<News[]> {
  const { data, isFromCache, error } = await fetchWithOfflineFallback<News[]>(
    'news',
    fetchNewsFunction,
    120 // Кэш действует 2 часа
  );

  if (error) throw error;
  return data || [];
}
```

#### NutritionService

```typescript
// Получение рекомендаций по питанию с fallback на кэш
static async getNutritionRecommendations(): Promise<NutritionRecommendation[]> {
  const { data, isFromCache, error } = await fetchWithOfflineFallback<NutritionRecommendation[]>(
    'nutrition',
    fetchNutritionFunction,
    180 // Кэш действует 3 часа
  );

  if (error) throw error;
  return data || [];
}
```

## 🔄 МЕХАНИЗМ РАБОТЫ

1. **При запуске приложения:**
   - Загружается сохраненное состояние сети из AsyncStorage
   - Выполняется проверка текущего состояния сети
   - Подписка на изменения состояния сети

2. **При выполнении сетевого запроса:**
   - Сначала выполняется сетевой запрос
   - Если запрос успешен, данные кэшируются
   - Если запрос не удался, пробуем получить данные из кэша
   - Если и кэш пуст, возвращаем ошибку

3. **При изменении данных:**
   - После создания/обновления/удаления данных кэш очищается
   - Это гарантирует актуальность данных при следующей загрузке

4. **Периодическая проверка:**
   - Состояние сети проверяется каждые 30 секунд
   - Сохраняется в AsyncStorage для использования при следующем запуске

## 🧪 ТЕСТИРОВАНИЕ

### Сценарии тестирования:

1. **Нормальный режим работы:**
   - Приложение запускается с интернет-соединением
   - Данные загружаются из сети и кэшируются
   - При повторной загрузке используются свежие данные

2. **Offline-режим:**
   - Приложение запускается без интернет-соединения
   - Используются кэшированные данные
   - Отображается соответствующее сообщение

3. **Переход из offline в online:**
   - При восстановлении соединения данные обновляются
   - Кэш обновляется свежими данными

4. **Устаревшие данные:**
   - Кэшированные данные старше установленного срока удаляются
   - При отсутствии свежих данных и кэша отображается ошибка

### Тестовые данные:

- **Новости:** кэш действует 2 часа
- **Питание:** кэш действует 3 часа
- **Другие данные:** настраивается индивидуально

## 🛠️ НАСТРОЙКА

### Установка зависимостей:

```bash
npm install @react-native-community/netinfo
# или
yarn add @react-native-community/netinfo
```

### Для iOS:

```bash
cd ios && pod install
```

### Для Android:

Нет дополнительных шагов

## 🔒 БЕЗОПАСНОСТЬ

### Хранение данных:

- Кэшированные данные хранятся в AsyncStorage
- Не содержат персональных данных
- Автоматически удаляются при устаревании

### Приватность:

- Состояние сети не передается на сервер
- Используются только локальные проверки

## 📈 ПРОИЗВОДИТЕЛЬНОСТЬ

### Ограничения:

- Размер кэша ограничен возможностями AsyncStorage
- Рекомендуется кэшировать только необходимые данные

### Оптимизации:

- Автоматическая очистка устаревших данных
- Индивидуальная настройка времени жизни кэша для разных типов данных
- Минимизация количества сетевых запросов

## 🐛 ОТЛАДКА

### Логирование:

Все ошибки и состояния логируются в консоль разработчика:

```javascript
console.log('Состояние сети:', networkState);
console.error('Ошибка сети:', error);
```

### Частые проблемы:

1. **Неправильное определение состояния сети:**
   - Проверить настройки эмулятора/устройства
   - Убедиться в правильной установке netinfo

2. **Устаревшие кэшированные данные:**
   - Проверить время жизни кэша
   - Очистить кэш вручную при необходимости

3. **Проблемы с AsyncStorage:**
   - Проверить доступ к хранилищу
   - Убедиться в наличии свободного места

## 📚 ДОПОЛНИТЕЛЬНЫЕ РЕСУРСЫ

- [React Native Netinfo Documentation](https://github.com/react-native-netinfo/react-native-netinfo)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)
- [React Native Offline Patterns](https://reactnative.dev/docs/network)

---

_Последнее обновление: 2025-09-05_
