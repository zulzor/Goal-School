# Система локализации и мультиязычная поддержка

## Обзор

Этот документ описывает реализацию системы локализации и мультиязычной поддержки в приложении футбольной школы Arsenal. Система позволяет пользователям переключаться между различными языками интерфейса.

## Поддерживаемые языки

На данный момент поддерживаются следующие языки:

- Русский (ru)
- Английский (en)

## Архитектура

### Сервис локализации

Система реализована через сервис `LocalizationService`, который предоставляет следующие функции:

1. **Хранение выбранного языка** - сохранение и загрузка предпочитаемого языка пользователя
2. **Переводы** - предоставление переводов для различных строк интерфейса
3. **Управление языками** - переключение между поддерживаемыми языками

### Hook для React

Для удобного использования в компонентах React создан hook `useLocalization`, который предоставляет:

- Текущий язык приложения
- Функции для переключения языков
- Функции для получения переводов

### Компонент выбора языка

Создан компонент `LanguageSelector` для удобного переключения языков в интерфейсе приложения.

## Реализация

### Сервис LocalizationService

Сервис находится в файле `src/services/LocalizationService.ts` и включает следующие функции:

```typescript
// Получение текущего языка
getCurrentLanguage(): Promise<SupportedLanguage>

// Установка языка
setLanguage(language: SupportedLanguage): Promise<boolean>

// Получение перевода для ключа
t(key: string, language?: SupportedLanguage): string

// Получение всех переводов для языка
getTranslations(language: SupportedLanguage): Record<string, string>
```

### Hook useLocalization

Hook находится в файле `src/hooks/useLocalization.ts` и предоставляет следующий интерфейс:

```typescript
const {
  language, // Текущий язык
  translations, // Все переводы для текущего языка
  loading, // Состояние загрузки
  changeLanguage, // Функция для изменения языка
  t, // Функция для получения перевода по ключу
  refresh, // Функция для обновления данных
} = useLocalization();
```

### Компонент LanguageSelector

Компонент находится в файле `src/components/LanguageSelector.tsx` и предоставляет пользовательский интерфейс для выбора языка.

## Использование

### Получение текущего языка

```typescript
import { LocalizationService } from '../services';

const currentLanguage = await LocalizationService.getCurrentLanguage();
```

### Установка языка

```typescript
import { LocalizationService } from '../services';

await LocalizationService.setLanguage('en');
```

### Получение перевода

```typescript
import { LocalizationService } from '../services';

const welcomeText = LocalizationService.t('welcome', 'en');
// Результат: "Welcome"
```

### Использование в компонентах React

Для использования в компонентах React рекомендуется использовать hook `useLocalization`:

```typescript
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

const MyComponent: React.FC = () => {
  const { t, language, changeLanguage } = useLocalization();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>Текущий язык: {language}</p>
      <button onClick={() => changeLanguage('en')}>
        Переключить на английский
      </button>
      <button onClick={() => changeLanguage('ru')}>
        Переключить на русский
      </button>
    </div>
  );
};
```

### Использование компонента выбора языка

```typescript
import React, { useState } from 'react';
import { LanguageSelector } from '../components/LanguageSelector';
import { IconButton } from 'react-native-paper';

const Header: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <div>
      <IconButton
        icon="translate"
        onPress={() => setMenuVisible(true)}
      />
      <LanguageSelector
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <IconButton
            icon="translate"
            onPress={() => setMenuVisible(true)}
          />
        }
      />
    </div>
  );
};
```

## Добавление новых языков

Для добавления новых языков необходимо:

1. Добавить код языка в тип `SupportedLanguage` в `LocalizationService.ts`
2. Добавить код языка в массив `SUPPORTED_LANGUAGES`
3. Добавить словарь переводов для нового языка в объект `translations`
4. Обновить компонент `LanguageSelector` для отображения нового языка

Пример добавления немецкого языка:

```typescript
// В LocalizationService.ts
export type SupportedLanguage = 'ru' | 'en' | 'de';
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['ru', 'en', 'de'];

const translations = {
  ru: {
    // ... существующие переводы
  },
  en: {
    // ... существующие переводы
  },
  de: {
    welcome: 'Willkommen',
    home: 'Startseite',
    // ... остальные переводы
  },
};
```

## Тестирование

Для сервиса локализации созданы unit-тесты, которые проверяют все основные функции сервиса. Тесты находятся в файле `src/services/__tests__/LocalizationService.test.ts`.

### Запуск тестов

```bash
npm test src/services/__tests__/LocalizationService.test.ts
```

## Планы по улучшению

1. **Расширение языковой поддержки** - добавление новых языков
2. **Динамическая загрузка переводов** - загрузка переводов по мере необходимости
3. **Автоматическое определение языка** - определение языка на основе настроек устройства
4. **Редактирование переводов** - возможность редактирования переводов через админ-панель
5. **Экспорт/импорт переводов** - возможность экспорта и импорта словарей переводов

## Безопасность

Система локализации реализует следующие меры безопасности:

1. **Валидация языков** - проверка, что запрашиваемый язык поддерживается
2. **Обработка ошибок** - корректная обработка ошибок при работе с AsyncStorage
3. **Фолбэк на язык по умолчанию** - использование русского языка по умолчанию при ошибках

## Производительность

Для обеспечения высокой производительности реализованы следующие оптимизации:

1. **Кэширование переводов** - переводы загружаются один раз и кэшируются
2. **Ленивая загрузка** - язык загружается только при необходимости
3. **Мемоизация** - оптимизация повторных вызовов функций

## Совместимость

Система локализации совместима со следующими платформами:

- iOS
- Android
- Web

Система использует AsyncStorage для хранения выбранного языка, что обеспечивает совместимость со всеми поддерживаемыми платформами.
