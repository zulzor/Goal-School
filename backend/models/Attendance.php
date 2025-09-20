<?php
// models/Attendance.php - Модель посещаемости

class Attendance {
    private $conn;
    private $table_name = "attendance";

    public $id;
    public $training_id;
    public $child_id;
    public $visited;
    public $confirmed_by_coach;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Создание записи о посещаемости
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET training_id=:training_id, child_id=:child_id, visited=:visited, confirmed_by_coach=:confirmed_by_coach";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->training_id = htmlspecialchars(strip_tags($this->training_id));
        $this->child_id = htmlspecialchars(strip_tags($this->child_id));
        $this->visited = htmlspecialchars(strip_tags($this->visited));
        $this->confirmed_by_coach = htmlspecialchars(strip_tags($this->confirmed_by_coach));

        // Привязка значений
        $stmt->bindParam(":training_id", $this->training_id);
        $stmt->bindParam(":child_id", $this->child_id);
        $stmt->bindParam(":visited", $this->visited);
        $stmt->bindParam(":confirmed_by_coach", $this->confirmed_by_coach);

        // Выполнение запроса
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Получение посещаемости по тренировке
    public function getByTrainingId($training_id) {
        $query = "SELECT a.id, a.training_id, a.child_id, a.visited, a.confirmed_by_coach,
                         c.name as child_name
                  FROM " . $this->table_name . " a
                  JOIN children c ON a.child_id = c.id
                  WHERE a.training_id = :training_id
                  ORDER BY c.name";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':training_id', $training_id);
        $stmt->execute();

        return $stmt;
    }

    // Получение посещаемости по ребенку
    public function getByChildId($child_id) {
        $query = "SELECT a.id, a.training_id, a.child_id, a.visited, a.confirmed_by_coach,
                         t.training_date, d.discipline_name
                  FROM " . $this->table_name . " a
                  JOIN trainings t ON a.training_id = t.id
                  JOIN disciplines d ON t.discipline_id = d.id
                  WHERE a.child_id = :child_id
                  ORDER BY t.training_date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':child_id', $child_id);
        $stmt->execute();

        return $stmt;
    }

    // Обновление статуса посещения
    public function updateVisitStatus($id, $visited) {
        $query = "UPDATE " . $this->table_name . " 
                  SET visited = :visited 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $visited = htmlspecialchars(strip_tags($visited));
        $id = htmlspecialchars(strip_tags($id));

        // Привязка значений
        $stmt->bindParam(":visited", $visited);
        $stmt->bindParam(":id", $id);

        // Выполнение запроса
        return $stmt->execute();
    }

    // Подтверждение тренером
    public function confirmByCoach($id, $confirmed) {
        $query = "UPDATE " . $this->table_name . " 
                  SET confirmed_by_coach = :confirmed 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $confirmed = htmlspecialchars(strip_tags($confirmed));
        $id = htmlspecialchars(strip_tags($id));

        // Привязка значений
        $stmt->bindParam(":confirmed", $confirmed);
        $stmt->bindParam(":id", $id);

        // Выполнение запроса
        return $stmt->execute();
    }

    // Проверка, существует ли запись
    public function exists($training_id, $child_id) {
        $query = "SELECT id FROM " . $this->table_name . " 
                  WHERE training_id = :training_id AND child_id = :child_id 
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':training_id', $training_id);
        $stmt->bindParam(':child_id', $child_id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            return true;
        }

        return false;
    }
}
?>