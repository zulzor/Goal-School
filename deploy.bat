@echo off
title Деплой приложения Футбольная Школа

REM Проверка аргументов
if "%1"=="" goto help
if "%1"=="web" goto build_web
if "%1"=="android" goto build_android
if "%1"=="ios" goto build_ios

:help
echo 📦 Скрипт автоматического деплоя приложения "Футбольная Школа"
echo.
echo ℹ️  Доступные команды:
echo    deploy.bat web      - Сборка веб-версии
echo    deploy.bat android  - Сборка Android APK
echo    deploy.bat ios      - Сборка iOS IPA
echo.
echo 🔧 Перед запуском убедитесь, что:
echo    1. Все зависимости установлены (npm install)
echo    2. У вас есть аккаунты в соответствующих сервисах
goto end

:build_web
echo 🌐 Сборка веб-версии...
npx expo build:web
if %errorlevel% neq 0 (
    echo ❌ Ошибка сборки веб-версии
    pause
    exit /b 1
)

echo ✅ Веб-версия собрана успешно!
echo 📁 Файлы находятся в папке "web-build"
echo 📋 Следующие шаги:
echo    1. Загрузите содержимое папки "web-build" на ваш хостинг
echo    2. Настройте статический хостинг
echo    3. Привяжите домен (опционально)
goto end

:build_android
echo 🤖 Сборка Android APK...

REM Проверка наличия EAS CLI
eas --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Установка EAS CLI...
    npm install -g eas-cli
)

echo 🔐 Вход в Expo (если требуется)...
npx eas login

echo 🔨 Сборка APK...
npx eas build --platform android --profile production
if %errorlevel% neq 0 (
    echo ❌ Ошибка сборки APK
    pause
    exit /b 1
)

echo ✅ APK собран успешно!
echo 📋 Следующие шаги:
echo    1. Перейдите в RuStore Console
echo    2. Создайте новое приложение
echo    3. Загрузите APK файл
echo    4. Заполните метаданные приложения
echo    5. Отправьте на модерацию
goto end

:build_ios
echo 📱 Сборка iOS IPA...

REM Проверка наличия EAS CLI
eas --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Установка EAS CLI...
    npm install -g eas-cli
)

echo 🔐 Вход в Expo (если требуется)...
npx eas login

echo 🔨 Сборка IPA...
npx eas build --platform ios --profile production
if %errorlevel% neq 0 (
    echo ❌ Ошибка сборки IPA
    pause
    exit /b 1
)

echo ✅ IPA собран успешно!
echo 📋 Следующие шаги:
echo    1. Перейдите в App Store Connect
echo    2. Создайте новое приложение
echo    3. Загрузите IPA файл
echo    4. Заполните метаданные приложения
echo    5. Отправьте на модерацию
goto end

:end
echo 🎉 Развертывание завершено!
pause