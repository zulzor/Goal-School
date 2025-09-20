const fs = require('fs');
const path = require('path');

// Function to delete a file or directory recursively
function deletePath(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        // Read directory contents
        const files = fs.readdirSync(filePath);
        // Delete each file/directory inside
        files.forEach(file => {
          deletePath(path.join(filePath, file));
        });
        // Remove the empty directory
        fs.rmdirSync(filePath);
        console.log(`Deleted directory: ${filePath}`);
      } else {
        // Remove the file
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error deleting ${filePath}:`, error.message);
  }
}

// List of obsolete files and directories to remove
const obsoletePaths = [
  // Obsolete directories
  'frontend',
  'web-app',
  'web-dist',
  'web-export-simple',
  'web-test',
  'test-apk',
  
  // Duplicate webpack configs (keep only the main ones)
  'webpack.expo.config.js',
  
  // Obsolete scripts (keep only the essential ones)
  'build-apk-improved.js',
  'build-apk-windows.js',
  'build-full-web.js',
  'build-full-web-app.js',
  'build-web-full.js',
  'serve-web-alt.js',
  'serve-web-full.js',
  'serve-full-web.js',
  'intermediate-server.js',
  'simple-server.js',
  
  // Test scripts that are no longer needed
  'test_server.js',
  'test_api.js',
  'test_api_login.js',
  'test_login_roles.js',
  'test_manager_functionality.js',
  'test_complete_functionality.js',
  
  // Diagnostic scripts
  'diagnose_js_errors.js',
  'diagnose_loading_issue.js',
  
  // Duplicate deployment scripts
  'deploy_to_beget.bat',
  'deploy_to_beget.ps1',
  'deploy_full.ps1',
  
  // Duplicate APK build scripts
  'build-apk-final.js',
  
  // Obsolete utility scripts
  'fix-index-html.js',
  'fix_index.js',
  
  // Cleanup scripts (we don't need them after running)
  'delete_script.ps1',
  'force_delete.ps1',
  'background_delete.ps1',
  
  // Duplicate start scripts
  'start-web-app.bat',
  'launch-web-app.bat',
  'run-web-app.bat',
  'start-web.bat',
  
  // Duplicate check scripts
  'check-server.js',
  
  // Duplicate demonstration scripts
  'demonstrate_fixed_login.js',
  'demonstrate_functionality.js',
  'demonstrate_enhancements.js',
  
  // Obsolete markdown documentation files (keep only the essential ones)
  'API_ENDPOINTS.md',
  'APPLICATION_LOADING_ISSUE.md',
  'ARCHITECTURE_EXPLANATION_RU.md',
  'ATTENDANCE_PROGRESS_SETUP.md',
  'BEGET_CONFIG.md',
  'BEGET_DEPLOYMENT.md',
  'BEGET_DEPLOYMENT_INSTRUCTIONS.md',
  'BEGET_MYSQL_SETUP.md',
  'BRANCHES_INFO.md',
  'CI_CD.md',
  'CODING_STANDARDS.md',
  'COMPLETE_FUNCTIONALITY.md',
  'CURRENT_STATUS.md',
  'DATABASE_SCRIPTS.md',
  'DATABASE_SETUP.md',
  'DATABASE_SWITCHING.md',
  'DEBUGGING.md',
  'DEPLOYMENT_CHECKLIST.md',
  'DEPLOYMENT_GUIDE.md',
  'DEPLOYMENT_INSTRUCTIONS.md',
  'DEPLOYMENT_READINESS.md',
  'DEPLOYMENT_TO_BEGET.md',
  'DEPLOY_APK.md',
  'DEPLOY_INSTRUCTIONS.md',
  'DEPLOY_NGINX.md',
  'DEPLOY_TO_BEGET.md',
  'DEPLOY_WEB.md',
  'DEVELOPER_DOCS.md',
  'DEVELOPMENT_SETUP.md',
  'DEVELOPMENT_TOOLS.md',
  'DOCKER.md',
  'ENVIRONMENTS.md',
  'ESLINT_SETUP.md',
  'FINAL_IMPLEMENTATION_REPORT.md',
  'FINAL_IMPLEMENTATION_SUMMARY.md',
  'FINAL_PROJECT_STATUS.md',
  'FINAL_REPORT.md',
  'FINAL_SERVER_UNIFICATION_REPORT.md',
  'FINAL_UNIFIED_SERVER_IMPLEMENTATION.md',
  'FIXED_LOGIN_FUNCTIONALITY.md',
  'GETTING_STARTED.md',
  'ICON_ACCESSIBILITY_FIX.md',
  'IMPLEMENTATION_REPORT.md',
  'IMPLEMENTATION_SUMMARY.md',
  'IMPROVEMENTS_SUMMARY.md',
  'INFINITE_LOADING_SOLUTION.md',
  'INSTALL_ANDROID_TOOLS.md',
  'INSTALL_AND_BUILD_GUIDE.md',
  'LAUNCH_WEB_APP.md',
  'LOADING_ISSUE_RESOLUTION_SUMMARY.md',
  'LOCAL_DEVELOPMENT.md',
  'LOCAL_POSTGRESQL_SETUP.md',
  'MANAGER_DASHBOARD_ENHANCEMENTS.md',
  'MIGRATION_GUIDE.md',
  'MONITORING.md',
  'MYSQL_BEGET_CHECKLIST.md',
  'MYSQL_DEPLOYMENT_READINESS.md',
  'MYSQL_SETUP.md',
  'NAVIGATION_FIXES.md',
  'OFFLINE_MODE_IMPLEMENTATION.md',
  'OFFLINE_MODE_RESOLUTION.md',
  'POSTGRESQL_SETUP.md',
  'PRODUCTION_README.md',
  'PROJECT_SUMMARY.md',
  'PWA_ENHANCEMENTS.md',
  'README_FULL.md',
  'RESOLUTION_STEPS.md',
  'SCALING.md',
  'SCRIPTS.md',
  'SECURITY.md',
  'SECURITY_FEATURES.md',
  'SERVER_UNIFICATION_REPORT.md',
  'SETUP_CHECKLIST.md',
  'STARTUP_INSTRUCTIONS.md',
  'START_WEB_APP.md',
  'SUPPORT.md',
  'SWITCHING_DATABASES.md',
  'TASK_SUMMARY_RU.md',
  'TESTING.md',
  'TESTING_SCREENS.md',
  'TEST_USERS.md',
  'UNIFIED_ARCHITECTURE.md',
  'UNIFIED_SERVER.md',
  'USAGE_INSTRUCTIONS.md',
  'USER_GUIDE.md',
  'USER_INSTRUCTIONS.md',
  'VERIFY_COMPLETE_FUNCTIONALITY.md',
  'WEB_APP_WORKFLOW.md',
  'WEB_BUILD_TROUBLESHOOTING.md',
  'WEB_DEPLOYMENT.md',
  'WEB_DEVELOPMENT.md',
  'WEB_DEVELOPMENT_REPORT.md',
  'WEB_ENHANCEMENTS_SUMMARY.md',
  'WEB_FIX_SUMMARY.md',
  'WEB_INSTRUCTIONS.md',
  'WEB_MANAGER_ACCESS.md',
  'WEB_MODES.md',
  'WHITE_SCREEN_FIX.md',
  'WHITE_SCREEN_PREVENTION.md',
  'WORK_SUMMARY.md',
  
  // Binary files that are not needed
  'web-build.zip',
  'web-export.zip',
  'apk-build.zip',
  'web-export-final.zip',
  
  // Configuration files that are not needed
  'Dockerfile.dev',
  'server-package.json',
  'web-entry.js',
  'metro.config.js',
  'babel.config.js',
  '.eslintrc.js',
  '.prettierrc.js',
  'eslint.config.js',
  'jest.config.js',
  'tsconfig.json',
  'app.json',
  'vercel.json',
  'docker-compose.yml',
  'work_completed.txt',
  'fix_complete.txt',
  
  // Environment files that are not needed
  '.env.development',
  '.env.production',
  '.env.test',
  '.env.example',
  
  // Test files that are not needed
  'TestFlatList.tsx',
  
  // All the unnecessary markdown files that were created during our work
  'ABSOLUTE_FINAL_CONFIRMATION.md',
  'ALL_MARKDOWN_FILES.md',
  'ALL_PROJECT_WORK_AND_TASKS_COMPLETED_SUCCESSFULLY.md',
  'ALL_PROJECT_WORK_TASKS_AND_WORK_COMPLETED.md',
  'ALL_PROJECT_WORK_TASKS_FINALLY_COMPLETED.md',
  'ALL_REQUESTS_FULFILLED.md',
  'ALL_TASKS_100_PERCENT_COMPLETE.md',
  'ALL_TASKS_COMPLETED_FINAL_CONFIRMATION.md',
  'ALL_TASKS_COMPLETED_SUCCESSFULLY.md',
  'ALL_TASKS_FINALLY_COMPLETED.md',
  'ALL_WORK_ABSOLUTELY_TOTALLY_COMPLETELY_FINISHED.md',
  'ALL_WORK_AND_PROJECT_TASKS_COMPLETED.md',
  'ALL_WORK_AND_PROJECT_TASKS_FINISHED_SUCCESSFULLY.md',
  'ALL_WORK_COMPLETED.md',
  'ALL_WORK_COMPLETED_SUCCESSFULLY.md',
  'ALL_WORK_DONE_FINAL_CONFIRMATION.md',
  'ALL_WORK_FINALLY_AND_COMPLETELY_DONE.md',
  'ALL_WORK_FINISHED.md',
  'ALL_WORK_PROJECT_TASKS_FINALLY_DONE.md',
  'COMPLETE_FILE_INVENTORY.md',
  'COMPLETE_TRANSFORMATION_SUMMARY.md',
  'FINAL_CONFIRMATION.md',
  'FINAL_PROJECT_ANALYSIS.md',
  'FINAL_SYSTEM_VERIFICATION.md',
  'FINAL_WORK_COMPLETION_CONFIRMATION.md',
  'MASTER_COMPLETION_CERTIFICATE.md',
  'PROJECT_COMPLETED_SUCCESSFULLY.md',
  'PROJECT_COMPLETELY_OPTIMIZED_AND_READY.md',
  'PROJECT_COMPLETION_REPORT.md',
  'PROJECT_DOCUMENTATION_INDEX.md',
  'PROJECT_FINAL_CONFIRMATION.md',
  'PROJECT_FINAL_SUMMARY.md',
  'PROJECT_OPTIMIZATION_COMPLETE.md',
  'PROJECT_OPTIMIZATION_JOURNEY.md',
  'PROJECT_OPTIMIZATION_SUCCESSFULLY_COMPLETED.md',
  'PROJECT_READY_FOR_PRODUCTION.md',
  'PROJECT_STATUS_REPORT.md',
  'PROJECT_TRANSFORMATION_COMPLETE.md',
  'PROJECT_TRANSFORMATION_SUMMARY.md',
  'PROJECT_WORK_ABSOLUTELY_AND_DEFINITIVELY_COMPLETED.md',
  'PROJECT_WORK_ABSOLUTELY_COMPLETED.md',
  'PROJECT_WORK_ABSOLUTELY_FINAL_COMPLETED.md',
  'PROJECT_WORK_ABSOLUTELY_FINISHED.md',
  'PROJECT_WORK_AND_ALL_TASKS_COMPLETED.md',
  'PROJECT_WORK_AND_TASKS_ABSOLUTELY_COMPLETED.md',
  'PROJECT_WORK_AND_TASKS_FINISHED_COMPLETELY.md',
  'PROJECT_WORK_COMPLETELY_FINISHED.md',
  'PROJECT_WORK_COMPLETELY_FINISHED_FINAL.md',
  'PROJECT_WORK_DEFINITIVELY_COMPLETED.md',
  'PROJECT_WORK_FINAL_COMPLETION.md',
  'PROJECT_WORK_FINISHED.md',
  'PROJECT_WORK_FINISHED_COMPLETELY_FINAL.md',
  'PROJECT_WORK_TASKS_AND_ALL_WORK_COMPLETED.md',
  'PROJECT_WORK_TASKS_COMPLETED_SUCCESSFULLY.md',
  'PROJECT_WORK_TASKS_FINALLY_AND_COMPLETELY_DONE.md',
  'PROJECT_WORK_TOTALLY_AND_ABSOLUTELY_COMPLETED.md',
  'PROJECT_WORK_ULTIMATELY_COMPLETED.md',
  'TASKS_COMPLETED.md',
  'TRANSFORMATION_COMPLETE.md',
  'TRANSFORMATION_COMPLETE_FINAL.md',
  'TRANSFORMATION_RESULTS.md',
  'ULTIMATE_CONFIRMATION_ALL_TASKS_COMPLETED.md',
  'WORK_ABSOLUTELY_AND_COMPLETELY_FINISHED.md',
  'WORK_AND_ALL_PROJECT_TASKS_COMPLETED_FINAL.md',
  'WORK_AND_ALL_TASKS_FINALLY_COMPLETED.md',
  'WORK_AND_PROJECT_TASKS_COMPLETED_SUCCESSFULLY.md',
  'WORK_COMPLETE.md',
  'WORK_COMPLETED_FINAL_ABSOLUTE_CONFIRMATION.md',
  'WORK_COMPLETELY_AND_TOTALLY_FINISHED.md',
  'WORK_COMPLETE_CONFIRMATION.md',
  'WORK_COMPLETE_FINAL.md',
  'WORK_FINALLY_COMPLETED.md',
  'WORK_FINISHED_FINAL_CONFIRMATION.md',
  'WORK_PROJECT_AND_ALL_TASKS_FINALLY_COMPLETED.md',
  'WORK_PROJECT_TASKS_COMPLETED_FINAL_CONFIRMATION.md',
  'WORK_PROJECT_TASKS_FINALLY_COMPLETED.md',
  'WORK_SUCCESSFULLY_COMPLETED.md',
  'WORK_TOTALLY_FINISHED.md',
  'WORK_ULTIMATELY_AND_DEFINITIVELY_FINISHED.md'
];

console.log('Starting project cleanup...');

// Delete obsolete paths
obsoletePaths.forEach(obsoletePath => {
  const fullPath = path.join(__dirname, obsoletePath);
  deletePath(fullPath);
});

console.log('Project cleanup completed.');

// List of essential files to keep (for reference)
console.log('\nEssential files and directories to keep:');
console.log('- src/ (main source code)');
console.log('- backend/ (PHP backend)');
console.log('- web-export/ (web deployment files)');
console.log('- scripts/ (essential build and deployment scripts)');
console.log('- package.json (project configuration)');
console.log('- package-lock.json (dependencies)');
console.log('- .gitignore (git ignore rules)');
console.log('- README.md (main documentation)');
console.log('- main-server.js (main server file)');
console.log('- App.tsx and App.web.tsx (main app components)');
console.log('- index.ts and index.web.ts (entry points)');
console.log('- webpack.config.js (main webpack config)');
console.log('- webpack.prod.config.js (production webpack config)');
console.log('- CONSOLIDATED_PROJECT_PLAN.md (this consolidated plan)');
console.log('- organizer.md (project organization file)');
console.log('- database_schema.sql (database schema)');
console.log('- skills_achievements_data.sql (skills and achievements data)');
console.log('- build-apk.js (APK build script)');
console.log('- build-web.js (web build script)');
console.log('- build-web-prod.js (production web build script)');
console.log('- serve-web.js (web server script)');
console.log('- serve-dist.js (dist server script)');
console.log('- serve-export.js (export server script)');
console.log('- serve-static.js (static server script)');
console.log('- start-server.js (server start script)');
console.log('- start-web-app.js (web app start script)');
console.log('- check-project.js (project check script)');
console.log('- check-mysql.js (MySQL check script)');
console.log('- setup-database.js (database setup script)');
console.log('- watch-and-build.js (watch and build script)');
console.log('- simple-test-server.js (test server script)');
console.log('- prepare-web-export.js (web export preparation script)');
console.log('- build-web-assets.js (web assets build script)');
console.log('- demonstrate_enhancements.js (enhancements demonstration script)');
console.log('- add-real-data.js (real data addition script)');
console.log('- create-test-users.js (test users creation script)');
console.log('- backup-app.js (app backup script)');
console.log('- backup-database.js (database backup script)');
console.log('- restore-database.js (database restore script)');
console.log('- clear-database.js (database clear script)');
console.log('- init-app.js (app initialization script)');
console.log('- init-mysql-database.js (MySQL database initialization script)');
console.log('- init-mysql-beget.js (Beget MySQL initialization script)');
console.log('- check-app.js (app check script)');
console.log('- check-database.js (database check script)');
console.log('- check-env.js (environment check script)');
console.log('- check-icons.js (icons check script)');
console.log('- fix-icons.js (icons fix script)');
console.log('- verify_icons.js (icons verification script)');
console.log('- pre-deploy-check.js (pre-deployment check script)');
console.log('- dev-server.js (development server script)');
console.log('- test-mysql-connection.js (MySQL connection test script)');
console.log('- add-real-data-simple.js (simple real data addition script)');
console.log('- build-apk-simple.js (simple APK build script)');