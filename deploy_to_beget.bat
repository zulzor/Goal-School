@echo off
chcp 65001 >nul
echo Запуск скрипта деплоя на сервер Beget...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0deploy_to_beget.ps1"

echo.
echo Скрипт завершен. Нажмите любую клавишу для выхода.
pause >nul