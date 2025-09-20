// setup-database.js
// Script to help set up the MySQL database for the Football School app

const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  console.log('🚀 Setting up database for Football School "Arsenal" app...');
  
  // Configuration without specifying a database
  const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
  };

  try {
    // Connect to MySQL server
    console.log('🔌 Connecting to MySQL server...');
    const connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL server');
    
    // Create database if it doesn't exist
    const databaseName = process.env.MYSQL_DATABASE || 'goalschool';
    console.log(`💾 Creating database '${databaseName}' if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${databaseName}' is ready`);
    
    // Close connection
    await connection.end();
    console.log('🔒 Disconnected from MySQL server');
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Make sure your MySQL server is running');
    console.log('2. Run the database initialization endpoint:');
    console.log(`   GET http://localhost:3003/api/db-init`);
    console.log('3. Or use the check-server script:');
    console.log('   npm run check-server');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Tips:');
      console.log('- Make sure MySQL server is installed and running');
      console.log('- Check if the MySQL service is started');
      console.log('- Verify the connection details in the .env file');
    }
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;