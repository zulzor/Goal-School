// Тестирование хэширования паролей
export const testPasswordHashing = () => {
  // Функция для создания хэша пароля (упрощенная реализация)
  const hashPassword = (password: string): string => {
    // В реальном приложении используйте криптографическую хэш-функцию
    return btoa(password); // Base64 для демонстрации
  };

  // Функция для проверки хэша пароля
  const verifyPassword = (password: string, hash: string): boolean => {
    return btoa(password) === hash;
  };

  // Тестовые данные
  const testPassword = 'password123';
  const hashedPassword = hashPassword(testPassword);

  console.log('Тест хэширования паролей:');
  console.log('Оригинальный пароль:', testPassword);
  console.log('Хэшированный пароль:', hashedPassword);
  console.log('Проверка совпадения:', verifyPassword(testPassword, hashedPassword));

  // Проверим с пробелами
  const passwordWithSpaces = ' password123 ';
  console.log('Пароль с пробелами:', passwordWithSpaces);
  console.log('Хэш пароля с пробелами:', hashPassword(passwordWithSpaces));
  console.log(
    'Проверка совпадения с пробелами:',
    verifyPassword(passwordWithSpaces, hashedPassword)
  );

  return {
    original: testPassword,
    hashed: hashedPassword,
    verification: verifyPassword(testPassword, hashedPassword),
    withSpaces: {
      password: passwordWithSpaces,
      hashed: hashPassword(passwordWithSpaces),
      verification: verifyPassword(passwordWithSpaces, hashedPassword),
    },
  };
};
