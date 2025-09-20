<?php
// models/Subscription.php - Модель абонемента

class Subscription {
    private $conn;
    private $table_name = "subscriptions";

    public $id;
    public $name;
    public $description;
    public $price;
    public $num_trainings;
    public $validity_period;
    public $is_active;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Создание нового абонемента
    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET name=:name, description=:description, price=:price, 
                      num_trainings=:num_trainings, validity_period=:validity_period, is_active=:is_active";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->num_trainings = htmlspecialchars(strip_tags($this->num_trainings));
        $this->validity_period = htmlspecialchars(strip_tags($this->validity_period));
        $this->is_active = $this->is_active ? 1 : 0;

        // Привязка значений
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":num_trainings", $this->num_trainings);
        $stmt->bindParam(":validity_period", $this->validity_period);
        $stmt->bindParam(":is_active", $this->is_active);

        // Выполнение запроса
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Получение абонемента по ID
    public function getById($id) {
        $query = "SELECT id, name, description, price, num_trainings, validity_period, is_active, created_at, updated_at
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
            $this->description = $row['description'];
            $this->price = $row['price'];
            $this->num_trainings = $row['num_trainings'];
            $this->validity_period = $row['validity_period'];
            $this->is_active = $row['is_active'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }

        return false;
    }

    // Получение всех активных абонементов
    public function getAllActive() {
        $query = "SELECT id, name, description, price, num_trainings, validity_period, is_active 
                  FROM " . $this->table_name . " 
                  WHERE is_active = 1 
                  ORDER BY name";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Получение всех абонементов
    public function getAll() {
        $query = "SELECT id, name, description, price, num_trainings, validity_period, is_active 
                  FROM " . $this->table_name . " 
                  ORDER BY name";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Обновление абонемента
    public function update() {
        $query = "UPDATE " . $this->table_name . "
                  SET name=:name, description=:description, price=:price, 
                      num_trainings=:num_trainings, validity_period=:validity_period, is_active=:is_active
                  WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        // Очистка данных
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->num_trainings = htmlspecialchars(strip_tags($this->num_trainings));
        $this->validity_period = htmlspecialchars(strip_tags($this->validity_period));
        $this->is_active = $this->is_active ? 1 : 0;
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Привязка значений
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":num_trainings", $this->num_trainings);
        $stmt->bindParam(":validity_period", $this->validity_period);
        $stmt->bindParam(":is_active", $this->is_active);
        $stmt->bindParam(":id", $this->id);

        // Выполнение запроса
        return $stmt->execute();
    }

    // Удаление абонемента (деактивация)
    public function delete() {
        $this->is_active = 0;
        return $this->update();
    }
}
?>