<?php
// models/User.php - Модель пользователя

class User {
    private $conn;
    private $table_name = "users";

    public $id;
    public $name;
    public $email;
    public $password_hash;
    public $role;
    public $family_id;
    public $child_id;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Получение пользователя по email
    public function getByEmail($email) {
        $query = "SELECT id, name, email, password_hash, role, family_id, child_id 
                  FROM " . $this->table_name . " 
                  WHERE email = :email 
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->email = $row['email'];
            $this->password_hash = $row['password_hash'];
            // No mapping needed as roles are now unified
            $this->role = $row['role'];
            $this->family_id = $row['family_id'];
            $this->child_id = $row['child_id'];
            return true;
        }

        return false;
    }

    // Получение пользователя по ID
    public function getById($id) {
        $query = "SELECT id, name, email, role, family_id, child_id 
                  FROM " . $this->table_name . " 
                  WHERE id = :id 
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->email = $row['email'];
            // No mapping needed as roles are now unified
            $this->role = $row['role'];
            $this->family_id = $row['family_id'];
            $this->child_id = $row['child_id'];
            return true;
        }

        return false;
    }

    // Создание нового пользователя
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET name=:name, email=:email, password_hash=:password_hash, role=:role, family_id=:family_id, child_id=:child_id";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->role = htmlspecialchars(strip_tags($this->role));
        $this->family_id = htmlspecialchars(strip_tags($this->family_id));
        $this->child_id = htmlspecialchars(strip_tags($this->child_id));

        // Привязка значений
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password_hash", $this->password_hash);
        $stmt->bindParam(":role", $this->role);
        $stmt->bindParam(":family_id", $this->family_id);
        $stmt->bindParam(":child_id", $this->child_id);

        // Выполнение запроса
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Получение всех пользователей
    public function getAll() {
        $query = "SELECT id, name, email, role, family_id, child_id FROM " . $this->table_name . " ORDER BY name";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }
}
?>