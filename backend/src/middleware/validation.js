/**
 * Validation Middleware
 * Request validation using express-validator
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

/**
 * User registration validation
 */
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  
  handleValidationErrors
];

/**
 * User login validation
 */
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

/**
 * Trade creation validation
 */
const validateTradeCreation = [
  body('tradePair')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Trade pair must be between 1 and 20 characters')
    .matches(/^[A-Z0-9\/]+$/)
    .withMessage('Trade pair must contain only uppercase letters, numbers, and forward slashes'),
  
  body('tradeType')
    .isIn(['buy', 'sell', 'long', 'short'])
    .withMessage('Trade type must be buy, sell, long, or short'),
  
  body('entryPrice')
    .isFloat({ min: 0 })
    .withMessage('Entry price must be a positive number'),
  
  body('exitPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Exit price must be a positive number'),
  
  body('stopLoss')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Stop loss must be a positive number'),
  
  body('takeProfit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Take profit must be a positive number'),
  
  body('positionSize')
    .isFloat({ min: 0 })
    .withMessage('Position size must be a positive number'),
  
  body('lotSize')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Lot size must be a positive number'),
  
  body('timeframe')
    .isIn(['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'])
    .withMessage('Invalid timeframe'),
  
  body('entryTime')
    .optional()
    .isISO8601()
    .withMessage('Entry time must be a valid ISO 8601 date'),
  
  body('strategy')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Strategy name cannot exceed 100 characters'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1 and 30 characters'),
  
  handleValidationErrors
];

/**
 * Trade update validation
 */
const validateTradeUpdate = [
  body('exitPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Exit price must be a positive number'),
  
  body('exitTime')
    .optional()
    .isISO8601()
    .withMessage('Exit time must be a valid ISO 8601 date'),
  
  body('status')
    .optional()
    .isIn(['open', 'closed', 'cancelled'])
    .withMessage('Status must be open, closed, or cancelled'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  
  handleValidationErrors
];

/**
 * MongoDB ObjectId validation
 */
const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];

/**
 * Pagination validation
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sort')
    .optional()
    .isIn(['createdAt', '-createdAt', 'entryTime', '-entryTime', 'pnl', '-pnl'])
    .withMessage('Invalid sort field'),
  
  handleValidationErrors
];

/**
 * Trade filtering validation
 */
const validateTradeFilters = [
  query('status')
    .optional()
    .isIn(['open', 'closed', 'cancelled'])
    .withMessage('Invalid status filter'),
  
  query('tradePair')
    .optional()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Trade pair filter must be between 1 and 20 characters'),
  
  query('tradeType')
    .optional()
    .isIn(['buy', 'sell', 'long', 'short'])
    .withMessage('Invalid trade type filter'),
  
  query('result')
    .optional()
    .isIn(['win', 'loss', 'breakeven'])
    .withMessage('Invalid result filter'),
  
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Date from must be a valid ISO 8601 date'),
  
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Date to must be a valid ISO 8601 date'),
  
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateTradeCreation,
  validateTradeUpdate,
  validateObjectId,
  validatePagination,
  validateTradeFilters,
  handleValidationErrors
};
