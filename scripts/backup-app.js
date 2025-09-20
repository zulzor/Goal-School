// scripts/backup-app.js
// Скрипт для создания резервной копии всего приложения

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');
const { pipeline } = require('stream/promises');
const { createGzip } = require('zlib');

const execAsync = promisify(exec);

async function runCommand(command, description) {
  console.log(`\nВыполняем: ${description}`);
  console.log(`Команда: ${command}\n`);

  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.log(stderr);
    return { success: true, stdout, stderr };
  } catch (error) {
    console.error(`Ошибка выполнения команды: ${error.message}`);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.log(error.stderr);
    return { success: false, error: error.message, stdout: error.stdout, stderr: error.stderr };
  }
}

async function backupDatabase() {
  console.log('=== Создание резервной копии базы данных ===\n');

  const dbBackup = await runCommand(
    'node scripts/backup-database.js',
    'Создание резервной копии базы данных'
  );
  return dbBackup.success;
}

async function backupAppFiles() {
  console.log('=== Создание резервной копии файлов приложения ===\n');

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `goalschool-backup-${timestamp}.tar.gz`;
    const backupPath = path.join(__dirname, '..', 'backups', backupFileName);

    // Создаем директорию для резервных копий
    const backupsDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir);
    }

    // Создаем архив всех файлов приложения (кроме node_modules и backups)
    const command = `tar --exclude='node_modules' --exclude='backups' --exclude='.git' -czf "${backupPath}" .`;

    console.log(`Создание архива: ${backupFileName}`);
    const result = await runCommand(command, 'Создание архива файлов приложения');

    if (result.success) {
      const stats = fs.statSync(backupPath);
      console.log(`Размер архива: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Архив сохранен в: ${backupPath}`);
    }

    return result.success;
  } catch (error) {
    console.error('Ошибка создания резервной копии файлов:', error);
    return false;
  }
}

async function backupApp() {
  console.log('Создание резервной копии приложения GoalSchool\n');

  let backupsCreated = 0;
  let totalBackups = 2;

  // Создание резервной копии базы данных
  if (await backupDatabase()) backupsCreated++;

  // Создание резервной копии файлов приложения
  if (await backupAppFiles()) backupsCreated++;

  console.log('\n=== Результаты резервного копирования ===');
  console.log(`Создано резервных копий: ${backupsCreated}/${totalBackups}`);

  if (backupsCreated === totalBackups) {
    console.log('🎉 Все резервные копии созданы успешно!');
  } else {
    console.log('⚠ Некоторые резервные копии не созданы. Проверьте ошибки выше.');
  }
}

// Запуск резервного копирования
backupApp().catch(error => {
  console.error('Ошибка выполнения резервного копирования:', error);
  process.exit(1);
});
