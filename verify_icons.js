#!/usr/bin/env node

const http = require('http');

console.log('🔍 ПРОВЕРКА ДОСТУПНОСТИ ИКОНОК ФУТБОЛЬНОЙ ШКОЛЫ "АРСЕНАЛ"');
console.log('='.repeat(60));

// Функция для проверки доступности URL
async function checkUrl(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve({
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        url: url
      });
    }).on('error', (err) => {
      resolve({
        statusCode: 0,
        statusMessage: err.message,
        url: url
      });
    });
    
    // Таймаут 5 секунд
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        statusCode: 0,
        statusMessage: 'Timeout',
        url: url
      });
    });
  });
}

// Основная функция проверки
async function verifyIcons() {
  console.log('\n🔍 ПРОВЕРКА ДОСТУПНОСТИ ИКОНОК...\n');
  
  const iconUrls = [
    'http://localhost:3003/icon.png',
    'http://localhost:3003/favicon.png',
    'http://localhost:3003/adaptive-icon.png',
    'http://localhost:3003/splash-icon.png'
  ];
  
  const results = [];
  
  for (const url of iconUrls) {
    const result = await checkUrl(url);
    results.push(result);
    
    const status = result.statusCode === 200 ? '✅' : '❌';
    console.log(`${status} ${result.url} - ${result.statusCode} ${result.statusMessage}`);
  }
  
  console.log('\n📊 СВОДКА ПРОВЕРКИ:');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.statusCode === 200).length;
  const failed = results.length - successful;
  
  console.log(`✅ Успешно: ${successful}`);
  console.log(`❌ Ошибок: ${failed}`);
  console.log(`📈 Процент успеха: ${Math.round((successful / results.length) * 100)}%`);
  
  if (failed > 0) {
    console.log('\n❌ ОШИБКИ:');
    results.filter(r => r.statusCode !== 200).forEach(r => {
      console.log(`  - ${r.url}: ${r.statusMessage}`);
    });
  } else {
    console.log('\n🎉 ВСЕ ИКОНКИ ДОСТУПНЫ!');
  }
  
  console.log('\n💡 РЕКОМЕНДАЦИИ:');
  console.log('='.repeat(20));
  console.log('1. Если вы по-прежнему видите ошибки в браузере, очистите кэш');
  console.log('2. Перезагрузите страницу с помощью Ctrl+F5');
  console.log('3. Проверьте вкладку "Application" в инструментах разработчика');
}

// Запуск проверки
verifyIcons().catch(console.error);