// Mock для mysql2
const mockQuery = (sql, values, callback) => {
  console.warn('MySQL query mock:', sql, values);
  // Возвращаем пустой результат для имитации
  if (callback) callback(null, []);
  return Promise.resolve([]);
};

const mockConnection = {
  query: mockQuery,
  end: () => {},
  connect: (callback) => {
    if (callback) callback(null);
  },
};

const mockPool = {
  query: mockQuery,
  getConnection: (callback) => {
    if (callback) callback(null, mockConnection);
  },
  end: () => {},
};

module.exports = {
  createConnection: () => mockConnection,
  createPool: () => mockPool,
  promise: {
    createConnection: () => Promise.resolve(mockConnection),
    createPool: () => Promise.resolve(mockPool),
  },
};