// src/services/LocalizationService.ts
// Сервис для работы с локализацией и мультиязычной поддержкой

import AsyncStorage from '@react-native-async-storage/async-storage';

// Поддерживаемые языки
export type SupportedLanguage = 'ru' | 'en';
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['ru', 'en'];

// Ключ для хранения выбранного языка в AsyncStorage
const LANGUAGE_KEY = '@arsenal_school_language';

// Словари переводов
const translations = {
  ru: {
    // Общие термины
    welcome: 'Добро пожаловать',
    home: 'Главная',
    news: 'Новости',
    schedule: 'Расписание',
    nutrition: 'Питание',
    profile: 'Профиль',
    settings: 'Настройки',
    logout: 'Выйти',
    login: 'Вход',
    register: 'Регистрация',
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    add: 'Добавить',
    search: 'Поиск',
    filter: 'Фильтр',
    refresh: 'Обновить',
    back: 'Назад',
    next: 'Далее',
    previous: 'Назад',
    finish: 'Завершить',
    continue: 'Продолжить',
    confirm: 'Подтвердить',
    close: 'Закрыть',

    // Навигация
    main: 'Главная',
    students: 'Ученики',
    analytics: 'Аналитика',
    admin: 'Админ-панель',
    branches: 'Филиалы',
    users: 'Пользователи',
    skills: 'Навыки',
    database: 'База данных',
    achievements: 'Достижения',

    // Роли пользователей
    student: 'Ученик',
    parent: 'Родитель',
    coach: 'Тренер',
    manager: 'Управляющий',
    admin_role: 'Администратор',
    smm_manager: 'SMM-менеджер',

    // Экраны
    home_screen_title: 'Главная страница',
    news_screen_title: 'Новости школы',
    schedule_screen_title: 'Расписание тренировок',
    nutrition_screen_title: 'Питание',
    profile_screen_title: 'Профиль',
    attendance_screen_title: 'Посещаемость',
    progress_screen_title: 'Прогресс учеников',
    analytics_screen_title: 'Аналитика посещаемости',
    skills_screen_title: 'Навыки и достижения',
    branches_screen_title: 'Управление филиалами',
    users_screen_title: 'Управление пользователями',
    admin_screen_title: 'Админ-панель',
    sm_manager_screen_title: 'Управление новостями',

    // Сообщения
    loading: 'Загрузка...',
    saving: 'Сохранение...',
    success: 'Успешно',
    error: 'Ошибка',
    warning: 'Предупреждение',
    info: 'Информация',
    confirmation: 'Подтверждение',

    // Ошибки
    error_occurred: 'Произошла ошибка',
    network_error: 'Ошибка сети',
    server_error: 'Ошибка сервера',
    data_load_error: 'Ошибка загрузки данных',
    data_save_error: 'Ошибка сохранения данных',

    // Уведомления
    notifications: 'Уведомления',
    no_notifications: 'Нет уведомлений',
    unread_notifications: 'Непрочитанные уведомления',

    // Формы
    email: 'Email',
    password: 'Пароль',
    name: 'Имя',
    surname: 'Фамилия',
    phone: 'Телефон',
    date_of_birth: 'Дата рождения',
    branch: 'Филиал',
    role: 'Роль',

    // Подтверждения
    are_you_sure: 'Вы уверены?',
    confirm_action: 'Подтвердите действие',
    confirm_delete: 'Подтвердите удаление',

    // Даты и время
    today: 'Сегодня',
    yesterday: 'Вчера',
    tomorrow: 'Завтра',
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда',
    thursday: 'Четверг',
    friday: 'Пятница',
    saturday: 'Суббота',
    sunday: 'Воскресенье',

    // Месяцы
    january: 'Январь',
    february: 'Февраль',
    march: 'Март',
    april: 'Апрель',
    may: 'Май',
    june: 'Июнь',
    july: 'Июль',
    august: 'Август',
    september: 'Сентябрь',
    october: 'Октябрь',
    november: 'Ноябрь',
    december: 'Декабрь',
  },
  en: {
    // Общие термины
    welcome: 'Welcome',
    home: 'Home',
    news: 'News',
    schedule: 'Schedule',
    nutrition: 'Nutrition',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    refresh: 'Refresh',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    finish: 'Finish',
    continue: 'Continue',
    confirm: 'Confirm',
    close: 'Close',

    // Навигация
    main: 'Main',
    students: 'Students',
    analytics: 'Analytics',
    admin: 'Admin Panel',
    branches: 'Branches',
    users: 'Users',
    skills: 'Skills',
    database: 'Database',
    achievements: 'Achievements',

    // Роли пользователей
    student: 'Student',
    parent: 'Parent',
    coach: 'Coach',
    manager: 'Manager',
    admin_role: 'Administrator',
    smm_manager: 'SMM Manager',

    // Экраны
    home_screen_title: 'Home Page',
    news_screen_title: 'School News',
    schedule_screen_title: 'Training Schedule',
    nutrition_screen_title: 'Nutrition',
    profile_screen_title: 'Profile',
    attendance_screen_title: 'Attendance',
    progress_screen_title: 'Student Progress',
    analytics_screen_title: 'Attendance Analytics',
    skills_screen_title: 'Skills and Achievements',
    branches_screen_title: 'Branch Management',
    users_screen_title: 'User Management',
    admin_screen_title: 'Admin Panel',
    sm_manager_screen_title: 'News Management',

    // Сообщения
    loading: 'Loading...',
    saving: 'Saving...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    confirmation: 'Confirmation',

    // Ошибки
    error_occurred: 'An error occurred',
    network_error: 'Network error',
    server_error: 'Server error',
    data_load_error: 'Data loading error',
    data_save_error: 'Data saving error',

    // Уведомления
    notifications: 'Notifications',
    no_notifications: 'No notifications',
    unread_notifications: 'Unread notifications',

    // Формы
    email: 'Email',
    password: 'Password',
    name: 'Name',
    surname: 'Surname',
    phone: 'Phone',
    date_of_birth: 'Date of Birth',
    branch: 'Branch',
    role: 'Role',

    // Подтверждения
    are_you_sure: 'Are you sure?',
    confirm_action: 'Confirm action',
    confirm_delete: 'Confirm deletion',

    // Даты и время
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',

    // Месяцы
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
  },
};

