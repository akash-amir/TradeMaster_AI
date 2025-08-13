/**
 * Trade Model
 * Mongoose schema for trading records with AI analysis integration
 */

const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  
  // Trade title for easy identification
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  // Basic Trade Information
  tradePair: {
    type: String,
    required: [true, 'Trade pair is required'],
    trim: true,
    uppercase: true,
    maxlength: [20, 'Trade pair cannot exceed 20 characters']
  },
  tradeType: {
    type: String,
    required: [true, 'Trade type is required'],
    enum: ['buy', 'sell', 'long', 'short'],
    lowercase: true
  },
  
  // Price Information
  entryPrice: {
    type: Number,
    default: null,
    min: [0, 'Entry price must be positive']
  },
  exitPrice: {
    type: Number,
    default: null,
    min: [0, 'Exit price must be positive']
  },
  stopLoss: {
    type: Number,
    default: null,
    min: [0, 'Stop loss must be positive']
  },
  takeProfit: {
    type: Number,
    default: null,
    min: [0, 'Take profit must be positive']
  },
  
  // Position Information
  positionSize: {
    type: Number,
    required: [true, 'Position size is required'],
    min: [0, 'Position size must be positive']
  },
  lotSize: {
    type: Number,
    default: null,
    min: [0, 'Lot size must be positive']
  },
  
  // Trade Timing
  dateOpened: {
    type: Date,
    default: Date.now
  },
  dateClosed: {
    type: Date,
    default: null
  },
  entryTime: {
    type: Date,
    required: [true, 'Entry time is required'],
    default: Date.now
  },
  exitTime: {
    type: Date,
    default: null
  },
  timeframe: {
    type: String,
    required: [true, 'Timeframe is required'],
    enum: ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'],
    default: '1h'
  },
  
  // Trade Status and Results - Updated Status Model
  status: {
    type: String,
    required: true,
    enum: ['pending', 'open', 'closed', 'tp_hit', 'stopped_out'],
    default: 'pending'
  },
  result: {
    type: String,
    enum: ['win', 'loss', 'breakeven'],
    default: null
  },
  pnl: {
    type: Number,
    default: null
  },
  profitLoss: {
    type: Number,
    default: null
  },
  pnlPercentage: {
    type: Number,
    default: null
  },
  
  // Risk Management
  riskAmount: {
    type: Number,
    default: null,
    min: [0, 'Risk amount must be positive']
  },
  riskPercentage: {
    type: Number,
    default: null,
    min: [0, 'Risk percentage must be positive'],
    max: [100, 'Risk percentage cannot exceed 100%']
  },
  riskRewardRatio: {
    type: Number,
    default: null,
    min: [0, 'Risk reward ratio must be positive']
  },
  
  // Trade Analysis
  strategy: {
    type: String,
    trim: true,
    maxlength: [100, 'Strategy name cannot exceed 100 characters']
  },
  setup: {
    type: String,
    trim: true,
    maxlength: [200, 'Setup description cannot exceed 200 characters']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  
  // Market Conditions
  marketCondition: {
    type: String,
    enum: ['trending', 'ranging', 'volatile', 'calm'],
    default: null
  },
  newsImpact: {
    type: String,
    enum: ['high', 'medium', 'low', 'none'],
    default: 'none'
  },
  
  // Screenshots and Attachments
  chartScreenshot: {
    url: String,
    filename: String,
    uploadedAt: Date
  },
  additionalScreenshots: [{
    url: String,
    filename: String,
    description: String,
    uploadedAt: Date
  }],
  
  // AI Analysis - This is the key field for AI integration
  aiAnalysis: {
    summary: {
      type: String,
      default: null,
      maxlength: [2000, 'AI summary cannot exceed 2000 characters']
    },
    score: {
      type: Number,
      min: [0, 'AI score must be between 0 and 100'],
      max: [100, 'AI score must be between 0 and 100'],
      default: null
    },
    strengths: [{
      type: String,
      maxlength: [200, 'Strength point cannot exceed 200 characters']
    }],
    weaknesses: [{
      type: String,
      maxlength: [200, 'Weakness point cannot exceed 200 characters']
    }],
    recommendations: [{
      type: String,
      maxlength: [300, 'Recommendation cannot exceed 300 characters']
    }],
    riskAssessment: {
      level: {
        type: String,
        enum: ['low', 'medium', 'high', 'very-high'],
        default: null
      },
      factors: [{
        type: String,
        maxlength: [150, 'Risk factor cannot exceed 150 characters']
      }]
    },
    psychologyInsights: {
      emotionalState: {
        type: String,
        enum: ['confident', 'fearful', 'greedy', 'patient', 'impulsive', 'neutral'],
        default: null
      },
      biases: [{
        type: String,
        maxlength: [100, 'Bias description cannot exceed 100 characters']
      }],
      suggestions: [{
        type: String,
        maxlength: [200, 'Psychology suggestion cannot exceed 200 characters']
      }]
    },
    confidence: {
      type: Number,
      min: [0, 'Confidence must be between 0 and 100'],
      max: [100, 'Confidence must be between 0 and 100'],
      default: null
    },
    generatedAt: {
      type: Date,
      default: null
    },
    model: {
      type: String,
      default: 'qwen3'
    },
    version: {
      type: String,
      default: '1.0'
    }
  },
  
  // AI Analysis Status
  aiAnalysisStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  aiAnalysisError: {
    type: String,
    default: null
  },
  
  // Metadata
  platform: {
    type: String,
    trim: true,
    maxlength: [50, 'Platform name cannot exceed 50 characters']
  },
  accountType: {
    type: String,
    enum: ['demo', 'live'],
    default: 'demo'
  },
  commission: {
    type: Number,
    default: 0,
    min: [0, 'Commission must be positive']
  },
  swap: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for trade duration
tradeSchema.virtual('duration').get(function() {
  if (!this.exitTime) return null;
  return this.exitTime - this.entryTime;
});

// Virtual for trade duration in hours
tradeSchema.virtual('durationHours').get(function() {
  if (!this.duration) return null;
  return Math.round(this.duration / (1000 * 60 * 60) * 100) / 100;
});

// Virtual for has AI analysis
tradeSchema.virtual('hasAiAnalysis').get(function() {
  return this.aiAnalysisStatus === 'completed' && this.aiAnalysis && this.aiAnalysis.summary;
});

// Instance methods
tradeSchema.methods.updateAIAnalysisStatus = function(status, analysisData = null) {
  this.aiAnalysis = this.aiAnalysis || {};
  this.aiAnalysis.status = status;
  
  if (analysisData) {
    Object.assign(this.aiAnalysis, analysisData);
    this.aiAnalysis.analysisDate = new Date();
  }
  
  return this.save();
};

// Calculate PnL for this trade - Updated for new status model
tradeSchema.methods.calculatePnL = function() {
  if (!this.exitPrice || !this.entryPrice) {
    return 0;
  }
  
  let pnl = 0;
  if (this.tradeType === 'buy' || this.tradeType === 'long') {
    pnl = (this.exitPrice - this.entryPrice) * this.positionSize;
  } else if (this.tradeType === 'sell' || this.tradeType === 'short') {
    pnl = (this.entryPrice - this.exitPrice) * this.positionSize;
  }
  
  // Update both pnl and profitLoss fields
  this.pnl = pnl;
  this.profitLoss = pnl;
  this.pnlPercentage = this.entryPrice > 0 ? (pnl / (this.entryPrice * this.positionSize)) * 100 : 0;
  
  // Determine result
  if (pnl > 0) {
    this.result = 'win';
  } else if (pnl < 0) {
    this.result = 'loss';
  } else {
    this.result = 'breakeven';
  }
  
  return pnl;
};

// Method to determine trade status based on entry/exit prices and targets
tradeSchema.methods.determineStatus = function() {
  // If no entry price, it's pending
  if (!this.entryPrice) {
    return 'pending';
  }
  
  // If entry price but no exit price, it's open
  if (!this.exitPrice) {
    return 'open';
  }
  
  // If both entry and exit prices exist, determine specific closure reason
  if (this.takeProfit && Math.abs(this.exitPrice - this.takeProfit) < 0.00001) {
    return 'tp_hit';
  }
  
  if (this.stopLoss && Math.abs(this.exitPrice - this.stopLoss) < 0.00001) {
    return 'stopped_out';
  }
  
  // Otherwise it's manually closed
  return 'closed';
};

// Auto-generate title if not provided and determine status
tradeSchema.pre('save', function(next) {
  if (!this.title) {
    const date = new Date(this.entryTime || this.createdAt).toLocaleDateString();
    this.title = `${this.tradePair} ${this.tradeType.toUpperCase()} - ${date}`;
  }
  
  // Auto-determine status based on entry/exit prices
  this.status = this.determineStatus();
  
  // Calculate PnL if trade has both entry and exit prices
  if (this.exitPrice && this.entryPrice) {
    this.calculatePnL();
  }
  
  // Set dateClosed if trade is closed
  if (['closed', 'tp_hit', 'stopped_out'].includes(this.status) && !this.dateClosed) {
    this.dateClosed = new Date();
  }
  
  next();
});

// Pre-save middleware to calculate risk-reward ratio
tradeSchema.pre('save', function(next) {
  if (this.stopLoss && this.takeProfit && this.entryPrice) {
    const risk = Math.abs(this.entryPrice - this.stopLoss);
    const reward = Math.abs(this.takeProfit - this.entryPrice);
    this.riskRewardRatio = reward / risk;
  }
  next();
});

// Static method to get trades needing AI analysis
tradeSchema.statics.findPendingAiAnalysis = function(limit = 10) {
  return this.find({
    aiAnalysisStatus: 'pending'
  })
  .populate('userId', 'firstName lastName email')
  .sort({ createdAt: 1 })
  .limit(limit);
};

// Static method to get user's recent trades
tradeSchema.statics.findRecentByUser = function(userId, limit = 5) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Instance method to mark AI analysis as processing
tradeSchema.methods.markAiAnalysisProcessing = async function() {
  this.aiAnalysisStatus = 'processing';
  await this.save({ validateBeforeSave: false });
};

// Instance method to save AI analysis
tradeSchema.methods.saveAiAnalysis = async function(analysisData) {
  this.aiAnalysis = {
    ...analysisData,
    generatedAt: new Date(),
    model: 'qwen3',
    version: '1.0'
  };
  this.aiAnalysisStatus = 'completed';
  await this.save({ validateBeforeSave: false });
};

// Instance method to mark AI analysis as failed
tradeSchema.methods.markAiAnalysisFailed = async function(error) {
  this.aiAnalysisStatus = 'failed';
  this.aiAnalysisError = error;
  await this.save({ validateBeforeSave: false });
};

// Indexes for better query performance
tradeSchema.index({ userId: 1, createdAt: -1 });
tradeSchema.index({ aiAnalysisStatus: 1 });
tradeSchema.index({ status: 1 });
tradeSchema.index({ tradePair: 1 });
tradeSchema.index({ entryTime: -1 });

module.exports = mongoose.model('Trade', tradeSchema);
