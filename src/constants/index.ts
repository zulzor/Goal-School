import { UserRole } from '../types';
import { ARSENAL_COLORS } from './arsenalColors';

// Цвета приложения - используем цвета Arsenal
export const COLORS = {
  primary: ARSENAL_COLORS.primary, // Красный Arsenal
  secondary: ARSENAL_COLORS.accent, // Синий Arsenal
  success: ARSENAL_COLORS.success,
  warning: ARSENAL_COLORS.warning,
  error: ARSENAL_COLORS.error,
  background: ARSENAL_COLORS.background,
  surface: ARSENAL_COLORS.surface,
  text: ARSENAL_COLORS.text,
  textSecondary: ARSENAL_COLORS.textSecondary,
  border: ARSENAL_COLORS.border,
  accent: ARSENAL_COLORS.secondary, // Темно-красный Arsenal
  // Добавляем недостающие цвета
  card: ARSENAL_COLORS.surface,
  notification: ARSENAL_COLORS.primary,
};

// Размеры
export const SIZES = {
  padding: 16,
  margin: 16,
  borderRadius: 8,
  iconSize: 24,
  avatarSize: 40,
};

// Роли пользователей с переводом
export const USER_ROLES = {
  [UserRole.CHILD]: 'Ребенок',
  [UserRole.PARENT]: 'Родитель',
  [UserRole.MANAGER]: 'Управляющий',
  [UserRole.COACH]: 'Тренер',
  [UserRole.SMM_MANAGER]: 'SMM Менеджер',
};

// Возрастные группы
export const AGE_GROUPS = [
  'U-6 (до 6 лет)',
  'U-8 (до 8 лет)',
  'U-10 (до 10 лет)',
  'U-12 (до 12 лет)',
  'U-14 (до 14 лет)',
  'U-16 (до 16 лет)',
  'U-18 (до 18 лет)',
];

// Типы тренировок
export const TRAINING_TYPES = {
  training: 'Тренировка',
  match: 'Матч',
  tournament: 'Турнир',
};

// Категории питания
export const NUTRITION_CATEGORIES = {
  breakfast: 'Завтрак',
  lunch: 'Обед',
  dinner: 'Ужин',
  snack: 'Перекус',
  hydration: 'Питьевой режим',
};

// Статусы регистрации
export const REGISTRATION_STATUS = {
  registered: 'Зарегистрирован',
  attended: 'Присутствовал',
  missed: 'Пропустил',
  cancelled: 'Отменено',
};

// Дни недели
export const WEEKDAYS = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье',
];
