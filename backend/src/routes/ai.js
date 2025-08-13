/**
 * AI Analysis Routes
 * AI-powered trading insights and analysis endpoints
 */

const express = require('express');
const Trade = require('../models/Trade');
const User = require('../models/User');
const { authenticate, requireSubscription, aiRateLimit } = require('../middleware/auth');
const { validatePagination } = require('../middleware/validation');
const { addAnalysisJob } = require('../services/queueService');
const { generateOverallInsight, generateTradeAnalysis, generateDashboardInsight } = require('../services/aiService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   GET /api/ai/overall-insight
 * @desc    Generate overall trading insight from recent trades
 * @access  Private (Premium/Professional)
 */
router.get('/overall-insight', 
  authenticate, 
  requireSubscription('premium'), 
  aiRateLimit,
  async (req, res) => {
    try {
      const { limit = 5, immediate = false } = req.query;
      const userId = req.user._id;

      // Get recent trades for analysis
      const recentTrades = await Trade.find({ userId })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .lean();

      if (recentTrades.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No trades found for analysis'
        });
      }

      if (immediate === 'true') {
        // Generate insight immediately
        logger.info('Generating immediate overall insight', {
          userId,
          tradeCount: recentTrades.length
        });

        const insight = await generateOverallInsight(recentTrades, req.user);

        // Update user's AI analysis count
        await User.findByIdAndUpdate(userId, {
          $inc: { 'aiAnalysisCount.overall': 1 }
        });

        res.json({
          success: true,
          message: 'Overall insight generated successfully',
          data: {
            insight,
            tradesAnalyzed: recentTrades.length,
            generatedAt: new Date()
          }
        });

      } else {
        // Queue analysis for background processing
        const job = await addAnalysisJob(userId, 'overall_insight', {
          priority: 'normal',
          delay: 2000,
          data: { tradeLimit: parseInt(limit) }
        });

        logger.info('Overall insight job queued', {
          userId,
          jobId: job.id,
          tradeCount: recentTrades.length
        });

        res.json({
          success: true,
          message: 'Overall insight analysis queued successfully',
          data: {
            jobId: job.id,
            tradesAnalyzed: recentTrades.length,
            estimatedTime: '2-3 minutes'
          }
        });
      }

    } catch (error) {
      logger.error('Failed to generate overall insight:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate overall insight'
      });
    }
  }
);

/**
 * @route   GET /api/ai/analysis-history
 * @desc    Get user's AI analysis history
 * @access  Private (Premium/Professional)
 */
router.get('/analysis-history', 
  authenticate, 
  requireSubscription('premium'),
  validatePagination,
  async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const userId = req.user._id;

      // Get trades with AI analysis
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const [tradesWithAnalysis, totalCount] = await Promise.all([
        Trade.find({ 
          userId, 
          'aiAnalysis.analysisDate': { $exists: true } 
        })
        .select('tradePair tradeType entryPrice exitPrice status result aiAnalysis createdAt')
        .sort({ 'aiAnalysis.analysisDate': -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
        
        Trade.countDocuments({ 
          userId, 
          'aiAnalysis.analysisDate': { $exists: true } 
        })
      ]);

      const totalPages = Math.ceil(totalCount / parseInt(limit));

      res.json({
        success: true,
        data: {
          analyses: tradesWithAnalysis,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCount,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1,
            limit: parseInt(limit)
          }
        }
      });

    } catch (error) {
      logger.error('Failed to fetch analysis history:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch analysis history'
      });
    }
  }
);

/**
 * @route   GET /api/ai/usage-stats
 * @desc    Get user's AI usage statistics
 * @access  Private
 */
router.get('/usage-stats', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Get current month's usage
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyUsage = await Trade.countDocuments({
      userId,
      'aiAnalysis.analysisDate': { $gte: currentMonth }
    });

    // Define limits based on subscription
    const limits = {
      'free': { daily: 5, monthly: 50 },
      'premium': { daily: 50, monthly: 1000 },
      'professional': { daily: 200, monthly: 5000 }
    };

    const userLimits = limits[user.subscription.plan] || limits.free;

    res.json({
      success: true,
      data: {
        currentPlan: user.subscription.plan,
        usage: {
          total: user.aiAnalysisCount,
          thisMonth: monthlyUsage
        },
        limits: userLimits,
        remaining: {
          monthly: Math.max(0, userLimits.monthly - monthlyUsage)
        }
      }
    });

  } catch (error) {
    logger.error('Failed to fetch AI usage stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch usage statistics'
    });
  }
});

/**
 * @route   POST /api/ai/batch-analyze
 * @desc    Queue AI analysis for multiple trades
 * @access  Private (Professional)
 */
