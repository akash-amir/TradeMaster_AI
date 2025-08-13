/**
 * Cron Job Service
 * Scheduled tasks for automated AI analysis and maintenance
 */

const cron = require('node-cron');
const Trade = require('../models/Trade');
const User = require('../models/User');
const { addAnalysisJob } = require('./queueService');
const logger = require('../utils/logger');

class CronService {
  constructor() {
    this.jobs = new Map();
    this.isRunning = false;
  }

  /**
   * Start all cron jobs
   */
  start() {
    if (this.isRunning) {
      logger.warn('Cron service is already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting cron service...');

    // Schedule periodic AI analysis for new trades
    this.scheduleTradeAnalysis();

    // Schedule cleanup tasks
    this.scheduleCleanupTasks();

    // Schedule usage statistics updates
    this.scheduleUsageStatsUpdate();

    logger.info('All cron jobs scheduled successfully');
  }

  /**
   * Stop all cron jobs
   */
  stop() {
    if (!this.isRunning) {
      logger.warn('Cron service is not running');
      return;
    }

    logger.info('Stopping cron service...');

    // Stop all scheduled jobs
    this.jobs.forEach((job, name) => {
      job.stop();
      logger.info(`Stopped cron job: ${name}`);
    });

    this.jobs.clear();
    this.isRunning = false;

    logger.info('Cron service stopped successfully');
  }

  /**
   * Schedule periodic AI analysis for new trades
   * Runs every 30 minutes to analyze recent trades
   */
  scheduleTradeAnalysis() {
    const cronExpression = process.env.CRON_TRADE_ANALYSIS || '*/30 * * * *'; // Every 30 minutes
    
    const job = cron.schedule(cronExpression, async () => {
      try {
        logger.cronInfo('Starting periodic trade analysis job');

        // Find trades created in the last 35 minutes that need analysis
        const cutoffTime = new Date(Date.now() - 35 * 60 * 1000);
        
        const tradesNeedingAnalysis = await Trade.find({
          createdAt: { $gte: cutoffTime },
          'aiAnalysis.analysisDate': { $exists: false },
          status: { $in: ['open', 'closed'] }
        })
        .populate('userId', 'subscription.plan subscription.isActive')
        .limit(50); // Limit to prevent overwhelming the queue

        let queuedCount = 0;
        let skippedCount = 0;

        for (const trade of tradesNeedingAnalysis) {
          // Only analyze for premium/professional users
          if (trade.userId.subscription.plan !== 'free' && trade.userId.subscription.isActive) {
            try {
              await addAnalysisJob(trade._id, 'trade_analysis', {
                priority: 'low',
                delay: queuedCount * 2000 // Stagger jobs by 2 seconds
              });
              queuedCount++;
            } catch (error) {
              logger.error('Failed to queue trade analysis:', error);
            }
          } else {
            skippedCount++;
          }
        }

        logger.cronInfo('Periodic trade analysis job completed', {
          tradesFound: tradesNeedingAnalysis.length,
          queuedCount,
          skippedCount
        });

      } catch (error) {
        logger.error('Periodic trade analysis job failed:', error);
      }
    }, {
      scheduled: false,
      timezone: process.env.TIMEZONE || 'UTC'
    });

    this.jobs.set('tradeAnalysis', job);
    job.start();
    
    logger.info(`Trade analysis cron job scheduled: ${cronExpression}`);
  }

  /**
   * Schedule cleanup tasks
   * Runs daily at 2 AM to clean up old data
   */
  scheduleCleanupTasks() {
    const cronExpression = process.env.CRON_CLEANUP || '0 2 * * *'; // Daily at 2 AM
    
    const job = cron.schedule(cronExpression, async () => {
      try {
        logger.cronInfo('Starting cleanup tasks');

        // Clean up old failed queue jobs (older than 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        // Clean up old AI analysis cache (older than 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        const cleanupResult = await Trade.updateMany(
          { 'aiAnalysis.analysisDate': { $lt: thirtyDaysAgo } },
          { $unset: { 'aiAnalysis.rawResponse': 1 } }
        );

        logger.cronInfo('Cleanup tasks completed', {
          aiAnalysisCacheCleared: cleanupResult.modifiedCount
        });

      } catch (error) {
        logger.error('Cleanup tasks failed:', error);
      }
    }, {
      scheduled: false,
      timezone: process.env.TIMEZONE || 'UTC'
    });

    this.jobs.set('cleanup', job);
    job.start();
    
    logger.info(`Cleanup cron job scheduled: ${cronExpression}`);
  }

