<?php
// api/index.php - Главная точка входа API

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Обработка OPTIONS запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Подключение обработчика ошибок
include_once '../config/error_handler.php';

// Подключение файлов
include_once '../config/database.php';
include_once '../config/auth.php';
include_once '../models/User.php';
include_once '../models/Family.php';
include_once '../models/Child.php';
include_once '../models/Branch.php';
include_once '../models/Trainer.php';
include_once '../models/Training.php';
include_once '../models/Discipline.php';
include_once '../models/Attendance.php';
include_once '../models/Progress.php';
// Добавляем новые модели
include_once '../models/Subscription.php';
include_once '../models/SubscriptionPurchase.php';
include_once '../models/FamilyTransfer.php';
include_once '../models/TrainerTransfer.php';
include_once '../models/CancelledTraining.php';

// Map database roles to frontend roles
function mapDatabaseRoleToFrontendRole($dbRole) {
    switch ($dbRole) {
        case 'admin':
            return 'manager'; // In database it's 'admin', in frontend it's 'manager'
        case 'manager':
            return 'manager';
        case 'coach':
            return 'coach';
        case 'parent':
            return 'parent';
        case 'child':
            return 'child';
        case 'smm_manager':
            return 'smm_manager';
        default:
            return 'child'; // Default fallback
    }
}

// Получение соединения с базой данных
$database = new Database();
$db = $database->getConnection();

// Получение метода запроса
$method = $_SERVER['REQUEST_METHOD'];

// Получение пути запроса
$request_uri = $_SERVER['REQUEST_URI'];
$path_parts = explode('/', trim($request_uri, '/'));

// Определение конечной точки API
$endpoint = isset($path_parts[1]) ? $path_parts[1] : '';

// Получение токена из заголовков
$headers = getallheaders();
$token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : '';

// Аутентификация
$auth = new Auth($db);

// Проверка токена для защищенных маршрутов
if($endpoint !== 'auth' && !empty($endpoint)) {
    $token_check = $auth->checkToken($token);
    if(!$token_check['success']) {
        http_response_code(401);
        echo json_encode(["message" => "Неавторизованный доступ"]);
        exit();
    }
}

// Обработка запросов в зависимости от конечной точки
switch($endpoint) {
    case 'auth':
        handleAuth($method, $db, $auth);
        break;
    case 'users':
        handleUsers($method, $db);
        break;
    case 'families':
        handleFamilies($method, $db);
        break;
    case 'children':
        handleChildren($method, $db);
        break;
    case 'branches':
        handleBranches($method, $db);
        break;
    case 'trainers':
        handleTrainers($method, $db);
        break;
    case 'trainings':
        handleTrainings($method, $db);
        break;
    case 'disciplines':
        handleDisciplines($method, $db);
        break;
    case 'attendance':
        handleAttendance($method, $db);
        break;
    case 'progress':
        handleProgress($method, $db);
        break;
    // Добавляем новые конечные точки
    case 'subscriptions':
        handleSubscriptions($method, $db);
        break;
    case 'subscription-purchases':
        handleSubscriptionPurchases($method, $db);
        break;
    case 'family-transfers':
        handleFamilyTransfers($method, $db);
        break;
    case 'trainer-transfers':
        handleTrainerTransfers($method, $db);
        break;
    case 'cancelled-trainings':
        handleCancelledTrainings($method, $db);
        break;
    default:
        http_response_code(404);
        echo json_encode(["message" => "Конечная точка не найдена"]);
        break;
}

// Функции обработки запросов

