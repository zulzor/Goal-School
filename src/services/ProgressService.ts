// Сервис для работы с прогрессом учеников через локальное хранилище

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

// Имитация локальных данных
const LOCAL_SKILLS: SkillAchievement[] = [
  {
    id: 'skill1',
    name: 'Ведение мяча',
    description: 'Умение контролировать мяч при движении',
    category: 'technical',
    level: 'beginner',
    points: 10,
    created_at: new Date().toISOString(),
  },
  {
    id: 'skill2',
    name: 'Удар по воротам',
    description: 'Точность и сила ударов по воротам',
    category: 'technical',
    level: 'intermediate',
    points: 20,
    created_at: new Date().toISOString(),
  },
];

const LOCAL_PROGRESS: StudentProgress[] = [
  {
    id: 'progress1',
    student_id: 'student1',
    skill_id: 'skill1',
    current_level: 50,
    target_level: 100,
    progress_notes: 'Хороший прогресс',
    last_assessment_date: new Date().toISOString(),
    assessed_by: 'coach1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    skill: LOCAL_SKILLS[0],
    assessor: { name: 'Иван Петров' },
  },
];

const LOCAL_FEEDBACK: CoachFeedback[] = [
  {
    id: 'feedback1',
    training_id: 'training1',
    student_id: 'student1',
    coach_id: 'coach1',
    overall_rating: 4,
    technical_skills: 4,
    physical_fitness: 3,
    teamwork: 5,
    attitude: 5,
    improvement_areas: ['Физическая подготовка'],
    strengths: ['Командная работа'],
    goals_for_next_training: 'Улучшить физическую подготовку',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    training: { title: 'Тренировка по технике', date: new Date().toISOString() },
    coach: { name: 'Иван Петров' },
  },
];

