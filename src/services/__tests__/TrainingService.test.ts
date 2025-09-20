import { TrainingService } from '../TrainingService';

// Мокаем Supabase клиент
const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockEq = jest.fn();
const mockOrder = jest.fn();
const mockGte = jest.fn();

const mockSupabase = {
  from: mockFrom,
};

jest.mock('../../config/supabase', () => ({
  supabase: mockSupabase,
}));

describe('TrainingService', () => {
  let trainingService: TrainingService;

  beforeEach(() => {
    trainingService = new TrainingService();
    jest.clearAllMocks();
  });

  describe('getTrainings', () => {
    it('should fetch trainings successfully', async () => {
      const mockData = [
        {
          id: '1',
          title: 'Test Training',
          description: 'Test description',
          date: '2023-01-01',
          start_time: '10:00',
          end_time: '12:00',
          coach_id: 'coach1',
        },
      ];

      mockFrom.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        gte: mockGte,
        order: mockOrder,
      });

      mockGte.mockReturnValue({
        order: mockOrder,
      });

      mockOrder.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await trainingService.getTrainings();

      expect(mockFrom).toHaveBeenCalledWith('trainings');
      expect(mockSelect).toHaveBeenCalledWith(`
        *,
        coach:profiles(name)
      `);
      expect(mockGte).toHaveBeenCalledWith('date', expect.any(String));
      expect(mockOrder).toHaveBeenCalledWith('date', { ascending: true });
      expect(result).toEqual(mockData);
    });

    it('should handle errors when fetching trainings', async () => {
      const mockError = new Error('Database error');

      mockFrom.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        gte: mockGte,
        order: mockOrder,
      });

      mockGte.mockReturnValue({
        order: mockOrder,
      });

      mockOrder.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(trainingService.getTrainings()).rejects.toThrow('Database error');
    });
  });

  describe('getStudentTrainings', () => {
    it('should fetch student trainings successfully', async () => {
      const mockData = [
        {
          id: '1',
          training_id: 'training1',
          user_id: 'student1',
          status: 'registered',
        },
      ];

      const mockEq2 = jest.fn();

      mockFrom.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        eq: mockEq,
      });

      mockEq.mockReturnValue({
        eq: mockEq2,
      });

      mockEq2.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await trainingService.getStudentTrainings('student1');

      expect(mockFrom).toHaveBeenCalledWith('training_registrations');
      expect(mockSelect).toHaveBeenCalledWith('training_id');
      expect(mockEq).toHaveBeenCalledWith('user_id', 'student1');
      expect(mockEq2).toHaveBeenCalledWith('status', 'registered');
      expect(result).toEqual(['training1']);
    });
  });

  describe('registerForTraining', () => {
    it('should register student for training successfully', async () => {
      const registrationData = {
        training_id: 'training1',
        user_id: 'student1',
        status: 'registered',
      };

      mockFrom.mockReturnValue({
        insert: mockInsert,
      });

      mockInsert.mockResolvedValue({
        data: [registrationData],
        error: null,
      });

      const result = await trainingService.registerForTraining('training1', 'student1');

      expect(mockFrom).toHaveBeenCalledWith('training_registrations');
      expect(mockInsert).toHaveBeenCalledWith(registrationData);
      expect(result).toEqual(registrationData);
    });
  });
});
