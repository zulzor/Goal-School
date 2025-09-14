// src/utils/logger.ts
// Утилита для логирования ошибок

/**
 * Логирование ошибок в приложении
 * @param message Сообщение об ошибке
 * @param error Объект ошибки
 */
export const logError = (message: string, error?: unknown): void => {
  // В реальном приложении здесь может быть интеграция с сервисом мониторинга ошибок
  // Например, Sentry, LogRocket и т.д.

  // Пока просто выводим в консоль, но в будущем можно заменить на более продвинутое решение
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.error(`[APP ERROR] ${message}`, error);
  } else {
    // В production окружении можно отправлять ошибки на сервер
    // eslint-disable-next-line no-console
    console.error(`[APP ERROR] ${message}`);
  }
};

/**
 * Логирование предупреждений
 * @param message Сообщение предупреждения
 */
export const logWarning = (message: string): void => {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn(`[APP WARNING] ${message}`);
  }
};

/**
 * Логирование информационных сообщений
 * @param message Информационное сообщение
 */
export const logInfo = (message: string): void => {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log(`[APP INFO] ${message}`);
  }
};
