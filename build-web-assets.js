const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔨 НАЧИНАЕМ СБОРКУ ВЕБ-ВЕРСИИ ПРИЛОЖЕНИЯ');
console.log('='.repeat(50));

// Функция для выполнения команды
function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔧 Выполняем: ${command}`);

    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Ошибка: ${error}`);
        reject(error);
        return;
      }

      if (stderr) {
        console.warn(`⚠️  Предупреждения: ${stderr}`);
      }

      console.log(`✅ Результат: ${stdout}`);
      resolve(stdout);
    });

    // Выводим логи в реальном времени
    child.stdout.on('data', data => {
      console.log(data);
    });

    child.stderr.on('data', data => {
      console.error(data);
    });
  });
}

// Основная функция сборки
async function buildWebApp() {
  try {
    console.log('🔍 Проверяем наличие необходимых зависимостей...');

    // Проверяем, установлен ли expo-cli
    try {
      await runCommand('npx expo --version');
      console.log('✅ Expo CLI найден');
    } catch (error) {
      console.log('⚠️  Expo CLI не найден. Устанавливаем...');
      await runCommand('npm install -g @expo/cli');
    }

    console.log('\n🗑️  Очищаем предыдущую сборку...');
    const webExportPath = path.join(__dirname, 'web-export');
    if (fs.existsSync(webExportPath)) {
      fs.rmSync(webExportPath, { recursive: true, force: true });
      console.log('✅ Предыдущая сборка удалена');
    }

    console.log('\n🏗️  Создаем новую сборку веб-версии...');
    await runCommand('npx expo export:web');

    console.log('\n📋 Проверяем результаты сборки...');
    if (fs.existsSync(webExportPath)) {
      const files = fs.readdirSync(webExportPath);
      console.log(`✅ Сборка создана успешно. Файлы в web-export: ${files.length}`);

      // Проверяем наличие ключевых файлов
      const keyFiles = ['index.html', 'app.js'];
      keyFiles.forEach(file => {
        if (fs.existsSync(path.join(webExportPath, file))) {
          console.log(`✅ Найден файл: ${file}`);
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

    console.log('\n🎉 СБОРКА ЗАВЕРШЕНА УСПЕШНО!');
    console.log('='.repeat(50));
    console.log('Для запуска веб-сервера используйте команду:');
    console.log('npm run launch-web');
    console.log('='.repeat(50));
  } catch (error) {
    console.error('\n💥 ОШИБКА ПРИ СБОРКЕ:');
    console.error(error);
    process.exit(1);
  }
}

// Запускаем сборку
buildWebApp();
