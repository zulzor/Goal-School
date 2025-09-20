<?php
// config/error_handler.php - Обработчик ошибок

class ErrorHandler {
    public static function handleException($exception) {
        http_response_code(500);
        echo json_encode([
            "message" => "Внутренняя ошибка сервера",
            "error" => $exception->getMessage(),
            "file" => $exception->getFile(),
            "line" => $exception->getLine()
        ]);
    }
    
    public static function handleError($severity, $message, $file, $line) {
        throw new ErrorException($message, 0, $severity, $file, $line);
    }
    
    public static function handleShutdown() {
        $error = error_get_last();
        if ($error !== null) {
            http_response_code(500);
            echo json_encode([
                "message" => "Критическая ошибка",
                "error" => $error['message'],
                "file" => $error['file'],
                "line" => $error['line']
            ]);
        }
    }
}

// Регистрация обработчиков ошибок
set_exception_handler(['ErrorHandler', 'handleException']);
set_error_handler(['ErrorHandler', 'handleError']);
register_shutdown_function(['ErrorHandler', 'handleShutdown']);
?>