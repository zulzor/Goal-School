import { ProgressService } from '../ProgressService';

// Мокаем Supabase клиент
const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockEq = jest.fn();
const mockOrder = jest.fn();

const mockSupabase = {
  from: mockFrom,
};

jest.mock('../../config/supabase', () => ({
  supabase: mockSupabase,
}));

describe('ProgressService', () => {
  let progressService: ProgressService;

  beforeEach(() => {
    progressService = new ProgressService();
    jest.clearAllMocks();
  });

  describe('getStudentProgress', () => {
    it('should fetch student progress successfully', async () => {
      const mockData = [
        {
          id: '1',
          student_id: 'student1',
          skill_id: 'skill1',
          level: 3,
          last_updated: '2023-01-01',
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

      const result = await progressService.getStudentProgress('student1');

      expect(mockFrom).toHaveBeenCalledWith('student_progress');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('student_id', 'student1');
      expect(mockOrder).toHaveBeenCalledWith('last_updated', { ascending: false });
      expect(result).toEqual(mockData);
    });

    it('should handle errors when fetching student progress', async () => {
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

      await expect(progressService.getStudentProgress('student1')).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('updateProgress', () => {
    it('should update student progress successfully', async () => {
      const progressData = {
        student_id: 'student1',
        skill_id: 'skill1',
        level: 4,
      };

      const mockData = {
        id: '1',
        ...progressData,
        last_updated: '2023-01-01',
      };

      mockFrom.mockReturnValue({
        insert: mockInsert,
      });

      mockInsert.mockResolvedValue({
        data: [mockData],
        error: null,
      });

      const result = await progressService.updateProgress(progressData);

      expect(mockFrom).toHaveBeenCalledWith('student_progress');
      expect(mockInsert).toHaveBeenCalledWith(progressData, {
        onConflict: 'student_id,skill_id',
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('getCoachFeedback', () => {
    it('should fetch coach feedback successfully', async () => {
      const mockData = [
        {
          id: '1',
          training_id: 'training1',
          student_id: 'student1',
          overall_rating: 5,
          technical_skills: 4,
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

      const result = await progressService.getCoachFeedback('student1');

      expect(mockFrom).toHaveBeenCalledWith('coach_feedback');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('student_id', 'student1');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(mockData);
    });
  });
});
