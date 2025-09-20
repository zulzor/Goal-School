<?php
// backend/tests/api_test.php - Тестирование API

echo "Тестирование API футбольной школы\n";
echo "================================\n\n";

// Тест 1: Получение списка дисциплин
echo "Тест 1: Получение списка дисциплин\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8080/api/disciplines");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP код: " . $httpCode . "\n";
echo "Ответ: " . $response . "\n\n";

// Тест 2: Получение списка филиалов
echo "Тест 2: Получение списка филиалов\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8080/api/branches");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP код: " . $httpCode . "\n";
echo "Ответ: " . $response . "\n\n";

// Тест 3: Регистрация нового пользователя
echo "Тест 3: Регистрация нового пользователя\n";
$data = array(
    "action" => "register",
    "name" => "Тестовый пользователь",
    "email" => "test@example.com",
    "password" => "password123",
    "role" => "parent"
);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost:8080/api/auth");
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP код: " . $httpCode . "\n";
echo "Ответ: " . $response . "\n\n";

echo "Тестирование завершено.\n";
?>