function handleAuth($method, $db, $auth) {
    if($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"));
        
        if(isset($data->action)) {
            switch($data->action) {
                case 'register':
                    if(isset($data->name) && isset($data->email) && isset($data->password) && isset($data->role)) {
                        $result = $auth->register(
                            $data->name, 
                            $data->email, 
                            $data->password, 
                            $data->role,
                            isset($data->family_id) ? $data->family_id : null,
                            isset($data->child_id) ? $data->child_id : null
                        );
                        http_response_code($result['success'] ? 201 : 400);
                        echo json_encode($result);
                    } else {
                        http_response_code(400);
                        echo json_encode(["message" => "Необходимы все обязательные поля"]);
                    }
                    break;
                case 'login':
                    if(isset($data->email) && isset($data->password)) {
                        $result = $auth->login($data->email, $data->password);
                        http_response_code($result['success'] ? 200 : 401);
                        echo json_encode($result);
                    } else {
                        http_response_code(400);
                        echo json_encode(["message" => "Email и пароль обязательны"]);
                    }
                    break;
                default:
                    http_response_code(400);
                    echo json_encode(["message" => "Недопустимое действие"]);
                    break;
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Действие обязательно"]);
        }
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Метод не разрешен"]);
    }
}

function handleUsers($method, $db) {
    $user = new User($db);
    
    switch($method) {
        case 'GET':
            // Получение всех пользователей
            $stmt = $user->getAll();
            $users_arr = array();
            $users_arr["records"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $user_item = array(
                    "id" => $id,
                    "name" => $name,
                    "email" => $email,
                    "role" => mapDatabaseRoleToFrontendRole($role),
                    "family_id" => $family_id,
                    "child_id" => $child_id
                );
                array_push($users_arr["records"], $user_item);
            }
            
            http_response_code(200);
            echo json_encode($users_arr);
            break;
        case 'POST':
            // Создание нового пользователя
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->name) && isset($data->email) && isset($data->password) && isset($data->role)) {
                $user->name = $data->name;
                $user->email = $data->email;
                $user->password_hash = password_hash($data->password, PASSWORD_DEFAULT);
                $user->role = $data->role;
                $user->family_id = isset($data->family_id) ? $data->family_id : null;
                $user->child_id = isset($data->child_id) ? $data->child_id : null;
                
                if($user->create()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Пользователь создан", "id" => $user->id));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Невозможно создать пользователя"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимы все обязательные поля"));
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(array("message" => "Метод не разрешен"));
            break;
    }
}

function handleFamilies($method, $db) {
    $family = new Family($db);
    
    switch($method) {
        case 'GET':
            // Получение всех семей
            $stmt = $family->getAll();
            $families_arr = array();
            $families_arr["records"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $family_item = array(
                    "id" => $id,
                    "family_name" => $family_name
                );
                array_push($families_arr["records"], $family_item);
            }
            
            http_response_code(200);
            echo json_encode($families_arr);
            break;
        case 'POST':
            // Создание новой семьи
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->family_name)) {
                $family->family_name = $data->family_name;
                
                if($family->create()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Семья создана", "id" => $family->id));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Невозможно создать семью"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимо указать название семьи"));
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(array("message" => "Метод не разрешен"));
            break;
    }
}

function handleChildren($method, $db) {
    $child = new Child($db);
    
    switch($method) {
        case 'GET':
            // Получение детей по семье
            $family_id = isset($_GET['family_id']) ? $_GET['family_id'] : null;
            
            if($family_id) {
                $stmt = $child->getByFamilyId($family_id);
                $children_arr = array();
                $children_arr["records"] = array();
                
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $child_item = array(
                        "id" => $id,
                        "family_id" => $family_id,
                        "name" => $name,
                        "balance" => $balance,
                        "birth_date" => $birth_date
                    );
                    array_push($children_arr["records"], $child_item);
                }
                
                http_response_code(200);
                echo json_encode($children_arr);
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимо указать family_id"));
            }
            break;
        case 'POST':
            // Создание нового ребенка
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->family_id) && isset($data->name)) {
                $child->family_id = $data->family_id;
                $child->name = $data->name;
                $child->balance = isset($data->balance) ? $data->balance : 0;
                $child->birth_date = isset($data->birth_date) ? $data->birth_date : null;
                
                if($child->create()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Ребенок создан", "id" => $child->id));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Невозможно создать ребенка"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимы family_id и name"));
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(array("message" => "Метод не разрешен"));
            break;
    }
}

