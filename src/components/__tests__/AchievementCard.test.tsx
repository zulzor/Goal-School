import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AchievementCard } from '../AchievementCard';
import { Achievement } from '../../types';

describe('AchievementCard', () => {
  const mockAchievement: Achievement = {
    id: '1',
    title: 'Первое достижение',
    description: 'Описание первого достижения',
    icon: 'trophy',
    category: 'training',
    points: 100,
    isUnlocked: true,
    earnedAt: new Date().toISOString(),
  };

  it('should render correctly with unlocked achievement', () => {
    const { getByText, getByTestId } = render(<AchievementCard achievement={mockAchievement} />);

    expect(getByText('Первое достижение')).toBeTruthy();
    expect(getByText('Описание первого достижения')).toBeTruthy();
    expect(getByText('+100 очков')).toBeTruthy();
    expect(getByText('Тренировки')).toBeTruthy();
  });

  it('should render correctly with locked achievement', () => {
    const lockedAchievement: Achievement = {
      ...mockAchievement,
      isUnlocked: false,
    };

    const { getByText, queryByText } = render(<AchievementCard achievement={lockedAchievement} />);

    expect(getByText('Первое достижение')).toBeTruthy();
    expect(getByText('Описание первого достижения')).toBeTruthy();
    expect(queryByText('+100 очков')).toBeNull();
    expect(getByText('Заблокировано')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();

    const { getByText } = render(
      <AchievementCard achievement={mockAchievement} onPress={onPressMock} />
    );

    fireEvent.press(getByText('Первое достижение'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should display correct category labels', () => {
    const categories: Array<{ category: any; label: string }> = [
      { category: 'training', label: 'Тренировки' },
      { category: 'skill', label: 'Навыки' },
      { category: 'progress', label: 'Прогресс' },
      { category: 'attendance', label: 'Посещаемость' },
      { category: 'special', label: 'Специальное' },
    ];

    categories.forEach(({ category, label }) => {
      const achievement: Achievement = {
        ...mockAchievement,
        category,
      };

      const { getByText } = render(<AchievementCard achievement={achievement} />);

      expect(getByText(label)).toBeTruthy();
    });
  });
});
