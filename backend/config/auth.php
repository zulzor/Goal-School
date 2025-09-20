<?php
// config/auth.php - Аутентификация и авторизация

require_once 'jwt.php';

class Auth {
    private $conn;
    private $jwt;

    public function __construct($db) {
        $this->conn = $db;
        $this->jwt = new JwtAuth();
    }

    // Регистрация нового пользователя
    public function register($name, $email, $password, $role, $family_id = null, $child_id = null) {
        // Проверка, существует ли уже пользователь с таким email
        $query = "SELECT id FROM users WHERE email = :email LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            return ["success" => false, "message" => "Пользователь с таким email уже существует"];
        }

        // Хеширование пароля
        $password_hash = password_hash($password, PASSWORD_DEFAULT);

        // Создание пользователя
        $query = "INSERT INTO users 
                  SET name=:name, email=:email, password_hash=:password_hash, role=:role, family_id=:family_id, child_id=:child_id";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $name = htmlspecialchars(strip_tags($name));
        $email = htmlspecialchars(strip_tags($email));
        $role = htmlspecialchars(strip_tags($role));
        $family_id = $family_id ? htmlspecialchars(strip_tags($family_id)) : null;
        $child_id = $child_id ? htmlspecialchars(strip_tags($child_id)) : null;

        // Привязка значений
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password_hash", $password_hash);
        $stmt->bindParam(":role", $role);
        $stmt->bindParam(":family_id", $family_id);
        $stmt->bindParam(":child_id", $child_id);

        // Выполнение запроса
        if($stmt->execute()) {
            $user_id = $this->conn->lastInsertId();
            return [
                "success" => true, 
                "message" => "Пользователь успешно зарегистрирован",
                "user_id" => $user_id,
                "name" => $name,
                "email" => $email,
                "role" => $role // Return role directly without mapping
            ];
        }

        return ["success" => false, "message" => "Ошибка при регистрации пользователя"];
    }

    // Вход пользователя
    public function login($email, $password) {
        // Получение пользователя по email
        $query = "SELECT id, name, email, password_hash, role, family_id, child_id 
                  FROM users 
                  WHERE email = :email 
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $password_hash = $row['password_hash'];

            // Проверка пароля
            if(password_verify($password, $password_hash)) {
                // Создание токена JWT
                $user_data = [
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "email" => $row['email'],
                    "role" => $row['role'], // Use role directly without mapping
                    "family_id" => $row['family_id'],
                    "child_id" => $row['child_id']
                ];
                
                $token = $this->jwt->generateToken($user_data);
                
                return [
                    "success" => true,
                    "message" => "Вход выполнен успешно",
                    "token" => $token,
                    "user" => $user_data
                ];
            } else {
                return ["success" => false, "message" => "Неверный пароль"];
            }
        }

        return ["success" => false, "message" => "Пользователь не найден"];
    }

    // Проверка токена JWT
    public function checkToken($token) {
        $result = $this->jwt->validateToken($token);
        return $result;
    }

    // Проверка роли пользователя
    public function checkRole($user_role, $required_role) {
        $roles = [
            'manager' => 3,
            'coach' => 2,
            'parent' => 1,
            'child' => 1
        ];

        return isset($roles[$user_role]) && isset($roles[$required_role]) && 
               $roles[$user_role] >= $roles[$required_role];
    }
}
?>