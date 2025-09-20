<?php
// backend/config/env.php - Загрузка переменных окружения

function loadEnv($path) {
    if (!file_exists($path)) {
        return;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Пропускаем комментарии и пустые строки
        if (strpos($line, '#') === 0 || empty(trim($line))) {
            continue;
        }
        
        // Разделяем ключ и значение
        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        
        // Удаляем кавычки, если они есть
        $value = trim($value, '"\'');
        
        // Устанавливаем переменную окружения
        putenv("$key=$value");
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
}

// Загрузка переменных окружения
loadEnv(__DIR__ . '/../.env');
?>