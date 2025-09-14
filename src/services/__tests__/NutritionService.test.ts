import { NutritionService } from '../NutritionService';

// Мокаем Supabase клиент
const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockOrder = jest.fn();

const mockSupabase = {
  from: mockFrom,
};

jest.mock('../../config/supabase', () => ({
  supabase: mockSupabase,
}));

describe('NutritionService', () => {
  let nutritionService: NutritionService;

  beforeEach(() => {
    nutritionService = new NutritionService();
    jest.clearAllMocks();
  });

  describe('getRecommendations', () => {
    it('should fetch nutrition recommendations successfully', async () => {
      const mockData = [
        {
          id: '1',
          title: 'Test Recommendation',
          description: 'Test description',
          category: 'breakfast',
          age_group: 'U12',
          created_at: '2023-01-01',
        },
      ];

      mockFrom.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        order: mockOrder,
      });

      mockOrder.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await nutritionService.getRecommendations();

      expect(mockFrom).toHaveBeenCalledWith('nutrition_recommendations');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(mockData);
    });

    it('should handle errors when fetching recommendations', async () => {
      const mockError = new Error('Database error');

      mockFrom.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        order: mockOrder,
      });

      mockOrder.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(nutritionService.getRecommendations()).rejects.toThrow('Database error');
    });
  });

  describe('getRecommendationsByCategory', () => {
    it('should fetch recommendations by category successfully', async () => {
      const mockData = [
        {
          id: '1',
          title: 'Breakfast Recommendation',
          description: 'Test description',
          category: 'breakfast',
          age_group: 'U12',
          created_at: '2023-01-01',
        },
      ];

      mockFrom.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        eq: mockEq,
        order: mockOrder,
      });

      mockEq.mockReturnValue({
        order: mockOrder,
      });

      mockOrder.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await nutritionService.getRecommendationsByCategory('breakfast');

      expect(mockFrom).toHaveBeenCalledWith('nutrition_recommendations');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('category', 'breakfast');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(mockData);
    });
  });

  describe('getRecommendationsByAgeGroup', () => {
    it('should fetch recommendations by age group successfully', async () => {
      const mockData = [
        {
          id: '1',
          title: 'U12 Recommendation',
          description: 'Test description',
          category: 'breakfast',
          age_group: 'U12',
          created_at: '2023-01-01',
        },
      ];

      mockFrom.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        eq: mockEq,
        order: mockOrder,
      });

      mockEq.mockReturnValue({
        order: mockOrder,
      });

      mockOrder.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await nutritionService.getRecommendationsByAgeGroup('U12');

      expect(mockFrom).toHaveBeenCalledWith('nutrition_recommendations');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('age_group', 'U12');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(mockData);
    });
  });
});
