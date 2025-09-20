import { Achievement } from '../types';

// Сервис для управления достижениями учеников
class AchievementService {
  // Получение всех достижений
  async getAllAchievements(): Promise<Achievement[]> {
    // В реальной реализации здесь будет запрос к API
    // Пока возвращаем моковые данные
    return [
      {
        id: '1',
        title: 'Первая тренировка',
        description: 'Посетите свою первую тренировку',
        icon: 'run',
        category: 'training',
        points: 10,
        earnedAt: new Date().toISOString(),
        isUnlocked: true,
      },
      {
        id: '2',
        title: 'Пять тренировок',
        description: 'Посетите пять тренировок',
        icon: 'numeric-5-box',
        category: 'training',
        points: 50,
        isUnlocked: true,
      },
      {
        id: '3',
        title: 'Мастер владения мячом',
        description: 'Достигните продвинутого уровня владения мячом',
        icon: 'soccer',
        category: 'skill',
        points: 100,
        isUnlocked: false,
      },
      {
        id: '4',
        title: 'Отличная посещаемость',
        description: 'Посетите 90% тренировок за месяц',
        icon: 'calendar-check',
        category: 'attendance',
        points: 75,
        isUnlocked: true,
      },
      {
        id: '5',
        title: 'Командный игрок',
        description: 'Проявите лидерские качества в команде',
        icon: 'account-group',
        category: 'special',
        points: 150,
        isUnlocked: false,
      },
      {
        id: '6',
        title: 'Быстрый прогресс',
        description: 'Покажите значительный прогресс за месяц',
        icon: 'chart-line',
        category: 'progress',
        points: 80,
        isUnlocked: true,
      },
      {
        id: '7',
        title: 'Марафонец',
        description: 'Посетите 20 тренировок подряд',
        icon: 'run-fast',
        category: 'training',
        points: 200,
        isUnlocked: false,
      },
      {
        id: '8',
        title: 'Идеальная посещаемость',
        description: 'Посетите все тренировки за месяц без пропусков',
        icon: 'calendar-star',
        category: 'attendance',
        points: 120,
        isUnlocked: false,
      },
    ];
  }

  // Получение достижений конкретного ученика
  async getStudentAchievements(studentId: string): Promise<Achievement[]> {
    // В реальной реализации здесь будет запрос к API с фильтрацией по studentId
    return this.getAllAchievements();
  }

  // Разблокировка достижения для ученика
  async unlockAchievement(studentId: string, achievementId: string): Promise<boolean> {
    // В реальной реализации здесь будет запрос к API для обновления статуса достижения
    console.log(`Разблокировано достижение ${achievementId} для ученика ${studentId}`);
    return true;
  }

  // Получение количества очков ученика
  async getStudentPoints(studentId: string): Promise<number> {
    // В реальной реализации здесь будет запрос к API для подсчета очков
    const achievements = await this.getStudentAchievements(studentId);
    return achievements
      .filter(a => a.isUnlocked)
      .reduce((total, achievement) => total + achievement.points, 0);
  }
}

export default new AchievementService();
