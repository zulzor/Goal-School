// Install dependencies script
console.log('Installing dependencies for football school app...');

// We'll use the child_process module to run npm install
const { exec } = require('child_process');
const path = require('path');

// Define the project path
const projectPath = path.join('C:', 'Users', 'jolab', 'Desktop', 'Goal-School', 'newfootballschoolapp');

console.log(`Installing dependencies in ${projectPath}...`);

// Run npm install
exec(`cd "${projectPath}" && npm install`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error installing dependencies: ${error}`);
    return;
  }
  
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  
  console.log(`stdout: ${stdout}`);
  console.log('Dependencies installed successfully!');
});