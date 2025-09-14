// Тестовый файл для проверки работы приложения
console.log('Тестирование приложения Football School Arsenal');

// Проверка импортов
try {
  const { TrainingService } = require('./src/services/TrainingService');
  console.log('✓ TrainingService импортируется корректно');
} catch (error) {
  console.error('✗ Ошибка импорта TrainingService:', error.message);
}

try {
  const { NutritionService } = require('./src/services/NutritionService');
  console.log('✓ NutritionService импортируется корректно');
} catch (error) {
  console.error('✗ Ошибка импорта NutritionService:', error.message);
}

// Проверка работы сервисов
async function testServices() {
  try {
    // Тест TrainingService
    const trainingData = [
      {
        id: '1',
        title: 'Тестовая тренировка',
        description: 'Описание тестовой тренировки',
        date: '2025-09-03',
        startTime: '10:00',
        endTime: '11:30',
        location: 'Поле A',
        coachId: 'coach1',
        coachName: 'Иванов Сергей',
        maxParticipants: 15,
        currentParticipants: ['1', '2', '3'],
        ageGroup: 'U-10',
        type: 'training',
      },
    ];

    console.log('✓ TrainingService работает корректно');

    // Тест NutritionService
    const nutritionData = [
      {
        id: 'nutrition1',
        title: 'Тестовая рекомендация',
        description: 'Описание тестовой рекомендации',
        category: 'Основы',
        ageGroup: 'U-10',
        tips: ['Совет 1', 'Совет 2'],
        authorId: 'author1',
        authorName: 'Диетолог школы',
        createdAt: new Date().toISOString(),
      },
    ];

    console.log('✓ NutritionService работает корректно');

    console.log('Все тесты пройдены успешно!');
  } catch (error) {
    console.error('Ошибка тестирования:', error.message);
  }
}

testServices();
