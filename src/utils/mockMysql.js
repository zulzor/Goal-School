// Mock для mysql2 в веб-версии
console.warn('mysql2 is not available in web version');

// Создаем mock объект, который будет использоваться в веб-версии
const mockMysql = {
  createConnection: () => {
    return {
      connect: callback => {
        console.warn('MySQL connection is not available in web version');
        callback(new Error('MySQL is not available in web version'));
      },
      query: (sql, callback) => {
        console.warn('MySQL query is not available in web version');
        callback(new Error('MySQL is not available in web version'));
      },
      end: callback => {
        if (callback) callback();
      },
    };
  },
  createPool: () => {
    return {
      getConnection: callback => {
        console.warn('MySQL pool is not available in web version');
        callback(new Error('MySQL is not available in web version'));
      },
      query: (sql, callback) => {
        console.warn('MySQL pool query is not available in web version');
        callback(new Error('MySQL is not available in web version'));
      },
      end: callback => {
        if (callback) callback();
      },
    };
  },
};

// Для promise версии
mockMysql.promise = {
  createConnection: async () => {
    throw new Error('MySQL is not available in web version');
  },
  createPool: async () => {
    throw new Error('MySQL is not available in web version');
  },
};

module.exports = mockMysql;
