// src/services/__tests__/SkillService.test.ts
import { SkillService } from '../SkillService';

// Мокаем AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('SkillService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new skill', async () => {
    const mockGetItem = require('@react-native-async-storage/async-storage').getItem;
    const mockSetItem = require('@react-native-async-storage/async-storage').setItem;

    mockGetItem.mockResolvedValue(null);

    const skillData = {
      name: 'Test Skill',
      category: 'technical' as const,
      description: 'Test Description',
    };

    const skill = await SkillService.createSkill(skillData);

    expect(skill).toHaveProperty('id');
    expect(skill.name).toBe(skillData.name);
    expect(skill.category).toBe(skillData.category);
    expect(skill.description).toBe(skillData.description);
    expect(mockSetItem).toHaveBeenCalled();
  });

  it('should update user skill level', async () => {
    const mockGetItem = require('@react-native-async-storage/async-storage').getItem;
    const mockSetItem = require('@react-native-async-storage/async-storage').setItem;

    mockGetItem.mockResolvedValue(null);

    const userSkill = await SkillService.updateUserSkillLevel(
      'user1',
      'skill1',
      75,
      'Good progress'
    );

    expect(userSkill).toHaveProperty('id');
    expect(userSkill.userId).toBe('user1');
    expect(userSkill.skillId).toBe('skill1');
    expect(userSkill.level).toBe(75);
    expect(userSkill.notes).toBe('Good progress');
    expect(mockSetItem).toHaveBeenCalled();
  });

  it('should get skills by category', async () => {
    const mockGetItem = require('@react-native-async-storage/async-storage').getItem;

    const skills = [
      {
        id: '1',
        name: 'Skill 1',
        category: 'technical',
        description: 'Description 1',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Skill 2',
        category: 'physical',
        description: 'Description 2',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Skill 3',
        category: 'technical',
        description: 'Description 3',
        createdAt: new Date().toISOString(),
      },
    ];

    mockGetItem.mockResolvedValue(JSON.stringify(skills));

    const result = await SkillService.getSkillsByCategory('technical');

    expect(result).toHaveLength(2);
    expect(result.every(skill => skill.category === 'technical')).toBe(true);
  });
});
