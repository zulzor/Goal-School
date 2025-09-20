const http = require('http');

console.log('🔍 ТЕСТИРОВАНИЕ ПОДКЛЮЧЕНИЯ К СЕРВЕРУ ФУТБОЛЬНОЙ ШКОЛЫ "АРСЕНАЛ"');
console.log('='.repeat(60));

function testConnection() {
    console.log('\n🚀 Проверка доступности сервера на порту 3003...');
    
    // Проверяем основной эндпоинт
    const mainReq = http.get('http://localhost:3003', (res) => {
        console.log(`✅ Основной эндпоинт: ${res.statusCode} ${res.statusMessage}`);
    }).on('error', (err) => {
        console.log(`❌ Основной эндпоинт: ${err.message}`);
    });
    
    // Проверяем API health endpoint
    const healthReq = http.get('http://localhost:3003/api/health', (res) => {
        console.log(`✅ API Health: ${res.statusCode} ${res.statusMessage}`);
    }).on('error', (err) => {
        console.log(`❌ API Health: ${err.message}`);
    });
    
    // Проверяем manifest
    const manifestReq = http.get('http://localhost:3003/manifest.json', (res) => {
        console.log(`✅ Manifest: ${res.statusCode} ${res.statusMessage}`);
    }).on('error', (err) => {
        console.log(`❌ Manifest: ${err.message}`);
    });
    
    // Устанавливаем таймаут для всех запросов
    mainReq.setTimeout(5000, () => {
        console.log('❌ Основной эндпоинт: Таймаут');
        mainReq.destroy();
    });
    
    healthReq.setTimeout(5000, () => {
        console.log('❌ API Health: Таймаут');
        healthReq.destroy();
    });
    
    manifestReq.setTimeout(5000, () => {
        console.log('❌ Manifest: Таймаут');
        manifestReq.destroy();
    });
}

// Выполняем тест
testConnection();

console.log('\n💡 Если все проверки прошли успешно, попробуйте обновить страницу в браузере.');
console.log('💡 Если вы по-прежнему видите сообщение об офлайн режиме, очистите кэш браузера.');