<?php
// models/Trainer.php - Модель тренера

class Trainer {
    private $conn;
    private $table_name = "trainers";

    public $id;
    public $user_id;
    public $branch_id;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Создание нового тренера
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET user_id=:user_id, branch_id=:branch_id";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->branch_id = htmlspecialchars(strip_tags($this->branch_id));

        // Привязка значений
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":branch_id", $this->branch_id);

        // Выполнение запроса
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Получение всех тренеров
    public function getAll() {
        $query = "SELECT t.id, t.user_id, t.branch_id,
                         u.name as trainer_name, b.branch_name
                  FROM " . $this->table_name . " t
                  JOIN users u ON t.user_id = u.id
                  JOIN branches b ON t.branch_id = b.id
                  ORDER BY u.name";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Получение тренеров по филиалу
    public function getByBranchId($branch_id) {
        $query = "SELECT t.id, t.user_id, t.branch_id,
                         u.name as trainer_name
                  FROM " . $this->table_name . " t
                  JOIN users u ON t.user_id = u.id
                  WHERE t.branch_id = :branch_id
                  ORDER BY u.name";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':branch_id', $branch_id);
        $stmt->execute();

        return $stmt;
    }

    // Получение тренера по user_id
    public function getByUserId($user_id) {
        $query = "SELECT id, user_id, branch_id FROM " . $this->table_name . " WHERE user_id = :user_id LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->id = $row['id'];
            $this->user_id = $row['user_id'];
            $this->branch_id = $row['branch_id'];
            return true;
        }

        return false;
    }

    // Получение тренера по ID
    public function getById($id) {
        $query = "SELECT id, user_id, branch_id FROM " . $this->table_name . " WHERE id = :id LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->id = $row['id'];
            $this->user_id = $row['user_id'];
            $this->branch_id = $row['branch_id'];
            return true;
        }

        return false;
    }

    // Обновление тренера
    public function update() {
        $query = "UPDATE " . $this->table_name . " 
                  SET user_id = :user_id, branch_id = :branch_id
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->branch_id = htmlspecialchars(strip_tags($this->branch_id));
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Привязка значений
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":branch_id", $this->branch_id);
        $stmt->bindParam(":id", $this->id);

        // Выполнение запроса
        return $stmt->execute();
    }

    // Удаление тренера
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