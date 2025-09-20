import AchievementService from '../AchievementService';
import { Achievement } from '../../types';

describe('AchievementService', () => {
  describe('getAllAchievements', () => {
    it('should return a list of achievements with correct structure', async () => {
      const achievements = await AchievementService.getAllAchievements();

      expect(achievements).toBeInstanceOf(Array);
      expect(achievements.length).toBeGreaterThan(0);

      // Проверяем структуру первого достижения
      const firstAchievement = achievements[0];
      expect(firstAchievement).toHaveProperty('id');
      expect(firstAchievement).toHaveProperty('title');
      expect(firstAchievement).toHaveProperty('description');
      expect(firstAchievement).toHaveProperty('icon');
      expect(firstAchievement).toHaveProperty('category');
      expect(firstAchievement).toHaveProperty('points');
      expect(firstAchievement).toHaveProperty('isUnlocked');

      // Проверяем типы свойств
      expect(typeof firstAchievement.id).toBe('string');
      expect(typeof firstAchievement.title).toBe('string');
      expect(typeof firstAchievement.description).toBe('string');
      expect(typeof firstAchievement.icon).toBe('string');
      expect(typeof firstAchievement.category).toBe('string');
      expect(typeof firstAchievement.points).toBe('number');
      expect(typeof firstAchievement.isUnlocked).toBe('boolean');
    });

    it('should return achievements with valid categories', async () => {
      const achievements = await AchievementService.getAllAchievements();
      const validCategories = ['training', 'skill', 'progress', 'attendance', 'special'];

      achievements.forEach(achievement => {
        expect(validCategories).toContain(achievement.category);
      });
    });
  });

  describe('getStudentAchievements', () => {
    it('should return achievements for a student', async () => {
      const studentId = 'test-student-id';
      const achievements = await AchievementService.getStudentAchievements(studentId);

      expect(achievements).toBeInstanceOf(Array);
      expect(achievements.length).toBeGreaterThan(0);
    });

    it('should return achievements with student-specific properties', async () => {
      const studentId = 'test-student-id';
      const achievements = await AchievementService.getStudentAchievements(studentId);

      // Проверяем, что у достижений есть свойства, специфичные для студента
      const achievement = achievements[0];
      expect(achievement).toHaveProperty('studentId', studentId);
    });
  });

  describe('unlockAchievement', () => {
    it('should unlock an achievement for a student', async () => {
      const studentId = 'test-student-id';
      const achievementId = 'test-achievement-id';

      const result = await AchievementService.unlockAchievement(studentId, achievementId);

      expect(result).toBe(true);
    });

    it('should handle unlocking with invalid achievement ID', async () => {
      const studentId = 'test-student-id';
      const achievementId = 'invalid-achievement-id';

      // Даже с невалидным ID сервис должен корректно обработать запрос
      const result = await AchievementService.unlockAchievement(studentId, achievementId);

      expect(result).toBe(true);
    });
  });

  describe('getStudentPoints', () => {
    it('should calculate total points for a student', async () => {
      const studentId = 'test-student-id';
      const points = await AchievementService.getStudentPoints(studentId);

      expect(typeof points).toBe('number');
      expect(points).toBeGreaterThanOrEqual(0);
    });

    it('should correctly calculate points based on unlocked achievements', async () => {
      const studentId = 'test-student-id';
      const achievements = await AchievementService.getStudentAchievements(studentId);
      const expectedPoints = achievements
        .filter(a => a.isUnlocked)
        .reduce((total, achievement) => total + achievement.points, 0);

      const actualPoints = await AchievementService.getStudentPoints(studentId);

      expect(actualPoints).toBe(expectedPoints);
    });
  });
});
