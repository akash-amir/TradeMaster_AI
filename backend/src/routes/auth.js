/**
 * Authentication Routes
 * User registration, login, and profile management
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateUserRegistration, async (req, res) => {
  try {
    const { email, password, firstName, lastName, tradingExperience, preferredMarkets } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      tradingExperience: tradingExperience || 'beginner',
      preferredMarkets: preferredMarkets || []
    });

    await user.save();

    // Generate JWT token
    const token = user.generateAuthToken();

    logger.info('User registered successfully', {
      userId: user._id,
      email: user.email,
      tradingExperience: user.tradingExperience
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          tradingExperience: user.tradingExperience,
          preferredMarkets: user.preferredMarkets,
          subscription: user.subscription
        },
        token
      }
    });

  } catch (error) {
    logger.error('User registration failed:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateUserLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findByEmail(email).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate JWT token
    const token = user.generateAuthToken();

    logger.info('User logged in successfully', {
      userId: user._id,
      email: user.email,
      lastLogin: user.lastLogin
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          tradingExperience: user.tradingExperience,
          preferredMarkets: user.preferredMarkets,
          subscription: user.subscription,
          lastLogin: user.lastLogin,
          aiAnalysisCount: user.aiAnalysisCount
        },
        token
      }
    });

  } catch (error) {
    logger.error('User login failed:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('tradeCount');

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          avatar: user.avatar,
          tradingExperience: user.tradingExperience,
          preferredMarkets: user.preferredMarkets,
          timezone: user.timezone,
          subscription: user.subscription,
          preferences: user.preferences,
          lastLogin: user.lastLogin,
          aiAnalysisCount: user.aiAnalysisCount,
          tradeCount: user.tradeCount,
          createdAt: user.createdAt
        }
      }
    });

  } catch (error) {
    logger.error('Failed to fetch user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, async (req, res) => {
  try {
    const allowedUpdates = [
      'firstName', 'lastName', 'displayName', 'avatar', 
      'tradingExperience', 'preferredMarkets', 'timezone', 'preferences'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    logger.info('User profile updated', {
      userId: user._id,
      updatedFields: Object.keys(updates)
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          avatar: user.avatar,
          tradingExperience: user.tradingExperience,
          preferredMarkets: user.preferredMarkets,
          timezone: user.timezone,
          subscription: user.subscription,
          preferences: user.preferences
        }
      }
    });

  } catch (error) {
    logger.error('Failed to update user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logger.info('User password changed', { userId: user._id });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    logger.error('Failed to change password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authenticate, (req, res) => {
  logger.info('User logged out', { userId: req.user._id });
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
