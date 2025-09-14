@echo off
title Сборка и запуск веб-версии футбольной школы Arsenal
color 0A

echo ================================
echo   Сборка и запуск веб-версии
echo   Футбольная школа Arsenal
echo ================================
echo.

echo Перехожу в директорию проекта...
cd /d "c:\Users\jolab\Desktop\Goal-School"

echo.
echo Собираю веб-версию приложения...
echo Это может занять 1-2 минуты
echo.

npx expo export --platform web

echo.
echo Запускаю сервер для статических файлов...
echo Приложение будет доступно по адресу: http://localhost:8081
echo.

start http://localhost:8081
node simple-server.js

echo.
pause