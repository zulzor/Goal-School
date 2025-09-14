# Установка инструментов для создания APK

## Шаг 1: Установка Android Studio

1. Перейдите на официальный сайт Android Studio: https://developer.android.com/studio
2. Скачайте установщик для Windows
3. Запустите установщик и следуйте инструкциям:
   - Выберите "Standard" установку
   - Установите все компоненты по умолчанию
   - Дождитесь завершения установки

## Шаг 2: Настройка переменных окружения

1. Найдите путь к Android SDK (обычно это `C:\Users\[Ваше имя]\AppData\Local\Android\Sdk`)
2. Найдите путь к JDK (обычно это `C:\Program Files\Java\jdk-11.x.x`)

3. Добавьте следующие переменные окружения:

   - ANDROID_HOME: путь к папке Android SDK
   - JAVA_HOME: путь к JDK

4. Добавьте в переменную PATH:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`
   - `%JAVA_HOME%\bin`

## Шаг 3: Проверка установки

1. Откройте новое окно командной строки
2. Выполните команды:
   ```
   java -version
   adb --version
   ```

## Шаг 4: Создание APK

После установки всех инструментов выполните:

```
node build-apk-improved.js
```

Или вручную:

1. Перейдите в папку `android`
2. Выполните команду: `.\gradlew.bat assembleRelease`
3. APK будет находиться в `android\app\build\outputs\apk\release\`
