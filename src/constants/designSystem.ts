// Улучшенная система дизайна с более красивыми визуальными элементами
export const DESIGN_SYSTEM = {
  colors: {
    primary: '#2196F3',
    primaryDark: '#1976D2',
    primaryLight: '#BBDEFB',
    secondary: '#FF5722',
    secondaryDark: '#E64A19',
    secondaryLight: '#FFCCBC',
    accent: '#9C27B0',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    background: '#F5F7FA',
    surface: '#FFFFFF',
    text: '#212121',
    textSecondary: '#757575',
    textDisabled: '#BDBDBD',
    border: '#E0E0E0',
    divider: '#EEEEEE',

    // Расширенная палитра для более богатого UI
    gradientStart: '#2196F3',
    gradientEnd: '#21CBF3',
    cardBackground: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.1)',

    // Цвета для различных типов контента
    newsImportant: '#FF5722',
    trainingMatch: '#9C27B0',
    trainingRegular: '#4CAF50',
  },

  gradients: {
    primary: ['#2196F3', '#21CBF3'],
    secondary: ['#FF5722', '#FF9800'],
    accent: ['#9C27B0', '#3F51B5'],
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    pill: 50,
  },

  typography: {
    h1: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 30,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 26,
    },
    body1: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 22,
    },
    body2: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 20,
    },
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },

  transitions: {
    default: 'all 0.3s ease-in-out',
    fast: 'all 0.15s ease-in-out',
    slow: 'all 0.45s ease-in-out',
  },
};
