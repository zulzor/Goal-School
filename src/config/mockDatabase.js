// src/config/mockDatabase.js
// Mock database implementation for development without MySQL

// In-memory storage for mock data
const mockData = {
  users: [
    {
      id: 1,
      email: 'admin@example.com',
      password: '$2a$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO', // 'password' hashed
      name: 'Admin User',
      role: 'admin',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      email: 'coach@example.com',
      password: '$2a$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO', // 'password' hashed
      name: 'Coach User',
      role: 'coach',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      email: 'parent@example.com',
      password: '$2a$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO', // 'password' hashed
      name: 'Parent User',
      role: 'parent',
      created_at: new Date().toISOString()
    }
  ],
  attendance: [],
  progress: [],
  nutrition: [],
  news: [
    {
      id: 1,
      title: 'Новое оборудование для тренировок',
      content: 'Мы получили новое оборудование для тренировок, которое поможет улучшить навыки игроков.',
      image_url: '',
      created_at: new Date().toISOString()
    }
  ],
  schedule: [],
  skills: [],
  achievements: []
};

// Mock query function
const mockQuery = async (query, params = []) => {
  console.log('Mock query executed:', query, params);
  
  // Simple parsing of the query to determine what to return
  if (query.toLowerCase().includes('select now()')) {
    return { rows: [{ now: new Date().toISOString() }], fields: [] };
  }
  
  if (query.toLowerCase().includes('select') && query.toLowerCase().includes('users')) {
    // Simple email/password check for login
    if (params.length >= 2) {
      const [email, password] = params;
      const user = mockData.users.find(u => u.email === email && u.password === password);
      if (user) {
        return { rows: [user], fields: [] };
      }
    }
    return { rows: [], fields: [] };
  }
  
  // For other queries, return empty results
  return { rows: [], fields: [] };
};

// Mock connection check
const checkMockConnection = async () => {
  console.log('Mock database connection successful');
  return true;
};

// Mock database initialization
const initializeMockDatabase = async () => {
  console.log('Mock database initialized with sample data');
  return true;
};

module.exports = {
  checkMockConnection,
  mockQuery,
  initializeMockDatabase,
  mockData
};