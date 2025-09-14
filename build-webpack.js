const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 СБОРКА ВЕБ-ВЕРСИИ С ПОМОЩЬЮ WEBPACK');
console.log('='.repeat(45));

// Функция для выполнения команды
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔧 Выполняем: ${command} ${args.join(' ')}`);

    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: __dirname,
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

// Основная функция сборки
async function buildWithWebpack() {
  try {
    console.log('🔍 Проверяем наличие webpack...');

    // Проверяем, установлен ли webpack
    try {
      await runCommand('npx', ['webpack', '--version'], { stdio: 'pipe' });
      console.log('✅ Webpack найден');
    } catch (error) {
      console.log('⚠️  Webpack не найден. Устанавливаем...');
      await runCommand('npm', ['install', '--save-dev', 'webpack', 'webpack-cli']);
    }

    console.log('\n🗑️  Очищаем предыдущую сборку...');
    const webExportPath = path.join(__dirname, 'web-export');
    if (fs.existsSync(webExportPath)) {
      fs.rmSync(webExportPath, { recursive: true, force: true });
      console.log('✅ Предыдущая сборка удалена');
    }

    console.log('\n🏗️  Создаем сборку с помощью Webpack...');
    await runCommand('npx', ['webpack', '--config', 'webpack.config.js', '--mode', 'production']);

    console.log('\n📋 Проверяем результаты сборки...');
    if (fs.existsSync(webExportPath)) {
      const files = fs.readdirSync(webExportPath);
      console.log(`✅ Сборка создана успешно. Файлы в web-export: ${files.length}`);

      // Проверяем наличие ключевых файлов
      const keyFiles = ['index.html'];
      keyFiles.forEach(file => {
        const filePath = path.join(webExportPath, file);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          console.log(`✅ ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
        } else {
          console.warn(`⚠️  Отсутствует файл: ${file}`);
        }
      });

      // Проверяем наличие JS файлов
      const jsFiles = files.filter(file => file.endsWith('.js'));
      if (jsFiles.length > 0) {
        console.log(`✅ Найдено ${jsFiles.length} JS файлов`);
      } else {
        console.warn('⚠️  JS файлы не найдены');
      }
    } else {
      throw new Error('Папка web-export не создана');
    }

    console.log('\n🎉 ВЕБ-ВЕРСИЯ СОБРАНА УСПЕШНО С ПОМОЩЬЮ WEBPACK!');
    console.log('='.repeat(45));
    console.log('Для запуска веб-сервера используйте команду:');
    console.log('npm run serve-web');
    console.log('='.repeat(45));
  } catch (error) {
    console.error('\n💥 ОШИБКА ПРИ СБОРКЕ:');
    console.error(error.message);
    process.exit(1);
  }
}

// Запускаем сборку
buildWithWebpack();
