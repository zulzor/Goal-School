<?php
// config/jwt.php - Работа с JWT токенами

require_once '../vendor/autoload.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class JwtAuth {
    private $secret_key;
    private $algorithm;

    public function __construct() {
        // Загрузка переменных окружения
        include_once 'env.php';
        
        $this->secret_key = getenv('JWT_SECRET') ?: 'your_jwt_secret_key_here';
        $this->algorithm = 'HS256';
    }

    // Генерация JWT токена
    public function generateToken($user_data) {
        $issued_at = time();
        $expiration_time = $issued_at + (getenv('JWT_EXPIRE') ?: 3600); // 1 час по умолчанию

        $payload = array(
            "iat" => $issued_at,
            "exp" => $expiration_time,
            "data" => $user_data
        );

        return JWT::encode($payload, $this->secret_key, $this->algorithm);
    }

    // Проверка JWT токена
    public function validateToken($token) {
        try {
            $decoded = JWT::decode($token, new Key($this->secret_key, $this->algorithm));
            return array("success" => true, "data" => $decoded->data);
        } catch (Exception $e) {
            return array("success" => false, "message" => $e->getMessage());
        }
    }
}
?>