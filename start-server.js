#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 ЗАПУСК ЕДИНОГО СЕРВЕРА ФУТБОЛЬНОЙ ШКОЛЫ "АРСЕНАЛ"');
console.log('='.repeat(60));

// Функция для запуска команды
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔧 Выполняем: ${command} ${args.join(' ')}`);

    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options,
    });

    child.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Команда завершена с кодом ${code}`));
      }
    });

    child.on('error', error => {
      reject(error);
    });
  });
}

// Основная функция запуска
async function startServer() {
  try {
    console.log('🔍 Проверяем наличие собранной веб-версии...');

    const fs = require('fs');
    const webExportPath = path.join(__dirname, 'web-export');

    if (!fs.existsSync(webExportPath)) {
      console.log('⚠️  Собранная версия не найдена.');
      console.log('💡 Рекомендуется выполнить сборку командой:');
      console.log('   npm run build-web');
    } else {
      console.log('✅ Собранная версия найдена');
    }

    console.log('\n🚀 Запускаем единый сервер...');
    console.log(`🌐 Сервер будет доступен по адресу: http://localhost:${process.env.PORT || 3003}`);

    // Запускаем сервер
    await runCommand('node', ['main-server.js']);
  } catch (error) {
    console.error('❌ Ошибка при запуске сервера:', error.message);
    process.exit(1);
  }
}

// Запускаем сервер
startServer();