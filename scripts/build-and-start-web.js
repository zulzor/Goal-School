const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 НАЧИНАЕМ СБОРКУ И ЗАПУСК ВЕБ-ПРИЛОЖЕНИЯ ФУТБОЛЬНОЙ ШКОЛЫ "АРСЕНАЛ"');
console.log('='.repeat(70));

// Функция для выполнения команды
function runCommand(command, onSuccess, onError) {
  console.log(`🔧 Выполняем команду: ${command}`);
  
  const child = exec(command, { cwd: path.join(__dirname, '..') });
  
  child.stdout.on('data', (data) => {
    process.stdout.write(data);
  });
  
  child.stderr.on('data', (data) => {
    process.stderr.write(data);
  });
  
  child.on('close', (code) => {
    if (code === 0) {
      onSuccess();
    } else {
      onError(code);
    }
  });
}

// Проверяем наличие необходимых файлов
const webExportDir = path.join(__dirname, '..', 'web-export');
console.log('🔍 Проверяем наличие папки web-export...');

if (!fs.existsSync(webExportDir)) {
  console.log('📁 Папка web-export не найдена, создаем...');
  fs.mkdirSync(webExportDir, { recursive: true });
}

// Шаг 1: Сборка веб-приложения
console.log('\n🔨 ШАГ 1: СБОРКА ВЕБ-ПРИЛОЖЕНИЯ');
runCommand(
  'npx expo export:web --dev',
  () => {
    console.log('✅ Сборка веб-приложения завершена успешно!');
    
    // Шаг 2: Запуск сервера
    console.log('\n🚀 ШАГ 2: ЗАПУСК СЕРВЕРА');
    runCommand(
      'node main-server.js',
      () => {
        console.log('✅ Сервер запущен успешно!');
        console.log('\n🌐 Веб-приложение доступно по адресу: http://localhost:3003');
        console.log('📂 Папка с файлами: ' + webExportDir);
        console.log('\n' + '='.repeat(70));
        console.log('💡 Для остановки сервера нажмите Ctrl+C');
        console.log('💡 Для пересборки приложения запустите этот скрипт снова');
        console.log('='.repeat(70));
      },
      (code) => {
        console.error(`❌ Ошибка запуска сервера. Код ошибки: ${code}`);
        process.exit(1);
      }
    );
  },
  (code) => {
    console.error(`❌ Ошибка сборки веб-приложения. Код ошибки: ${code}`);
    console.log('💡 Попробуйте выполнить команду вручную: npx expo export:web --dev');
    process.exit(1);
  }
);