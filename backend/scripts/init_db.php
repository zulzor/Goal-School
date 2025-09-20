<?php
// backend/scripts/init_db.php - Скрипт инициализации базы данных

// Подключение к базе данных
include_once '../config/database.php';

echo "Инициализация базы данных футбольной школы...\n";

// Получение соединения с базой данных
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    die("Ошибка подключения к базе данных\n");
}

echo "Подключение к базе данных установлено успешно\n";

// Чтение SQL файла
$sql_file = '../database_schema.sql';
if (!file_exists($sql_file)) {
    die("Файл схемы базы данных не найден: $sql_file\n");
}

$sql = file_get_contents($sql_file);

// Разделение SQL на отдельные запросы
$queries = explode(';', $sql);

foreach ($queries as $query) {
    $query = trim($query);
    if (!empty($query)) {
        try {
            $db->exec($query);
            echo "Выполнен запрос: " . substr($query, 0, 50) . "...\n";
        } catch (PDOException $e) {
            echo "Ошибка выполнения запроса: " . $e->getMessage() . "\n";
            echo "Запрос: " . $query . "\n";
        }
    }
}

echo "Инициализация базы данных завершена!\n";
?>