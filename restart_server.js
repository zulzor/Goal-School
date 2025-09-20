#!/usr/bin/env node

const { exec } = require('child_process');

console.log('🔄 ПЕРЕЗАПУСК СЕРВЕРА ФУТБОЛЬНОЙ ШКОЛЫ "АРСЕНАЛ"');
console.log('='.repeat(50));

// Функция для остановки сервера
function stopServer() {
    return new Promise((resolve) => {
        console.log('🛑 Остановка текущего сервера...');
        exec('taskkill /IM node.exe /F', (error, stdout, stderr) => {
            if (error) {
                console.log('ℹ️  Сервер, возможно, уже остановлен');
            } else {
                console.log('✅ Сервер остановлен');
            }
            // Небольшая задержка перед запуском нового сервера
            setTimeout(resolve, 2000);
        });
    });
}

// Функция для запуска сервера
function startServer() {
    return new Promise((resolve) => {
        console.log('🚀 Запуск сервера...');
        const serverProcess = exec('node main-server.js');
        
        serverProcess.stdout.on('data', (data) => {
            process.stdout.write(data);
            // Если сервер успешно запущен, выводим информацию
            if (data.includes('Сервер запущен на порту')) {
                console.log('\n✅ СЕРВЕР УСПЕШНО ЗАПУЩЕН!');
                console.log('\n🌐 ДОСТУП К ПРИЛОЖЕНИЮ:');
                console.log('   URL: http://localhost:3003');
                console.log('\n💡 СОВЕТЫ ПО ИСПОЛЬЗОВАНИЮ:');
                console.log('   • Откройте браузер и перейдите по указанному адресу');
                console.log('   • Если вы видите сообщение об офлайн режиме, нажмите "Попробовать снова"');
                console.log('   • При возникновении проблем очистите кэш браузера');
                resolve();
            }
        });
        
        serverProcess.stderr.on('data', (data) => {
            process.stderr.write(data);
        });
        
        serverProcess.on('error', (error) => {
            console.error('❌ Ошибка запуска сервера:', error);
        });
    });
}

// Основная функция перезапуска
async function restartServer() {
    try {
        await stopServer();
        await startServer();
    } catch (error) {
        console.error('❌ Ошибка перезапуска сервера:', error);
    }
}

// Запуск перезапуска
restartServer();