/**
 * Authentication Middleware
 * JWT-based authentication for API endpoints
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Verify JWT token and authenticate user
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No valid token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }

    logger.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Check if user has required subscription plan
 */
const requireSubscription = (requiredPlan = 'free') => {
  const planHierarchy = {
    'free': 0,
    'premium': 1,
    'professional': 2
  };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const userPlanLevel = planHierarchy[req.user.subscription.plan] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan] || 0;

    if (userPlanLevel < requiredPlanLevel) {
      return res.status(403).json({
        success: false,
        message: `${requiredPlan} subscription required.`,
        currentPlan: req.user.subscription.plan,
        requiredPlan
      });
    }

    // Check if subscription is active
    if (!req.user.subscription.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Subscription is not active.'
      });
    }

    next();
  };
};

/**
 * Rate limiting for AI requests based on subscription
 */
const aiRateLimit = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  // Define limits based on subscription plan
  const limits = {
    'free': { daily: 5, monthly: 50 },
    'premium': { daily: 50, monthly: 1000 },
    'professional': { daily: 200, monthly: 5000 }
  };

  const userLimit = limits[req.user.subscription.plan] || limits.free;
  
  // For now, just log the request - implement actual rate limiting with Redis
  logger.info('AI request rate limit check', {
    userId: req.user._id,
    plan: req.user.subscription.plan,
    dailyLimit: userLimit.daily,
    monthlyLimit: userLimit.monthly
  });

  next();
};

module.exports = {
  authenticate,
  optionalAuth,
  requireSubscription,
  aiRateLimit
};