function handleBranches($method, $db) {
    $branch = new Branch($db);
    
    switch($method) {
        case 'GET':
            // Получение всех филиалов
            $stmt = $branch->getAll();
            $branches_arr = array();
            $branches_arr["records"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $branch_item = array(
                    "id" => $id,
                    "name" => $name,
                    "address" => $address,
                    "phone" => $phone,
                    "email" => $email,
                    "manager_id" => $manager_id,
                    "is_active" => $is_active
                );
                array_push($branches_arr["records"], $branch_item);
            }
            
            http_response_code(200);
            echo json_encode($branches_arr);
            break;
        case 'POST':
            // Создание нового филиала
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->name) && isset($data->address)) {
                $branch->name = $data->name;
                $branch->address = $data->address;
                $branch->phone = isset($data->phone) ? $data->phone : null;
                $branch->email = isset($data->email) ? $data->email : null;
                $branch->manager_id = isset($data->manager_id) ? $data->manager_id : null;
                $branch->is_active = isset($data->is_active) ? $data->is_active : true;
                
                if($branch->create()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Филиал создан", "id" => $branch->id));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Невозможно создать филиал"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимы name и address"));
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(array("message" => "Метод не разрешен"));
            break;
    }
}

function handleTrainers($method, $db) {
    $trainer = new Trainer($db);
    
    switch($method) {
        case 'GET':
            // Получение всех тренеров
            $stmt = $trainer->getAll();
            $trainers_arr = array();
            $trainers_arr["records"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $trainer_item = array(
                    "id" => $id,
                    "user_id" => $user_id,
                    "branch_id" => $branch_id,
                    "trainer_name" => $trainer_name,
                    "branch_name" => $branch_name
                );
                array_push($trainers_arr["records"], $trainer_item);
            }
            
            http_response_code(200);
            echo json_encode($trainers_arr);
            break;
        case 'POST':
            // Создание нового тренера
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->user_id) && isset($data->branch_id)) {
                $trainer->user_id = $data->user_id;
                $trainer->branch_id = $data->branch_id;
                
                if($trainer->create()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Тренер создан", "id" => $trainer->id));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Невозможно создать тренера"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимы user_id и branch_id"));
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(array("message" => "Метод не разрешен"));
            break;
    }
}

function handleTrainings($method, $db) {
    $training = new Training($db);
    
    switch($method) {
        case 'GET':
            // Получение всех тренировок
            $stmt = $training->getAll();
            $trainings_arr = array();
            $trainings_arr["records"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $training_item = array(
                    "id" => $id,
                    "branch_id" => $branch_id,
                    "trainer_id" => $trainer_id,
                    "training_date" => $training_date,
                    "discipline_id" => $discipline_id,
                    "branch_name" => $branch_name,
                    "discipline_name" => $discipline_name
                );
                array_push($trainings_arr["records"], $training_item);
            }
            
            http_response_code(200);
            echo json_encode($trainings_arr);
            break;
        case 'POST':
            // Создание новой тренировки
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->branch_id) && isset($data->trainer_id) && isset($data->training_date) && isset($data->discipline_id)) {
                $training->branch_id = $data->branch_id;
                $training->trainer_id = $data->trainer_id;
                $training->training_date = $data->training_date;
                $training->discipline_id = $data->discipline_id;
                
                if($training->create()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Тренировка создана", "id" => $training->id));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Невозможно создать тренировку"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимы branch_id, trainer_id, training_date и discipline_id"));
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(array("message" => "Метод не разрешен"));
            break;
    }
}

function handleDisciplines($method, $db) {
    $discipline = new Discipline($db);
    
    switch($method) {
        case 'GET':
            // Получение всех дисциплин
            $stmt = $discipline->getAll();
            $disciplines_arr = array();
            $disciplines_arr["records"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $discipline_item = array(
                    "id" => $id,
                    "discipline_name" => $discipline_name
                );
                array_push($disciplines_arr["records"], $discipline_item);
            }
            
            http_response_code(200);
            echo json_encode($disciplines_arr);
            break;
        case 'POST':
            // Создание новой дисциплины
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->discipline_name)) {
                $discipline->discipline_name = $data->discipline_name;
                
                if($discipline->create()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Дисциплина создана", "id" => $discipline->id));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Невозможно создать дисциплину"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимо указать название дисциплины"));
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(array("message" => "Метод не разрешен"));
            break;
    }
}

