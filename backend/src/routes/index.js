/**
 * Routes Index
 * Central route configuration and API documentation
 */

const express = require('express');
const authRoutes = require('./auth');
const tradesRoutes = require('./trades');
const aiRoutes = require('./ai');
const logger = require('../utils/logger');

const router = express.Router();

// API Documentation endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Trade Master AI Backend API',
    version: '1.0.0',
    documentation: {
      endpoints: {
        auth: {
          'POST /api/auth/register': 'Register a new user',
          'POST /api/auth/login': 'Login user',
          'GET /api/auth/profile': 'Get user profile',
          'PUT /api/auth/profile': 'Update user profile',
          'PUT /api/auth/change-password': 'Change password',
          'POST /api/auth/logout': 'Logout user'
        },
        trades: {
          'GET /api/trades': 'Get user trades with filtering and pagination',
          'GET /api/trades/:id': 'Get specific trade',
          'POST /api/trades': 'Create new trade',
          'PUT /api/trades/:id': 'Update trade',
          'DELETE /api/trades/:id': 'Delete trade',
          'POST /api/trades/:id/analyze': 'Generate AI analysis for trade',
          'GET /api/trades/stats/summary': 'Get trading statistics'
        },
        ai: {
          'GET /api/ai/dashboard-insight': 'Generate AI insight for dashboard display',
          'GET /api/ai/overall-insight': 'Generate overall trading insight',
          'GET /api/ai/analysis-history': 'Get AI analysis history',
          'GET /api/ai/usage-stats': 'Get AI usage statistics',
          'POST /api/ai/batch-analyze': 'Queue batch AI analysis',
          'GET /api/ai/insights/patterns': 'Get trading pattern insights'
        }
      },
      authentication: 'Bearer token required for protected endpoints',
      subscriptionLevels: {
        free: 'Basic trade logging',
        premium: 'AI analysis for individual trades',
        professional: 'Full AI features including batch analysis'
      }
    },
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API status endpoint with detailed service status
router.get('/status', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const redis = require('../config/redis');
    const queueService = require('../services/queueService');
    const cronService = require('../services/cronService');

    const status = {
      api: 'operational',
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      redis: redis.status || 'unknown',
      queue: queueService.isConnected() ? 'operational' : 'disconnected',
      cron: cronService.getStatus(),
      timestamp: new Date().toISOString()
    };

    const allHealthy = Object.values(status).every(service => 
      service === 'operational' || service === 'connected' || 
      (typeof service === 'object' && service.isRunning)
    );

    res.status(allHealthy ? 200 : 503).json({
      success: allHealthy,
      services: status
    });

  } catch (error) {
    logger.error('Status check failed:', error);
    res.status(503).json({
      success: false,
      message: 'Service status check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Test endpoint for debugging
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString(),
    headers: req.headers
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/trades', tradesRoutes);
router.use('/ai', aiRoutes);

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

module.exports = router;