router.post('/batch-analyze', 
  authenticate, 
  requireSubscription('professional'), 
  aiRateLimit,
  async (req, res) => {
    try {
      const { tradeIds, priority = 'normal' } = req.body;
      const userId = req.user._id;

      if (!Array.isArray(tradeIds) || tradeIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Trade IDs array is required'
        });
      }

      if (tradeIds.length > 50) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 50 trades can be analyzed in batch'
        });
      }

      // Verify all trades belong to the user
      const trades = await Trade.find({
        _id: { $in: tradeIds },
        userId
      }).select('_id');

      if (trades.length !== tradeIds.length) {
        return res.status(400).json({
          success: false,
          message: 'Some trades not found or access denied'
        });
      }

      // Queue analysis jobs for all trades
      const jobs = [];
      for (let i = 0; i < trades.length; i++) {
        const job = await addAnalysisJob(trades[i]._id, 'trade_analysis', {
          priority,
          delay: i * 1000 // Stagger jobs by 1 second each
        });
        jobs.push(job.id);
      }

      logger.info('Batch AI analysis jobs queued', {
        userId,
        tradeCount: trades.length,
        jobIds: jobs
      });

      res.json({
        success: true,
        message: 'Batch analysis queued successfully',
        data: {
          jobIds: jobs,
          tradesQueued: trades.length,
          estimatedTime: `${Math.ceil(trades.length / 2)}-${trades.length} minutes`
        }
      });

    } catch (error) {
      logger.error('Failed to queue batch analysis:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to queue batch analysis'
      });
    }
  }
);

/**
 * @route   GET /api/ai/dashboard-insight
 * @desc    Generate AI insight for dashboard display
 * @access  Private
 */
router.get('/dashboard-insight', 
  authenticate,
  aiRateLimit,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { refresh = false } = req.query;

      // Get recent trades for analysis (last 5 trades)
      const recentTrades = await Trade.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      if (recentTrades.length === 0) {
        return res.json({
          success: true,
          data: {
            insight: {
              title: "Welcome to TradeMaster!",
              content: "Start by adding your first trade to get personalized AI insights about your trading performance.",
              score: null,
              type: "welcome"
            },
            tradesAnalyzed: 0,
            generatedAt: new Date()
          }
        });
      }

      logger.info('Generating dashboard insight', {
        userId,
        tradeCount: recentTrades.length,
        refresh
      });

      // Generate dashboard-specific insight
      const insight = await generateDashboardInsight(recentTrades, req.user);

      // Update user's AI analysis count
      await User.findByIdAndUpdate(userId, {
        $inc: { 'aiAnalysisCount.dashboard': 1 }
      });

      res.json({
        success: true,
        data: {
          insight,
          tradesAnalyzed: recentTrades.length,
          generatedAt: new Date()
        }
      });

    } catch (error) {
      logger.error('Failed to generate dashboard insight:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to generate insight. Try again later.',
        data: {
          insight: {
            title: "Analysis Unavailable",
            content: "We're experiencing technical difficulties. Please try refreshing in a moment.",
            score: null,
            type: "error"
          },
          tradesAnalyzed: 0,
          generatedAt: new Date()
        }
      });
    }
  }
);

/**
 * @route   GET /api/ai/insights/patterns
 * @desc    Get trading pattern insights
 * @access  Private (Premium/Professional)
 */
router.get('/insights/patterns', 
  authenticate, 
  requireSubscription('premium'),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const { timeframe = '30d' } = req.query;

      // Calculate date range
      const daysBack = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysBack);

      // Aggregate pattern data
      const patterns = await Trade.aggregate([
        {
          $match: {
            userId,
            createdAt: { $gte: startDate },
            status: 'closed'
          }
        },
        {
          $group: {
            _id: {
              tradePair: '$tradePair',
              tradeType: '$tradeType',
              timeframe: '$timeframe'
            },
            count: { $sum: 1 },
            winCount: {
              $sum: { $cond: [{ $eq: ['$result', 'win'] }, 1, 0] }
            },
            totalPnL: { $sum: '$pnl' },
            avgPnL: { $avg: '$pnl' }
          }
        },
        {
          $project: {
            _id: 0,
            tradePair: '$_id.tradePair',
            tradeType: '$_id.tradeType',
            timeframe: '$_id.timeframe',
            count: 1,
            winRate: {
              $multiply: [{ $divide: ['$winCount', '$count'] }, 100]
            },
            totalPnL: 1,
            avgPnL: 1
          }
        },
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]);

      res.json({
        success: true,
        data: {
          patterns,
          timeframe,
          generatedAt: new Date()
        }
      });

    } catch (error) {
      logger.error('Failed to generate pattern insights:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate pattern insights'
      });
    }
  }
);

module.exports = router;
