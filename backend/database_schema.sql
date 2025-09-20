-- Создание базы данных
CREATE DATABASE IF NOT EXISTS football_school CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE football_school;

-- Таблица пользователей
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'coach', 'parent', 'child', 'smm_manager') NOT NULL,
    family_id INT NULL,
    child_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE SET NULL,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE SET NULL
);

-- Таблица семей
CREATE TABLE families (
    id INT AUTO_INCREMENT PRIMARY KEY,
    family_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Таблица детей
CREATE TABLE children (
    id INT AUTO_INCREMENT PRIMARY KEY,
    family_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    balance INT DEFAULT 0,
    birth_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
);

-- Таблица филиалов
CREATE TABLE branches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch_name VARCHAR(255) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Таблица тренеров
CREATE TABLE trainers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    branch_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
);

-- Таблица тренировок
CREATE TABLE trainings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch_id INT NOT NULL,
    trainer_id INT NOT NULL,
    training_date DATETIME NOT NULL,
    discipline_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
    FOREIGN KEY (discipline_id) REFERENCES disciplines(id) ON DELETE CASCADE
);

-- Таблица посещаемости
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    training_id INT NOT NULL,
    child_id INT NOT NULL,
    visited BOOLEAN DEFAULT FALSE,
    confirmed_by_coach BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (training_id) REFERENCES trainings(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (training_id, child_id)
);

-- Таблица дисциплин
CREATE TABLE disciplines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discipline_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Таблица прогресса
CREATE TABLE progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    child_id INT NOT NULL,
    discipline_id INT NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    measurement_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
    FOREIGN KEY (discipline_id) REFERENCES disciplines(id) ON DELETE CASCADE
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_children_family ON children(family_id);
CREATE INDEX idx_trainings_date ON trainings(training_date);
CREATE INDEX idx_trainings_branch ON trainings(branch_id);
CREATE INDEX idx_attendance_training ON attendance(training_id);
CREATE INDEX idx_attendance_child ON attendance(child_id);
CREATE INDEX idx_progress_child ON progress(child_id);
CREATE INDEX idx_progress_discipline ON progress(discipline_id);

-- Добавим тестовые данные

-- Тестовые дисциплины
INSERT INTO disciplines (discipline_name) VALUES 
('Бег'),
('Змейка'),
('Отжимания'),
('Прыжки'),
('Удар по мячу'),
('Ведение мяча');

-- Тестовые филиалы
INSERT INTO branches (branch_name, address) VALUES 
('Центральный филиал', 'ул. Спортивная, 1'),
('Филиал на севере', 'пр. Победы, 45'),
('Филиал на юге', 'ул. Молодежная, 12');

-- Тестовая семья
INSERT INTO families (family_name) VALUES ('Ивановы');

-- Тестовый пользователь-родитель
INSERT INTO users (name, email, password_hash, role, family_id) VALUES 
('Иван Иванов', 'ivan@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'parent', 1);

-- Тестовый ребенок
INSERT INTO children (family_id, name, balance, birth_date) VALUES 
(1, 'Петр Иванов', 10, '2015-05-15');

-- Тестовый пользователь-тренер
INSERT INTO users (name, email, password_hash, role) VALUES 
('Алексей Петров', 'alexey@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'coach');

-- Тестовый тренер
INSERT INTO trainers (user_id, branch_id) VALUES (2, 1);

-- Тестовая тренировка
INSERT INTO trainings (branch_id, trainer_id, training_date, discipline_id) VALUES 
(1, 1, '2025-09-20 18:00:00', 1);