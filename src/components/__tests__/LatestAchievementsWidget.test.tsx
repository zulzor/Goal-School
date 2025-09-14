import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LatestAchievementsWidget } from '../LatestAchievementsWidget';
import { Achievement } from '../../types';

describe('LatestAchievementsWidget', () => {
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
      earnedAt: new Date(Date.now() - 172800000).toISOString(), // Позавчера
      isUnlocked: true,
    },
    {
      id: '4',
      title: 'Perfect Attendance',
      description: 'Attend 100% of trainings for a month',
      icon: 'calendar-check',
      category: 'attendance',
      points: 75,
      isUnlocked: false,
    },
  ];

  const mockOnAchievementPress = jest.fn();
  const mockOnSeeAllPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with achievements data', () => {
    const { getByText } = render(
      <LatestAchievementsWidget
        achievements={mockAchievements}
        onAchievementPress={mockOnAchievementPress}
        onSeeAllPress={mockOnSeeAllPress}
      />
    );

    // Проверяем, что заголовок отображается
    expect(getByText('Последние достижения')).toBeTruthy();

    // Проверяем, что кнопка "Все" отображается
    expect(getByText('Все')).toBeTruthy();

    // Проверяем, что отображаются достижения
    expect(getByText('First Training')).toBeTruthy();
    expect(getByText('Five Trainings')).toBeTruthy();
    expect(getByText('Ball Master')).toBeTruthy();
  });

  it('should handle empty achievements array', () => {
    const { getByText } = render(
      <LatestAchievementsWidget
        achievements={[]}
        onAchievementPress={mockOnAchievementPress}
        onSeeAllPress={mockOnSeeAllPress}
      />
    );

    // Проверяем, что отображается пустое состояние
    expect(getByText('Последние достижения')).toBeTruthy();
    expect(getByText('Пока нет достижений')).toBeTruthy();
    expect(getByText('Продолжайте тренироваться!')).toBeTruthy();
  });

  it('should handle achievements with no unlocked items', () => {
    const lockedAchievements = mockAchievements.map(a => ({ ...a, isUnlocked: false }));
    const { getByText } = render(
      <LatestAchievementsWidget
        achievements={lockedAchievements}
        onAchievementPress={mockOnAchievementPress}
        onSeeAllPress={mockOnSeeAllPress}
      />
    );

    // Проверяем, что отображается пустое состояние
    expect(getByText('Последние достижения')).toBeTruthy();
    expect(getByText('Пока нет достижений')).toBeTruthy();
    expect(getByText('Продолжайте тренироваться!')).toBeTruthy();
  });

  it('should call onAchievementPress when achievement is pressed', () => {
    const { getAllByText } = render(
      <LatestAchievementsWidget
        achievements={mockAchievements}
        onAchievementPress={mockOnAchievementPress}
        onSeeAllPress={mockOnSeeAllPress}
      />
    );

    // Нажимаем на первое достижение
    const achievementItems = getAllByText('First Training');
    fireEvent.press(achievementItems[0]);

    // Проверяем, что функция была вызвана
    expect(mockOnAchievementPress).toHaveBeenCalledTimes(1);
  });

  it('should call onSeeAllPress when "See All" button is pressed', () => {
    const { getByText } = render(
      <LatestAchievementsWidget
        achievements={mockAchievements}
        onAchievementPress={mockOnAchievementPress}
        onSeeAllPress={mockOnSeeAllPress}
      />
    );

    // Нажимаем на кнопку "Все"
    const seeAllButton = getByText('Все');
    fireEvent.press(seeAllButton);

    // Проверяем, что функция была вызвана
    expect(mockOnSeeAllPress).toHaveBeenCalledTimes(1);
  });
});
