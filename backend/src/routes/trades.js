/**
 * Trades Routes
 * CRUD operations for trades and AI analysis endpoints
 */

const express = require('express');
const Trade = require('../models/Trade');
const { authenticate, requireSubscription, aiRateLimit } = require('../middleware/auth');
const { 
  validateTradeCreation, 
  validateTradeUpdate, 
  validateObjectId, 
  validatePagination, 
  validateTradeFilters 
} = require('../middleware/validation');
const { addAnalysisJob } = require('../services/queueService');
const { generateTradeAnalysis, generateOverallInsight } = require('../services/aiService');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   GET /api/trades
 * @desc    Get user's trades with filtering and pagination
 * @access  Private
 */
router.get('/', authenticate, validatePagination, validateTradeFilters, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = '-createdAt',
      status,
      tradePair,
      tradeType,
      result,
      dateFrom,
      dateTo
    } = req.query;

    // Build filter query
    const filter = { userId: req.user._id };
    
    if (status) filter.status = status;
    if (tradePair) filter.tradePair = new RegExp(tradePair, 'i');
    if (tradeType) filter.tradeType = tradeType;
    if (result) filter.result = result;
    
    if (dateFrom || dateTo) {
      filter.entryTime = {};
      if (dateFrom) filter.entryTime.$gte = new Date(dateFrom);
      if (dateTo) filter.entryTime.$lte = new Date(dateTo);
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [trades, totalCount] = await Promise.all([
      Trade.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Trade.countDocuments(filter)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: {
        trades,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Failed to fetch trades:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trades'
    });
  }
});

/**
 * @route   GET /api/trades/:id
 * @desc    Get a specific trade by ID
 * @access  Private
 */
router.get('/:id', authenticate, validateObjectId, async (req, res) => {
  try {
    const trade = await Trade.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found'
      });
    }

    res.json({
      success: true,
      data: { trade }
    });

  } catch (error) {
    logger.error('Failed to fetch trade:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trade'
    });
  }
});

/**
 * @route   POST /api/trades
 * @desc    Create a new trade with comprehensive status model
 * @access  Private
 */
