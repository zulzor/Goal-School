<?php
// models/Training.php - Модель тренировки

class Training {
    private $conn;
    private $table_name = "trainings";

    public $id;
    public $branch_id;
    public $trainer_id;
    public $training_date;
    public $discipline_id;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Создание новой тренировки
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET branch_id=:branch_id, trainer_id=:trainer_id, training_date=:training_date, discipline_id=:discipline_id";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->branch_id = htmlspecialchars(strip_tags($this->branch_id));
        $this->trainer_id = htmlspecialchars(strip_tags($this->trainer_id));
        $this->training_date = htmlspecialchars(strip_tags($this->training_date));
        $this->discipline_id = htmlspecialchars(strip_tags($this->discipline_id));

        // Привязка значений
        $stmt->bindParam(":branch_id", $this->branch_id);
        $stmt->bindParam(":trainer_id", $this->trainer_id);
        $stmt->bindParam(":training_date", $this->training_date);
        $stmt->bindParam(":discipline_id", $this->discipline_id);

        // Выполнение запроса
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Получение всех тренировок
    public function getAll() {
        $query = "SELECT t.id, t.branch_id, t.trainer_id, t.training_date, t.discipline_id, 
                         b.branch_name, d.discipline_name
                  FROM " . $this->table_name . " t
                  JOIN branches b ON t.branch_id = b.id
                  JOIN disciplines d ON t.discipline_id = d.id
                  ORDER BY t.training_date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Получение тренировок по филиалу
    public function getByBranchId($branch_id) {
        $query = "SELECT t.id, t.branch_id, t.trainer_id, t.training_date, t.discipline_id,
                         b.branch_name, d.discipline_name
                  FROM " . $this->table_name . " t
                  JOIN branches b ON t.branch_id = b.id
                  JOIN disciplines d ON t.discipline_id = d.id
                  WHERE t.branch_id = :branch_id
                  ORDER BY t.training_date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':branch_id', $branch_id);
        $stmt->execute();

        return $stmt;
    }

    // Получение тренировки по ID
    public function getById($id) {
        $query = "SELECT id, branch_id, trainer_id, training_date, discipline_id 
                  FROM " . $this->table_name . " 
                  WHERE id = :id 
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->id = $row['id'];
            $this->branch_id = $row['branch_id'];
            $this->trainer_id = $row['trainer_id'];
            $this->training_date = $row['training_date'];
            $this->discipline_id = $row['discipline_id'];
            return true;
        }

        return false;
    }

    // Обновление тренировки
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET branch_id = :branch_id, trainer_id = :trainer_id, 
                      training_date = :training_date, discipline_id = :discipline_id
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->branch_id = htmlspecialchars(strip_tags($this->branch_id));
        $this->trainer_id = htmlspecialchars(strip_tags($this->trainer_id));
        $this->training_date = htmlspecialchars(strip_tags($this->training_date));
        $this->discipline_id = htmlspecialchars(strip_tags($this->discipline_id));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Привязка значений
        $stmt->bindParam(":branch_id", $this->branch_id);
        $stmt->bindParam(":trainer_id", $this->trainer_id);
        $stmt->bindParam(":training_date", $this->training_date);
        $stmt->bindParam(":discipline_id", $this->discipline_id);
        $stmt->bindParam(":id", $this->id);

        // Выполнение запроса
        return $stmt->execute();
    }

    // Удаление тренировки
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