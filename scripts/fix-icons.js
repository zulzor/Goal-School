// Скрипт для автоматической замены импортов иконок
const fs = require('fs');
const path = require('path');

// Функция для рекурсивного поиска файлов
function findFiles(dir, extension) {
  let results = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Исключаем node_modules и .git
      if (file !== 'node_modules' && file !== '.git') {
        results = results.concat(findFiles(filePath, extension));
      }
    } else if (path.extname(file) === extension) {
      results.push(filePath);
    }
  });

  return results;
}

// Функция для замены импортов иконок
function fixIconImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changesMade = false;

  // Паттерны для замены
  const replacements = [
    {
      // Замена прямого импорта MaterialCommunityIcons
      pattern:
        /import\s+([A-Za-z]+)\s+from\s+['"]react-native-vector-icons\/MaterialCommunityIcons['"]/g,
      replacement: "import { $1 } from '@expo/vector-icons'",
    },
    {
      // Замена импорта с деструктуризацией
      pattern:
        /import\s+{\s*([^}]*MaterialCommunityIcons[^}]*)\s*}\s+from\s+['"]react-native-vector-icons['"]/g,
      replacement: "import { $1 } from '@expo/vector-icons'",
    },
  ];

  // Применяем замены
  replacements.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      changesMade = true;
    }
  });

  // Если были сделаны изменения, сохраняем файл
  if (changesMade) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Исправлены импорты в файле: ${path.relative(process.cwd(), filePath)}`);
    return true;
  }

  return false;
}

// Функция для проверки использования иконок в компонентах
function checkIconUsage(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Проверяем использование иконок в JSX
  const iconUsagePattern =
    /<\s*(MaterialCommunityIcons|Icon)[^>]*name\s*=\s*["']([^"']*)["'][^>]*\/?>/g;
  const matches = [];
  let match;

  while ((match = iconUsagePattern.exec(content)) !== null) {
    matches.push({
      component: match[1],
      iconName: match[2],
      line: content.substring(0, match.index).split('\n').length,
    });
  }

  return matches;
}

// Функция для создания компонента обертки
function createIconWrapper() {
  const iconWrapperPath = path.join(__dirname, '..', 'src', 'components', 'IconWrapper.tsx');

  if (fs.existsSync(iconWrapperPath)) {
    console.log('⚠️  Компонент IconWrapper уже существует');
    return;
  }

  const iconWrapperContent = `import React from 'react';
import { Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { IconButton as PaperIconButton } from 'react-native-paper';

interface IconWrapperProps {
  name: string;
  size?: number;
  color?: string;
  onPress?: () => void;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ 
  name, 
  size = 24, 
  color, 
  onPress 
}) => {
  if (Platform.OS === 'web') {
    return (
      <MaterialCommunityIcons 
        name={name} 
        size={size} 
        color={color} 
        onPress={onPress}
      />
    );
  }
  
  return (
    <PaperIconButton 
      icon={name} 
      size={size} 
      iconColor={color} 
      onPress={onPress}
    />
  );
};
`;

  fs.writeFileSync(iconWrapperPath, iconWrapperContent, 'utf8');
  console.log('✅ Создан компонент IconWrapper');
}

// Функция для создания констант иконок
function createIconConstants() {
  const iconsPath = path.join(__dirname, '..', 'src', 'constants', 'icons.ts');

  if (fs.existsSync(iconsPath)) {
    console.log('⚠️  Константы иконок уже существуют');
    return;
  }

  const iconsContent = `// Константы иконок приложения