function handleAttendance($method, $db) {
    $attendance = new Attendance($db);
    
    switch($method) {
        case 'GET':
            // Получение посещаемости по тренировке
            $training_id = isset($_GET['training_id']) ? $_GET['training_id'] : null;
            
            if($training_id) {
                $stmt = $attendance->getByTrainingId($training_id);
                $attendance_arr = array();
                $attendance_arr["records"] = array();
                
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $attendance_item = array(
                        "id" => $id,
                        "training_id" => $training_id,
                        "child_id" => $child_id,
                        "visited" => $visited,
                        "confirmed_by_coach" => $confirmed_by_coach,
                        "child_name" => $child_name
                    );
                    array_push($attendance_arr["records"], $attendance_item);
                }
                
                http_response_code(200);
                echo json_encode($attendance_arr);
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимо указать training_id"));
            }
            break;
        case 'POST':
            // Создание записи о посещаемости
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->training_id) && isset($data->child_id)) {
                $attendance->training_id = $data->training_id;
                $attendance->child_id = $data->child_id;
                $attendance->visited = isset($data->visited) ? $data->visited : false;
                $attendance->confirmed_by_coach = isset($data->confirmed_by_coach) ? $data->confirmed_by_coach : false;
                
                // Проверка, существует ли уже запись
                if(!$attendance->exists($data->training_id, $data->child_id)) {
                    if($attendance->create()) {
                        http_response_code(201);
                        echo json_encode(array("message" => "Запись о посещаемости создана", "id" => $attendance->id));
                    } else {
                        http_response_code(503);
                        echo json_encode(array("message" => "Невозможно создать запись о посещаемости"));
                    }
                } else {
                    http_response_code(409);
                    echo json_encode(array("message" => "Запись о посещаемости уже существует"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимы training_id и child_id"));
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(array("message" => "Метод не разрешен"));
            break;
    }
}

function handleProgress($method, $db) {
    $progress = new Progress($db);
    
    switch($method) {
        case 'GET':
            // Получение прогресса по ребенку
            $child_id = isset($_GET['child_id']) ? $_GET['child_id'] : null;
            
            if($child_id) {
                $stmt = $progress->getByChildId($child_id);
                $progress_arr = array();
                $progress_arr["records"] = array();
                
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $progress_item = array(
                        "id" => $id,
                        "child_id" => $child_id,
                        "discipline_id" => $discipline_id,
                        "value" => $value,
                        "measurement_date" => $measurement_date,
                        "discipline_name" => $discipline_name
                    );
                    array_push($progress_arr["records"], $progress_item);
                }
                
                http_response_code(200);
                echo json_encode($progress_arr);
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимо указать child_id"));
            }
            break;
        case 'POST':
            // Создание записи о прогрессе
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->child_id) && isset($data->discipline_id) && isset($data->value) && isset($data->measurement_date)) {
                $progress->child_id = $data->child_id;
                $progress->discipline_id = $data->discipline_id;
                $progress->value = $data->value;
                $progress->measurement_date = $data->measurement_date;
                
                if($progress->create()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Запись о прогрессе создана", "id" => $progress->id));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Невозможно создать запись о прогрессе"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимы child_id, discipline_id, value и measurement_date"));
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(array("message" => "Метод не разрешен"));
            break;
    }
}

// Новые функции обработки запросов

function handleSubscriptions($method, $db) {
    $subscription = new Subscription($db);
    
    switch($method) {
        case 'GET':
            // Получение всех абонементов
            $active_only = isset($_GET['active_only']) ? $_GET['active_only'] : false;
            
            if($active_only) {
                $stmt = $subscription->getAllActive();
            } else {
                $stmt = $subscription->getAll();
            }
            
            $subscriptions_arr = array();
            $subscriptions_arr["records"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $subscription_item = array(
                    "id" => $id,
                    "name" => $name,
                    "description" => $description,
                    "price" => $price,
                    "num_trainings" => $num_trainings,
                    "validity_period" => $validity_period,
                    "is_active" => $is_active
                );
                array_push($subscriptions_arr["records"], $subscription_item);
            }
            
            http_response_code(200);
            echo json_encode($subscriptions_arr);
            break;
        case 'POST':
            // Создание нового абонемента
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->name) && isset($data->price) && isset($data->num_trainings) && isset($data->validity_period)) {
                $subscription->name = $data->name;
                $subscription->description = isset($data->description) ? $data->description : '';
                $subscription->price = $data->price;
                $subscription->num_trainings = $data->num_trainings;
                $subscription->validity_period = $data->validity_period;
                $subscription->is_active = isset($data->is_active) ? $data->is_active : true;
                
                if($subscription->create()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Абонемент создан", "id" => $subscription->id));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Невозможно создать абонемент"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимы name, price, num_trainings и validity_period"));
            }
            break;
        case 'PUT':
            // Обновление абонемента
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->id)) {
                $subscription->id = $data->id;
                $subscription->name = isset($data->name) ? $data->name : $subscription->name;
                $subscription->description = isset($data->description) ? $data->description : $subscription->description;
                $subscription->price = isset($data->price) ? $data->price : $subscription->price;
                $subscription->num_trainings = isset($data->num_trainings) ? $data->num_trainings : $subscription->num_trainings;
                $subscription->validity_period = isset($data->validity_period) ? $data->validity_period : $subscription->validity_period;
                $subscription->is_active = isset($data->is_active) ? $data->is_active : $subscription->is_active;
                
                if($subscription->update()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Абонемент обновлен"));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Невозможно обновить абонемент"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимо указать ID абонемента"));
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(array("message" => "Метод не разрешен"));
            break;
    }
}

