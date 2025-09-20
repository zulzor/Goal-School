// Скрипт для проверки иконок в проекте
import fs from 'fs';
import path from 'path';

// Функция для рекурсивного поиска файлов
function findFiles(dir, extension) {
  let results = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(findFiles(filePath, extension));
    } else if (path.extname(file) === extension) {
      results.push(filePath);
    }
  });

  return results;
}

// Функция для поиска импортов иконок
function findIconImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const iconImports = [];

  // Регулярные выражения для поиска импортов иконок
  const importPatterns = [
    /import\s+.*\s+from\s+['"]react-native-vector-icons\/([^'"]+)['"]/g,
    /import\s+.*\s+from\s+['"]@expo\/vector-icons['"]/g,
    /import\s+{\s*([^}]*Icon[^}]*)\s*}\s+from\s+['"]react-native-paper['"]/g,
  ];

  importPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      iconImports.push({
        line: match[0],
        file: filePath,
        groups: match.slice(1),
      });
    }
  });

  return iconImports;
}

// Функция для проверки использования иконок в компонентах
function findIconUsage(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const iconUsages = [];

  // Регулярные выражения для поиска использования иконок
  const usagePatterns = [
    /<\s*([A-Za-z]+Icon)[^>]*\/?>/g,
    /icon\s*=\s*["'][^"']*["']/g,
    /name\s*=\s*["'][^"']*["']/g,
  ];

  usagePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      iconUsages.push({
        line: match[0],
        file: filePath,
      });
    }
  });

  return iconUsages;
}

// Основная функция
function checkIcons() {
  console.log('🔍 Проверка иконок в проекте...\n');

  // Поиск всех .tsx файлов
  const tsxFiles = findFiles(path.join(__dirname, '..', 'src'), '.tsx');
  console.log(`📁 Найдено ${tsxFiles.length} .tsx файлов\n`);

  // Поиск импортов иконок
  let allIconImports = [];
  let allIconUsages = [];

  tsxFiles.forEach(file => {
    const imports = findIconImports(file);
    const usages = findIconUsage(file);

    if (imports.length > 0) {
      allIconImports = allIconImports.concat(imports);
    }

    if (usages.length > 0) {
      allIconUsages = allIconUsages.concat(usages);
    }
  });

  // Вывод результатов
  console.log('📦 Найденные импорты иконок:');
  if (allIconImports.length > 0) {
    allIconImports.forEach(importItem => {
      console.log(`  📄 ${path.relative(path.join(__dirname, '..'), importItem.file)}`);
      console.log(`     ${importItem.line}`);
      console.log('');
    });
  } else {
    console.log('  ❌ Импорты иконок не найдены\n');
  }

  console.log('📱 Найденное использование иконок:');
  if (allIconUsages.length > 0) {
    allIconUsages.slice(0, 10).forEach(usage => {
      console.log(`  📄 ${path.relative(path.join(__dirname, '..'), usage.file)}`);
      console.log(`     ${usage.line}`);
      console.log('');
    });

    if (allIconUsages.length > 10) {
      console.log(`  ... и еще ${allIconUsages.length - 10} случаев использования\n`);
    }
  } else {
    console.log('  ❌ Использование иконок не найдено\n');
  }

  // Проверка версий библиотек
  console.log('📚 Проверка версий библиотек иконок:');
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
  );

  const iconLibraries = [
    'react-native-vector-icons',
    '@react-native-vector-icons/material-icons',
    '@expo/vector-icons',
    'react-native-paper',
  ];

  iconLibraries.forEach(lib => {
    if (packageJson.dependencies[lib]) {
      console.log(`  ✅ ${lib}: ${packageJson.dependencies[lib]}`);
    } else if (packageJson.devDependencies[lib]) {
      console.log(`  ✅ ${lib}: ${packageJson.devDependencies[lib]} (dev)`);
    } else {
      console.log(`  ❌ ${lib}: не найдена`);
    }
  });

  console.log('\n✅ Проверка завершена!');
}

// Запуск проверки
checkIcons();
