<?php
// models/Discipline.php - Модель дисциплины

class Discipline {
    private $conn;
    private $table_name = "disciplines";

    public $id;
    public $discipline_name;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Создание новой дисциплины
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET discipline_name=:discipline_name";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->discipline_name = htmlspecialchars(strip_tags($this->discipline_name));

        // Привязка значений
        $stmt->bindParam(":discipline_name", $this->discipline_name);

        // Выполнение запроса
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Получение всех дисциплин
    public function getAll() {
        $query = "SELECT id, discipline_name FROM " . $this->table_name . " ORDER BY discipline_name";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Обновление дисциплины
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET discipline_name = :discipline_name 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->discipline_name = htmlspecialchars(strip_tags($this->discipline_name));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Привязка значений
        $stmt->bindParam(":discipline_name", $this->discipline_name);
        $stmt->bindParam(":id", $this->id);

        // Выполнение запроса
        return $stmt->execute();
    }

    // Удаление дисциплины
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