/**
 * Получение текущего языка
 */
export const getCurrentLanguage = async (): Promise<SupportedLanguage> => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage as SupportedLanguage)) {
      return savedLanguage as SupportedLanguage;
    }

    // По умолчанию русский язык
    return 'ru';
  } catch (error) {
    console.error('Ошибка при получении языка:', error);
    return 'ru';
  }
};

/**
 * Установка языка
 */
export const setLanguage = async (language: SupportedLanguage): Promise<boolean> => {
  try {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      throw new Error(`Язык ${language} не поддерживается`);
    }

    await AsyncStorage.setItem(LANGUAGE_KEY, language);
    return true;
  } catch (error) {
    console.error('Ошибка при установке языка:', error);
    return false;
  }
};

/**
 * Получение перевода для ключа
 */
export const t = (key: string, language?: SupportedLanguage): string => {
  // Если язык не указан, используем русский по умолчанию
  const lang = language || 'ru';

  // Проверяем, есть ли перевод для указанного языка
  if (translations[lang] && translations[lang][key]) {
    return translations[lang][key];
  }

  // Если перевод не найден, возвращаем ключ
  return key;
};

/**
 * Получение всех переводов для языка
 */
export const getTranslations = (language: SupportedLanguage) => {
  return translations[language] || translations.ru;
};

// Экспорт сервиса
export const LocalizationService = {
  getCurrentLanguage,
  setLanguage,
  t,
  getTranslations,
  SUPPORTED_LANGUAGES,
};
