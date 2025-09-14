@echo off
title Установка Android инструментов
color 0A

echo ====================================================
echo Установка Android инструментов для создания APK
echo ====================================================
echo.

echo Проверка наличия Chocolatey...
choco --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Chocolatey не найден. Устанавливаем Chocolatey...
    powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
    if %errorlevel% neq 0 (
        echo Ошибка при установке Chocolatey!
        echo Пожалуйста, установите Chocolatey вручную с сайта https://chocolatey.org/install
        pause
        exit /b 1
    )
    echo Chocolatey успешно установлен!
) else (
    echo Chocolatey уже установлен
)

echo.
echo Установка OpenJDK 11...
choco install openjdk11 -y
if %errorlevel% neq 0 (
    echo Ошибка при установке OpenJDK 11!
    pause
    exit /b 1
)
echo OpenJDK 11 успешно установлен!

echo.
echo Установка Android SDK...
choco install android-sdk -y
if %errorlevel% neq 0 (
    echo Ошибка при установке Android SDK!
    pause
    exit /b 1
)
echo Android SDK успешно установлен!

echo.
echo Установка Android Studio...
choco install android-studio -y
if %errorlevel% neq 0 (
    echo Ошибка при установке Android Studio!
    pause
    exit /b 1
)
echo Android Studio успешно установлен!

echo.
echo ====================================================
echo Установка завершена успешно!
echo.
echo Теперь вам нужно:
echo 1. Перезагрузить компьютер
echo 2. Запустить Android Studio и завершить настройку
echo 3. Запустить build_apk.bat для создания APK
echo ====================================================
pause