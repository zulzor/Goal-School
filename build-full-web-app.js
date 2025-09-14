const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 НАЧИНАЕМ СБОРКУ ПОЛНОФУНКЦИОНАЛЬНОЙ ВЕБ-ВЕРСИИ');
console.log('='.repeat(55));

// Функция для выполнения команды с таймаутом
function runCommandWithTimeout(command, timeout = 300000) {
  // 5 минут таймаут
  return new Promise((resolve, reject) => {
    console.log(`\n🔧 Выполняем: ${command}`);

    const child = exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Ошибка: ${error.message}`);
        reject(error);
        return;
      }

      if (stderr && !stderr.includes('warning')) {
        console.warn(`⚠️  Предупреждения: ${stderr}`);
      }

      console.log(`✅ Выполнено успешно`);
      resolve(stdout);
    });

    // Выводим логи в реальном времени
    child.stdout.on('data', data => {
      process.stdout.write(data);
    });

    child.stderr.on('data', data => {
      process.stderr.write(data);
    });

    // Таймаут
    setTimeout(() => {
      child.kill();
      reject(new Error(`Команда превысила время ожидания (${timeout}ms)`));
    }, timeout);
  });
}

// Основная функция сборки
async function buildFullWebApp() {
  try {
    console.log('🔍 Проверяем наличие Expo CLI...');

    // Проверяем Expo CLI
    try {
      await runCommandWithTimeout('npx expo --version', 30000);
      console.log('✅ Expo CLI доступен');
    } catch (error) {
      console.log('⚠️  Expo CLI не найден, устанавливаем...');
      await runCommandWithTimeout('npm install -g @expo/cli', 120000);
    }

    console.log('\n🗑️  Очищаем предыдущую сборку...');
    const webExportPath = path.join(__dirname, 'web-export');
    if (fs.existsSync(webExportPath)) {
      fs.rmSync(webExportPath, { recursive: true, force: true });
      console.log('✅ Предыдущая сборка удалена');
    }

    console.log('\n🏗️  Создаем новую сборку веб-версии...');
    console.log('Это может занять несколько минут...');

    // Выполняем сборку с правильными параметрами
    await runCommandWithTimeout('npx expo export:web --dev', 600000); // 10 минут

    console.log('\n📋 Проверяем результаты сборки...');
    if (fs.existsSync(webExportPath)) {
      const files = fs.readdirSync(webExportPath);
      console.log(`✅ Сборка создана успешно. Файлы в web-export: ${files.length}`);

      // Проверяем наличие ключевых файлов
      const keyFiles = ['index.html', 'app.js'];
      keyFiles.forEach(file => {
        const filePath = path.join(webExportPath, file);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          console.log(`✅ ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
        } else {
          console.warn(`⚠️  Отсутствует файл: ${file}`);
        }
      });

      // Проверяем папку assets
      const assetsPath = path.join(webExportPath, 'assets');
      if (fs.existsSync(assetsPath)) {
        const assetFiles = fs.readdirSync(assetsPath);
        console.log(`✅ Папка assets содержит ${assetFiles.length} элементов`);
      } else {
        console.warn('⚠️  Папка assets не найдена');
      }
    } else {
      throw new Error('Папка web-export не создана');
    }

    console.log('\n🎉 ПОЛНОФУНКЦИОНАЛЬНАЯ ВЕБ-ВЕРСИЯ СОБРАНА УСПЕШНО!');
    console.log('='.repeat(55));
    console.log('Для запуска веб-сервера используйте команду:');
    console.log('npm run serve-web');
    console.log('='.repeat(55));
  } catch (error) {
    console.error('\n💥 ОШИБКА ПРИ СБОРКЕ:');
    console.error(error.message);

    // Предлагаем альтернативное решение
    console.log('\n🔧 АЛЬТЕРНАТИВНОЕ РЕШЕНИЕ:');
    console.log('Попробуйте выполнить следующие команды поочередно:');
    console.log('1. npx expo export:web');
    console.log('2. Если команда зависает, нажмите Ctrl+C');
    console.log('3. npm run serve-web');

    process.exit(1);
  }
}

// Запускаем сборку
buildFullWebApp();
