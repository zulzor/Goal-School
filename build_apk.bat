@echo off
title Сборка APK для RuStore
color 0A

echo ====================================================
echo Сборка APK для RuStore
echo ====================================================
echo.

echo Проверка наличия Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo Java не найдена!
    echo.
    echo Пожалуйста, установите Java Development Kit (JDK) 11:
    echo 1. Запустите install_android_tools.bat для автоматической установки
    echo 2. Или установите JDK 11 вручную с сайта Oracle
    echo 3. Или установите OpenJDK 11 с помощью Chocolatey: choco install openjdk11
    echo.
    pause
    exit /b 1
)

echo Проверка наличия Android проекта...
if not exist android (
    echo Android проект не найден. Создаем его с помощью Expo...
    npx expo prebuild
    if %errorlevel% neq 0 (
        echo Ошибка при создании Android проекта!
        pause
        exit /b 1
    )
)

echo.
echo Переход в папку android...
cd android

echo.
echo Сборка APK...
.\gradlew.bat assembleRelease
if %errorlevel% neq 0 (
    echo Ошибка при сборке APK!
    cd ..
    pause
    exit /b 1
)

echo.
echo Копирование APK в корневую папку...
if exist app\build\outputs\apk\release\app-release.apk (
    copy app\build\outputs\apk\release\app-release.apk ..\GoalSchoolApp.apk
    if %errorlevel% neq 0 (
        echo Ошибка при копировании APK!
        cd ..
        pause
        exit /b 1
    )
    echo.
    echo APK успешно создан! Файл находится по адресу: ..\GoalSchoolApp.apk
) else (
    echo APK файл не найден!
    echo Проверьте папку android\app\build\outputs\apk\release\ для наличия APK файла
    cd ..
    pause
    exit /b 1
)

cd ..
echo.
echo ====================================================
echo Сборка завершена успешно!
echo ====================================================
pause