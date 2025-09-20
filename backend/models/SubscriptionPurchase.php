<?php
// models/SubscriptionPurchase.php - Модель покупки абонемента

class SubscriptionPurchase {
    private $conn;
    private $table_name = "subscription_purchases";

    public $id;
    public $child_id;
    public $subscription_id;
    public $manager_id;
    public $purchase_date;
    public $start_date;
    public $end_date;
    public $num_trainings;
    public $remaining_trainings;
    public $total_cost;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Создание новой покупки абонемента
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET child_id=:child_id, subscription_id=:subscription_id, manager_id=:manager_id,
                      purchase_date=:purchase_date, start_date=:start_date, end_date=:end_date,
                      num_trainings=:num_trainings, remaining_trainings=:remaining_trainings, total_cost=:total_cost";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->child_id = htmlspecialchars(strip_tags($this->child_id));
        $this->subscription_id = htmlspecialchars(strip_tags($this->subscription_id));
        $this->manager_id = htmlspecialchars(strip_tags($this->manager_id));
        $this->purchase_date = htmlspecialchars(strip_tags($this->purchase_date));
        $this->start_date = htmlspecialchars(strip_tags($this->start_date));
        $this->end_date = htmlspecialchars(strip_tags($this->end_date));
        $this->num_trainings = htmlspecialchars(strip_tags($this->num_trainings));
        $this->remaining_trainings = htmlspecialchars(strip_tags($this->remaining_trainings));
        $this->total_cost = htmlspecialchars(strip_tags($this->total_cost));

        // Привязка значений
        $stmt->bindParam(":child_id", $this->child_id);
        $stmt->bindParam(":subscription_id", $this->subscription_id);
        $stmt->bindParam(":manager_id", $this->manager_id);
        $stmt->bindParam(":purchase_date", $this->purchase_date);
        $stmt->bindParam(":start_date", $this->start_date);
        $stmt->bindParam(":end_date", $this->end_date);
        $stmt->bindParam(":num_trainings", $this->num_trainings);
        $stmt->bindParam(":remaining_trainings", $this->remaining_trainings);
        $stmt->bindParam(":total_cost", $this->total_cost);

        // Выполнение запроса
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Получение покупки абонемента по ID
    public function getById($id) {
        $query = "SELECT id, child_id, subscription_id, manager_id, purchase_date, start_date, end_date,
                         num_trainings, remaining_trainings, total_cost, created_at, updated_at
                  FROM " . $this->table_name . " 
                  WHERE id = :id 
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->id = $row['id'];
            $this->child_id = $row['child_id'];
            $this->subscription_id = $row['subscription_id'];
            $this->manager_id = $row['manager_id'];
            $this->purchase_date = $row['purchase_date'];
            $this->start_date = $row['start_date'];
            $this->end_date = $row['end_date'];
            $this->num_trainings = $row['num_trainings'];
            $this->remaining_trainings = $row['remaining_trainings'];
            $this->total_cost = $row['total_cost'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }

        return false;
    }

    // Получение всех покупок абонементов для ребенка
    public function getByChildId($child_id) {
        $query = "SELECT id, child_id, subscription_id, manager_id, purchase_date, start_date, end_date,
                         num_trainings, remaining_trainings, total_cost
                  FROM " . $this->table_name . " 
                  WHERE child_id = :child_id
                  ORDER BY purchase_date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':child_id', $child_id);
        $stmt->execute();

        return $stmt;
    }

    // Получение активных покупок абонементов для ребенка (в пределах срока действия)
    public function getActiveByChildId($child_id) {
        $query = "SELECT id, child_id, subscription_id, manager_id, purchase_date, start_date, end_date,
                         num_trainings, remaining_trainings, total_cost
                  FROM " . $this->table_name . " 
                  WHERE child_id = :child_id
                    AND start_date <= CURDATE()
                    AND end_date >= CURDATE()
                    AND remaining_trainings > 0
                  ORDER BY purchase_date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':child_id', $child_id);
        $stmt->execute();

        return $stmt;
    }

    // Обновление оставшихся тренировок
    public function updateRemainingTrainings($id, $remaining_trainings) {
        $query = "UPDATE " . $this->table_name . "
                  SET remaining_trainings=:remaining_trainings, updated_at=NOW()
                  WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $remaining_trainings = htmlspecialchars(strip_tags($remaining_trainings));
        $id = htmlspecialchars(strip_tags($id));

        // Привязка значений
        $stmt->bindParam(":remaining_trainings", $remaining_trainings);
        $stmt->bindParam(":id", $id);

        // Выполнение запроса
        return $stmt->execute();
    }

    // Получение всех покупок абонементов
    public function getAll() {
        $query = "SELECT id, child_id, subscription_id, manager_id, purchase_date, start_date, end_date,
                         num_trainings, remaining_trainings, total_cost
                  FROM " . $this->table_name . " 
                  ORDER BY purchase_date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }
}
?>