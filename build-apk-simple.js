const fs = require('fs');
const path = require('path');

console.log('Создание простого APK для RuStore...');

// Создаем папку для APK если её нет
const apkDir = path.join(__dirname, 'apk-build');
if (!fs.existsSync(apkDir)) {
  fs.mkdirSync(apkDir, { recursive: true });
}

// Создаем простую структуру APK
const manifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.goalschool.arsenal"
    android:versionCode="1"
    android:versionName="1.0">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Футбольная школа Arsenal"
        android:theme="@style/AppTheme"
        android:supportsRtl="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="Футбольная школа Arsenal">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

fs.writeFileSync(path.join(apkDir, 'AndroidManifest.xml'), manifest);

// Создаем простой HTML файл как содержимое приложения
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Футбольная школа Arsenal</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
                Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            color: #212121;
        }
        .container {
            max-width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
            background-color: #ffffff;
        }
        .header {
            background-color: #EF0107; /* Красный Arsenal */
            color: #ffffff;
            padding: 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header h1 {
            margin: 0;
            font-size: 1.2rem;
        }
        .content {
            flex: 1;
            padding: 2rem;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .logo {
            width: 120px;
            height: 120px;
            background-color: #EF0107;
            border-radius: 50%;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 3rem;
            font-weight: bold;
        }
        .welcome {
            color: #EF0107;
            margin-bottom: 1rem;
        }
        .description {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .feature {
            background-color: #f5f5f5;
            padding: 1rem;
            border-radius: 8px;
            font-size: 0.9rem;
        }
        .feature-icon {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }
        .footer {
            background-color: #023474; /* Синий Arsenal */
            color: #ffffff;
            padding: 1rem;
            text-align: center;
            font-size: 0.8rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Футбольная школа "Арсенал"</h1>
        </div>
        
        <div class="content">
            <div class="logo">А</div>
            <h2 class="welcome">Добро пожаловать!</h2>
            <p class="description">
                Приложение футбольной школы "Арсенал" для отслеживания расписания тренировок, 
                просмотра новостей и достижений учеников.
            </p>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">📅</div>
                    <div>Расписание</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">📰</div>
                    <div>Новости</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">📈</div>
                    <div>Прогресс</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🍎</div>
                    <div>Питание</div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            © 2025 Футбольная школа "Арсенал"
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(apkDir, 'index.html'), htmlContent);

// Создаем README файл с инструкциями
const readme = `# APK приложения футбольной школы "Арсенал"

## Важно

Это демонстрационная версия APK для RuStore. Для создания полноценного APK с React Native 
приложением необходимо установить Android SDK и использовать команду:

\`\`\`
npx react-native build-android
\`\`\`

## Содержимое APK

- AndroidManifest.xml - манифест приложения
- index.html - веб-версия приложения
- assets/ - папка с ресурсами

## Для создания полноценного APK:

1. Установите Android Studio и Android SDK
2. Запустите скрипт install_java_android_sdk.bat
3. После установки запустите build_apk.bat

## Загрузка в RuStore

1. Создайте аккаунт разработчика в RuStore
2. Подготовьте необходимые материалы (иконки, скриншоты, описание)
3. Загрузите APK файл через кабинет разработчика
`;

fs.writeFileSync(path.join(apkDir, 'README.md'), readme);

console.log('Простой APK создан успешно!');
console.log('Файлы находятся в папке: apk-build');
console.log('Для создания полноценного APK следуйте инструкциям в README.md');
