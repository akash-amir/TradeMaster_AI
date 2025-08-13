/**
 * Queue Service - BullMQ Integration
 * Handles background processing of AI analysis requests
 */

const { Queue, Worker } = require('bullmq');
const { getRedisClient } = require('../config/redis');
const aiService = require('./aiService');
const Trade = require('../models/Trade');
const User = require('../models/User');
const logger = require('../utils/logger');

class QueueService {
  constructor() {
    this.connection = null;
    this.aiAnalysisQueue = null;
    this.aiAnalysisWorker = null;
  }

  /**
   * Initialize queue system
   */
  async initialize() {
    try {
      this.connection = getRedisClient();
      
      // Create AI Analysis Queue
      this.aiAnalysisQueue = new Queue('ai-analysis', {
        connection: this.connection,
        defaultJobOptions: {
          removeOnComplete: 100, // Keep last 100 completed jobs
          removeOnFail: 50, // Keep last 50 failed jobs
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      });

      // Create AI Analysis Worker
      this.aiAnalysisWorker = new Worker(
        'ai-analysis',
        this.processAiAnalysis.bind(this),
        {
          connection: this.connection,
          concurrency: 2, // Process 2 jobs concurrently
          limiter: {
            max: 10, // Max 10 jobs per duration
            duration: 60000, // 1 minute
          },
        }
      );

      // Worker event handlers
      this.aiAnalysisWorker.on('completed', (job) => {
        logger.queueJob('AI analysis job completed', {
          jobId: job.id,
          tradeId: job.data.tradeId,
          duration: Date.now() - job.timestamp,
        });
      });

      this.aiAnalysisWorker.on('failed', (job, err) => {
        logger.queueJob('AI analysis job failed', {
          jobId: job.id,
          tradeId: job.data.tradeId,
          error: err.message,
          attempts: job.attemptsMade,
        });
      });

      this.aiAnalysisWorker.on('stalled', (jobId) => {
        logger.queueJob('AI analysis job stalled', { jobId });
      });

      logger.info('Queue service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize queue service:', error);
      throw error;
    }
  }

  /**
   * Add trade analysis job to queue
   */
  async addTradeAnalysisJob(tradeId, priority = 0) {
    try {
      const job = await this.aiAnalysisQueue.add(
        'analyze-trade',
        { tradeId, type: 'single-trade' },
        {
          priority,
          delay: 0,
          jobId: `trade-analysis-${tradeId}`, // Prevent duplicate jobs
        }
      );

      logger.queueJob('Trade analysis job added', {
        jobId: job.id,
        tradeId,
        priority,
      });

      return job;
    } catch (error) {
      logger.error('Failed to add trade analysis job:', error);
      throw error;
    }
  }

  /**
   * Add batch analysis job for multiple trades
   */
  async addBatchAnalysisJob(tradeIds, priority = 0) {
    try {
      const jobs = [];
      
      for (const tradeId of tradeIds) {
        const job = await this.aiAnalysisQueue.add(
          'analyze-trade',
          { tradeId, type: 'batch' },
          {
            priority,
            delay: Math.random() * 5000, // Random delay up to 5 seconds to spread load
            jobId: `batch-analysis-${tradeId}`,
          }
        );
        jobs.push(job);
      }

      logger.queueJob('Batch analysis jobs added', {
        count: jobs.length,
        tradeIds,
      });

      return jobs;
    } catch (error) {
      logger.error('Failed to add batch analysis jobs:', error);
      throw error;
    }
  }

  /**
   * Process AI analysis job
   */
  async processAiAnalysis(job) {
    const { tradeId, type } = job.data;
    
    try {
      logger.queueJob('Processing AI analysis job', {
        jobId: job.id,
        tradeId,
        type,
      });

      // Update job progress
      await job.updateProgress(10);

      // Fetch trade from database
      const trade = await Trade.findById(tradeId).populate('userId');
      if (!trade) {
        throw new Error(`Trade not found: ${tradeId}`);
      }

      // Check if trade already has analysis
      if (trade.aiAnalysisStatus === 'completed') {
        logger.queueJob('Trade already has AI analysis, skipping', { tradeId });
        return { status: 'skipped', reason: 'already_analyzed' };
      }

      await job.updateProgress(20);

      // Mark trade as processing
      await trade.markAiAnalysisProcessing();

      await job.updateProgress(30);

      // Generate AI analysis
      const analysis = await aiService.analyzeTrade(trade);

      await job.updateProgress(80);

      // Save analysis to trade
      await trade.saveAiAnalysis(analysis);

      // Update user's AI analysis count
      await User.findByIdAndUpdate(
        trade.userId._id,
        { $inc: { aiAnalysisCount: 1 } }
      );

      await job.updateProgress(100);

      logger.queueJob('AI analysis completed successfully', {
        jobId: job.id,
        tradeId,
        score: analysis.score,
      });

      return {
        status: 'completed',
        tradeId,
        analysisScore: analysis.score,
        confidence: analysis.confidence,
      };

    } catch (error) {
      logger.queueJob('AI analysis job failed', {
        jobId: job.id,
        tradeId,
        error: error.message,
      });

      // Mark trade analysis as failed
      try {
        const trade = await Trade.findById(tradeId);
        if (trade) {
          await trade.markAiAnalysisFailed(error.message);
        }
      } catch (updateError) {
        logger.error('Failed to update trade analysis status:', updateError);
      }

      throw error;
    }
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    try {
      const waiting = await this.aiAnalysisQueue.getWaiting();
      const active = await this.aiAnalysisQueue.getActive();
      const completed = await this.aiAnalysisQueue.getCompleted();
      const failed = await this.aiAnalysisQueue.getFailed();

      return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        total: waiting.length + active.length + completed.length + failed.length,
      };
    } catch (error) {
      logger.error('Failed to get queue stats:', error);
      return null;
    }
  }

