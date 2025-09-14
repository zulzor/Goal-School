import React from 'react';
import { render } from '@testing-library/react-native';
import { StudentAwards } from '../StudentAwards';
import { Achievement } from '../../types';

describe('StudentAwards', () => {
  const mockAchievements: Achievement[] = [
    {
      id: '1',
      title: 'First Training',
      description: 'Attend your first training',
      icon: 'run',
      category: 'training',
      points: 10,
      earnedAt: new Date().toISOString(),
      isUnlocked: true,
    },
    {
      id: '2',
      title: 'Five Trainings',
      description: 'Attend five trainings',
      icon: 'numeric-5-box',
      category: 'training',
      points: 50,
      earnedAt: new Date(Date.now() - 86400000).toISOString(), // Вчера
      isUnlocked: true,
    },
    {
      id: '3',
      title: 'Ball Master',
      description: 'Achieve advanced ball handling skills',
      icon: 'soccer',
      category: 'skill',
      points: 100,
      isUnlocked: false,
    },
  ];

  it('should render correctly with unlocked achievements', () => {
    const studentId = 'test-student-id';
    const { getByText } = render(
      <StudentAwards achievements={mockAchievements} studentId={studentId} />
    );

    // Проверяем, что заголовок отображается
    expect(getByText('Награды')).toBeTruthy();

    // Проверяем, что разблокированные достижения отображаются
    expect(getByText('First Training')).toBeTruthy();
    expect(getByText('Five Trainings')).toBeTruthy();

    // Проверяем, что заблокированные достижения не отображаются
    const ballMasterElements = getByText('Ball Master', { exact: false });
    expect(ballMasterElements).toBeNull();
  });

  it('should handle empty achievements array', () => {
    const studentId = 'test-student-id';
    const { getByText } = render(<StudentAwards achievements={[]} studentId={studentId} />);

    // Проверяем, что отображается пустое состояние
    expect(getByText('Награды')).toBeTruthy();
    expect(getByText('Пока нет наград')).toBeTruthy();
    expect(getByText('Продолжайте тренироваться, чтобы получить награды!')).toBeTruthy();
  });

  it('should handle achievements with no unlocked items', () => {
    const studentId = 'test-student-id';
    const lockedAchievements = mockAchievements.map(a => ({ ...a, isUnlocked: false }));
    const { getByText } = render(
      <StudentAwards achievements={lockedAchievements} studentId={studentId} />
    );

    // Проверяем, что отображается пустое состояние
    expect(getByText('Награды')).toBeTruthy();
    expect(getByText('Пока нет наград')).toBeTruthy();
    expect(getByText('Продолжайте тренироваться, чтобы получить награды!')).toBeTruthy();
  });

  it('should display achievement details correctly', () => {
    const studentId = 'test-student-id';
    const { getByText } = render(
      <StudentAwards achievements={mockAchievements} studentId={studentId} />
    );

    // Проверяем детали первого достижения
    expect(getByText('First Training')).toBeTruthy();
    expect(getByText('Attend your first training')).toBeTruthy();
    expect(getByText('+10 очков')).toBeTruthy();

    // Проверяем детали второго достижения
    expect(getByText('Five Trainings')).toBeTruthy();
    expect(getByText('Attend five trainings')).toBeTruthy();
    expect(getByText('+50 очков')).toBeTruthy();
  });
});
