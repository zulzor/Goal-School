// Сервис для работы с дисциплинами через локальное хранилище

export interface Discipline {
  id: string;
  name: string;
  description: string;
  unit: string;
  is_active: boolean;
  age_groups: string[];
  created_at: string;
  updated_at: string;
}

export interface DisciplineResult {
  id: string;
  discipline_id: string;
  user_id: string;
  coach_id: string;
  result_value: number;
  date_recorded: string;
  age_group: string;
  notes?: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  discipline?: Discipline;
  user?: { name: string };
  coach?: { name: string };
}

// Имитация локальных данных
const LOCAL_DISCIPLINES: Discipline[] = [
  {
    id: 'discipline1',
    name: 'Бег на 30 метров',
    description: 'Спринт на 30 метров',
    unit: 'сек',
    is_active: true,
    age_groups: ['U-8', 'U-10', 'U-12'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'discipline2',
    name: 'Прыжок в длину',
    description: 'Прыжок в длину с места',
    unit: 'см',
    is_active: true,
    age_groups: ['U-8', 'U-10', 'U-12'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const LOCAL_RESULTS: DisciplineResult[] = [
  {
    id: 'result1',
    discipline_id: 'discipline1',
    user_id: 'student1',
    coach_id: 'coach1',
    result_value: 4.5,
    date_recorded: new Date().toISOString(),
    age_group: 'U-10',
    notes: 'Хороший результат',
    is_archived: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    discipline: LOCAL_DISCIPLINES[0],
    user: { name: 'Иван Иванов' },
    coach: { name: 'Сергей Петров' },
  },
];

export class DisciplineService {
  // Получение всех активных дисциплин
  static async getActiveDisciplines(): Promise<Discipline[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение дисциплин из локального хранилища');
      return LOCAL_DISCIPLINES;
    } catch (error) {
      console.error('Ошибка получения дисциплин:', error);
      return [];
    }
  }

  // Создание новой дисциплины
  static async createDiscipline(discipline: any): Promise<Discipline | null> {
    try {
      // В реальном приложении здесь будет создание в локальном хранилище
      console.log('Создание дисциплины в локальном хранилище:', discipline);
      return null;
    } catch (error) {
      console.error('Ошибка создания дисциплины:', error);
      return null;
    }
  }

  // Обновление дисциплины
  static async updateDiscipline(id: string, updates: any): Promise<boolean> {
    try {
      // В реальном приложении здесь будет обновление в локальном хранилище
      console.log('Обновление дисциплины в локальном хранилище:', { id, updates });
      return true;
    } catch (error) {
      console.error('Ошибка обновления дисциплины:', error);
      return false;
    }
  }

  // Получение результатов по дисциплине для конкретного пользователя
  static async getUserResults(userId: string, disciplineId: string): Promise<DisciplineResult[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение результатов пользователя из локального хранилища:', {
        userId,
        disciplineId,
      });
      return LOCAL_RESULTS.filter(r => r.user_id === userId && r.discipline_id === disciplineId);
    } catch (error) {
      console.error('Ошибка получения результатов пользователя:', error);
      return [];
    }
  }

  // Получение всех результатов для тренера (его учеников)
  static async getCoachResults(coachId: string): Promise<DisciplineResult[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение результатов тренера из локального хранилища:', coachId);
      return LOCAL_RESULTS.filter(r => r.coach_id === coachId);
    } catch (error) {
      console.error('Ошибка получения результатов тренера:', error);
      return [];
    }
  }

  // Добавление нового результата
  static async addResult(result: any): Promise<DisciplineResult | null> {
    try {
      // В реальном приложении здесь будет создание в локальном хранилище
      console.log('Добавление результата в локальное хранилище:', result);
      return null;
    } catch (error) {
      console.error('Ошибка добавления результата:', error);
      return null;
    }
  }

  // Обновление результата
  static async updateResult(id: string, updates: any): Promise<boolean> {
    try {
      // В реальном приложении здесь будет обновление в локальном хранилище
      console.log('Обновление результата в локальном хранилище:', { id, updates });
      return true;
    } catch (error) {
      console.error('Ошибка обновления результата:', error);
      return false;
    }
  }

  // Архивирование результата (исключение из топа)
  static async archiveResult(id: string): Promise<boolean> {
    try {
      // В реальном приложении здесь будет обновление в локальном хранилище
      console.log('Архивирование результата в локальном хранилище:', id);
      return true;
    } catch (error) {
      console.error('Ошибка архивирования результата:', error);
      return false;
    }
  }

  // Получение топ результатов по дисциплине и возрастной группе
  static async getTopResults(
    disciplineId: string,
    ageGroup: string,
    limit: number = 10
  ): Promise<DisciplineResult[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение топ результатов из локального хранилища:', {
        disciplineId,
        ageGroup,
        limit,
      });
      return LOCAL_RESULTS.filter(
        r => r.discipline_id === disciplineId && r.age_group === ageGroup && !r.is_archived
      )
        .sort((a, b) => a.result_value - b.result_value)
        .slice(0, limit);
    } catch (error) {
      console.error('Ошибка получения топ результатов:', error);
      return [];
    }
  }

  // Получение среднего результата по возрастной группе
  static async getAverageResult(disciplineId: string, ageGroup: string): Promise<number | null> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение среднего результата из локального хранилища:', {
        disciplineId,
        ageGroup,
      });

      const results = LOCAL_RESULTS.filter(
        r => r.discipline_id === disciplineId && r.age_group === ageGroup && !r.is_archived
      );

      if (results.length === 0) return null;

      const sum = results.reduce((acc, result) => acc + result.result_value, 0);
      return sum / results.length;
    } catch (error) {
      console.error('Ошибка получения среднего результата:', error);
      return null;
    }
  }

  // Получение прогресса пользователя по дисциплине
  static async getUserProgress(
    userId: string,
    disciplineId: string
  ): Promise<{
    bestResult: DisciplineResult | null;
    latestResult: DisciplineResult | null;
    improvement: number | null;
  }> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение прогресса пользователя из локального хранилища:', {
        userId,
        disciplineId,
      });

      const userResults = LOCAL_RESULTS.filter(
        r => r.user_id === userId && r.discipline_id === disciplineId && !r.is_archived
      ).sort((a, b) => new Date(b.date_recorded).getTime() - new Date(a.date_recorded).getTime());

      if (userResults.length === 0) {
        return { bestResult: null, latestResult: null, improvement: null };
      }

      const latestResult = userResults[0];
      const bestResult = userResults.reduce((best, current) =>
        current.result_value < best.result_value ? current : best
      );

      const improvement = latestResult.result_value - bestResult.result_value;

      return { bestResult, latestResult, improvement };
    } catch (error) {
      console.error('Ошибка получения прогресса пользователя:', error);
      return { bestResult: null, latestResult: null, improvement: null };
    }
  }

  // Получение сравнения результатов по возрастной группе
  static async getAgeGroupComparison(
    disciplineId: string,
    ageGroup: string,
    userId: string
  ): Promise<{
    userResult: DisciplineResult | null;
    groupAverage: number | null;
    userRank: number | null;
    totalInGroup: number;
  }> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение сравнения по возрастной группе из локального хранилища:', {
        disciplineId,
        ageGroup,
        userId,
      });

      const groupResults = LOCAL_RESULTS.filter(
        r => r.discipline_id === disciplineId && r.age_group === ageGroup && !r.is_archived
      ).sort((a, b) => a.result_value - b.result_value);

      const userResult = groupResults.find(r => r.user_id === userId) || null;
      const totalInGroup = groupResults.length;

      if (groupResults.length === 0) {
        return { userResult, groupAverage: null, userRank: null, totalInGroup };
      }

      const sum = groupResults.reduce((acc, result) => acc + result.result_value, 0);
      const groupAverage = sum / groupResults.length;

      let userRank = null;
      if (userResult) {
        userRank = groupResults.findIndex(r => r.user_id === userId) + 1;
      }

      return { userResult, groupAverage, userRank, totalInGroup };
    } catch (error) {
      console.error('Ошибка получения сравнения по возрастной группе:', error);
      return { userResult: null, groupAverage: null, userRank: null, totalInGroup: 0 };
    }
  }

  // Получение удаленных пользователей (для UserManagementScreen)
  static async getDeletedUsers(): Promise<any[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение удаленных пользователей из локального хранилища');
      // Пока возвращаем пустой массив, так как у нас нет данных об удаленных пользователях
      return [];
    } catch (error) {
      console.error('Ошибка получения удаленных пользователей:', error);
      return [];
    }
  }
}

export const disciplineService = new DisciplineService();