function handleSubscriptionPurchases($method, $db) {
    $purchase = new SubscriptionPurchase($db);
    
    switch($method) {
        case 'GET':
            // Получение покупок абонементов
            $child_id = isset($_GET['child_id']) ? $_GET['child_id'] : null;
            $active_only = isset($_GET['active_only']) ? $_GET['active_only'] : false;
            
            if($child_id) {
                if($active_only) {
                    $stmt = $purchase->getActiveByChildId($child_id);
                } else {
                    $stmt = $purchase->getByChildId($child_id);
                }
            } else {
                $stmt = $purchase->getAll();
            }
            
            $purchases_arr = array();
            $purchases_arr["records"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $purchase_item = array(
                    "id" => $id,
                    "child_id" => $child_id,
                    "subscription_id" => $subscription_id,
                    "manager_id" => $manager_id,
                    "purchase_date" => $purchase_date,
                    "start_date" => $start_date,
                    "end_date" => $end_date,
                    "num_trainings" => $num_trainings,
                    "remaining_trainings" => $remaining_trainings,
                    "total_cost" => $total_cost
                );
                array_push($purchases_arr["records"], $purchase_item);
            }
            
            http_response_code(200);
            echo json_encode($purchases_arr);
            break;
        case 'POST':
            // Создание новой покупки абонемента
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->child_id) && isset($data->subscription_id) && isset($data->manager_id) && 
               isset($data->start_date) && isset($data->end_date) && isset($data->num_trainings) && 
               isset($data->total_cost)) {
                $purchase->child_id = $data->child_id;
                $purchase->subscription_id = $data->subscription_id;
                $purchase->manager_id = $data->manager_id;
                $purchase->purchase_date = date('Y-m-d H:i:s');
                $purchase->start_date = $data->start_date;
                $purchase->end_date = $data->end_date;
                $purchase->num_trainings = $data->num_trainings;
                $purchase->remaining_trainings = isset($data->remaining_trainings) ? $data->remaining_trainings : $data->num_trainings;
                $purchase->total_cost = $data->total_cost;
                
                if($purchase->create()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Покупка абонемента создана", "id" => $purchase->id));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Невозможно создать покупку абонемента"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимы child_id, subscription_id, manager_id, start_date, end_date, num_trainings и total_cost"));
            }
            break;
        case 'PUT':
            // Обновление оставшихся тренировок
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->id) && isset($data->remaining_trainings)) {
                if($purchase->updateRemainingTrainings($data->id, $data->remaining_trainings)) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Оставшиеся тренировки обновлены"));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Невозможно обновить оставшиеся тренировки"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимы ID покупки и количество оставшихся тренировок"));
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(array("message" => "Метод не разрешен"));
            break;
    }
}

