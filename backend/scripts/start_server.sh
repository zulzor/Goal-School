#!/bin/bash
# backend/scripts/start_server.sh - Скрипт запуска сервера разработки

echo "Запуск сервера разработки для API футбольной школы..."

# Переход в директорию backend
cd "$(dirname "$0")/.."

# Запуск встроенного сервера PHP
php -S localhost:8080 -t ./

echo "Сервер запущен на http://localhost:8080"
echo "API доступно по адресу http://localhost:8080/api"
echo "Нажмите Ctrl+C для остановки сервера"