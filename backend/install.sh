#!/bin/bash
# backend/install.sh - Скрипт установки зависимостей

echo "Установка зависимостей для бэкенда футбольной школы..."

# Проверка наличия Composer
if ! command -v composer &> /dev/null
then
    echo "Composer не найден. Устанавливаем Composer..."
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    php composer-setup.php
    php -r "unlink('composer-setup.php');"
    mv composer.phar /usr/local/bin/composer
fi

# Установка зависимостей
composer install

echo "Зависимости установлены успешно!"