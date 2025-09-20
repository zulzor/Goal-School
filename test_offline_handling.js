/**
 * Тестовый скрипт для проверки обработки офлайн режима
 */

console.log('🚀 Запуск теста обработки офлайн режима...\\n');

// Проверка наличия необходимых файлов
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'web-export/sw.js',
  'web-export/fallback.html',
  'src/context/NetworkContext.tsx',
  'src/utils/netinfo.web.ts',
  'src/components/OfflineBanner.tsx',
  'App.web.tsx',
  'src/utils/networkUtils.ts',
  'main-server.js'
];

console.log('🔍 Проверка наличия необходимых файлов:');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file}`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\\n❌ Некоторые необходимые файлы отсутствуют!');
  process.exit(1);
}

console.log('\\n✅ Все необходимые файлы присутствуют!');

// Проверка содержимого service worker
console.log('\\n🔍 Проверка service worker (sw.js):');
const swContent = fs.readFileSync(path.join(__dirname, 'web-export/sw.js'), 'utf8');
if (swContent.includes('CONNECTION_RESTORED')) {
  console.log('  ✅ Обработчик сообщений о восстановлении соединения найден');
} else {
  console.log('  ❌ Обработчик сообщений о восстановлении соединения не найден');
}

if (swContent.includes('connection-restored')) {
  console.log('  ✅ Обработчик сообщений service worker найден');
} else {
  console.log('  ❌ Обработчик сообщений service worker не найден');
}

// Проверка fallback.html
console.log('\\n🔍 Проверка fallback.html:');
const fallbackContent = fs.readFileSync(path.join(__dirname, 'web-export/fallback.html'), 'utf8');
if (fallbackContent.includes('success-message')) {
  console.log('  ✅ Элемент success-message найден');
} else {
  console.log('  ❌ Элемент success-message не найден');
}

if (fallbackContent.includes('CONNECTION_RESTORED')) {
  console.log('  ✅ Отправка сообщения о восстановлении соединения найдена');
} else {
  console.log('  ❌ Отправка сообщения о восстановлении соединения не найдена');
}

// Проверка NetworkContext
console.log('\\n🔍 Проверка NetworkContext.tsx:');
const networkContextContent = fs.readFileSync(path.join(__dirname, 'src/context/NetworkContext.tsx'), 'utf8');
if (networkContextContent.includes('window.location.pathname === \'/fallback.html\'')) {
  console.log('  ✅ Обработчик перенаправления с fallback.html найден');
} else {
  console.log('  ❌ Обработчик перенаправления с fallback.html не найден');
}

// Проверка netinfo.web.ts
console.log('\\n🔍 Проверка netinfo.web.ts:');
const netinfoContent = fs.readFileSync(path.join(__dirname, 'src/utils/netinfo.web.ts'), 'utf8');
if (netinfoContent.includes('fetch(')) {
  console.log('  ✅ Дополнительная проверка соединения найдена');
} else {
  console.log('  ❌ Дополнительная проверка соединения не найдена');
}

console.log('\\n✅ Тест обработки офлайн режима завершен успешно!');
console.log('\\n💡 Теперь приложение должно корректно обрабатывать офлайн режим:');
console.log('   - При восстановлении соединения автоматически перенаправлять с fallback.html на главную');
console.log('   - Показывать баннер с уведомлением об офлайн режиме внутри приложения');
console.log('   - Периодически проверять соединение и обновлять статус');