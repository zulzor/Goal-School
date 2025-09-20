<?php
// Test database connection
include_once 'config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    echo "Database connection successful!\n";
    
    // Test creating a manager user
    $query = "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)";
    $stmt = $db->prepare($query);
    $stmt->execute([
        'Test Manager',
        'manager@test.com',
        password_hash('test123', PASSWORD_DEFAULT),
        'manager'
    ]);
    
    echo "Manager user created successfully!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>