#!/usr/bin/env node

const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

console.log('🔍 НАБЛЮДЕНИЕ ЗА ИЗМЕНЕНИЯМИ В ФАЙЛАХ ФУТБОЛЬНОЙ ШКОЛЫ "АРСЕНАЛ"');
console.log('='.repeat(70));

// Пути для наблюдения
const watchPaths = [
  'src/**/*',
  'App.tsx',
  'App.web.tsx',
  'index.web.ts'
];

// Игнорируемые пути
const ignoredPaths = [
  'node_modules/**/*',
  'web-export/**/*',
  'web-dist/**/*',
  'web-app/**/*',
  '*.log'
];

// Создаем наблюдатель
const watcher = chokidar.watch(watchPaths, {
  ignored: ignoredPaths,
  persistent: true,
  ignoreInitial: true
});

let isBuilding = false;
let rebuildQueued = false;

// Функция для выполнения сборки
function buildApp() {
  if (isBuilding) {
    rebuildQueued = true;
    return;
  }

  isBuilding = true;
  rebuildQueued = false;

  console.log('\n🔨 Начинаем сборку веб-приложения...');
  console.log(new Date().toLocaleString());

  const buildProcess = exec('npm run build-web', (error, stdout, stderr) => {
    isBuilding = false;

    if (error) {
      console.error('❌ Ошибка при сборке:');
      console.error(error);
      return;
    }

    if (stderr) {
      console.warn('⚠️  Предупреждения при сборке:');
      console.warn(stderr);
    }

    console.log('✅ Сборка завершена успешно!');
    console.log(stdout);

    // Если была запрошена повторная сборка, выполняем её
    if (rebuildQueued) {
      console.log('🔁 Выполняем повторную сборку...');
      setTimeout(buildApp, 1000);
    }
  });

  // Выводим логи в реальном времени
  buildProcess.stdout.on('data', data => {
    process.stdout.write(data);
  });

  buildProcess.stderr.on('data', data => {
    process.stderr.write(data);
  });
}

// Обработчики событий
watcher
  .on('add', path => {
    console.log(`📁 Добавлен файл: ${path}`);
    buildApp();
  })
  .on('change', path => {
    console.log(`✏️  Изменен файл: ${path}`);
    buildApp();
  })
  .on('unlink', path => {
    console.log(`🗑️  Удален файл: ${path}`);
    buildApp();
  })
  .on('addDir', path => {
    console.log(`📁 Добавлена папка: ${path}`);
  })
  .on('unlinkDir', path => {
    console.log(`🗑️  Удалена папка: ${path}`);
  })
  .on('error', error => {
    console.error('❌ Ошибка наблюдателя:', error);
  })
  .on('ready', () => {
    console.log('✅ Наблюдатель запущен и готов к работе');
    console.log('👀 Ожидание изменений в файлах...');
  });

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Остановка наблюдателя...');
  watcher.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Остановка наблюдателя...');
  watcher.close();
  process.exit(0);
});