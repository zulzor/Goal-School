// Сервис для работы с рекомендациями по питанию через локальное хранилище
import { fetchWithOfflineFallback, cacheData } from '../utils/networkUtils';

export interface NutritionRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  ageGroup: string;
  tips: string[];
  imageUrl?: string;
  authorId: string;
  authorName?: string;
  createdAt: string;
}

// Имитация локальных данных
const LOCAL_NUTRITION: NutritionRecommendation[] = [
  {
    id: 'nutrition1',
    title: 'Правильное питание юного футболиста',
    description: 'Основные принципы питания для юных спортсменов',
    category: 'Основы',
    ageGroup: 'U-10',
    tips: ['Ешьте разнообразную пищу', 'Пейте достаточно воды', 'Не пропускайте завтрак'],
    authorId: 'author1',
    authorName: 'Диетолог школы',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'nutrition2',
    title: 'Углеводы для энергии',
    description: 'Роль углеводов в спортивном питании',
    category: 'Макронутриенты',
    ageGroup: 'U-12',
    tips: [
      'Углеводы - основной источник энергии',
      'Предпочтение сложным углеводам',
      'Употребляйте за 2-3 часа до тренировки',
    ],
    authorId: 'author1',
    authorName: 'Диетолог школы',
    createdAt: new Date().toISOString(),
  },
];

export class NutritionService {
  // Получение всех рекомендаций по питанию с поддержкой offline-режима
  static async getNutritionRecommendations(): Promise<NutritionRecommendation[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение рекомендаций по питанию из локального хранилища');
      return LOCAL_NUTRITION;
    } catch (error) {
      console.error('Ошибка получения рекомендаций по питанию:', error);
      throw error;
    }
  }

  // Поиск рекомендаций по питанию
  static async searchNutrition(query: string): Promise<NutritionRecommendation[]> {
    try {
      // В реальном приложении здесь будет поиск в локальном хранилище
      console.log('Поиск рекомендаций по питанию в локальном хранилище:', query);
      return LOCAL_NUTRITION.filter(
        nutrition =>
          nutrition.title.toLowerCase().includes(query.toLowerCase()) ||
          nutrition.description.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Ошибка поиска рекомендаций по питанию:', error);
      return [];
    }
  }

  // Получение рекомендаций по категории
  static async getNutritionByCategory(category: string): Promise<NutritionRecommendation[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение рекомендаций по категории из локального хранилища:', category);
      return LOCAL_NUTRITION.filter(nutrition => nutrition.category === category);
    } catch (error) {
      console.error('Ошибка получения рекомендаций по категории:', error);
      return [];
    }
  }

  // Получение рекомендаций по возрастной группе
  static async getNutritionByAgeGroup(ageGroup: string): Promise<NutritionRecommendation[]> {
    try {
      // В реальном приложении здесь будет запрос к локальному хранилищу
      console.log('Получение рекомендаций по возрастной группе из локального хранилища:', ageGroup);
      return LOCAL_NUTRITION.filter(nutrition => nutrition.ageGroup === ageGroup);
    } catch (error) {
      console.error('Ошибка получения рекомендаций по возрастной группе:', error);
      return [];
    }
  }

  // Создание новой рекомендации
  static async createNutrition(
    nutritionData: Omit<NutritionRecommendation, 'id' | 'authorName' | 'createdAt'>
  ): Promise<boolean> {
    try {
      // В реальном приложении здесь будет создание в локальном хранилище
      console.log('Создание рекомендации по питанию в локальном хранилище:', nutritionData);
      return true;
    } catch (error) {
      console.error('Ошибка создания рекомендации:', error);
      return false;
    }
  }

  // Обновление рекомендации
  static async updateNutrition(
    id: string,
    updates: Partial<NutritionRecommendation>
  ): Promise<boolean> {
    try {
      // В реальном приложении здесь будет обновление в локальном хранилище
      console.log('Обновление рекомендации по питанию в локальном хранилище:', { id, updates });
      return true;
    } catch (error) {
      console.error('Ошибка обновления рекомендации:', error);
      return false;
    }
  }

  // Удаление рекомендации
  static async deleteNutrition(id: string): Promise<boolean> {
    try {
      // В реальном приложении здесь будет удаление из локального хранилища
      console.log('Удаление рекомендации по питанию из локального хранилища:', id);
      return true;
    } catch (error) {
      console.error('Ошибка удаления рекомендации:', error);
      return false;
    }
  }
}

export const nutritionService = new NutritionService();
