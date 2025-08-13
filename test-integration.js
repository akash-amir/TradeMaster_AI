/**
 * Backend Integration Test Script
 * Run this script to test the backend integration
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test configuration
const testConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create axios instance
const api = axios.create(testConfig);

// Test data
const testUser = {
  email: 'test@trademaster.ai',
  password: 'TestPassword123',
  firstName: 'Test',
  lastName: 'User',
  tradingExperience: 'intermediate',
  preferredMarkets: ['forex', 'crypto']
};

const testTrade = {
  tradePair: 'EUR/USD',
  tradeType: 'buy',
  entryPrice: 1.0850,
  positionSize: 10000,
  timeframe: '1h',
  notes: 'Test trade from integration script'
};

let authToken = null;
let userId = null;
let tradeId = null;

// Helper functions
const log = (message, data = null) => {
  console.log(`\n✅ ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

const error = (message, err = null) => {
  console.log(`\n❌ ${message}`);
  if (err) {
    console.log(err.response?.data || err.message);
  }
};

const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
    authToken = token;
  }
};

// Test functions
async function testHealthCheck() {
  try {
    const response = await api.get('/health');
    log('Health Check Passed', response.data);
    return true;
  } catch (err) {
    error('Health Check Failed', err);
    return false;
  }
}

async function testSystemStatus() {
  try {
    const response = await api.get('/status');
    log('System Status Check Passed', response.data);
    return true;
  } catch (err) {
    error('System Status Check Failed', err);
    return false;
  }
}

async function testUserRegistration() {
  try {
    const response = await api.post('/auth/register', testUser);
    if (response.data.success) {
      log('User Registration Passed', {
        user: response.data.data.user.email,
        id: response.data.data.user.id
      });
      setAuthHeader(response.data.data.token);
      userId = response.data.data.user.id;
      return true;
    }
    return false;
  } catch (err) {
    if (err.response?.data?.message?.includes('already exists')) {
      log('User already exists, trying login...');
      return await testUserLogin();
    }
    error('User Registration Failed', err);
    return false;
  }
}

async function testUserLogin() {
  try {
    const response = await api.post('/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    if (response.data.success) {
      log('User Login Passed', {
        user: response.data.data.user.email,
        id: response.data.data.user.id
      });
      setAuthHeader(response.data.data.token);
      userId = response.data.data.user.id;
      return true;
    }
    return false;
  } catch (err) {
    error('User Login Failed', err);
    return false;
  }
}

async function testGetProfile() {
  try {
    const response = await api.get('/auth/profile');
    if (response.data.success) {
      log('Get Profile Passed', {
        user: response.data.data.user.email,
        subscription: response.data.data.user.subscription.plan
      });
      return true;
    }
    return false;
  } catch (err) {
    error('Get Profile Failed', err);
    return false;
  }
}

async function testCreateTrade() {
  try {
    const response = await api.post('/trades', testTrade);
    if (response.data.success) {
      log('Create Trade Passed', {
        id: response.data.data.trade._id,
        pair: response.data.data.trade.tradePair,
        type: response.data.data.trade.tradeType
      });
      tradeId = response.data.data.trade._id;
      return true;
    }
    return false;
  } catch (err) {
    error('Create Trade Failed', err);
    return false;
  }
}

async function testGetTrades() {
  try {
    const response = await api.get('/trades');
    if (response.data.success) {
      log('Get Trades Passed', {
        count: response.data.data.trades.length,
        pagination: response.data.data.pagination
      });
      return true;
    }
    return false;
  } catch (err) {
    error('Get Trades Failed', err);
    return false;
  }
}

async function testUpdateTrade() {
  if (!tradeId) {
    error('No trade ID available for update test');
    return false;
  }

  try {
    const updateData = {
      exitPrice: 1.0900,
      status: 'closed',
      notes: 'Updated test trade'
    };
    
    const response = await api.put(`/trades/${tradeId}`, updateData);
    if (response.data.success) {
      log('Update Trade Passed', {
        id: response.data.data.trade._id,
        status: response.data.data.trade.status,
        exitPrice: response.data.data.trade.exitPrice
      });
      return true;
    }
    return false;
  } catch (err) {
    error('Update Trade Failed', err);
    return false;
  }
}

async function testTradeAnalysis() {
  if (!tradeId) {
    error('No trade ID available for analysis test');
    return false;
  }

  try {
    const response = await api.post(`/trades/${tradeId}/analyze`, { immediate: true });
    if (response.data.success) {
      log('Trade Analysis Passed', {
        tradeId: tradeId,
        hasAnalysis: !!response.data.data.trade?.aiAnalysis
      });
      return true;
    }
    return false;
  } catch (err) {
    // AI analysis might fail due to subscription limits or API issues
    if (err.response?.status === 403) {
      log('Trade Analysis Skipped (Subscription Required)', {
        message: err.response.data.message
      });
      return true; // Not a failure, just a subscription limitation
    }
    error('Trade Analysis Failed', err);
    return false;
  }
}

async function testTradingStats() {
  try {
    const response = await api.get('/trades/stats/summary');
    if (response.data.success) {
      log('Trading Stats Passed', response.data.data);
      return true;
    }
    return false;
  } catch (err) {
    error('Trading Stats Failed', err);
    return false;
  }
}

async function testAIUsageStats() {
  try {
    const response = await api.get('/ai/usage-stats');
    if (response.data.success) {
      log('AI Usage Stats Passed', response.data.data);
      return true;
    }
    return false;
  } catch (err) {
    error('AI Usage Stats Failed', err);
    return false;
  }
}

async function testOverallInsight() {
  try {
    const response = await api.get('/ai/overall-insight?immediate=true&limit=3');
    if (response.data.success) {
      log('Overall Insight Passed', {
        hasInsight: !!response.data.data.insight,
        tradesAnalyzed: response.data.data.tradesAnalyzed
      });
      return true;
    }
    return false;
  } catch (err) {
    if (err.response?.status === 403) {
      log('Overall Insight Skipped (Subscription Required)', {
        message: err.response.data.message
      });
      return true;
    }
    error('Overall Insight Failed', err);
    return false;
  }
}

async function cleanup() {
  if (tradeId) {
    try {
      await api.delete(`/trades/${tradeId}`);
      log('Cleanup: Test trade deleted');
    } catch (err) {
      error('Cleanup: Failed to delete test trade', err);
    }
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Backend Integration Tests...\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'System Status', fn: testSystemStatus },
    { name: 'User Registration/Login', fn: testUserRegistration },
    { name: 'Get Profile', fn: testGetProfile },
    { name: 'Create Trade', fn: testCreateTrade },
    { name: 'Get Trades', fn: testGetTrades },
    { name: 'Update Trade', fn: testUpdateTrade },
    { name: 'Trading Stats', fn: testTradingStats },
    { name: 'AI Usage Stats', fn: testAIUsageStats },
    { name: 'Trade Analysis', fn: testTradeAnalysis },
    { name: 'Overall Insight', fn: testOverallInsight },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`\n🧪 Running: ${test.name}`);
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (err) {
      error(`Test "${test.name}" threw an error`, err);
      failed++;
    }
  }

  // Cleanup
  await cleanup();

  // Results
  console.log('\n' + '='.repeat(50));
  console.log('🎯 TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Backend integration is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the backend setup and configuration.');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };
