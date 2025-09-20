// check-mysql.js
// Script to check if MySQL is installed and running

const { exec } = require('child_process');

function checkMySQL() {
  console.log('🔍 Checking MySQL installation and status...');
  
  // Check if mysql is in PATH
  exec('mysql --version', (error, stdout, stderr) => {
    if (error) {
      console.log('❌ MySQL client not found in PATH');
      console.log('💡 Please install MySQL or add it to your PATH');
      console.log('   Download: https://dev.mysql.com/downloads/mysql/');
      return;
    }
    
    console.log('✅ MySQL client found:', stdout.trim());
    
    // Check if MySQL service is running
    const os = require('os');
    const platform = os.platform();
    
    let command;
    if (platform === 'win32') {
      command = 'net start | findstr -i mysql';
    } else if (platform === 'darwin') {
      command = 'brew services list | grep mysql';
    } else {
      command = 'systemctl status mysql';
    }
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log('❌ MySQL service is not running');
        console.log('💡 Please start MySQL service:');
        
        if (platform === 'win32') {
          console.log('   net start mysql');
        } else if (platform === 'darwin') {
          console.log('   brew services start mysql');
        } else {
          console.log('   sudo systemctl start mysql');
        }
        return;
      }
      
      console.log('✅ MySQL service is running');
      console.log(stdout.trim());
    });
  });
}

// Run the check if this file is executed directly
if (require.main === module) {
  checkMySQL();
}

module.exports = checkMySQL;