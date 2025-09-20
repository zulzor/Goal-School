@echo off
REM backend/scripts/start_server.bat - Скрипт запуска сервера разработки для Windows

echo Запуск сервера разработки для API футбольной школы...

REM Переход в директорию backend
cd /d "%~dp0\.."

REM Запуск встроенного сервера PHP
php -S localhost:8080 -t ./

echo Сервер запущен на http://localhost:8080
echo API доступно по адресу http://localhost:8080/api
echo Нажмите Ctrl+C для остановки сервера