const LOCAL_GOALS: DevelopmentGoal[] = [
  {
    id: 'goal1',
    student_id: 'student1',
    coach_id: 'coach1',
    title: 'Улучшить технику ведения мяча',
    description: 'Отработка ведения мяча в движении',
    category: 'technical',
    target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    status: 'active',
    progress_percentage: 30,
    milestones: [
      { title: 'Освоить базовые приемы', completed: true, date: new Date().toISOString() },
      { title: 'Ведение в движении', completed: false },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    coach: { name: 'Иван Петров' },
  },
];

class ProgressService {
  // Получить все навыки и достижения
  async getAllSkills(): Promise<SkillAchievement[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение всех навыков из локального хранилища');
      return LOCAL_SKILLS;
    } catch (error) {
      console.error('Ошибка при получении навыков:', error);
      throw error;
    }
  }

  // Получить навыки по категории
  async getSkillsByCategory(category: string): Promise<SkillAchievement[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение навыков по категории из локального хранилища:', category);
      return LOCAL_SKILLS.filter(skill => skill.category === category);
    } catch (error) {
      console.error('Ошибка при получении навыков по категории:', error);
      throw error;
    }
  }

  // Получить прогресс ученика
  async getStudentProgress(studentId: string): Promise<StudentProgress[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение прогресса ученика из локального хранилища:', studentId);
      return LOCAL_PROGRESS.filter(progress => progress.student_id === studentId);
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
      // В реальном приложении здесь будет обновление в локальном хранилище
      console.log('Обновление прогресса ученика в локальном хранилище:', {
        studentId,
        skillId,
        progressData,
      });

      // Имитация обновления
      const updatedProgress = {
        ...LOCAL_PROGRESS[0],
        current_level: progressData.current_level,
        target_level: progressData.target_level || 100,
        progress_notes: progressData.progress_notes,
        updated_at: new Date().toISOString(),
      };

      return updatedProgress;
    } catch (error) {
      console.error('Ошибка при обновлении прогресса:', error);
      throw error;
    }
  }

  // Получить обратную связь от тренеров для ученика
  async getStudentFeedback(studentId: string, limit: number = 10): Promise<CoachFeedback[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение обратной связи ученика из локального хранилища:', studentId);
      return LOCAL_FEEDBACK.filter(feedback => feedback.student_id === studentId).slice(0, limit);
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
      // В реальном приложении здесь будет создание в локальном хранилище
      console.log('Создание обратной связи в локальном хранилище:', feedbackData);

      // Имитация создания
      const newFeedback: CoachFeedback = {
        id: 'new-feedback-id',
        training_id: feedbackData.training_id,
        student_id: feedbackData.student_id,
        coach_id: 'current-coach-id',
        overall_rating: feedbackData.overall_rating,
        technical_skills: feedbackData.technical_skills,
        physical_fitness: feedbackData.physical_fitness,
        teamwork: feedbackData.teamwork,
        attitude: feedbackData.attitude,
        improvement_areas: feedbackData.improvement_areas || [],
        strengths: feedbackData.strengths || [],
        goals_for_next_training: feedbackData.goals_for_next_training,
        private_notes: feedbackData.private_notes,
        public_feedback: feedbackData.public_feedback,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        training: { title: 'Тренировка', date: new Date().toISOString() },
        coach: { name: 'Тренер' },
      };

      return newFeedback;
    } catch (error) {
      console.error('Ошибка при создании обратной связи:', error);
      throw error;
    }
  }

  // Получить цели развития ученика
  async getStudentGoals(studentId: string): Promise<DevelopmentGoal[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение целей ученика из локального хранилища:', studentId);
      return LOCAL_GOALS.filter(goal => goal.student_id === studentId);
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
      // В реальном приложении здесь будет создание в локальном хранилище
      console.log('Создание цели в локальном хранилище:', goalData);

      // Имитация создания
      const newGoal: DevelopmentGoal = {
        id: 'new-goal-id',
        student_id: goalData.student_id,
        coach_id: 'current-coach-id',
        title: goalData.title,
        description: goalData.description,
        category: goalData.category,
        target_date: goalData.target_date,
        priority: goalData.priority || 'medium',
        status: 'active',
        progress_percentage: 0,
        milestones: goalData.milestones || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        coach: { name: 'Тренер' },
      };

      return newGoal;
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
      // В реальном приложении здесь будет обновление в локальном хранилище
      console.log('Обновление прогресса цели в локальном хранилище:', { goalId, updates });

      // Имитация обновления
      const updatedGoal = {
        ...LOCAL_GOALS[0],
        progress_percentage:
          updates.progress_percentage !== undefined
            ? updates.progress_percentage
            : LOCAL_GOALS[0].progress_percentage,
        status: updates.status || LOCAL_GOALS[0].status,
        milestones: updates.milestones || LOCAL_GOALS[0].milestones,
        updated_at: new Date().toISOString(),
      };

      return updatedGoal;
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
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение сводки прогресса ученика из локального хранилища:', studentId);

      // Имитация данных
      return {
        totalSkills: LOCAL_SKILLS.length,
        skillsInProgress: LOCAL_PROGRESS.filter(
          p => p.current_level > 0 && p.current_level < p.target_level
        ).length,
        averageProgress: 50,
        completedGoals: LOCAL_GOALS.filter(g => g.status === 'completed').length,
        activeGoals: LOCAL_GOALS.filter(g => g.status === 'active').length,
        recentFeedback: LOCAL_FEEDBACK.slice(0, 3),
        strongestCategories: [{ category: 'technical', averageLevel: 75 }],
        improvementAreas: [{ category: 'physical', averageLevel: 30 }],
      };
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
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение статистики тренера из локального хранилища:', coachId);

      // Имитация данных
      return {
        totalStudents: 10,
        studentsWithProgress: 8,
        averageOverallProgress: 65,
        recentFeedbackCount: LOCAL_FEEDBACK.length,
        activeGoalsCount: LOCAL_GOALS.filter(g => g.status === 'active').length,
        topPerformers: [{ student_name: 'Иван Иванов', average_progress: 85 }],
        needsAttention: [{ student_name: 'Петр Петров', average_progress: 30 }],
      };
    } catch (error) {
      console.error('Ошибка при получении обзора прогресса для тренера:', error);
      throw error;
    }
  }

  // Получить навыки ученика (для StudentProgressScreen)
  async getStudentSkills(studentId: string): Promise<any[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение навыков ученика из локального хранилища:', studentId);
      // Пока возвращаем пустой массив
      return [];
    } catch (error) {
      console.error('Ошибка при получении навыков ученика:', error);
      throw error;
    }
  }

  // Получить недавние достижения ученика (для StudentProgressScreen)
  async getStudentRecentAchievements(studentId: string): Promise<any[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение недавних достижений ученика из локального хранилища:', studentId);
      // Пока возвращаем пустой массив
      return [];
    } catch (error) {
      console.error('Ошибка при получении недавних достижений ученика:', error);
      throw error;
    }
  }

  // Получить статистику посещаемости ученика (для StudentProgressScreen)
  async getStudentAttendanceStats(studentId: string): Promise<any> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение статистики посещаемости ученика из локального хранилища:', studentId);
      // Пока возвращаем пустой объект
      return {};
    } catch (error) {
      console.error('Ошибка при получении статистики посещаемости ученика:', error);
      throw error;
    }
  }
}

export const progressService = new ProgressService();
