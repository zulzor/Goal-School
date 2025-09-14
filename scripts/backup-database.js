#!/usr/bin/env node

// scripts/backup-database.js
// Скрипт для создания резервной копии базы данных MySQL

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Получаем текущую дату для имени файла резервной копии
const date = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
const backupDir = path.join(__dirname, '..', 'backups');
const backupFile = path.join(backupDir, `goalschool-backup-${date}.sql`);

// Создаем директорию для резервных копий, если она не существует
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Получаем параметры подключения из переменных окружения
const dbHost = process.env.MYSQL_HOST || 'localhost';
const dbPort = process.env.MYSQL_PORT || '3306';
const dbName = process.env.MYSQL_DATABASE || 'goalschool';
const dbUser = process.env.MYSQL_USER || 'root';

console.log(`Creating backup of database ${dbName}...`);

// Команда для создания резервной копии MySQL
const backupCommand = `mysqldump -h ${dbHost} -P ${dbPort} -u ${dbUser} -p${process.env.MYSQL_PASSWORD || ''} ${dbName} > ${backupFile}`;

exec(backupCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Backup failed: ${error.message}`);
    process.exit(1);
  }

  if (stderr) {
    console.error(`Backup stderr: ${stderr}`);
  }

  console.log(`Backup created successfully: ${backupFile}`);
  console.log('Backup completed!');
  process.exit(0);
});
