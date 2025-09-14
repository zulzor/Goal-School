// scripts/restore-database.js
// Скрипт для восстановления базы данных из резервной копии

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Директория с резервными копиями
const backupDir = path.join(__dirname, '..', 'backups');

// Получаем список доступных резервных копий
fs.readdir(backupDir, (err, files) => {
  if (err) {
    console.error('Failed to read backup directory:', err);
    process.exit(1);
  }

  // Фильтруем только .sql файлы
  const sqlFiles = files.filter(file => file.endsWith('.sql'));

  if (sqlFiles.length === 0) {
    console.log('No backup files found');
    process.exit(1);
  }

  // Сортируем по дате (новые первыми)
  sqlFiles.sort((a, b) => {
    const dateA = new Date(
      a.replace('goalschool-backup-', '').replace(/-/g, '/').replace('.sql', '')
    );
    const dateB = new Date(
      b.replace('goalschool-backup-', '').replace(/-/g, '/').replace('.sql', '')
    );
    return dateB - dateA;
  });

  console.log('Available backups:');
  sqlFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });

  console.log('\nTo restore a specific backup, run:');
  console.log('node scripts/restore-database.js <backup-file-name>');

  // Если передано имя файла для восстановления
  const backupFileName = process.argv[2];
  if (backupFileName) {
    restoreBackup(backupFileName);
  }
});

function restoreBackup(backupFileName) {
  const backupFile = path.join(__dirname, '..', 'backups', backupFileName);

  // Проверяем, существует ли файл
  if (!fs.existsSync(backupFile)) {
    console.error(`Backup file not found: ${backupFile}`);
    process.exit(1);
  }

  // Получаем параметры подключения из переменных окружения
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || '5432';
  const dbName = process.env.DB_NAME || 'goalschool';
  const dbUser = process.env.DB_USER || 'postgres';

  console.log(`Restoring database ${dbName} from ${backupFileName}...`);
  console.log('WARNING: This will overwrite all current data!');

  // Спрашиваем подтверждение
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Are you sure you want to continue? (yes/no): ', answer => {
    rl.close();

    if (answer.toLowerCase() !== 'yes') {
      console.log('Restore cancelled');
      process.exit(0);
    }

    // Команда для восстановления
    const restoreCommand = `psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} < ${backupFile}`;

    exec(restoreCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Restore failed: ${error.message}`);
        process.exit(1);
      }

      if (stderr) {
        console.error(`Restore stderr: ${stderr}`);
      }

      console.log('Database restored successfully!');
      process.exit(0);
    });
  });
}
