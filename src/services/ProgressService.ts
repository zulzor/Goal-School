// Сервис для работы с прогрессом учеников через API

import { apiRequest } from './api';

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
  skill: SkillAchievement;
  assessor?: { name: string };
}

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
  training?: { title: string; date: string };
  coach?: { name: string };
}

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
  milestones?: Array<{ title: string; completed: boolean; date?: string }>;
  created_at: string;
  updated_at: string;
  coach?: { name: string };
}

class ProgressService {
  // Получить все навыки и достижения
  async getAllSkills(): Promise<SkillAchievement[]> {
    try {
      const response = await apiRequest<SkillAchievement[]>(`/api/skills`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Ошибка при получении навыков:', error);
      throw error;
    }
  }

  // Получить навыки по категории
  async getSkillsByCategory(category: string): Promise<SkillAchievement[]> {
    try {
      const response = await apiRequest<SkillAchievement[]>(
        `/api/skills/category/${category}`,
        {
          method: 'GET',
        }
      );
      return response;
    } catch (error) {
      console.error('Ошибка при получении навыков по категории:', error);
      throw error;
    }
  }

  // Получить прогресс ученика
  async getStudentProgress(studentId: string): Promise<StudentProgress[]> {
    try {
      const response = await apiRequest<StudentProgress[]>(
        `/api/progress/student/${studentId}`,
        {
          method: 'GET',
        }
      );
      return response;
    } catch (error) {
      console.error('Ошибка при получении прогресса ученика:', error);
      throw error;
    }
  }

  // Обновить прогресс ученика по навыку
  async updateStudentProgress(
    studentId: string,
    skillId: string,
    progressData: {
      current_level: number;
      target_level?: number;
      progress_notes?: string;
    }
  ): Promise<StudentProgress> {
    try {
      const response = await apiRequest<StudentProgress>(`/api/progress/update`, {
        method: 'POST',
        body: JSON.stringify({
          studentId,
          skillId,
          ...progressData,
        }),
      });
      return response;
    } catch (error) {
      console.error('Ошибка при обновлении прогресса:', error);
      throw error;
    }
  }

  // Получить обратную связь от тренеров для ученика
  async getStudentFeedback(studentId: string, limit: number = 10): Promise<CoachFeedback[]> {
    try {
      const params = new URLSearchParams();
      params.append('studentId', studentId);
      params.append('limit', limit.toString());

      const response = await apiRequest<CoachFeedback[]>(
        `/api/feedback?${params.toString()}`,
        {
          method: 'GET',
        }
      );
      return response;
    } catch (error) {
      console.error('Ошибка при получении обратной связи:', error);
      throw error;
    }
  }

  // Создать обратную связь от тренера
  async createCoachFeedback(feedbackData: {
    training_id: string;
    student_id: string;
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
  }): Promise<CoachFeedback> {
    try {
      const response = await apiRequest<CoachFeedback>(`/api/feedback`, {
        method: 'POST',
        body: JSON.stringify(feedbackData),
      });
      return response;
    } catch (error) {
      console.error('Ошибка при создании обратной связи:', error);
      throw error;
    }
  }

  // Получить цели развития ученика
  async getStudentGoals(studentId: string): Promise<DevelopmentGoal[]> {
    try {
      const response = await apiRequest<DevelopmentGoal[]>(
        `/api/goals/student/${studentId}`,
        {
          method: 'GET',
        }
      );
      return response;
    } catch (error) {
      console.error('Ошибка при получении целей ученика:', error);
      throw error;
    }
  }

  // Создать цель развития
  async createDevelopmentGoal(goalData: {
    student_id: string;
    title: string;
    description: string;
    category: 'technical' | 'physical' | 'tactical' | 'mental' | 'social';
    target_date?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    milestones?: Array<{ title: string; completed: boolean; date?: string }>;
  }): Promise<DevelopmentGoal> {
    try {
      const response = await apiRequest<DevelopmentGoal>(`/api/goals`, {
        method: 'POST',
        body: JSON.stringify(goalData),
      });
      return response;
    } catch (error) {
      console.error('Ошибка при создании цели:', error);
      throw error;
    }
  }

  // Обновить прогресс цели
  async updateGoalProgress(
    goalId: string,
    updates: {
      progress_percentage?: number;
      status?: 'active' | 'completed' | 'paused' | 'cancelled';
      milestones?: Array<{ title: string; completed: boolean; date?: string }>;
    }
  ): Promise<DevelopmentGoal> {
    try {
      const response = await apiRequest<DevelopmentGoal>(`/api/goals/${goalId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return response;
    } catch (error) {
      console.error('Ошибка при обновлении прогресса цели:', error);
      throw error;
    }
  }

  // Получить сводку прогресса ученика
  async getStudentProgressSummary(studentId: string): Promise<{
    totalSkills: number;
    skillsInProgress: number;
    averageProgress: number;
    completedGoals: number;
    activeGoals: number;
    recentFeedback: CoachFeedback[];
    strongestCategories: Array<{ category: string; averageLevel: number }>;
    improvementAreas: Array<{ category: string; averageLevel: number }>;
  }> {
    try {
      const response = await apiRequest<any>(`/api/progress/summary/${studentId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Ошибка при получении сводки прогресса:', error);
      throw error;
    }
  }

  // Получить статистику для тренера/менеджера
  async getCoachProgressOverview(coachId?: string): Promise<{
    totalStudents: number;
    studentsWithProgress: number;
    averageOverallProgress: number;
    recentFeedbackCount: number;
    activeGoalsCount: number;
    topPerformers: Array<{ student_name: string; average_progress: number }>;
    needsAttention: Array<{ student_name: string; average_progress: number }>;
  }> {
    try {
      const params = new URLSearchParams();
      if (coachId) params.append('coachId', coachId);

      const response = await apiRequest<any>(
        `/api/progress/overview?${params.toString()}`,
        {
          method: 'GET',
        }
      );
      return response;
    } catch (error) {
      console.error('Ошибка при получении обзора прогресса для тренера:', error);
      throw error;
    }
  }

  // Получить навыки ученика (для StudentProgressScreen)
  async getStudentSkills(studentId: string): Promise<any[]> {
    try {
      const response = await apiRequest<any[]>(`/api/skills/student/${studentId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Ошибка при получении навыков ученика:', error);
      throw error;
    }
  }

  // Получить недавние достижения ученика (для StudentProgressScreen)
  async getStudentRecentAchievements(studentId: string): Promise<any[]> {
    try {
      const response = await apiRequest<any[]>(`/api/achievements/student/${studentId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Ошибка при получении недавних достижений ученика:', error);
      throw error;
    }
  }

  // Получить статистику посещаемости ученика (для StudentProgressScreen)
  async getStudentAttendanceStats(studentId: string): Promise<any> {
    try {
      const response = await apiRequest<any>(`/api/attendance/stats/${studentId}`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Ошибка при получении статистики посещаемости ученика:', error);
      throw error;
    }
  }
}

export const progressService = new ProgressService();