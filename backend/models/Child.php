<?php
// models/Child.php - Модель ребенка

class Child {
    private $conn;
    private $table_name = "children";

    public $id;
    public $family_id;
    public $name;
    public $balance;
    public $birth_date;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Создание нового ребенка
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET family_id=:family_id, name=:name, balance=:balance, birth_date=:birth_date";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->family_id = htmlspecialchars(strip_tags($this->family_id));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->balance = htmlspecialchars(strip_tags($this->balance));
        $this->birth_date = htmlspecialchars(strip_tags($this->birth_date));

        // Привязка значений
        $stmt->bindParam(":family_id", $this->family_id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":balance", $this->balance);
        $stmt->bindParam(":birth_date", $this->birth_date);

        // Выполнение запроса
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Получение детей по family_id
    public function getByFamilyId($family_id) {
        $query = "SELECT id, family_id, name, balance, birth_date FROM " . $this->table_name . " WHERE family_id = :family_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':family_id', $family_id);
        $stmt->execute();

        return $stmt;
    }

    // Получение ребенка по ID
    public function getById($id) {
        $query = "SELECT id, family_id, name, balance, birth_date FROM " . $this->table_name . " WHERE id = :id LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->id = $row['id'];
            $this->family_id = $row['family_id'];
            $this->name = $row['name'];
            $this->balance = $row['balance'];
            $this->birth_date = $row['birth_date'];
            return true;
        }

        return false;
    }

    // Обновление баланса ребенка
    public function updateBalance($child_id, $new_balance) {
        $query = "UPDATE " . $this->table_name . " 
                  SET balance = :balance 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $new_balance = htmlspecialchars(strip_tags($new_balance));
        $child_id = htmlspecialchars(strip_tags($child_id));

        // Привязка значений
        $stmt->bindParam(":balance", $new_balance);
        $stmt->bindParam(":id", $child_id);

        // Выполнение запроса
        return $stmt->execute();
    }
}
?>