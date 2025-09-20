import React from 'react';
import { render } from '@testing-library/react-native';
import { AchievementStats } from '../AchievementStats';
import { Achievement } from '../../types';

describe('AchievementStats', () => {
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
    const { getByText } = render(
      <AchievementStats achievements={mockAchievements} studentId={studentId} />
    );

    // Проверяем, что заголовок отображается
    expect(getByText('Статистика достижений')).toBeTruthy();

    // Проверяем статистику достижений
    expect(getByText('2')).toBeTruthy(); // Разблокировано (2 из 4)
    expect(getByText('2')).toBeTruthy(); // Осталось (2 из 4)
    expect(getByText('110')).toBeTruthy(); // Очков (10 + 100)

    // Проверяем текстовые метки
    expect(getByText('Разблокировано')).toBeTruthy();
    expect(getByText('Осталось')).toBeTruthy();
    expect(getByText('Очков')).toBeTruthy();

    // Проверяем статистику по категориям
    expect(getByText('По категориям')).toBeTruthy();
    expect(getByText('3 категории, 4 достижений')).toBeTruthy();
  });

  it('should handle empty achievements array', () => {
    const studentId = 'test-student-id';
    const { getByText } = render(<AchievementStats achievements={[]} studentId={studentId} />);

    // Проверяем, что компонент отображается даже с пустым массивом
    expect(getByText('Статистика достижений')).toBeTruthy();

    // Проверяем, что все значения равны нулю
    expect(getByText('0')).toBeTruthy(); // Разблокировано
    expect(getByText('0')).toBeTruthy(); // Осталось
    expect(getByText('0')).toBeTruthy(); // Очков

    // Проверяем статистику по категориям
    expect(getByText('0 категории, 0 достижений')).toBeTruthy();
  });

  it('should handle all unlocked achievements', () => {
    const studentId = 'test-student-id';
    const allUnlocked = mockAchievements.map(a => ({ ...a, isUnlocked: true }));
    const { getByText } = render(
      <AchievementStats achievements={allUnlocked} studentId={studentId} />
    );

    // Проверяем, что все достижения разблокированы
    expect(getByText('4')).toBeTruthy(); // Разблокировано (4 из 4)
    expect(getByText('0')).toBeTruthy(); // Осталось (0 из 4)
    expect(getByText('235')).toBeTruthy(); // Очков (10 + 50 + 100 + 75)
  });

  it('should handle all locked achievements', () => {
    const studentId = 'test-student-id';
    const allLocked = mockAchievements.map(a => ({ ...a, isUnlocked: false }));
    const { getByText } = render(
      <AchievementStats achievements={allLocked} studentId={studentId} />
    );

    // Проверяем, что все достижения заблокированы
    expect(getByText('0')).toBeTruthy(); // Разблокировано (0 из 4)
    expect(getByText('4')).toBeTruthy(); // Осталось (4 из 4)
    expect(getByText('0')).toBeTruthy(); // Очков (0)
  });
});
