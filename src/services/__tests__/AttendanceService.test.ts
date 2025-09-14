import { AttendanceService } from '../AttendanceService';

// Мокаем Supabase клиент
const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockEq = jest.fn();

const mockSupabase = {
  from: mockFrom,
};

jest.mock('../../config/supabase', () => ({
  supabase: mockSupabase,
}));

describe('AttendanceService', () => {
  let attendanceService: AttendanceService;

  beforeEach(() => {
    attendanceService = new AttendanceService();
    jest.clearAllMocks();
  });

  describe('getStudentAttendance', () => {
    it('should fetch student attendance data successfully', async () => {
      const mockData = [
        {
          id: '1',
          student_id: 'student1',
          training_id: 'training1',
          attendance_status: 'present',
          date: '2023-01-01',
        },
      ];

      mockFrom.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        eq: mockEq,
      });

      mockEq.mockResolvedValue({
        data: mockData,
        error: null,
      });

      const result = await attendanceService.getStudentAttendance('student1');

      expect(mockFrom).toHaveBeenCalledWith('attendance');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('student_id', 'student1');
      expect(result).toEqual(mockData);
    });

    it('should handle errors when fetching student attendance', async () => {
      const mockError = new Error('Database error');

      mockFrom.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        eq: mockEq,
      });

      mockEq.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(attendanceService.getStudentAttendance('student1')).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('markAttendance', () => {
    it('should mark attendance successfully', async () => {
      const attendanceData = {
        student_id: 'student1',
        training_id: 'training1',
        attendance_status: 'present',
      };

      mockFrom.mockReturnValue({
        insert: mockInsert,
      });

      mockInsert.mockResolvedValue({
        data: [attendanceData],
        error: null,
      });

      const result = await attendanceService.markAttendance(attendanceData);

      expect(mockFrom).toHaveBeenCalledWith('attendance');
      expect(mockInsert).toHaveBeenCalledWith(attendanceData);
      expect(result).toEqual(attendanceData);
    });

    it('should handle errors when marking attendance', async () => {
      const attendanceData = {
        student_id: 'student1',
        training_id: 'training1',
        attendance_status: 'present',
      };
      const mockError = new Error('Insert failed');

      mockFrom.mockReturnValue({
        insert: mockInsert,
      });

      mockInsert.mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(attendanceService.markAttendance(attendanceData)).rejects.toThrow(
        'Insert failed'
      );
    });
  });

  describe('updateAttendance', () => {
    it('should update attendance successfully', async () => {
      const attendanceId = '1';
      const updateData = {
        attendance_status: 'late',
      };

      mockFrom.mockReturnValue({
        update: mockUpdate,
      });

      mockUpdate.mockReturnValue({
        eq: mockEq,
      });

      mockEq.mockResolvedValue({
        data: [{ id: attendanceId, ...updateData }],
        error: null,
      });

      const result = await attendanceService.updateAttendance(attendanceId, updateData);

      expect(mockFrom).toHaveBeenCalledWith('attendance');
      expect(mockUpdate).toHaveBeenCalledWith(updateData);
      expect(mockEq).toHaveBeenCalledWith('id', attendanceId);
      expect(result).toEqual({ id: attendanceId, ...updateData });
    });
  });
});