function handleFamilyTransfers($method, $db) {
    $transfer = new FamilyTransfer($db);
    
    switch($method) {
        case 'GET':
            // Получение переводов семей
            $family_id = isset($_GET['family_id']) ? $_GET['family_id'] : null;
            $pending_only = isset($_GET['pending_only']) ? $_GET['pending_only'] : false;
            
            if($family_id) {
                $stmt = $transfer->getByFamilyId($family_id);
            } else if($pending_only) {
                $stmt = $transfer->getPendingTransfers();
            } else {
                $stmt = $transfer->getAll();
            }
            
            $transfers_arr = array();
            $transfers_arr["records"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $transfer_item = array(
                    "id" => $id,
                    "family_id" => $family_id,
                    "from_branch_id" => $from_branch_id,
                    "to_branch_id" => $to_branch_id,
                    "initiated_by" => $initiated_by,
                    "reason" => $reason,
                    "status" => $status,
                    "approved_by" => $approved_by,
                    "approved_at" => $approved_at,
                    "transfer_date" => $transfer_date,
                    "created_at" => $created_at,
                    "updated_at" => $updated_at
                );
                array_push($transfers_arr["records"], $transfer_item);
            }
            
            http_response_code(200);
            echo json_encode($transfers_arr);
            break;
        case 'POST':
            // Создание нового перевода семьи
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->family_id) && isset($data->from_branch_id) && isset($data->to_branch_id) && 
               isset($data->initiated_by) && isset($data->transfer_date)) {
                $transfer->family_id = $data->family_id;
                $transfer->from_branch_id = $data->from_branch_id;
                $transfer->to_branch_id = $data->to_branch_id;
                $transfer->initiated_by = $data->initiated_by;
                $transfer->reason = isset($data->reason) ? $data->reason : '';
                $transfer->transfer_date = $data->transfer_date;
                $transfer->status = 'pending';
                
                if($transfer->create()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Запрос на перевод семьи создан", "id" => $transfer->id));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Невозможно создать запрос на перевод семьи"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимы family_id, from_branch_id, to_branch_id, initiated_by и transfer_date"));
            }
            break;
        case 'PUT':
            // Обновление статуса перевода семьи
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->id) && isset($data->status)) {
                $approved_by = isset($data->approved_by) ? $data->approved_by : null;
                if($transfer->updateStatus($data->id, $data->status, $approved_by)) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Статус перевода семьи обновлен"));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Невозможно обновить статус перевода семьи"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимы ID перевода и статус"));
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(array("message" => "Метод не разрешен"));
            break;
    }
}

function handleTrainerTransfers($method, $db) {
    $transfer = new TrainerTransfer($db);
    
    switch($method) {
        case 'GET':
            // Получение переводов тренеров
            $trainer_id = isset($_GET['trainer_id']) ? $_GET['trainer_id'] : null;
            $pending_only = isset($_GET['pending_only']) ? $_GET['pending_only'] : false;
            
            if($trainer_id) {
                $stmt = $transfer->getByTrainerId($trainer_id);
            } else if($pending_only) {
                $stmt = $transfer->getPendingTransfers();
            } else {
                $stmt = $transfer->getAll();
            }
            
            $transfers_arr = array();
            $transfers_arr["records"] = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $transfer_item = array(
                    "id" => $id,
                    "trainer_id" => $trainer_id,
                    "from_branch_id" => $from_branch_id,
                    "to_branch_id" => $to_branch_id,
                    "initiated_by" => $initiated_by,
                    "reason" => $reason,
                    "status" => $status,
                    "approved_by" => $approved_by,
                    "approved_at" => $approved_at,
                    "transfer_date" => $transfer_date,
                    "created_at" => $created_at,
                    "updated_at" => $updated_at
                );
                array_push($transfers_arr["records"], $transfer_item);
            }
            
            http_response_code(200);
            echo json_encode($transfers_arr);
            break;
        case 'POST':
            // Создание нового перевода тренера
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->trainer_id) && isset($data->from_branch_id) && isset($data->to_branch_id) && 
               isset($data->initiated_by) && isset($data->transfer_date)) {
                $transfer->trainer_id = $data->trainer_id;
                $transfer->from_branch_id = $data->from_branch_id;
                $transfer->to_branch_id = $data->to_branch_id;
                $transfer->initiated_by = $data->initiated_by;
                $transfer->reason = isset($data->reason) ? $data->reason : '';
                $transfer->transfer_date = $data->transfer_date;
                $transfer->status = 'pending';
                
                if($transfer->create()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Запрос на перевод тренера создан", "id" => $transfer->id));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Невозможно создать запрос на перевод тренера"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимы trainer_id, from_branch_id, to_branch_id, initiated_by и transfer_date"));
            }
            break;
        case 'PUT':
            // Обновление статуса перевода тренера
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->id) && isset($data->status)) {
                $approved_by = isset($data->approved_by) ? $data->approved_by : null;
                if($transfer->updateStatus($data->id, $data->status, $approved_by)) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Статус перевода тренера обновлен"));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Невозможно обновить статус перевода тренера"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимы ID перевода и статус"));
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(array("message" => "Метод не разрешен"));
            break;
    }
}