  /**
   * Clean old jobs
   */
  async cleanOldJobs() {
    try {
      await this.aiAnalysisQueue.clean(24 * 60 * 60 * 1000, 100); // Clean jobs older than 24 hours
      logger.queueJob('Old jobs cleaned');
    } catch (error) {
      logger.error('Failed to clean old jobs:', error);
    }
  }

  /**
   * Pause queue
   */
  async pauseQueue() {
    try {
      await this.aiAnalysisQueue.pause();
      logger.queueJob('Queue paused');
    } catch (error) {
      logger.error('Failed to pause queue:', error);
    }
  }

  /**
   * Resume queue
   */
  async resumeQueue() {
    try {
      await this.aiAnalysisQueue.resume();
      logger.queueJob('Queue resumed');
    } catch (error) {
      logger.error('Failed to resume queue:', error);
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    try {
      if (this.aiAnalysisWorker) {
        await this.aiAnalysisWorker.close();
        logger.info('AI analysis worker closed');
      }

      if (this.aiAnalysisQueue) {
        await this.aiAnalysisQueue.close();
        logger.info('AI analysis queue closed');
      }
    } catch (error) {
      logger.error('Error during queue service shutdown:', error);
    }
  }
}

// Create singleton instance
const queueService = new QueueService();

// Export methods for easy access
module.exports = {
  initializeQueues: () => queueService.initialize(),
  addTradeAnalysisJob: (tradeId, priority) => queueService.addTradeAnalysisJob(tradeId, priority),
  addBatchAnalysisJob: (tradeIds, priority) => queueService.addBatchAnalysisJob(tradeIds, priority),
  getQueueStats: () => queueService.getQueueStats(),
  cleanOldJobs: () => queueService.cleanOldJobs(),
  pauseQueue: () => queueService.pauseQueue(),
  resumeQueue: () => queueService.resumeQueue(),
  shutdown: () => queueService.shutdown(),
};
