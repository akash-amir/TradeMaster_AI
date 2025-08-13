/**
 * Simple Backend Integration Test
 * Tests basic connectivity without requiring MongoDB/Redis
 */

const http = require('http');

const API_BASE_URL = 'http://localhost:5000';

function testConnection(url, description) {
  return new Promise((resolve) => {
    const request = http.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        console.log(`✅ ${description}: Status ${response.statusCode}`);
        if (response.statusCode === 200) {
          try {
            const parsed = JSON.parse(data);
            console.log(`   Response:`, parsed);
          } catch (e) {
            console.log(`   Response:`, data.substring(0, 100));
          }
        }
        resolve(response.statusCode === 200);
      });
    });

    request.on('error', (error) => {
      console.log(`❌ ${description}: ${error.message}`);
      resolve(false);
    });

    request.setTimeout(5000, () => {
      console.log(`❌ ${description}: Timeout`);
      request.destroy();
      resolve(false);
    });
  });
}

async function runSimpleTests() {
  console.log('🚀 Testing Backend Integration...\n');

  const tests = [
    { url: `${API_BASE_URL}/api/health`, desc: 'Health Check' },
    { url: `${API_BASE_URL}/api`, desc: 'API Documentation' },
    { url: `${API_BASE_URL}/api/status`, desc: 'System Status' },
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    const result = await testConnection(test.url, test.desc);
    if (result) passed++;
    console.log(''); // Add spacing
  }

  console.log('='.repeat(40));
  console.log(`Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 Backend is responding correctly!');
    console.log('✅ You can now test the frontend integration.');
  } else if (passed > 0) {
    console.log('⚠️  Backend is partially working.');
    console.log('💡 Some services may need configuration.');
  } else {
    console.log('❌ Backend is not responding.');
    console.log('💡 Make sure the backend server is running on port 5000.');
  }
}

runSimpleTests().catch(console.error);