function handleCancelledTrainings($method, $db) {
    $cancelled = new CancelledTraining($db);
    
    switch($method) {
        case 'GET':
            // Получение отмененных тренировок
            $training_id = isset($_GET['training_id']) ? $_GET['training_id'] : null;
            $start_date = isset($_GET['start_date']) ? $_GET['start_date'] : null;
            $end_date = isset($_GET['end_date']) ? $_GET['end_date'] : null;
            
            if($training_id) {
                // Получение по ID тренировки
                if($cancelled->getByTrainingId($training_id)) {
                    $cancelled_item = array(
                        "id" => $cancelled->id,
                        "training_id" => $cancelled->training_id,
                        "cancelled_by" => $cancelled->cancelled_by,
                        "reason" => $cancelled->reason,
                        "cancelled_at" => $cancelled->cancelled_at,
                        "refund_policy_applied" => $cancelled->refund_policy_applied
                    );
                    http_response_code(200);
                    echo json_encode($cancelled_item);
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "Отмененная тренировка не найдена"));
                }
            } else if($start_date && $end_date) {
                // Получение по диапазону дат
                $stmt = $cancelled->getByDateRange($start_date, $end_date);
                $cancelled_arr = array();
                $cancelled_arr["records"] = array();
                
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $cancelled_item = array(
                        "id" => $id,
                        "training_id" => $training_id,
                        "cancelled_by" => $cancelled_by,
                        "reason" => $reason,
                        "cancelled_at" => $cancelled_at,
                        "refund_policy_applied" => $refund_policy_applied
                    );
                    array_push($cancelled_arr["records"], $cancelled_item);
                }
                
                http_response_code(200);
                echo json_encode($cancelled_arr);
            } else {
                // Получение всех отмененных тренировок
                $stmt = $cancelled->getAll();
                $cancelled_arr = array();
                $cancelled_arr["records"] = array();
                
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $cancelled_item = array(
                        "id" => $id,
                        "training_id" => $training_id,
                        "cancelled_by" => $cancelled_by,
                        "reason" => $reason,
                        "cancelled_at" => $cancelled_at,
                        "refund_policy_applied" => $refund_policy_applied
                    );
                    array_push($cancelled_arr["records"], $cancelled_item);
                }
                
                http_response_code(200);
                echo json_encode($cancelled_arr);
            }
            break;
        case 'POST':
            // Создание записи об отмене тренировки
            $data = json_decode(file_get_contents("php://input"));
            
            if(isset($data->training_id) && isset($data->cancelled_by) && isset($data->reason)) {
                $cancelled->training_id = $data->training_id;
                $cancelled->cancelled_by = $data->cancelled_by;
                $cancelled->reason = $data->reason;
                $cancelled->refund_policy_applied = isset($data->refund_policy_applied) ? $data->refund_policy_applied : false;
                
                if($cancelled->create()) {
                    http_response_code(201);
                    echo json_encode(array("message" => "Тренировка отменена", "id" => $cancelled->id));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Невозможно отменить тренировку"));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Необходимы training_id, cancelled_by и reason"));
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(array("message" => "Метод не разрешен"));
            break;
    }
}
?>