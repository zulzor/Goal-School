const fs = require('fs');
const path = require('path');

console.log('🔍 ПРОВЕРКА СОСТОЯНИЯ ПРОЕКТА');
console.log('='.repeat(40));

// Проверяем основные файлы и папки
const checks = [
  { path: 'package.json', name: 'Конфигурационный файл проекта' },
  { path: 'App.tsx', name: 'Основной файл приложения' },
  { path: 'App.web.tsx', name: 'Веб-версия приложения' },
  { path: 'src', name: 'Папка с исходным кодом' },
  { path: 'web-export', name: 'Папка с веб-сборкой' },
  { path: 'android', name: 'Папка для Android' },
];

let allGood = true;

checks.forEach(check => {
  const fullPath = path.join(__dirname, check.path);
  const exists = fs.existsSync(fullPath);

  if (exists) {
    console.log(`✅ ${check.name} - НАЙДЕН`);
  } else {
    console.log(`❌ ${check.name} - НЕ НАЙДЕН`);
    allGood = false;
  }
});

console.log('\n' + '='.repeat(40));

// Проверяем скрипты в package.json
if (fs.existsSync(path.join(__dirname, 'package.json'))) {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

  console.log('Доступные скрипты:');
  Object.keys(packageJson.scripts).forEach(script => {
    console.log(`  npm run ${script}`);
  });
} else {
  console.log('❌ Не найден package.json');
  allGood = false;
}

console.log('\n' + '='.repeat(40));

if (allGood) {
  console.log('🎉 Все основные компоненты проекта на месте!');
  console.log('\nРекомендуемые следующие шаги:');
  console.log('1. Для запуска веб-версии: npm run launch-web');
  console.log('2. Для сборки APK: npm run build-apk');
} else {
  console.log('❌ Некоторые компоненты проекта отсутствуют');
  console.log('Пожалуйста, проверьте структуру проекта');
}

console.log('\n' + '='.repeat(40));
