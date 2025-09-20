<?php
// models/Branch.php - Модель филиала

class Branch {
    private $conn;
    private $table_name = "branches";

    public $id;
    public $name;
    public $address;
    public $phone;
    public $email;
    public $manager_id;
    public $is_active;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Создание нового филиала
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET name=:name, address=:address, phone=:phone, email=:email, 
                      manager_id=:manager_id, is_active=:is_active";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->manager_id = htmlspecialchars(strip_tags($this->manager_id));
        $this->is_active = $this->is_active ? 1 : 0;

        // Привязка значений
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":manager_id", $this->manager_id);
        $stmt->bindParam(":is_active", $this->is_active);

        // Выполнение запроса
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Получение филиала по ID
    public function getById($id) {
        $query = "SELECT id, name, address, phone, email, manager_id, is_active, created_at, updated_at
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
            $this->address = $row['address'];
            $this->phone = $row['phone'];
            $this->email = $row['email'];
            $this->manager_id = $row['manager_id'];
            $this->is_active = $row['is_active'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }

        return false;
    }

    // Получение всех активных филиалов
    public function getAllActive() {
        $query = "SELECT id, name, address, phone, email, manager_id, is_active 
                  FROM " . $this->table_name . " 
                  WHERE is_active = 1 
                  ORDER BY name";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Получение всех филиалов
    public function getAll() {
        $query = "SELECT id, name, address, phone, email, manager_id, is_active 
                  FROM " . $this->table_name . " 
                  ORDER BY name";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Обновление филиала
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET name=:name, address=:address, phone=:phone, email=:email, 
                      manager_id=:manager_id, is_active=:is_active
                  WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->manager_id = htmlspecialchars(strip_tags($this->manager_id));
        $this->is_active = $this->is_active ? 1 : 0;
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Привязка значений
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":manager_id", $this->manager_id);
        $stmt->bindParam(":is_active", $this->is_active);
        $stmt->bindParam(":id", $this->id);

        // Выполнение запроса
        return $stmt->execute();
    }

    // Удаление филиала (деактивация)
    public function delete() {
        $this->is_active = 0;
        return $this->update();
    }

    // Перевод семьи в другой филиал
    public function transferFamily($family_id, $from_branch_id, $to_branch_id, $initiated_by, $reason, $transfer_date) {
        try {
            $this->conn->beginTransaction();

            // Создание записи о переводе
            $query = "INSERT INTO family_transfers 
                      (family_id, from_branch_id, to_branch_id, initiated_by, reason, transfer_date)
                      VALUES (:family_id, :from_branch_id, :to_branch_id, :initiated_by, :reason, :transfer_date)";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':family_id', $family_id);
            $stmt->bindParam(':from_branch_id', $from_branch_id);
            $stmt->bindParam(':to_branch_id', $to_branch_id);
            $stmt->bindParam(':initiated_by', $initiated_by);
            $stmt->bindParam(':reason', $reason);
            $stmt->bindParam(':transfer_date', $transfer_date);
            
            if (!$stmt->execute()) {
                $this->conn->rollback();
                return false;
            }

            // Обновление филиала для всех членов семьи
            $query = "UPDATE profiles 
                      SET branch_id = :to_branch_id 
                      WHERE family_id = :family_id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':to_branch_id', $to_branch_id);
            $stmt->bindParam(':family_id', $family_id);
            
            if (!$stmt->execute()) {
                $this->conn->rollback();
                return false;
            }

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollback();
            return false;
        }
    }

    // Перевод тренера в другой филиал
    public function transferTrainer($trainer_id, $from_branch_id, $to_branch_id, $initiated_by, $reason, $transfer_date) {
        try {
            $this->conn->beginTransaction();

            // Создание записи о переводе
            $query = "INSERT INTO trainer_transfers 
                      (trainer_id, from_branch_id, to_branch_id, initiated_by, reason, transfer_date)
                      VALUES (:trainer_id, :from_branch_id, :to_branch_id, :initiated_by, :reason, :transfer_date)";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':trainer_id', $trainer_id);
            $stmt->bindParam(':from_branch_id', $from_branch_id);
            $stmt->bindParam(':to_branch_id', $to_branch_id);
            $stmt->bindParam(':initiated_by', $initiated_by);
            $stmt->bindParam(':reason', $reason);
            $stmt->bindParam(':transfer_date', $transfer_date);
            
            if (!$stmt->execute()) {
                $this->conn->rollback();
                return false;
            }

            // Обновление филиала для тренера
            $query = "UPDATE profiles 
                      SET branch_id = :to_branch_id 
                      WHERE id = :trainer_id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':to_branch_id', $to_branch_id);
            $stmt->bindParam(':trainer_id', $trainer_id);
            
            if (!$stmt->execute()) {
                $this->conn->rollback();
                return false;
            }

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollback();
            return false;
        }
    }
}
?>