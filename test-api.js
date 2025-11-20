#!/usr/bin/env node

/**
 * Comprehensive API Test Suite for Babcock University Shuttle Tracker
 * Tests all admin frontend functionalities with real API calls
 */

const BASE_URL = process.env.API_URL || 'http://localhost:8000';
let accessToken = null;
let testResults = [];

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(title, passed, message = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const result = { title, passed, message };
  testResults.push(result);
  log(`${status}: ${title}${message ? ' - ' + message : ''}`, passed ? 'green' : 'red');
}

async function makeRequest(method, endpoint, body = null, requiresAuth = false) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth && accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json().catch(() => null);
    return { response, data, status: response.status };
  } catch (error) {
    throw new Error(`Request failed: ${error.message}`);
  }
}

// Test 1: Signup
async function testSignup() {
  log('\n--- Test 1: User Signup ---', 'blue');
  const testUser = {
    username: `testadmin_${Date.now()}`,
    email: `testadmin${Date.now()}@babcock.edu.ng`,
    password: 'TestPass123!',
    phone_number: '+234-8012345678',
  };

  try {
    const { response, data, status } = await makeRequest('POST', '/api/signup/', testUser);
    logTest('Signup API Call', status === 201, `Status: ${status}`);
    
    if (data && data.user_id) {
      logTest('User Created', true, `User ID: ${data.user_id}`);
      return testUser; // Return test user for login
    } else {
      logTest('User Created', false, 'No user_id in response');
      return null;
    }
  } catch (error) {
    logTest('Signup API Call', false, error.message);
    return null;
  }
}

// Test 2: Login
async function testLogin(testUser) {
  log('\n--- Test 2: User Login ---', 'blue');

  if (!testUser) {
    log('Skipping login test - no test user', 'yellow');
    return false;
  }

  try {
    const { response, data, status } = await makeRequest('POST', '/api/login/', {
      username: testUser.username,
      password: testUser.password,
    });

    logTest('Login API Call', status === 200, `Status: ${status}`);

    if (data && data.access) {
      accessToken = data.access;
      logTest('JWT Token Received', true, `Token: ${data.access.substring(0, 20)}...`);
      logTest('User ID in Response', !!data.user_id, `User ID: ${data.user_id}`);
      return true;
    } else {
      logTest('JWT Token Received', false, 'No token in response');
      return false;
    }
  } catch (error) {
    logTest('Login API Call', false, error.message);
    return false;
  }
}

// Test 3: Get Profile
async function testGetProfile() {
  log('\n--- Test 3: Get User Profile ---', 'blue');

  if (!accessToken) {
    log('Skipping profile test - not authenticated', 'yellow');
    return;
  }

  try {
    const { response, data, status } = await makeRequest('GET', '/api/profile/', null, true);
    logTest('Get Profile API Call', status === 200, `Status: ${status}`);

    if (data && data.user) {
      logTest('Profile Data Retrieved', true, `Username: ${data.user.username}`);
      logTest('Email in Profile', !!data.user.email, `Email: ${data.user.email}`);
      logTest('Phone Number in Profile', !!data.phone_number, `Phone: ${data.phone_number}`);
    } else {
      logTest('Profile Data Retrieved', false, 'Missing profile data');
    }
  } catch (error) {
    logTest('Get Profile API Call', false, error.message);
  }
}

// Test 4: Get Vehicles (Shuttles)
async function testGetVehicles() {
  log('\n--- Test 4: Get Vehicles/Shuttles ---', 'blue');

  if (!accessToken) {
    log('Skipping vehicles test - not authenticated', 'yellow');
    return null;
  }

  try {
    const { response, data, status } = await makeRequest('GET', '/api/backend/vehicles/', null, true);
    logTest('Get Vehicles API Call', status === 200, `Status: ${status}`);

    if (Array.isArray(data)) {
      logTest('Vehicles Data Retrieved', true, `Count: ${data.length}`);
      if (data.length > 0) {
        logTest('Vehicle Structure Valid', !!data[0].id, `First vehicle ID: ${data[0].id}`);
        logTest('Vehicle Color Present', !!data[0].color, `Color: ${data[0].color}`);
      }
      return data;
    } else {
      logTest('Vehicles Data Retrieved', false, 'Data is not an array');
      return null;
    }
  } catch (error) {
    logTest('Get Vehicles API Call', false, error.message);
    return null;
  }
}

