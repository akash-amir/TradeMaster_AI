/**
 * Trade Master AI Backend Types
 * TypeScript definitions for backend API responses and data structures
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface PaginatedResponse<T> extends ApiResponse {
  data: {
    items: T[];
    pagination: PaginationInfo;
  };
}

// User Types
export interface UserSubscription {
  plan: 'free' | 'premium' | 'professional';
  isActive: boolean;
  expiresAt?: string;
  features: string[];
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    aiAnalysis: boolean;
  };
  dashboard: {
    defaultTimeframe: string;
    showPnL: boolean;
    currency: string;
  };
  trading: {
    defaultLotSize?: number;
    riskPercentage?: number;
    autoStopLoss?: boolean;
  };
}

export interface UserStatistics {
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  totalPnL: number;
  lastTradeDate?: string;
  lastUpdated: string;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  tradingExperience: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  preferredMarkets: string[];
  timezone: string;
  subscription: UserSubscription;
  preferences: UserPreferences;
  statistics?: UserStatistics;
  lastLogin?: string;
  aiAnalysisCount: {
    total: number;
    thisMonth: number;
    overall: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Trade Types
export interface TradeAIAnalysis {
  summary: string;
  entryQuality: {
    score: number; // 1-10
    reasoning: string;
    factors: string[];
  };
  riskAssessment: {
    score: number; // 1-10
    reasoning: string;
    riskLevel: 'low' | 'medium' | 'high';
    suggestions: string[];
  };
  marketContext: {
    trend: 'bullish' | 'bearish' | 'sideways';
    sentiment: 'positive' | 'negative' | 'neutral';
    volatility: 'low' | 'medium' | 'high';
    keyLevels: Array<{
      level: number;
      type: 'support' | 'resistance';
      strength: number;
    }>;
  };
  performanceMetrics: {
    efficiency: number;
    riskReward: number;
    timeInTrade?: number;
    maxDrawdown?: number;
  };
  suggestions: Array<{
    category: 'entry' | 'exit' | 'risk' | 'strategy';
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
  }>;
  analysisDate: string;
  analysisVersion: string;
  confidence: number; // 0-1
  rawResponse?: string;
}

export interface Trade {
  _id: string;
  userId: string;
  tradePair: string;
  tradeType: 'buy' | 'sell' | 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  positionSize: number;
  lotSize?: number;
  timeframe: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';
  entryTime: string;
  exitTime?: string;
  status: 'open' | 'closed' | 'cancelled';
  result?: 'win' | 'loss' | 'breakeven';
  pnl?: number;
  pnlPercentage?: number;
  commission?: number;
  strategy?: string;
  notes?: string;
  tags?: string[];
  chartScreenshotUrl?: string;
  aiAnalysis?: TradeAIAnalysis;
  metadata?: {
    platform?: string;
    accountType?: string;
    leverage?: number;
    spread?: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tradingExperience?: string;
  preferredMarkets?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface TradeCreateRequest {
  tradePair: string;
  tradeType: 'buy' | 'sell' | 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  positionSize: number;
  lotSize?: number;
  timeframe: string;
  entryTime?: string;
  strategy?: string;
  notes?: string;
  tags?: string[];
}

export interface TradeUpdateRequest {
  exitPrice?: number;
  exitTime?: string;
  status?: 'open' | 'closed' | 'cancelled';
  stopLoss?: number;
  takeProfit?: number;
  notes?: string;
  tags?: string[];
}

export interface TradeFilters {
  page?: number;
  limit?: number;
  sort?: string;
  status?: 'open' | 'closed' | 'cancelled';
  tradePair?: string;
  tradeType?: 'buy' | 'sell' | 'long' | 'short';
  result?: 'win' | 'loss' | 'breakeven';
  dateFrom?: string;
  dateTo?: string;
}

export interface TradingStatistics {
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  winningTrades: number;
  losingTrades: number;
  totalPnL: number;
  averagePnL: number;
  totalVolume: number;
  winRate: number;
  profitFactor?: number;
  maxDrawdown?: number;
  avgWin?: number;
  avgLoss?: number;
  largestWin?: number;
  largestLoss?: number;
}

// AI Analysis Types
export interface OverallInsightRequest {
  limit?: number;
  immediate?: boolean;
}

export interface OverallInsight {
  summary: string;
  performanceAnalysis: {
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    trends: Array<{
      metric: string;
      direction: 'improving' | 'declining' | 'stable';
      significance: number;
    }>;
  };
  riskManagement: {
    score: number;
    assessment: string;
    recommendations: string[];
  };
  tradingPatterns: Array<{
    pattern: string;
    frequency: number;
    successRate: number;
    avgReturn: number;
  }>;
  marketInsights: {
    bestPerformingPairs: string[];
    worstPerformingPairs: string[];
    optimalTimeframes: string[];
    marketConditions: string;
  };
  recommendations: Array<{
    category: 'strategy' | 'risk' | 'psychology' | 'technical';
    priority: 'high' | 'medium' | 'low';
    recommendation: string;
    expectedImpact: string;
  }>;
  generatedAt: string;
  tradesAnalyzed: number;
  confidence: number;
}

export interface UsageStats {
  currentPlan: 'free' | 'premium' | 'professional';
  usage: {
    total: {
      trades: number;
      analyses: number;
      overall: number;
    };
    thisMonth: number;
  };
  limits: {
    daily: number;
    monthly: number;
  };
  remaining: {
    monthly: number;
  };
}

export interface PatternInsight {
  tradePair: string;
  tradeType: 'buy' | 'sell' | 'long' | 'short';
  timeframe: string;
  count: number;
  winRate: number;
  totalPnL: number;
  avgPnL: number;
}

export interface AnalysisJob {
  jobId: string;
  status: 'waiting' | 'active' | 'completed' | 'failed';
  progress?: number;
  estimatedTime?: string;
  result?: any;
  error?: string;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  statusCode?: number;
}

// System Status Types
export interface SystemStatus {
  api: 'operational' | 'degraded' | 'down';
  database: 'connected' | 'disconnected' | 'error';
  redis: 'operational' | 'disconnected' | 'error';
  queue: 'operational' | 'degraded' | 'down';
  cron: {
    isRunning: boolean;
    jobs: Array<{
      name: string;
      running: boolean;
      scheduled: boolean;
    }>;
  };
  timestamp: string;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  environment: string;
}

// Utility Types
export type SortOrder = 'asc' | 'desc';
export type TradeStatus = 'open' | 'closed' | 'cancelled';
export type TradeResult = 'win' | 'loss' | 'breakeven';
export type SubscriptionPlan = 'free' | 'premium' | 'professional';
export type TradingExperience = 'beginner' | 'intermediate' | 'advanced' | 'professional';

// Form Data Types (for frontend forms)
export interface TradeFormData {
  title?: string; // For frontend compatibility
  asset: string; // Maps to tradePair
  date: string;
  time: string;
  entryPrice: string;
  exitPrice?: string;
  stopLoss?: string;
  takeProfit?: string;
  positionType: 'buy' | 'sell' | 'long' | 'short'; // Maps to tradeType
  lotSize: string; // Maps to positionSize
  riskPercent?: string;
  timeframe: string;
  notes?: string;
  strategy?: string;
  tags?: string[];
}
