// src/services/DatabaseInitService.js
// JavaScript wrapper for DatabaseInitService

const { initializeMySQLDatabase } = require('../config/mysql');

async function initializeDatabase() {
  try {
    await initializeMySQLDatabase();
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

module.exports = { initializeDatabase };
