// src/services/index.ts
// Main services index file

// Local storage services
import { UserService } from './UserService';
import { attendanceService } from './AttendanceService';
import { progressService } from './ProgressService';
import { nutritionService } from './NutritionService';
import { NewsService } from './NewsService';
import { ScheduleService } from './ScheduleService';
import { SkillService } from './SkillService';
import achievementService from './AchievementService';
import { DisciplineService } from './DisciplineService';
import * as BranchService from './BranchService';
import { TrainingResultsService } from './TrainingResultsService';
import { NewsStorageService } from './NewsService';
import { PushNotificationService } from './PushNotificationService';
import { LocalizationService } from './LocalizationService';
import { CustomNotificationService } from './CustomNotificationService'; // Добавляем импорт нового сервиса
import { TrainingService } from './TrainingService'; // Добавляем импорт TrainingService

// Export services
export { UserService } from './UserService';
export { attendanceService } from './AttendanceService';
export { progressService } from './ProgressService';
export { nutritionService } from './NutritionService';
export { NewsService } from './NewsService';
export { DisciplineService } from './DisciplineService';
export { TrainingResultsService } from './TrainingResultsService';
export { TrainingService } from './TrainingService'; // Добавляем экспорт TrainingService

export { ScheduleService } from './ScheduleService';
export { SkillService } from './SkillService';
export { default as achievementService } from './AchievementService';

// Export branch service
export { BranchService };

// MySQL services
export { MySQLUserService } from './MySQLUserService';
export { MySQLAttendanceService } from './MySQLAttendanceService';

// Database initialization service
export { DatabaseInitService } from './DatabaseInitService';

// News storage service
export { NewsStorageService };

// Push notification service
export { PushNotificationService };

// Localization service
export { LocalizationService };

// Custom notification service
export { CustomNotificationService };

// API utility
export { apiRequest } from './api';