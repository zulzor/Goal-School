const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 ЗАПУСК ФУТБОЛЬНОЙ ШКОЛЫ "АРСЕНАЛ" - ВЕБ-ВЕРСИЯ');
console.log('='.repeat(50));

// Функция для запуска команды
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\nВыполняем: ${command} ${args.join(' ')}`);

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
async function launchApp() {
  try {
    console.log('🔍 Проверяем наличие собранной веб-версии...');

    const fs = require('fs');
    const webExportPath = path.join(__dirname, 'web-export');

    if (!fs.existsSync(webExportPath)) {
      console.log('⚠️  Собранная версия не найдена. Запускаем сборку...');
      await runCommand('node', ['build-full-web.js']);
    } else {
      console.log('✅ Собранная версия найдена');
    }

    console.log('\n🚀 Запускаем веб-сервер...');
    console.log('Сервер будет доступен по адресу: http://localhost:8080');

    // Запускаем сервер
    await runCommand('node', ['final-web-server.js']);
  } catch (error) {
    console.error('❌ Ошибка при запуске приложения:', error.message);
    process.exit(1);
  }
}

// Запускаем приложение
launchApp();
