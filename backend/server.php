<?php
// backend/server.php - Простой сервер для тестирования API

// Запуск встроенного PHP сервера для разработки
// Использование: php server.php

if (php_sapi_name() !== 'cli') {
    die('Этот скрипт должен запускаться из командной строки');
}

$host = 'localhost';
$port = 8080;
$documentRoot = __DIR__;

echo "Запуск сервера разработки...\n";
echo "Адрес: http://$host:$port\n";
echo "Документация API: http://$host:$port/api\n";
echo "Нажмите Ctrl+C для остановки сервера\n\n";

// Запуск встроенного сервера PHP
$command = "php -S $host:$port -t \"$documentRoot\"";

// Выполнение команды
system($command);
?>