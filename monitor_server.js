#!/usr/bin/env node

const http = require('http');

console.log('🔍 МОНИТОРИНГ СЕРВЕРА ФУТБОЛЬНОЙ ШКОЛЫ "АРСЕНАЛ"');
console.log('='.repeat(50));

// Функция для проверки доступности сервера
async function checkServer() {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:3003/api/health', (res) => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        statusCode: res.statusCode,
                        statusMessage: res.statusMessage,
                        data: jsonData,
                        success: res.statusCode === 200
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        statusMessage: res.statusMessage,
                        data: data,
                        success: res.statusCode === 200
                    });
                }
            });
        }).on('error', (err) => {
            resolve({
                statusCode: 0,
                statusMessage: err.message,
                data: null,
                success: false
            });
        });
        
        // Таймаут 5 секунд
        req.setTimeout(5000, () => {
            req.destroy();
            resolve({
                statusCode: 0,
                statusMessage: 'Timeout',
                data: null,
                success: false
            });
        });
    });
}

// Функция для непрерывного мониторинга
async function monitorContinuously() {
    console.log('\n🔍 НЕПРЕРЫВНЫЙ МОНИТОРИНГ (нажмите Ctrl+C для остановки)\n');
    
    let checkCount = 0;
    let successCount = 0;
    let errorCount = 0;
    
    const interval = setInterval(async () => {
        checkCount++;
        const result = await checkServer();
        
        if (result.success) {
            successCount++;
            console.log(`✅ Проверка ${checkCount}: Сервер доступен - ${result.data.status}`);
        } else {
            errorCount++;
            console.log(`❌ Проверка ${checkCount}: Ошибка - ${result.statusMessage}`);
        }
        
        // Выводим статистику каждые 10 проверок
        if (checkCount % 10 === 0) {
            const successRate = ((successCount / checkCount) * 100).toFixed(1);
            console.log(`\n📊 Статистика: ${checkCount} проверок, ${successCount} успешных, ${errorCount} ошибок, ${successRate}% успеха\n`);
        }
    }, 3000); // Проверяем каждые 3 секунды
    
    // Обработка сигнала остановки
    process.on('SIGINT', () => {
        clearInterval(interval);
        const successRate = checkCount > 0 ? ((successCount / checkCount) * 100).toFixed(1) : 0;
        console.log(`\n\n🛑 Мониторинг остановлен`);
        console.log(`📊 Итоговая статистика:`);
        console.log(`   Всего проверок: ${checkCount}`);
        console.log(`   Успешных: ${successCount}`);
        console.log(`   Ошибок: ${errorCount}`);
        console.log(`   Процент успеха: ${successRate}%`);
        process.exit(0);
    });
}

// Функция для однократной проверки
async function singleCheck() {
    console.log('\n🔍 ОДНОКРАТНАЯ ПРОВЕРКА СЕРВЕРА...\n');
    
    const result = await checkServer();
    
    if (result.success) {
        console.log(`✅ Сервер доступен!`);
        console.log(`   Статус: ${result.data.status}`);
        console.log(`   Время: ${result.data.timestamp}`);
        console.log(`   Версия: ${result.data.version || 'Не указана'}`);
    } else {
        console.log(`❌ Сервер недоступен!`);
        console.log(`   Ошибка: ${result.statusMessage}`);
        console.log(`   Код: ${result.statusCode}`);
    }
    
    return result.success;
}

// Основная функция
async function main() {
    // Проверяем аргументы командной строки
    const args = process.argv.slice(2);
    
    if (args.includes('--continuous') || args.includes('-c')) {
        // Непрерывный мониторинг
        await monitorContinuously();
    } else {
        // Однократная проверка
        const success = await singleCheck();
        process.exit(success ? 0 : 1);
    }
}

// Запуск
main().catch(console.error);