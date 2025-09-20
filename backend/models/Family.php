<?php
// models/Family.php - Модель семьи

class Family {
    private $conn;
    private $table_name = "families";

    public $id;
    public $family_name;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Создание новой семьи
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET family_name=:family_name";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->family_name = htmlspecialchars(strip_tags($this->family_name));

        // Привязка значений
        $stmt->bindParam(":family_name", $this->family_name);

        // Выполнение запроса
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Получение всех семей
    public function getAll() {
        $query = "SELECT id, family_name FROM " . $this->table_name . " ORDER BY family_name";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Получение семьи по ID
    public function getById($id) {
        $query = "SELECT id, family_name FROM " . $this->table_name . " WHERE id = :id LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->id = $row['id'];
            $this->family_name = $row['family_name'];
            return true;
        }

        return false;
    }

    // Обновление семьи
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET family_name = :family_name 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->family_name = htmlspecialchars(strip_tags($this->family_name));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Привязка значений
        $stmt->bindParam(":family_name", $this->family_name);
        $stmt->bindParam(":id", $this->id);

        // Выполнение запроса
        return $stmt->execute();
    }

    // Удаление семьи
    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Привязка значений
        $stmt->bindParam(":id", $this->id);

        // Выполнение запроса
        return $stmt->execute();
    }
}
?>