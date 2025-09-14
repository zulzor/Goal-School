# 🚀 Настройка Supabase для приложения футбольной школы

## 1. Создание проекта в Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите "Start your project"
3. Войдите через GitHub
4. Создайте новую организацию или выберите существующую
5. Создайте новый проект:
   - Название: `football-school-app`
   - База данных: `football_school`
   - Регион: `West EU (London)` (ближайший к России)

## 2. Получение ключей API

После создания проекта:

1. Перейдите в Settings → API
2. Скопируйте:
   - **Project URL** (например: `https://your-project.supabase.co`)
   - **anon/public key** (начинается с `eyJ...`)

## 3. Настройка конфигурации

Откройте файл `src/config/supabase.ts` и замените:

```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL'; // Ваш Project URL
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Ваш anon key
```

## 4. Создание схемы базы данных

1. В Supabase перейдите в SQL Editor
2. Скопируйте содержимое файла `database_schema.sql`
3. Вставьте в редактор и нажмите "Run"

Это создаст:

- ✅ Таблицы для пользователей, тренировок, новостей
- ✅ Индексы для производительности
- ✅ Политики безопасности (RLS)
- ✅ Триггеры для автоматизации

## 5. Настройка аутентификации

В Supabase Dashboard:

1. Перейдите в Authentication → Settings
2. Включите провайдеров:
   - ✅ Email (уже включен)
   - ✅ Phone (опционально)
   - ✅ Google (опционально)

## 6. Тестирование подключения

После настройки:

1. Перезапустите приложение
2. Попробуйте зарегистрироваться
3. Данные должны появиться в Supabase Dashboard

## 7. Добавление тестовых данных

Выполните в SQL Editor:

```sql
-- Добавление тестовых тренировок
INSERT INTO trainings (title, description, date, start_time, end_time, location, coach_id, age_group, type) VALUES
('Техническая тренировка U-10', 'Работа с мячом, дриблинг', '2025-09-10', '10:00', '11:30', 'Поле A', (SELECT id FROM profiles WHERE role = 'coach' LIMIT 1), 'U-10', 'training'),
('Матч U-12 vs Спартак', 'Товарищеский матч', '2025-09-12', '15:00', '17:00', 'Главное поле', (SELECT id FROM profiles WHERE role = 'coach' LIMIT 1), 'U-12', 'match');

-- Добавление тестовых новостей
INSERT INTO news (title, content, excerpt, author_id, is_important) VALUES
('Открытие нового сезона!', 'Начинаем новый футбольный сезон с большими планами...', 'Новый сезон стартует 1 сентября', (SELECT id FROM profiles WHERE role = 'manager' LIMIT 1), true),
('Расписание изменений', 'Небольшие изменения в расписании тренировок...', 'Обновленное расписание', (SELECT id FROM profiles WHERE role = 'manager' LIMIT 1), false);
```

## 8. Настройка Storage (для изображений)

1. Перейдите в Storage
2. Создайте bucket: `avatars`
3. Создайте bucket: `news-images`
4. Настройте политики доступа

## 🎯 Готово!

Теперь ваше приложение использует настоящую базу данных Supabase!

**Следующие шаги:**

- 📱 Тестирование всех функций
- 🎨 Добавление реальных данных
- 🚀 Развертывание в продакшн

## 🔧 Полезные команды

```bash
# Установка Supabase CLI (опционально)
npm install -g supabase

# Инициализация проекта
supabase init

# Запуск локального Supabase
supabase start
```

## 📚 Документация

- [Supabase Docs](https://supabase.com/docs)
- [React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [Authentication](https://supabase.com/docs/guides/auth)
