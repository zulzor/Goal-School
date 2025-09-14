
# Создание APK для RuStore

## Шаг 1: Установка необходимых инструментов

1. Установите Android Studio с официального сайта: https://developer.android.com/studio
2. Во время установки выберите установку Android SDK и Android Virtual Device (AVD)

## Шаг 2: Настройка переменных окружения

1. Добавьте следующие переменные окружения:
   - ANDROID_HOME: путь к папке Android SDK (обычно C:\Users\[Ваше имя]\AppData\Local\Android\Sdk)
   - JAVA_HOME: путь к JDK (обычно C:\Program Files\Java\jdk-11.x.x)

2. Добавьте в переменную PATH:
   - %ANDROID_HOME%\platform-tools
   - %ANDROID_HOME%\tools
   - %ANDROID_HOME%\tools\bin

## Шаг 3: Создание Android проекта

1. Откройте терминал в корневой папке проекта
2. Выполните команду:
   npx expo prebuild

## Шаг 4: Сборка APK

1. Перейдите в папку android:
   cd android

2. Выполните команду сборки:
   .\gradlew.bat assembleRelease

## Шаг 5: Нахождение APK

После успешной сборки APK будет находиться по адресу:
android\app\build\outputs\apk\release\app-release.apk

## Шаг 6: Загрузка в RuStore

1. Создайте аккаунт разработчика в RuStore: https://www.rustore.ru/dev/
2. Подготовьте необходимые материалы:
   - Иконки приложения (разных размеров)
   - Скриншоты приложения
   - Описание приложения
   - Политика конфиденциальности
3. Загрузите APK файл через кабинет разработчика

## Альтернативный способ: Использование EAS Build

Если у вас возникают проблемы с локальной сборкой, вы можете использовать облачную сборку:

1. Войдите в EAS:
   npx eas login

2. Запустите сборку:
   npx eas build --platform android

3. Скачайте APK после завершения сборки
