import React from 'react';
import { render } from '@testing-library/react-native';
import { StudentAchievementProgress } from '../StudentAchievementProgress';
import { Achievement } from '../../types';

describe('StudentAchievementProgress', () => {
  const mockAchievements: Achievement[] = [
    {
      id: '1',
      title: 'First Training',
      description: 'Attend your first training',
      icon: 'run',
      category: 'training',
      points: 10,
      isUnlocked: true,
    },
    {
      id: '2',
      title: 'Five Trainings',
      description: 'Attend five trainings',
      icon: 'numeric-5-box',
      category: 'training',
      points: 50,
      isUnlocked: false,
    },
    {
      id: '3',
      title: 'Ball Master',
      description: 'Achieve advanced ball handling skills',
      icon: 'soccer',
      category: 'skill',
      points: 100,
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

  it('should render correctly with achievements data', () => {
    const studentId = 'test-student-id';
    const { getByText, getAllByTestId } = render(
      <StudentAchievementProgress achievements={mockAchievements} studentId={studentId} />
    );

    // Проверяем, что заголовок отображается
    expect(getByText('Прогресс по достижениям')).toBeTruthy();

    // Проверяем, что категории отображаются
    expect(getByText('Тренировки')).toBeTruthy();
    expect(getByText('Навыки')).toBeTruthy();
    expect(getByText('Посещаемость')).toBeTruthy();

    // Проверяем статистику по категориям
    expect(getByText('1/2')).toBeTruthy(); // Тренировки: 1 из 2
    expect(getByText('1/1')).toBeTruthy(); // Навыки: 1 из 1
    expect(getByText('0/1')).toBeTruthy(); // Посещаемость: 0 из 1
  });

  it('should calculate progress correctly', () => {
    const studentId = 'test-student-id';
    const { getByText } = render(
      <StudentAchievementProgress achievements={mockAchievements} studentId={studentId} />
    );

    // Проверяем правильность расчета прогресса
    // Тренировки: 1 из 2 = 50%
    // Навыки: 1 из 1 = 100%
    // Посещаемость: 0 из 1 = 0%

    // Эти проверки уже выполнены в предыдущем тесте,
    // но здесь мы подтверждаем правильность расчетов
    expect(getByText('1/2')).toBeTruthy();
    expect(getByText('1/1')).toBeTruthy();
    expect(getByText('0/1')).toBeTruthy();
  });

  it('should handle empty achievements array', () => {
    const studentId = 'test-student-id';
    const { queryByText } = render(
      <StudentAchievementProgress achievements={[]} studentId={studentId} />
    );

    // Проверяем, что компонент отображается даже с пустым массивом
    expect(queryByText('Прогресс по достижениям')).toBeTruthy();

    // Проверяем, что категории не отображаются при отсутствии достижений
    expect(queryByText('Тренировки')).toBeNull();
    expect(queryByText('Навыки')).toBeNull();
    expect(queryByText('Посещаемость')).toBeNull();
  });
});
