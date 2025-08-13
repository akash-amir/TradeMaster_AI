/**
 * Trade Master AI Backend Startup Script
 * Quick setup and validation before starting the server
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Trade Master AI Backend Setup\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('📋 Please copy .env.example to .env and configure your settings:');
  console.log('   cp .env.example .env\n');
  console.log('Required environment variables:');
  console.log('   - MONGODB_URI (MongoDB connection string)');
  console.log('   - REDIS_URL (Redis connection string)');
  console.log('   - JWT_SECRET (JWT signing secret)');
  console.log('   - OPENROUTER_API_KEY (OpenRouter API key)\n');
  process.exit(1);
}

// Load environment variables
require('dotenv').config();

// Validate required environment variables
const requiredVars = [
  'MONGODB_URI',
  'REDIS_URL', 
  'JWT_SECRET',
  'OPENROUTER_API_KEY'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\nPlease update your .env file with these values.\n');
  process.exit(1);
}

console.log('✅ Environment variables configured');

// Check if logs directory exists
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
  console.log('✅ Created logs directory');
}

console.log('✅ All checks passed');
console.log('\n🎯 Starting Trade Master AI Backend...\n');

// Start the main server
require('./src/server.js');
