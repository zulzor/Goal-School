import { DisciplineService } from '../DisciplineService';

// Мокаем Supabase клиент
const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockEq = jest.fn();
const mockOrder = jest.fn();

const mockSupabase = {
  from: mockFrom,
};

jest.mock('../../config/supabase', () => ({
  supabase: mockSupabase,
}));

describe('DisciplineService', () => {
  let disciplineService: DisciplineService;

  beforeEach(() => {
    disciplineService = new DisciplineService();
    jest.clearAllMocks();
  });

  describe('getDisciplines', () => {
    it('should fetch active disciplines successfully', async () => {
      const mockData = [
        {
          id: '1',
          name: 'Speed Run',
          description: 'Test speed running',
          unit: 'time',
          is_active: true,
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

      const result = await disciplineService.getDisciplines();

      expect(mockFrom).toHaveBeenCalledWith('disciplines');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('is_active', true);
      expect(mockOrder).toHaveBeenCalledWith('name', { ascending: true });
      expect(result).toEqual(mockData);
    });

    it('should handle errors when fetching disciplines', async () => {
      const mockError = new Error('Database error');

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
        data: null,
        error: mockError,
      });

      await expect(disciplineService.getDisciplines()).rejects.toThrow('Database error');
    });
  });

  describe('getStudentResults', () => {
    it('should fetch student results successfully', async () => {
      const mockData = [
        {
          id: '1',
          discipline_id: 'discipline1',
          user_id: 'student1',
          result_value: 15000,
          date_recorded: '2023-01-01',
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

      const result = await disciplineService.getStudentResults('student1');

      expect(mockFrom).toHaveBeenCalledWith('discipline_results');
      expect(mockSelect).toHaveBeenCalledWith(`
        *,
        discipline:disciplines(name, unit),
        user:profiles(name)
      `);
      expect(mockEq).toHaveBeenCalledWith('user_id', 'student1');
      expect(mockOrder).toHaveBeenCalledWith('date_recorded', { ascending: false });
      expect(result).toEqual(mockData);
    });
  });

  describe('addDisciplineResult', () => {
    it('should add discipline result successfully', async () => {
      const resultData = {
        discipline_id: 'discipline1',
        user_id: 'student1',
        result_value: 15000,
        age_group: 'U12',
        date_recorded: '2023-01-01',
      };

      mockFrom.mockReturnValue({
        insert: mockInsert,
      });

      mockInsert.mockResolvedValue({
        data: [resultData],
        error: null,
      });

      const result = await disciplineService.addDisciplineResult(resultData);

      expect(mockFrom).toHaveBeenCalledWith('discipline_results');
      expect(mockInsert).toHaveBeenCalledWith(resultData);
      expect(result).toEqual(resultData);
    });
  });
});
