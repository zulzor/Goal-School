// src/services/SkillService.ts
// Сервис для работы с навыками через локальное хранилище

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'tactical' | 'physical' | 'mental' | 'social';
  description: string;
  createdAt: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  level: number; // 0-100
  notes?: string;
  lastAssessed: string;
  createdAt: string;
  updatedAt: string;
}

class SkillService {
  private static readonly SKILLS_KEY = 'skills';
  private static readonly USER_SKILLS_KEY = 'user_skills';

  // Получение всех навыков
  static async getAllSkills(): Promise<Skill[]> {
    try {
      const skillsJson = await AsyncStorage.getItem(this.SKILLS_KEY);
      return skillsJson ? JSON.parse(skillsJson) : [];
    } catch (error) {
      console.error('Error getting skills:', error);
      return [];
    }
  }

  // Получение навыков по категории
  static async getSkillsByCategory(category: string): Promise<Skill[]> {
    try {
      const allSkills = await this.getAllSkills();
      return allSkills.filter(skill => skill.category === category);
    } catch (error) {
      console.error('Error getting skills by category:', error);
      return [];
    }
  }

  // Создание нового навыка
  static async createSkill(skillData: Omit<Skill, 'id' | 'createdAt'>): Promise<Skill> {
    try {
      const skills = await this.getAllSkills();

      const newSkill: Skill = {
        id: Date.now().toString(),
        ...skillData,
        createdAt: new Date().toISOString(),
      };

      skills.push(newSkill);
      await AsyncStorage.setItem(this.SKILLS_KEY, JSON.stringify(skills));

      return newSkill;
    } catch (error) {
      console.error('Error creating skill:', error);
      throw error;
    }
  }

  // Обновление навыка
  static async updateSkill(skillId: string, updates: Partial<Skill>): Promise<Skill> {
    try {
      const skills = await this.getAllSkills();
      const skillIndex = skills.findIndex(s => s.id === skillId);

      if (skillIndex === -1) {
        throw new Error('Skill not found');
      }

      const updatedSkill = {
        ...skills[skillIndex],
        ...updates,
      };

      skills[skillIndex] = updatedSkill;
      await AsyncStorage.setItem(this.SKILLS_KEY, JSON.stringify(skills));

      return updatedSkill;
    } catch (error) {
      console.error('Error updating skill:', error);
      throw error;
    }
  }

  // Удаление навыка
  static async deleteSkill(skillId: string): Promise<void> {
    try {
      const skills = await this.getAllSkills();
      const filteredSkills = skills.filter(s => s.id !== skillId);
      await AsyncStorage.setItem(this.SKILLS_KEY, JSON.stringify(filteredSkills));

      // Также удаляем все пользовательские записи для этого навыка
      const userSkills = await this.getAllUserSkills();
      const filteredUserSkills = userSkills.filter(us => us.skillId !== skillId);
      await AsyncStorage.setItem(this.USER_SKILLS_KEY, JSON.stringify(filteredUserSkills));
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  }

  // Получение навыков пользователя
  static async getUserSkills(userId: string): Promise<UserSkill[]> {
    try {
      const allUserSkills = await this.getAllUserSkills();
      return allUserSkills.filter(us => us.userId === userId);
    } catch (error) {
      console.error('Error getting user skills:', error);
      return [];
    }
  }

  // Получение всех пользовательских навыков
  static async getAllUserSkills(): Promise<UserSkill[]> {
    try {
      const userSkillsJson = await AsyncStorage.getItem(this.USER_SKILLS_KEY);
      return userSkillsJson ? JSON.parse(userSkillsJson) : [];
    } catch (error) {
      console.error('Error getting all user skills:', error);
      return [];
    }
  }

  // Обновление уровня навыка пользователя
  static async updateUserSkillLevel(
    userId: string,
    skillId: string,
    level: number,
    notes?: string
  ): Promise<UserSkill> {
    try {
      const userSkills = await this.getAllUserSkills();
      const userSkillIndex = userSkills.findIndex(
        us => us.userId === userId && us.skillId === skillId
      );

      const timestamp = new Date().toISOString();

      if (userSkillIndex === -1) {
        // Создаем новую запись
        const newUserSkill: UserSkill = {
          id: Date.now().toString(),
          userId,
          skillId,
          level,
          notes,
          lastAssessed: timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
        };

        userSkills.push(newUserSkill);
        await AsyncStorage.setItem(this.USER_SKILLS_KEY, JSON.stringify(userSkills));
        return newUserSkill;
      } else {
        // Обновляем существующую запись
        const updatedUserSkill = {
          ...userSkills[userSkillIndex],
          level,
          notes,
          lastAssessed: timestamp,
          updatedAt: timestamp,
        };

        userSkills[userSkillIndex] = updatedUserSkill;
        await AsyncStorage.setItem(this.USER_SKILLS_KEY, JSON.stringify(userSkills));
        return updatedUserSkill;
      }
    } catch (error) {
      console.error('Error updating user skill level:', error);
      throw error;
    }
  }

  // Получение уровня навыка пользователя
  static async getUserSkillLevel(userId: string, skillId: string): Promise<UserSkill | null> {
    try {
      const userSkills = await this.getUserSkills(userId);
      const userSkill = userSkills.find(us => us.skillId === skillId);
      return userSkill || null;
    } catch (error) {
      console.error('Error getting user skill level:', error);
      return null;
    }
  }

  // Удаление пользовательского навыка
  static async deleteUserSkill(userSkillId: string): Promise<void> {
    try {
      const userSkills = await this.getAllUserSkills();
      const filteredUserSkills = userSkills.filter(us => us.id !== userSkillId);
      await AsyncStorage.setItem(this.USER_SKILLS_KEY, JSON.stringify(filteredUserSkills));
    } catch (error) {
      console.error('Error deleting user skill:', error);
      throw error;
    }
  }

  // Получение прогресса пользователя по всем навыкам
  static async getUserProgressSummary(userId: string): Promise<{
    totalSkills: number;
    skillsInProgress: number;
    averageProgress: number;
    categoryProgress: Record<string, number>;
  }> {
    try {
      const userSkills = await this.getUserSkills(userId);
      const allSkills = await this.getAllSkills();

      const totalSkills = allSkills.length;
      const skillsInProgress = userSkills.filter(us => us.level > 0).length;

      const averageProgress =
        userSkills.length > 0
          ? userSkills.reduce((sum, us) => sum + us.level, 0) / userSkills.length
          : 0;

      // Группируем по категориям
      const categoryProgress: Record<string, number> = {};
      const categories = [...new Set(allSkills.map(s => s.category))];

      for (const category of categories) {
        const categorySkills = allSkills.filter(s => s.category === category);
        const categoryUserSkills = userSkills.filter(us =>
          categorySkills.some(cs => cs.id === us.skillId)
        );

        categoryProgress[category] =
          categoryUserSkills.length > 0
            ? categoryUserSkills.reduce((sum, us) => sum + us.level, 0) / categoryUserSkills.length
            : 0;
      }

      return {
        totalSkills,
        skillsInProgress,
        averageProgress,
        categoryProgress,
      };
    } catch (error) {
      console.error('Error getting user progress summary:', error);
      throw error;
    }
  }
}

export { SkillService };
