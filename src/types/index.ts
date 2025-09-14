// Роли пользователей
export enum UserRole {
  CHILD = 'child',
  PARENT = 'parent',
  MANAGER = 'manager',
  COACH = 'coach',
  SMM_MANAGER = 'smm_manager',
}

// Добавляем интерфейс для филиала
export interface Branch {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Интерфейс пользователя
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  dateOfBirth?: string;
  parentId?: string; // Для детей - ID родителя
  childrenIds?: string[]; // Для родителей - ID детей
  branchId?: string; // Добавляем привязку к филиалу
}

// Интерфейс тренировки
export interface Training {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  coachId: string;
  coachName: string;
  maxParticipants: number;
  currentParticipants: string[];
  ageGroup: string;
  type: 'training' | 'match' | 'tournament';
}

// Интерфейс новости
export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  authorId: string;
  authorName: string;
  publishedAt: string;
  tags: string[];
  isImportant: boolean;
}

// Интерфейс рекомендации по питанию
export interface NutritionRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'hydration';
  ageGroup: string;
  tips: string[];
  imageUrl?: string;
  authorId: string;
  createdAt: string;
}

// Интерфейс регистрации на тренировку
export interface TrainingRegistration {
  id: string;
  trainingId: string;
  userId: string;
  registeredAt: string;
  status: 'registered' | 'attended' | 'missed' | 'cancelled';
}

// Контекст аутентификации
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (
    userData: Partial<User>,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<{ success: boolean; message: string }>;
  updateProfile?: (userData: Partial<User>) => Promise<void>;
  resendConfirmationEmail?: (email: string) => Promise<{ success: boolean; message: string }>;
  createTestUser?: (role: UserRole) => Promise<{ success: boolean; message: string }>;
  session?: unknown; // Supabase Session
}

// Пропсы для навигации
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Schedule: undefined;
  News: undefined;
  Nutrition: undefined;
  Profile: undefined;
  AdminPanel: undefined;
  DisciplineResults: undefined;
  UserManagement: undefined;
  SkillsManagement: undefined;
  AnimationsDemo: undefined;
  ImportantNewsDemo: undefined;
  PerformanceDemo: undefined;
  TrainingDetails: { trainingId: string };
  NewsDetail: { newsId: string };
  // Добавляем недостающие маршруты
  TabNavigator: undefined;
  ManagerStack: undefined;
  ScheduleTest: undefined;
  NutritionTest: undefined;
  Debug: undefined;
  SimpleSchedule: undefined;
  SimpleNutrition: undefined;
  ScreenTest: undefined;
  ServiceTest: undefined;
  DisplayTest: undefined;
  FinalTest: undefined;
  StudentAchievements: undefined;
  DebugAuth: undefined; // Добавляем маршрут для DebugAuth
  MinimalTest: undefined; // Добавляем маршрут для MinimalTest
  WebTest: undefined; // Добавляем маршрут для WebTest
  Achievements: undefined; // Добавляем маршрут для Achievements
};

export type TabParamList = {
  Home: undefined;
  Schedule: undefined;
  News: undefined;
  Nutrition: undefined;
  Progress: undefined;
  Attendance: undefined;
  AttendanceAnalytics: undefined;
  Profile: undefined;
  AnimationsDemo: undefined;
  ImportantNewsDemo: undefined;
  PerformanceDemo: undefined;
  MinimalTest: undefined; // Добавляем маршрут для MinimalTest
  WebTest: undefined; // Добавляем маршрут для WebTest
  Achievements: undefined; // Добавляем маршрут для Achievements
};

// Добавляем тип для ManagerStack
export type ManagerParamList = {
  AdminPanel: undefined;
  AttendanceAnalytics: undefined;
  SkillsManagement: undefined;
  SecurityDemo: undefined;
  PerformanceDemo: undefined;
  AnimationsDemo: undefined;
  TestNotifications: undefined;
  ComponentTest: undefined;
  ScheduleTest: undefined;
  NutritionTest: undefined;
};

// Интерфейсы для посещаемости
export interface AttendanceDetail {
  id: string;
  training_registration_id: string;
  training_id: string;
  student_id: string;
  coach_id: string;
  attendance_status: 'present' | 'absent' | 'late' | 'excused';
  arrival_time?: string;
  departure_time?: string;
  notes?: string;
  behavior_rating?: number;
  participation_rating?: number;
  marked_by: string;
  marked_at: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceStatistic {
  id: string;
  student_id: string;
  month: number;
  year: number;
  total_trainings: number;
  attended_trainings: number;
  missed_trainings: number;
  late_arrivals: number;
  excused_absences: number;
  attendance_percentage: number;
  avg_behavior_rating?: number;
  avg_participation_rating?: number;
}

export interface StudentWithAttendance {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  attendance_status?: 'present' | 'absent' | 'late' | 'excused';
  attendance_detail?: AttendanceDetail;
  is_registered: boolean;
}

// Интерфейс для достижений
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'training' | 'skill' | 'progress' | 'attendance' | 'special';
  points: number;
  earnedAt?: string;
  studentId?: string;
  isUnlocked: boolean;
}

// Интерфейс для навыков и достижений
export interface SkillAchievement {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'physical' | 'tactical' | 'mental' | 'social';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  icon?: string;
  color?: string;
  points: number;
  created_at: string;
}

// Интерфейс для прогресса ученика
export interface StudentProgress {
  id: string;
  student_id: string;
  skill_id: string;
  current_level: number;
  target_level: number;
  progress_notes?: string;
  last_assessment_date?: string;
  assessed_by?: string;
  created_at: string;
  updated_at: string;
}

// Интерфейс для отзывов тренера
export interface CoachFeedback {
  id: string;
  training_id: string;
  student_id: string;
  coach_id: string;
  overall_rating?: number;
  technical_skills?: number;
  physical_fitness?: number;
  teamwork?: number;
  attitude?: number;
  improvement_areas?: string[];
  strengths?: string[];
  goals_for_next_training?: string;
  private_notes?: string;
  public_feedback?: string;
  created_at: string;
  updated_at: string;
}

// Интерфейс для целей развития
export interface DevelopmentGoal {
  id: string;
  student_id: string;
  coach_id: string;
  title: string;
  description: string;
  category: 'technical' | 'physical' | 'tactical' | 'mental' | 'social';
  target_date?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  progress_percentage: number;
  milestones?: unknown[];
  created_at: string;
  updated_at: string;
}

// Константы для ролей пользователей
export const USER_ROLES: Record<UserRole, string> = {
  [UserRole.CHILD]: 'Ребенок',
  [UserRole.PARENT]: 'Родитель',
  [UserRole.MANAGER]: 'Управляющий',
  [UserRole.COACH]: 'Тренер',
  [UserRole.SMM_MANAGER]: 'SMM-менеджер',
};
