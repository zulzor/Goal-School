<?php
// models/CancelledTraining.php - Модель отмененной тренировки

class CancelledTraining {
    private $conn;
    private $table_name = "cancelled_trainings";

    public $id;
    public $training_id;
    public $cancelled_by;
    public $reason;
    public $cancelled_at;
    public $refund_policy_applied;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Создание записи об отмене тренировки
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET training_id=:training_id, cancelled_by=:cancelled_by, reason=:reason,
                      refund_policy_applied=:refund_policy_applied";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->training_id = htmlspecialchars(strip_tags($this->training_id));
        $this->cancelled_by = htmlspecialchars(strip_tags($this->cancelled_by));
        $this->reason = htmlspecialchars(strip_tags($this->reason));
        $this->refund_policy_applied = $this->refund_policy_applied ? 1 : 0;

        // Привязка значений
        $stmt->bindParam(":training_id", $this->training_id);
        $stmt->bindParam(":cancelled_by", $this->cancelled_by);
        $stmt->bindParam(":reason", $this->reason);
        $stmt->bindParam(":refund_policy_applied", $this->refund_policy_applied);

        // Выполнение запроса
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Получение отмененной тренировки по ID
    public function getById($id) {
        $query = "SELECT id, training_id, cancelled_by, reason, cancelled_at, refund_policy_applied
                  FROM " . $this->table_name . " 
                  WHERE id = :id 
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->id = $row['id'];
            $this->training_id = $row['training_id'];
            $this->cancelled_by = $row['cancelled_by'];
            $this->reason = $row['reason'];
            $this->cancelled_at = $row['cancelled_at'];
            $this->refund_policy_applied = $row['refund_policy_applied'];
            return true;
        }

        return false;
    }

    // Получение отмененной тренировки по ID тренировки
    public function getByTrainingId($training_id) {
        $query = "SELECT id, training_id, cancelled_by, reason, cancelled_at, refund_policy_applied
                  FROM " . $this->table_name . " 
                  WHERE training_id = :training_id 
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':training_id', $training_id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->id = $row['id'];
            $this->training_id = $row['training_id'];
            $this->cancelled_by = $row['cancelled_by'];
            $this->reason = $row['reason'];
            $this->cancelled_at = $row['cancelled_at'];
            $this->refund_policy_applied = $row['refund_policy_applied'];
            return true;
        }

        return false;
    }

    // Получение всех отмененных тренировок
    public function getAll() {
        $query = "SELECT id, training_id, cancelled_by, reason, cancelled_at, refund_policy_applied
                  FROM " . $this->table_name . " 
                  ORDER BY cancelled_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Получение отмененных тренировок за период
    public function getByDateRange($start_date, $end_date) {
        $query = "SELECT id, training_id, cancelled_by, reason, cancelled_at, refund_policy_applied
                  FROM " . $this->table_name . " 
                  WHERE cancelled_at >= :start_date AND cancelled_at <= :end_date
                  ORDER BY cancelled_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':start_date', $start_date);
        $stmt->bindParam(':end_date', $end_date);
        $stmt->execute();

        return $stmt;
    }
}
?>