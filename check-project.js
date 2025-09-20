const fs = require('fs');
const path = require('path');

console.log('🔍 ПРОВЕРКА СОСТОЯНИЯ ПРОЕКТА');
console.log('========================================');

// Проверяем наличие ключевых файлов
const requiredFiles = ['package.json', 'App.tsx', 'index.ts', 'tsconfig.json'];

const requiredDirs = ['src', 'web-export', 'android'];

let allGood = true;

// Проверка файлов
requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file} - НАЙДЕН`);
  } else {
    console.log(`❌ ${file} - ОТСУТСТВУЕТ`);
    allGood = false;
  }
});

// Проверка папок
requiredDirs.forEach(dir => {
  if (fs.existsSync(path.join(__dirname, dir))) {
    console.log(`✅ Папка ${dir} - НАЙДЕНА`);
  } else {
    console.log(`❌ Папка ${dir} - ОТСУТСТВУЕТ`);
    allGood = false;
  }
});

console.log('\n========================================');

// Проверяем наличие веб-сборки
const webExportPath = path.join(__dirname, 'web-export');
if (fs.existsSync(webExportPath)) {
  const files = fs.readdirSync(webExportPath);
  if (files.length > 0) {
    console.log('✅ Веб-сборка - НАЙДЕНА');
  } else {
    console.log('⚠️  Веб-сборка - ПУСТАЯ');
  }
} else {
  console.log('❌ Веб-сборка - ОТСУТСТВУЕТ');
}

console.log('\n========================================');
console.log('Доступные скрипты:');
console.log('  npm run start              # Запуск Expo DevTools');
console.log('  npm run web                # Разработка веб-версии');
console.log('  npm run android            # Запуск на Android');
console.log('  npm run ios                # Запуск на iOS (требуется macOS)');
console.log('  npm run launch-web         # Быстрый запуск веб-версии');
console.log('  npm run build-web          # Сборка веб-версии');
console.log('  npm run build-apk          # Создание APK для Android');
console.log('  npm run check              # Проверка состояния проекта');

console.log('\n========================================');

if (allGood) {
  console.log('🎉 Все основные компоненты проекта на месте!');
  console.log('\nРекомендуемые следующие шаги:');
  console.log('1. Для запуска веб-версии: npm run launch-web');
  console.log('2. Для сборки APK: npm run build-apk');
} else {
  console.log('⚠️  Некоторые компоненты проекта отсутствуют!');
  console.log('Пожалуйста, проверьте наличие всех файлов и папок.');
}

console.log('\n========================================');
