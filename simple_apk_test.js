const fs = require('fs');
const path = require('path');

// Создаем простую структуру для тестового APK
console.log('Создание тестового APK...');

// Создаем папку для тестового APK если её нет
const testApkDir = path.join(__dirname, 'test-apk');
if (!fs.existsSync(testApkDir)) {
  fs.mkdirSync(testApkDir);
}

// Создаем простой манифест
const manifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.goalschool.test">
    
    <application
        android:label="Тест Футбольная школа Arsenal">
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

fs.writeFileSync(path.join(testApkDir, 'AndroidManifest.xml'), manifest);

// Создаем простой HTML файл как содержимое приложения
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Футбольная школа Arsenal</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background-color: #f0f0f0;
        }
        .container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            max-width: 500px;
            margin: 0 auto;
        }
        h1 {
            color: #EF0107; /* Красный цвет Arsenal */
        }
        .info {
            background-color: #e3f2fd;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Футбольная школа Arsenal</h1>
        <div class="info">
            <p>Тестовое приложение успешно создано!</p>
            <p>Это демонстрационный APK для проверки процесса сборки.</p>
        </div>
        <p>Для полноценного приложения используйте основной проект после установки Android инструментов.</p>
    </div>
</body>
</html>`;

fs.writeFileSync(path.join(testApkDir, 'index.html'), htmlContent);

// Создаем README файл с инструкциями
const readme = `# Тестовый APK

Это тестовый APK для проверки процесса сборки.

## Важно

Это НЕ полноценное приложение. Это минимальный тест для проверки возможности создания APK.

Для создания полноценного APK приложения футбольной школы "Арсенал" необходимо:

1. Установить Java Development Kit (JDK)
2. Установить Android SDK
3. Запустить скрипт build_apk.bat

## Следующие шаги

1. Запустите install_java_android_sdk.bat для установки необходимых инструментов
2. После установки запустите build_apk.bat для сборки полноценного APK
`;

fs.writeFileSync(path.join(testApkDir, 'README.txt'), readme);

console.log('Тестовый APK создан успешно!');
console.log('Файлы находятся в папке: test-apk');
console.log('Для создания полноценного APK следуйте инструкциям в README.md');
