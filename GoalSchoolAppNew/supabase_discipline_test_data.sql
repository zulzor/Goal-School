-- Тестовые данные для дисциплин
INSERT INTO disciplines (name, description, unit, is_active, created_by) VALUES
('Змейка', 'Прохождение змейки между конусами', 'time', true, NULL),
('Бег 30 метров', 'Спринт на 30 метров', 'time', true, NULL),
('Прыжок в длину', 'Прыжок в длину с места', 'distance', true, NULL),
('Отжимания', 'Количество отжиманий за 30 секунд', 'points', true, NULL),
('Пресс', 'Количество подъемов туловища за 30 секунд', 'points', true, NULL);

-- Тестовые результаты для дисциплин
-- Предполагаем, что у нас есть тестовые пользователи с ID
-- admin1@gs.com (ребенок) - ID: 'child-user-id'
-- admin4@gs.com (тренер) - ID: 'coach-user-id'

-- Примеры результатов (в реальности ID будут другими)
-- INSERT INTO discipline_results (discipline_id, user_id, result_value, age_group, standard_result, coach_id) VALUES
-- ('discipline-id-1', 'child-user-id', 22800, 'U-10 (до 10 лет)', 22800, 'coach-user-id'),
-- ('discipline-id-1', 'child-user-id', 23500, 'U-10 (до 10 лет)', 22800, 'coach-user-id'),
-- ('discipline-id-2', 'child-user-id', 5200, 'U-10 (до 10 лет)', 5000, 'coach-user-id');