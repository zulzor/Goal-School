// Simple test script to verify login/registration page functionality
console.log('Testing login/registration page...');

// Test 1: Check if all required elements exist
const requiredElements = [
  'authSection',
  'dashboard',
  'loginTab',
  'registerTab',
  'branchSelector',
  'regName',
  'regEmail',
  'regPassword',
  'regRole',
  'regBranch',
  'email',
  'password',
];

console.log('=== Test 1: Checking required elements ===');
let allElementsFound = true;
requiredElements.forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    console.log(`✓ Element found: ${id}`);
  } else {
    console.error(`✗ Element NOT found: ${id}`);
    allElementsFound = false;
  }
});

if (allElementsFound) {
  console.log('✓ All required elements found');
} else {
  console.error('✗ Some required elements are missing');
}

// Test 2: Check if CSS styles are applied
console.log('=== Test 2: Checking CSS styles ===');
const registerTab = document.getElementById('registerTab');
if (registerTab) {
  const display = window.getComputedStyle(registerTab).display;
  console.log(`Register tab display property: ${display}`);

  if (display !== 'none') {
    console.log('✓ Register tab is visible');
  } else {
    console.log('ℹ Register tab is hidden (this is normal when on login tab)');
  }
} else {
  console.error('✗ Register tab not found');
}

// Test 3: Check if functions exist
console.log('=== Test 3: Checking required functions ===');
const requiredFunctions = ['showTab', 'selectRole', 'selectBranch', 'register', 'login'];
let allFunctionsExist = true;

requiredFunctions.forEach(funcName => {
  if (typeof window[funcName] === 'function') {
    console.log(`✓ Function exists: ${funcName}`);
  } else {
    console.error(`✗ Function missing: ${funcName}`);
    allFunctionsExist = false;
  }
});

if (allFunctionsExist) {
  console.log('✓ All required functions exist');
} else {
  console.error('✗ Some required functions are missing');
}

// Test 4: Try to switch to registration tab
console.log('=== Test 4: Testing tab switching ===');
try {
  if (typeof showTab === 'function') {
    showTab('register');
    console.log('✓ Tab switching works');
    // Switch back to login tab
    showTab('login');
  } else {
    console.error('✗ showTab function not available');
  }
} catch (error) {
  console.error('✗ Error during tab switching:', error);
}

console.log('=== Test complete ===');