router.post('/', authenticate, async (req, res) => {
  try {
    // Extract and validate required fields
    const {
      title,
      entryPrice,
      exitPrice,
      positionSize,
      tradeType, // Long or Short
      stopLoss,
      takeProfit,
      notes,
      dateOpened,
      dateClosed,
      tradePair = 'EUR/USD', // Default if not provided
      timeframe = '1h' // Default if not provided
    } = req.body;

    // Input validation
    const errors = [];
    
    if (!title || title.trim().length === 0) {
      errors.push('Title is required');
    }
    
    if (!positionSize || positionSize <= 0) {
      errors.push('Position size must be a positive number');
    }
    
    if (!tradeType || !['long', 'short'].includes(tradeType.toLowerCase())) {
      errors.push('Trade type must be either "Long" or "Short"');
    }
    
    if (entryPrice && entryPrice <= 0) {
      errors.push('Entry price must be positive if provided');
    }
    
    if (exitPrice && exitPrice <= 0) {
      errors.push('Exit price must be positive if provided');
    }
    
    if (stopLoss && stopLoss <= 0) {
      errors.push('Stop loss must be positive if provided');
    }
    
    if (takeProfit && takeProfit <= 0) {
      errors.push('Take profit must be positive if provided');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Prepare trade data
    const tradeData = {
      title: title.trim(),
      tradePair,
      tradeType: tradeType.toLowerCase(),
      entryPrice: entryPrice || null,
      exitPrice: exitPrice || null,
      positionSize,
      stopLoss: stopLoss || null,
      takeProfit: takeProfit || null,
      notes: notes ? notes.trim() : null,
      timeframe,
      userId: req.user._id,
      dateOpened: dateOpened ? new Date(dateOpened) : new Date(),
      dateClosed: dateClosed ? new Date(dateClosed) : null,
      entryTime: dateOpened ? new Date(dateOpened) : new Date(),
      exitTime: dateClosed ? new Date(dateClosed) : null
    };

    // Create and save trade (status will be auto-determined by pre-save middleware)
    const trade = new Trade(tradeData);
    await trade.save();

    // Calculate profit/loss if both prices are available
    let profitLoss = 0;
    if (trade.entryPrice && trade.exitPrice) {
      if (trade.tradeType === 'long') {
        profitLoss = (trade.exitPrice - trade.entryPrice) * trade.positionSize;
      } else if (trade.tradeType === 'short') {
        profitLoss = (trade.entryPrice - trade.exitPrice) * trade.positionSize;
      }
      
      // Update the trade with calculated P&L
      trade.profitLoss = profitLoss;
      trade.pnl = profitLoss;
      await trade.save();
    }

    // Calculate updated statistics
    const stats = await Trade.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalTrades: { $sum: 1 },
          pendingTrades: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          openTrades: {
            $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] }
          },
          closedTrades: {
            $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
          },
          tpHitTrades: {
            $sum: { $cond: [{ $eq: ['$status', 'tp_hit'] }, 1, 0] }
          },
          stoppedOutTrades: {
            $sum: { $cond: [{ $eq: ['$status', 'stopped_out'] }, 1, 0] }
          },
          winningTrades: {
            $sum: { $cond: [{ $eq: ['$result', 'win'] }, 1, 0] }
          },
          totalPnL: { $sum: '$profitLoss' },
          averagePnL: { $avg: '$profitLoss' }
        }
      }
    ]);

    const statistics = stats[0] || {
      totalTrades: 0,
      pendingTrades: 0,
      openTrades: 0,
      closedTrades: 0,
      tpHitTrades: 0,
      stoppedOutTrades: 0,
      winningTrades: 0,
      totalPnL: 0,
      averagePnL: 0
    };

    const completedTrades = statistics.closedTrades + statistics.tpHitTrades + statistics.stoppedOutTrades;
    statistics.winRate = completedTrades > 0 
      ? (statistics.winningTrades / completedTrades) * 100 
      : 0;

    // Queue AI analysis if user has premium subscription and trade is closed
    if (req.user.subscription && req.user.subscription.plan !== 'free' && 
        ['closed', 'tp_hit', 'stopped_out'].includes(trade.status)) {
      try {
        await addAnalysisJob(trade._id, 'trade_analysis', {
          priority: 'normal',
          delay: 5000
        });
        
        logger.info('AI analysis job queued for new trade', {
          tradeId: trade._id,
          userId: req.user._id,
          status: trade.status
        });
      } catch (queueError) {
        logger.warn('Failed to queue AI analysis for new trade', {
          error: queueError.message,
          tradeId: trade._id
        });
      }
    }

    logger.info('Trade created successfully with status model', {
      tradeId: trade._id,
      userId: req.user._id,
      tradePair: trade.tradePair,
      tradeType: trade.tradeType,
      status: trade.status,
      profitLoss: trade.profitLoss
    });

    res.status(201).json({
      success: true,
      message: `Trade created successfully with status: ${trade.status}`,
      data: { 
        trade: {
          id: trade._id,
          title: trade.title,
          tradePair: trade.tradePair,
          tradeType: trade.tradeType,
          entryPrice: trade.entryPrice,
          exitPrice: trade.exitPrice,
          positionSize: trade.positionSize,
          stopLoss: trade.stopLoss,
          takeProfit: trade.takeProfit,
          status: trade.status,
          profitLoss: trade.profitLoss,
          notes: trade.notes,
          dateOpened: trade.dateOpened,
          dateClosed: trade.dateClosed,
          createdAt: trade.createdAt,
          updatedAt: trade.updatedAt
        },
        statistics 
      }
    });

  } catch (error) {
    logger.error('Failed to create trade with status model:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create trade',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/trades/:id
 * @desc    Update a trade
 * @access  Private
 */
router.put('/:id', authenticate, validateObjectId, validateTradeUpdate, async (req, res) => {
  try {
    const trade = await Trade.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found'
      });
    }

    // Update trade fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        trade[key] = req.body[key];
      }
    });

    await trade.save();

    // Calculate updated statistics
    const stats = await Trade.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalTrades: { $sum: 1 },
          openTrades: {
            $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] }
          },
          closedTrades: {
            $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
          },
          winningTrades: {
            $sum: { $cond: [{ $eq: ['$result', 'win'] }, 1, 0] }
          },
          totalPnL: { $sum: '$pnl' },
          averagePnL: { $avg: '$pnl' }
        }
      }
    ]);

    const statistics = stats[0] || {
      totalTrades: 0,
      openTrades: 0,
      closedTrades: 0,
      winningTrades: 0,
      totalPnL: 0,
      averagePnL: 0
    };

    statistics.winRate = statistics.closedTrades > 0 
      ? (statistics.winningTrades / statistics.closedTrades) * 100 
      : 0;

    // Queue AI analysis if trade was closed and user has premium subscription
    if (req.body.status === 'closed' && req.user.subscription.plan !== 'free') {
      try {
        await addAnalysisJob(trade._id, 'trade_analysis', {
          priority: 'high',
          delay: 2000 // 2 second delay for closed trades
        });
        
        logger.info('AI analysis job queued for closed trade', {
          tradeId: trade._id,
          userId: req.user._id
        });
      } catch (queueError) {
        logger.error('Failed to queue AI analysis:', queueError);
      }
    }

    logger.info('Trade updated successfully', {
      tradeId: trade._id,
      userId: req.user._id,
      updatedFields: Object.keys(req.body)
    });

    res.json({
      success: true,
      message: 'Trade updated successfully',
      data: { trade, statistics }
    });

  } catch (error) {
    logger.error('Failed to update trade:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update trade'
    });
  }
});

