<?php
// models/TrainerTransfer.php - Модель перевода тренера

class TrainerTransfer {
    private $conn;
    private $table_name = "trainer_transfers";

    public $id;
    public $trainer_id;
    public $from_branch_id;
    public $to_branch_id;
    public $initiated_by;
    public $reason;
    public $status;
    public $approved_by;
    public $approved_at;
    public $transfer_date;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Создание нового перевода тренера
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET trainer_id=:trainer_id, from_branch_id=:from_branch_id, to_branch_id=:to_branch_id,
                      initiated_by=:initiated_by, reason=:reason, transfer_date=:transfer_date";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->trainer_id = htmlspecialchars(strip_tags($this->trainer_id));
        $this->from_branch_id = htmlspecialchars(strip_tags($this->from_branch_id));
        $this->to_branch_id = htmlspecialchars(strip_tags($this->to_branch_id));
        $this->initiated_by = htmlspecialchars(strip_tags($this->initiated_by));
        $this->reason = htmlspecialchars(strip_tags($this->reason));
        $this->transfer_date = htmlspecialchars(strip_tags($this->transfer_date));

        // Привязка значений
        $stmt->bindParam(":trainer_id", $this->trainer_id);
        $stmt->bindParam(":from_branch_id", $this->from_branch_id);
        $stmt->bindParam(":to_branch_id", $this->to_branch_id);
        $stmt->bindParam(":initiated_by", $this->initiated_by);
        $stmt->bindParam(":reason", $this->reason);
        $stmt->bindParam(":transfer_date", $this->transfer_date);

        // Выполнение запроса
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Получение перевода тренера по ID
    public function getById($id) {
        $query = "SELECT id, trainer_id, from_branch_id, to_branch_id, initiated_by, reason, status,
                         approved_by, approved_at, transfer_date, created_at, updated_at
                  FROM " . $this->table_name . " 
                  WHERE id = :id 
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->id = $row['id'];
            $this->trainer_id = $row['trainer_id'];
            $this->from_branch_id = $row['from_branch_id'];
            $this->to_branch_id = $row['to_branch_id'];
            $this->initiated_by = $row['initiated_by'];
            $this->reason = $row['reason'];
            $this->status = $row['status'];
            $this->approved_by = $row['approved_by'];
            $this->approved_at = $row['approved_at'];
            $this->transfer_date = $row['transfer_date'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }

        return false;
    }

    // Получение всех переводов тренера для конкретного тренера
    public function getByTrainerId($trainer_id) {
        $query = "SELECT id, trainer_id, from_branch_id, to_branch_id, initiated_by, reason, status,
                         approved_by, approved_at, transfer_date, created_at, updated_at
                  FROM " . $this->table_name . " 
                  WHERE trainer_id = :trainer_id
                  ORDER BY created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':trainer_id', $trainer_id);
        $stmt->execute();

        return $stmt;
    }

    // Получение всех переводов тренера
    public function getAll() {
        $query = "SELECT id, trainer_id, from_branch_id, to_branch_id, initiated_by, reason, status,
                         approved_by, approved_at, transfer_date, created_at, updated_at
                  FROM " . $this->table_name . " 
                  ORDER BY created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Обновление статуса перевода тренера
    public function updateStatus($id, $status, $approved_by = null) {
        $query = "UPDATE " . $this->table_name . "
                  SET status=:status, approved_by=:approved_by, approved_at=NOW(), updated_at=NOW()
                  WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $status = htmlspecialchars(strip_tags($status));
        $approved_by = $approved_by ? htmlspecialchars(strip_tags($approved_by)) : null;
        $id = htmlspecialchars(strip_tags($id));

        // Привязка значений
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":approved_by", $approved_by);
        $stmt->bindParam(":id", $id);

        // Выполнение запроса
        return $stmt->execute();
    }

    // Получение ожидающих подтверждения переводов
    public function getPendingTransfers() {
        $query = "SELECT id, trainer_id, from_branch_id, to_branch_id, initiated_by, reason, status,
                         approved_by, approved_at, transfer_date, created_at, updated_at
                  FROM " . $this->table_name . " 
                  WHERE status = 'pending'
                  ORDER BY created_at ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }
}
?>