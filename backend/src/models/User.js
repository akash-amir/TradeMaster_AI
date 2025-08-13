/**
 * User Model
 * Mongoose schema for user authentication and profile management
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  displayName: {
    type: String,
    trim: true,
    maxlength: [100, 'Display name cannot exceed 100 characters']
  },
  avatar: {
    type: String,
    default: null
  },
  tradingExperience: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'professional'],
    default: 'beginner'
  },
  preferredMarkets: [{
    type: String,
    enum: ['forex', 'crypto', 'stocks', 'commodities', 'indices']
  }],
  timezone: {
    type: String,
    default: 'UTC'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  aiAnalysisCount: {
    type: Number,
    default: 0
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium', 'professional'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    aiAnalysisFrequency: {
      type: String,
      enum: ['immediate', 'hourly', 'daily'],
      default: 'immediate'
    },
    riskTolerance: {
      type: String,
      enum: ['conservative', 'moderate', 'aggressive'],
      default: 'moderate'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for trade count
userSchema.virtual('tradeCount', {
  ref: 'Trade',
  localField: '_id',
  foreignField: 'userId',
  count: true
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it's been modified
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to set display name
userSchema.pre('save', function(next) {
  if (!this.displayName) {
    this.displayName = this.fullName;
  }
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate JWT token
userSchema.methods.generateAuthToken = function() {
  const payload = {
    id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Instance method to update last login
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save({ validateBeforeSave: false });
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'subscription.plan': 1 });

module.exports = mongoose.model('User', userSchema);
