#!/bin/bash

# Скрипт автоматического деплоя приложения "Футбольная Школа"

case "$1" in
    "web")
        echo "🌐 Сборка веб-версии..."
        npx expo build:web
        
        echo "✅ Веб-версия собрана успешно!"
        echo "📁 Файлы находятся в папке 'web-build'"
        echo "📋 Следующие шаги:"
        echo "   1. Загрузите содержимое папки 'web-build' на ваш хостинг"
        echo "   2. Настройте статический хостинг"
        echo "   3. Привяжите домен (опционально)"
        ;;
        
    "android")
        echo "🤖 Сборка Android APK..."
        
        # Проверка наличия EAS CLI
        if ! command -v eas &> /dev/null; then
            echo "📦 Установка EAS CLI..."
            npm install -g eas-cli
        fi
        
        echo "🔐 Вход в Expo (если требуется)..."
        npx eas login
        
        echo "🔨 Сборка APK..."
        npx eas build --platform android --profile production
        
        echo "✅ APK собран успешно!"
        echo "📋 Следующие шаги:"
        echo "   1. Перейдите в RuStore Console"
        echo "   2. Создайте новое приложение"
        echo "   3. Загрузите APK файл"
        echo "   4. Заполните метаданные приложения"
        echo "   5. Отправьте на модерацию"
        ;;
        
    "ios")
        echo "📱 Сборка iOS IPA..."
        
        # Проверка наличия EAS CLI
        if ! command -v eas &> /dev/null; then
            echo "📦 Установка EAS CLI..."
            npm install -g eas-cli
        fi
        
        echo "🔐 Вход в Expo (если требуется)..."
        npx eas login
        
        echo "🔨 Сборка IPA..."
        npx eas build --platform ios --profile production
        
        echo "✅ IPA собран успешно!"
        echo "📋 Следующие шаги:"
        echo "   1. Перейдите в App Store Connect"
        echo "   2. Создайте новое приложение"
        echo "   3. Загрузите IPA файл"
        echo "   4. Заполните метаданные приложения"
        echo "   5. Отправьте на модерацию"
        ;;
        
    *)
        echo "ℹ️  Доступные команды:"
        echo "   ./deploy.sh web      - Сборка веб-версии"
        echo "   ./deploy.sh android  - Сборка Android APK"
        echo "   ./deploy.sh ios      - Сборка iOS IPA"
        echo ""
        echo "🔧 Перед запуском убедитесь, что:"
        echo "   1. Все зависимости установлены (npm install)"
        echo "   2. У вас есть аккаунты в соответствующих сервисах"
        ;;
esac

echo "🎉 Развертывание завершено!"