/**
 * @route   DELETE /api/trades/:id
 * @desc    Delete a trade
 * @access  Private
 */
router.delete('/:id', authenticate, validateObjectId, async (req, res) => {
  try {
    const trade = await Trade.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found'
      });
    }

    logger.info('Trade deleted successfully', {
      tradeId: trade._id,
      userId: req.user._id
    });

    res.json({
      success: true,
      message: 'Trade deleted successfully'
    });

  } catch (error) {
    logger.error('Failed to delete trade:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete trade'
    });
  }
});

/**
 * @route   POST /api/trades/:id/analyze
 * @desc    Generate AI analysis for a specific trade
 * @access  Private (Premium/Professional)
 */
router.post('/:id/analyze', 
  authenticate, 
  requireSubscription('premium'), 
  aiRateLimit,
  validateObjectId, 
  async (req, res) => {
    try {
      const trade = await Trade.findOne({
        _id: req.params.id,
        userId: req.user._id
      });

      if (!trade) {
        return res.status(404).json({
          success: false,
          message: 'Trade not found'
        });
      }

      // Check if analysis already exists and is recent
      if (trade.aiAnalysis && trade.aiAnalysis.analysisDate) {
        const hoursSinceAnalysis = (Date.now() - trade.aiAnalysis.analysisDate) / (1000 * 60 * 60);
        if (hoursSinceAnalysis < 1) {
          return res.json({
            success: true,
            message: 'Recent analysis already exists',
            data: { 
              trade,
              fromCache: true 
            }
          });
        }
      }

      // Check if immediate analysis is requested
      const { immediate = false } = req.body;

      if (immediate) {
        // Generate analysis immediately
        logger.info('Generating immediate AI analysis', {
          tradeId: trade._id,
          userId: req.user._id
        });

        const analysis = await generateTradeAnalysis(trade);
        
        // Update trade with analysis
        trade.aiAnalysis = {
          ...analysis,
          analysisDate: new Date(),
          analysisVersion: '1.0'
        };
        
        await trade.save();

        res.json({
          success: true,
          message: 'AI analysis generated successfully',
          data: { trade }
        });

      } else {
        // Queue analysis for background processing
        const job = await addAnalysisJob(trade._id, 'trade_analysis', {
          priority: 'high',
          delay: 1000
        });

        logger.info('AI analysis job queued', {
          tradeId: trade._id,
          userId: req.user._id,
          jobId: job.id
        });

        res.json({
          success: true,
          message: 'AI analysis queued successfully',
          data: { 
            jobId: job.id,
            estimatedTime: '1-2 minutes'
          }
        });
      }

    } catch (error) {
      logger.error('Failed to analyze trade:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to analyze trade'
      });
    }
  }
);

/**
 * @route   GET /api/trades/stats/summary
 * @desc    Get trading statistics summary
 * @access  Private
 */
router.get('/stats/summary', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Aggregate trading statistics
    const stats = await Trade.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalTrades: { $sum: 1 },
          openTrades: {
            $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] }
          },
          closedTrades: {
            $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
          },
          winningTrades: {
            $sum: { $cond: [{ $eq: ['$result', 'win'] }, 1, 0] }
          },
          losingTrades: {
            $sum: { $cond: [{ $eq: ['$result', 'loss'] }, 1, 0] }
          },
          totalPnL: { $sum: '$pnl' },
          averagePnL: { $avg: '$pnl' },
          totalVolume: { $sum: { $multiply: ['$entryPrice', '$positionSize'] } }
        }
      }
    ]);

    const summary = stats[0] || {
      totalTrades: 0,
      openTrades: 0,
      closedTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      totalPnL: 0,
      averagePnL: 0,
      totalVolume: 0
    };

    // Calculate win rate
    const winRate = summary.closedTrades > 0 
      ? (summary.winningTrades / summary.closedTrades) * 100 
      : 0;

    res.json({
      success: true,
      data: {
        ...summary,
        winRate: Math.round(winRate * 100) / 100
      }
    });

  } catch (error) {
    logger.error('Failed to fetch trading stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trading statistics'
    });
  }
});

module.exports = router;