// Test 5: Create Vehicle
async function testCreateVehicle() {
  log('\n--- Test 5: Create New Shuttle ---', 'blue');

  if (!accessToken) {
    log('Skipping create vehicle test - not authenticated', 'yellow');
    return null;
  }

  const newVehicle = {
    vehicle_type: 'Bus',
    model: 'Hibisco AC 35',
    color: 'Blue',
    driver_name: 'John Driver',
    plate_number: `BABTEC-${Date.now()}`,
  };

  try {
    const { response, data, status } = await makeRequest('POST', '/api/backend/vehicles/', newVehicle, true);
    logTest('Create Vehicle API Call', status === 201, `Status: ${status}`);

    if (data && data.id) {
      logTest('Vehicle Created', true, `Vehicle ID: ${data.id}`);
      logTest('Plate Number Saved', data.plate_number === newVehicle.plate_number, `Plate: ${data.plate_number}`);
      logTest('Color Saved', data.color === newVehicle.color, `Color: ${data.color}`);
      return data;
    } else {
      logTest('Vehicle Created', false, 'No vehicle ID in response');
      return null;
    }
  } catch (error) {
    logTest('Create Vehicle API Call', false, error.message);
    return null;
  }
}

// Test 6: Update Vehicle
async function testUpdateVehicle(vehicleId) {
  log('\n--- Test 6: Update Shuttle ---', 'blue');

  if (!accessToken || !vehicleId) {
    log('Skipping update vehicle test - missing prerequisites', 'yellow');
    return;
  }

  const updatedData = {
    driver_name: 'Jane Driver Updated',
    color: 'Red',
  };

  try {
    const { response, data, status } = await makeRequest('PUT', `/api/backend/vehicles/${vehicleId}/`, updatedData, true);
    logTest('Update Vehicle API Call', status === 200, `Status: ${status}`);

    if (data) {
      logTest('Vehicle Updated', data.driver_name === updatedData.driver_name, `Driver: ${data.driver_name}`);
      logTest('Color Updated', data.color === updatedData.color, `Color: ${data.color}`);
    }
  } catch (error) {
    logTest('Update Vehicle API Call', false, error.message);
  }
}

// Test 7: Delete Vehicle
async function testDeleteVehicle(vehicleId) {
  log('\n--- Test 7: Delete Shuttle ---', 'blue');

  if (!accessToken || !vehicleId) {
    log('Skipping delete vehicle test - missing prerequisites', 'yellow');
    return;
  }

  try {
    const { response, status } = await makeRequest('DELETE', `/api/backend/vehicles/${vehicleId}/`, null, true);
    logTest('Delete Vehicle API Call', status === 204, `Status: ${status}`);
  } catch (error) {
    logTest('Delete Vehicle API Call', false, error.message);
  }
}

// Test 8: Authentication Error Handling
async function testAuthenticationErrors() {
  log('\n--- Test 8: Authentication Error Handling ---', 'blue');

  try {
    // Test invalid credentials
    const { response, status } = await makeRequest('POST', '/api/login/', {
      username: 'invaliduser',
      password: 'wrongpass',
    });
    logTest('Invalid Credentials Rejected', status === 401, `Status: ${status}`);

    // Test unauthorized access
    const { response: resp2, status: status2 } = await makeRequest('GET', '/api/backend/vehicles/', null, false);
    logTest('Unauthorized Access Blocked', status2 !== 200, `Status: ${status2}`);
  } catch (error) {
    logTest('Authentication Error Handling', false, error.message);
  }
}

// Main test runner
async function runAllTests() {
  log('========================================', 'blue');
  log('Babcock University Shuttle Tracker', 'blue');
  log('Admin Frontend API Test Suite', 'blue');
  log('========================================', 'blue');
  log(`API Base URL: ${BASE_URL}\n`);

  // Run tests in sequence
  const testUser = await testSignup();
  const loggedIn = await testLogin(testUser);

  if (loggedIn) {
    await testGetProfile();
    await testGetVehicles();
    const createdVehicle = await testCreateVehicle();

    if (createdVehicle) {
      await testUpdateVehicle(createdVehicle.id);
      await testDeleteVehicle(createdVehicle.id);
    }
  }

  await testAuthenticationErrors();

  // Print summary
  log('\n========================================', 'blue');
  log('Test Summary', 'blue');
  log('========================================', 'blue');

  const passed = testResults.filter((r) => r.passed).length;
  const total = testResults.length;
  const passRate = ((passed / total) * 100).toFixed(2);

  log(`\nTotal Tests: ${total}`);
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${total - passed}`, total - passed === 0 ? 'green' : 'red');
  log(`Pass Rate: ${passRate}%\n`, passRate === '100.00' ? 'green' : 'yellow');

  // Exit with appropriate code
  process.exit(total - passed === 0 ? 0 : 1);
}

// Run tests
runAllTests().catch((error) => {
  log(`Fatal Error: ${error.message}`, 'red');
  process.exit(1);
});