  /**
   * Schedule usage statistics updates
   * Runs every hour to update user statistics
   */
  scheduleUsageStatsUpdate() {
    const cronExpression = process.env.CRON_STATS_UPDATE || '0 * * * *'; // Every hour
    
    const job = cron.schedule(cronExpression, async () => {
      try {
        logger.cronInfo('Starting usage statistics update');

        // Update trade counts for all users
        const userStats = await Trade.aggregate([
          {
            $group: {
              _id: '$userId',
              totalTrades: { $sum: 1 },
              openTrades: {
                $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] }
              },
              closedTrades: {
                $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
              },
              totalPnL: { $sum: '$pnl' },
              lastTradeDate: { $max: '$createdAt' }
            }
          }
        ]);

        let updatedUsers = 0;

        for (const stats of userStats) {
          try {
            await User.findByIdAndUpdate(stats._id, {
              $set: {
                'statistics.totalTrades': stats.totalTrades,
                'statistics.openTrades': stats.openTrades,
                'statistics.closedTrades': stats.closedTrades,
                'statistics.totalPnL': stats.totalPnL,
                'statistics.lastTradeDate': stats.lastTradeDate,
                'statistics.lastUpdated': new Date()
              }
            });
            updatedUsers++;
          } catch (error) {
            logger.error('Failed to update user statistics:', error);
          }
        }

        logger.cronInfo('Usage statistics update completed', {
          usersProcessed: userStats.length,
          usersUpdated: updatedUsers
        });

      } catch (error) {
        logger.error('Usage statistics update failed:', error);
      }
    }, {
      scheduled: false,
      timezone: process.env.TIMEZONE || 'UTC'
    });

    this.jobs.set('statsUpdate', job);
    job.start();
    
    logger.info(`Usage statistics cron job scheduled: ${cronExpression}`);
  }

  /**
   * Schedule weekly insights generation
   * Runs every Sunday at 6 AM to generate weekly insights for active users
   */
  scheduleWeeklyInsights() {
    const cronExpression = process.env.CRON_WEEKLY_INSIGHTS || '0 6 * * 0'; // Sundays at 6 AM
    
    const job = cron.schedule(cronExpression, async () => {
      try {
        logger.cronInfo('Starting weekly insights generation');

        // Find active premium/professional users with recent trades
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        const activeUsers = await User.find({
          'subscription.plan': { $in: ['premium', 'professional'] },
          'subscription.isActive': true,
          'statistics.lastTradeDate': { $gte: oneWeekAgo }
        }).select('_id email firstName lastName subscription.plan');

        let insightsQueued = 0;

        for (const user of activeUsers) {
          try {
            await addAnalysisJob(user._id, 'weekly_insight', {
              priority: 'low',
              delay: insightsQueued * 5000 // Stagger by 5 seconds
            });
            insightsQueued++;
          } catch (error) {
            logger.error('Failed to queue weekly insight:', error);
          }
        }

        logger.cronInfo('Weekly insights generation completed', {
          activeUsers: activeUsers.length,
          insightsQueued
        });

      } catch (error) {
        logger.error('Weekly insights generation failed:', error);
      }
    }, {
      scheduled: false,
      timezone: process.env.TIMEZONE || 'UTC'
    });

    this.jobs.set('weeklyInsights', job);
    job.start();
    
    logger.info(`Weekly insights cron job scheduled: ${cronExpression}`);
  }

  /**
   * Get status of all cron jobs
   */
  getStatus() {
    const status = {
      isRunning: this.isRunning,
      jobs: []
    };

    this.jobs.forEach((job, name) => {
      status.jobs.push({
        name,
        running: job.running,
        scheduled: job.scheduled
      });
    });

    return status;
  }

  /**
   * Manually trigger a specific job
   */
  async triggerJob(jobName) {
    const job = this.jobs.get(jobName);
    if (!job) {
      throw new Error(`Job '${jobName}' not found`);
    }

    logger.info(`Manually triggering job: ${jobName}`);
    
    // Execute the job's task function
    await job.task();
    
    logger.info(`Job '${jobName}' executed successfully`);
  }
}

// Create singleton instance
const cronService = new CronService();

module.exports = cronService;