export const APP_ICONS = {
  // Навигация
  home: 'home',
  homeOutline: 'home-outline',
  news: 'newspaper',
  newsOutline: 'newspaper-outline',
  schedule: 'calendar',
  scheduleOutline: 'calendar-outline',
  nutrition: 'food',
  nutritionOutline: 'food-outline',
  profile: 'account',
  profileOutline: 'account-outline',
  admin: 'shield',
  adminOutline: 'shield-outline',
  coach: 'whistle',
  coachOutline: 'whistle-outline',
  parent: 'account-multiple',
  parentOutline: 'account-multiple-outline',
  
  // Действия
  edit: 'pencil',
  delete: 'delete',
  add: 'plus',
  close: 'close',
  check: 'check',
  save: 'content-save',
  cancel: 'cancel',
  refresh: 'refresh',
  
  // Навигация
  arrowLeft: 'arrow-left',
  arrowRight: 'arrow-right',
  arrowUp: 'arrow-up',
  arrowDown: 'arrow-down',
  
  // Сортировка и фильтрация
  sort: 'sort',
  sortAscending: 'sort-ascending',
  sortDescending: 'sort-descending',
  filter: 'filter',
  search: 'magnify',
  
  // Достижения
  trophy: 'trophy',
  star: 'star',
  starOutline: 'star-outline',
  lock: 'lock',
  lockOpen: 'lock-open',
  checkCircle: 'check-circle',
  checkCircleOutline: 'check-circle-outline',
  
  // Статусы
  alert: 'alert',
  alertCircle: 'alert-circle',
  alertCircleOutline: 'alert-circle-outline',
  information: 'information',
  informationOutline: 'information-outline',
  help: 'help',
  helpCircle: 'help-circle',
  helpCircleOutline: 'help-circle-outline',
  
  // Социальные
  share: 'share',
  shareOutline: 'share-outline',
  heart: 'heart',
  heartOutline: 'heart-outline',
  comment: 'comment',
  commentOutline: 'comment-outline',
  
  // Файлы и медиа
  image: 'image',
  imageOutline: 'image-outline',
  camera: 'camera',
  cameraOutline: 'camera-outline',
  video: 'video',
  videoOutline: 'video-outline',
  file: 'file',
  fileOutline: 'file-outline',
  download: 'download',
  upload: 'upload',
  
  // Настройки
  settings: 'cog',
  settingsOutline: 'cog-outline',
  accountSettings: 'account-cog',
  accountSettingsOutline: 'account-cog-outline',
  
  // Время и дата
  clock: 'clock',
  clockOutline: 'clock-outline',
  calendar: 'calendar',
  calendarOutline: 'calendar-outline',
  
  // Другие
  menu: 'menu',
  dotsVertical: 'dots-vertical',
  dotsHorizontal: 'dots-horizontal',
  more: 'dots-horizontal',
} as const;
`;

  fs.writeFileSync(iconsPath, iconsContent, 'utf8');
  console.log('✅ Созданы константы иконок');
}

// Основная функция
function fixIcons() {
  console.log('🔧 Исправление импортов иконок...\n');

  // Создаем необходимые компоненты
  createIconWrapper();
  createIconConstants();

  // Поиск всех .tsx файлов
  const tsxFiles = findFiles(path.join(__dirname, '..', 'src'), '.tsx');
  console.log(`📁 Найдено ${tsxFiles.length} .tsx файлов\n`);

  // Исправляем импорты иконок
  let fixedFiles = 0;
  tsxFiles.forEach(file => {
    if (fixIconImports(file)) {
      fixedFiles++;
    }
  });

  console.log(`\n✅ Исправлены импорты в ${fixedFiles} файлах`);

  // Проверяем использование иконок
  console.log('\n🔍 Проверка использования иконок:');
  let totalUsages = 0;
  tsxFiles.forEach(file => {
    const usages = checkIconUsage(file);
    if (usages.length > 0) {
      console.log(`  📄 ${path.relative(process.cwd(), file)}`);
      usages.forEach(usage => {
        console.log(`     Строка ${usage.line}: <${usage.component} name="${usage.iconName}" />`);
      });
      totalUsages += usages.length;
    }
  });

  console.log(`\n📊 Найдено ${totalUsages} использований иконок`);

  // Проверяем наличие зависимости @expo/vector-icons
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  if (!packageJson.dependencies['@expo/vector-icons']) {
    console.log('\n⚠️  Необходимо установить зависимость @expo/vector-icons:');
    console.log('   npm install @expo/vector-icons');
  } else {
    console.log('\n✅ Зависимость @expo/vector-icons уже установлена');
  }

  console.log('\n✅ Исправление импортов иконок завершено!');
  console.log('\n💡 Рекомендации:');
  console.log('   1. Установите зависимость @expo/vector-icons, если она не установлена');
  console.log('   2. Перезапустите Metro bundler: npm start -- --reset-cache');
  console.log('   3. Проверьте работу приложения на всех платформах');
}

// Запуск исправления
fixIcons();
