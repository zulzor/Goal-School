<?php
// models/Progress.php - Модель прогресса

class Progress {
    private $conn;
    private $table_name = "progress";

    public $id;
    public $child_id;
    public $discipline_id;
    public $value;
    public $measurement_date;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Создание новой записи прогресса
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET child_id=:child_id, discipline_id=:discipline_id, value=:value, measurement_date=:measurement_date";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->child_id = htmlspecialchars(strip_tags($this->child_id));
        $this->discipline_id = htmlspecialchars(strip_tags($this->discipline_id));
        $this->value = htmlspecialchars(strip_tags($this->value));
        $this->measurement_date = htmlspecialchars(strip_tags($this->measurement_date));

        // Привязка значений
        $stmt->bindParam(":child_id", $this->child_id);
        $stmt->bindParam(":discipline_id", $this->discipline_id);
        $stmt->bindParam(":value", $this->value);
        $stmt->bindParam(":measurement_date", $this->measurement_date);

        // Выполнение запроса
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Получение прогресса по ребенку
    public function getByChildId($child_id) {
        $query = "SELECT p.id, p.child_id, p.discipline_id, p.value, p.measurement_date,
                         d.discipline_name
                  FROM " . $this->table_name . " p
                  JOIN disciplines d ON p.discipline_id = d.id
                  WHERE p.child_id = :child_id
                  ORDER BY p.measurement_date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':child_id', $child_id);
        $stmt->execute();

        return $stmt;
    }

    // Получение прогресса по ребенку и дисциплине
    public function getByChildAndDiscipline($child_id, $discipline_id) {
        $query = "SELECT id, child_id, discipline_id, value, measurement_date
                  FROM " . $this->table_name . " 
                  WHERE child_id = :child_id AND discipline_id = :discipline_id
                  ORDER BY measurement_date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':child_id', $child_id);
        $stmt->bindParam(':discipline_id', $discipline_id);
        $stmt->execute();

        return $stmt;
    }

    // Обновление значения прогресса
    public function updateValue($id, $value) {
        $query = "UPDATE " . $this->table_name . " 
                  SET value = :value 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $value = htmlspecialchars(strip_tags($value));
        $id = htmlspecialchars(strip_tags($id));

        // Привязка значений
        $stmt->bindParam(":value", $value);
        $stmt->bindParam(":id", $id);

        // Выполнение запроса
        return $stmt->execute();
    }

    // Удаление записи прогресса
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