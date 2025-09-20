@echo off
REM backend/install.bat - Скрипт установки зависимостей для Windows

echo Установка зависимостей для бэкенда футбольной школы...

REM Проверка наличия Composer
where composer >nul 2>&1
if %errorlevel% neq 0 (
    echo Composer не найден. Устанавливаем Composer...
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    php composer-setup.php
    php -r "unlink('composer-setup.php');"
    move composer.phar C:\ProgramData\ComposerSetup\bin\composer.bat >nul 2>&1
)

REM Установка зависимостей
composer install

echo Зависимости установлены успешно!