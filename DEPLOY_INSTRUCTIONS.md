# Инструкции по деплою приложения "Футбольная Школа" в России

## 🚀 Бесплатные способы деплоя доступные в России

### 1. Веб-версия приложения

#### А. Vercel (Рекомендуется)

1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Подключите GitHub репозиторий
3. Vercel автоматически определит настройки для Expo
4. Приложение будет доступно по URL: `https://your-app.vercel.app`

```bash
# Установите Vercel CLI
npm i -g vercel

# Деплой
cd GoalSchoolApp
vercel --prod
```

#### Б. Netlify

1. Зарегистрируйтесь на [netlify.com](https://netlify.com)
2. Подключите GitHub репозиторий
3. Настройки сборки:
   - Build command: `npm run build`
   - Publish directory: `dist`

#### В. GitHub Pages

1. Создайте репозиторий на GitHub
2. Включите GitHub Pages в настройках
3. Добавьте GitHub Action для автодеплоя

### 2. Мобильное приложение

#### А. Expo Go (Для тестирования)

```bash
# Запустите сервер разработки
npx expo start

# Отсканируйте QR-код приложением Expo Go
```

#### Б. APK для Android (Бесплатно)

```bash
# Установите EAS CLI
npm install -g @expo/eas-cli

# Войдите в аккаунт Expo
eas login

# Создайте APK
eas build --platform android --profile preview

# Скачайте готовый APK файл
```

#### В. Публикация в Google Play

1. Зарегистрируйте аккаунт разработчика ($25 одноразово)
2. Создайте production сборку:

```bash
eas build --platform android --profile production
```

3. Загрузите в Google Play Console

### 3. Backend и база данных

#### А. Supabase (Рекомендуется для России)

- PostgreSQL база данных
- Аутентификация
- Real-time subscriptions
- File storage
- **Бесплатный тариф**: 500MB БД, 2GB bandwidth

1. Зарегистрируйтесь на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Получите URL и API ключи
4. Добавьте в код приложения

#### Б. Firebase (Альтернатива)

- NoSQL база данных
- Аутентификация
- Cloud Functions
- Push-уведомления

### 4. Альтернативы для России

#### А. Российские облачные платформы

- **Yandex Cloud** - есть бесплатный тариф

- **SberCloud** - корпоративные решения

#### Б. Собственный сервер

- **VPS хостинг** от российских провайдеров
- **Shared хостинг** с поддержкой Node.js

## 📱 Полная схема деплоя

### Шаг 1: Подготовка

```bash
cd GoalSchoolApp
npm install
```

### Шаг 2: Веб-версия

```bash
# Установите веб-зависимости
npx expo install react-dom react-native-web @expo/metro-runtime

# Соберите веб-версию
npm run build

# Деплой на Vercel
vercel --prod
```

### Шаг 3: Мобильное приложение

```bash
# Создайте аккаунт Expo
eas login

# Настройте проект
eas build:configure

# Соберите APK
eas build --platform android --profile preview
```

### Шаг 4: Backend

1. Создайте проект в Supabase
2. Настройте таблицы для пользователей, тренировок, новостей
3. Добавьте API endpoints в приложение

## 🔧 Настройка для production

### app.config.js

```javascript
export default {
  expo: {
    name: 'Футбольная Школа',
    slug: 'goal-school-app',
    version: '1.0.0',
    platforms: ['ios', 'android', 'web'],
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    android: {
      package: 'com.goalschool.app',
      versionCode: 1,
    },
    ios: {
      bundleIdentifier: 'com.goalschool.app',
    },
  },
};
```

### eas.json

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

## 💰 Стоимость

### Бесплатно:

- Vercel/Netlify для веб-версии
- Expo Go для тестирования
- Supabase (до 500MB)
- GitHub/GitLab репозиторий

### Платно:

- Google Play Developer ($25 одноразово)
- Apple Developer Program ($99/год)
- Расширенные тарифы облачных сервисов

## 🛡️ Безопасность для России

1. **Локализация данных** - используйте российские дата-центры
2. **Соответствие 152-ФЗ** - для персональных данных
3. **Резервные домены** - на случай блокировок
4. **VPN-ready** - приложение должно работать через VPN

## 📞 Поддержка

При возникновении вопросов:

1. Проверьте документацию Expo
2. Обратитесь к сообществу React Native Russia
3. Создайте issue в репозитории проекта

---

**Готово!** Ваше приложение для футбольной школы готово к деплою! 🎉
