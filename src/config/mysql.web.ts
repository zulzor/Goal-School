// src/config/mysql.web.ts
// Веб-заглушка для MySQL модуля

// Создаем полную заглушку для mysql2 модуля
const createPool = () => ({
  getConnection: async () => ({
    query: async () => [[], []],
    release: () => {},
  }),
  execute: async () => [[], []],
  end: async () => {},
});

// Экспортируем объект, совместимый с mysql2
const mysql2Stub = {
  createPool,
  createConnection: createPool,
};

// Функция для проверки подключения к базе данных (веб-версия)
export const checkMySQLConnection = async (): Promise<boolean> => {
  console.log('[Web] MySQL проверка пропущена, используется API');
  return false; // В веб-версии MySQL недоступен
};

// Функция для выполнения запросов к базе данных (веб-версия)
export const mysqlQuery = async (text: string, params?: any[]) => {
  console.log('[Web] MySQL запрос пропущен, используется API:', text);
  return { rows: [], fields: [] };
};

// Функция для инициализации базы данных (веб-версия)
export const initializeMySQLDatabase = async (): Promise<void> => {
  console.log('[Web] MySQL инициализация пропущена, используется API');
};

// Экспортируем по умолчанию заглушку пула
const defaultExport = null;

// Также экспортируем как модуль для совместимости с mysql2
export default defaultExport;

// Экспортируем для совместимости
module.exports = mysql2Stub;
module.exports.default = defaultExport;
module.exports.checkMySQLConnection = checkMySQLConnection;
module.exports.mysqlQuery = mysqlQuery;
module.exports.initializeMySQLDatabase = initializeMySQLDatabase;