@echo off
title Запуск веб-версии футбольной школы Arsenal
color 0A

echo ================================
echo   Запуск веб-версии приложения
echo   Футбольная школа Arsenal
echo ================================
echo.

echo Перехожу в директорию проекта...
cd /d "c:\Users\jolab\Desktop\Goal-School"

echo.
echo Запускаю веб-версию приложения с очисткой кэша...
echo Это может занять 1-2 минуты при первой загрузке
echo.

npx expo start --web --clear

echo.
echo Для остановки сервера нажмите Ctrl+C
echo.
pause