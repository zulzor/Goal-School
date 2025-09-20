import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BranchService from '../BranchService';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('BranchService', () => {
  const mockBranches = [
    {
      id: '1',
      name: 'Филиал 1',
      address: 'Адрес 1',
      phone: '123456789',
      email: 'branch1@example.com',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      name: 'Филиал 2',
      address: 'Адрес 2',
      phone: '987654321',
      email: 'branch2@example.com',
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBranches', () => {
    it('should return branches from AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockBranches));

      const branches = await BranchService.getBranches();

      expect(branches).toEqual(mockBranches);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('app_branches');
    });

    it('should create default branches if none exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));

      const branches = await BranchService.getBranches();

      expect(branches.length).toBe(2);
      expect(branches[0].name).toContain('Жулебино');
      expect(branches[1].name).toContain('Дмитриевское');
    });

    it('should handle errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const branches = await BranchService.getBranches();

      expect(branches).toEqual([]);
    });
  });

  describe('createBranch', () => {
    it('should create a new branch', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockBranches));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const newBranchData = {
        name: 'Новый филиал',
        address: 'Новый адрес',
        phone: '111222333',
        email: 'newbranch@example.com',
      };

      const newBranch = await BranchService.createBranch(newBranchData);

      expect(newBranch).toHaveProperty('id');
      expect(newBranch.name).toBe(newBranchData.name);
      expect(newBranch.createdAt).toBeDefined();
      expect(newBranch.updatedAt).toBeDefined();
    });
  });

  describe('updateBranch', () => {
    it('should update an existing branch', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockBranches));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const updatedBranch = await BranchService.updateBranch('1', { name: 'Обновленный филиал' });

      expect(updatedBranch).not.toBeNull();
      expect(updatedBranch?.name).toBe('Обновленный филиал');
      expect(updatedBranch?.updatedAt).toBeDefined();
    });

    it('should return null if branch not found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockBranches));

      const updatedBranch = await BranchService.updateBranch('999', { name: 'Обновленный филиал' });

      expect(updatedBranch).toBeNull();
    });
  });

  describe('deleteBranch', () => {
    it('should delete a branch', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockBranches));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const result = await BranchService.deleteBranch('1');

      expect(result).toBe(true);
    });
  });

  describe('getBranchById', () => {
    it('should return a branch by id', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockBranches));

      const branch = await BranchService.getBranchById('1');

      expect(branch).toEqual(mockBranches[0]);
    });

    it('should return null if branch not found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockBranches));

      const branch = await BranchService.getBranchById('999');

      expect(branch).toBeNull();
    });
  });
});
