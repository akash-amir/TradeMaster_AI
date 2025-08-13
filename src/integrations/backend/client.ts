/**
 * Trade Master AI Backend API Client
 * Handles all communication with the Node.js/Express backend
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginatedResponse<T> extends ApiResponse<{
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}> {}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  tradingExperience: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  preferredMarkets: string[];
  timezone: string;
  subscription: {
    plan: 'free' | 'premium' | 'professional';
    isActive: boolean;
    expiresAt?: string;
  };
  preferences: {
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
  };
  lastLogin?: string;
  aiAnalysisCount: {
    total: number;
    thisMonth: number;
    overall: number;
  };
  createdAt: string;
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
  timeframe: string;
  entryTime: string;
  exitTime?: string;
  status: 'open' | 'closed' | 'cancelled';
  result?: 'win' | 'loss' | 'breakeven';
  pnl?: number;
  pnlPercentage?: number;
  strategy?: string;
  notes?: string;
  tags?: string[];
  chartScreenshotUrl?: string;
  aiAnalysis?: {
    summary: string;
    entryQuality: {
      score: number;
      reasoning: string;
    };
    riskAssessment: {
      score: number;
      reasoning: string;
    };
    marketContext: {
      trend: string;
      sentiment: string;
      volatility: string;
    };
    suggestions: string[];
    analysisDate: string;
    analysisVersion: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tradingExperience?: string;
  preferredMarkets?: string[];
}

export interface TradeCreateData {
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

export interface TradeUpdateData {
  exitPrice?: number;
  exitTime?: string;
  status?: 'open' | 'closed' | 'cancelled';
  notes?: string;
}

class BackendApiClient {
  private api: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage on initialization
    this.loadAuthToken();

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuthToken();
          // Redirect to login or emit auth error event
          window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
        return Promise.reject(error);
      }
    );
  }

  private loadAuthToken(): void {
    this.authToken = localStorage.getItem('trademaster_token');
  }

  private saveAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('trademaster_token', token);
  }

  private clearAuthToken(): void {
    this.authToken = null;
    localStorage.removeItem('trademaster_token');
  }

  // Auth Methods
  async register(data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.api.post('/auth/register', data);
    if (response.data.success && response.data.data?.token) {
      this.saveAuthToken(response.data.data.token);
    }
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.api.post('/auth/login', credentials);
    if (response.data.success && response.data.data?.token) {
      this.saveAuthToken(response.data.data.token);
    }
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await this.api.post('/auth/logout');
      this.clearAuthToken();
      return response.data;
    } catch (error) {
      this.clearAuthToken();
      throw error;
    }
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    const response = await this.api.put('/auth/profile', data);
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await this.api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  // Trade Methods
  async getTrades(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    status?: string;
    tradePair?: string;
    tradeType?: string;
    result?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<{ trades: Trade[]; pagination: any }>> {
    const response = await this.api.get('/trades', { params });
    return response.data;
  }

  async getTrade(id: string): Promise<ApiResponse<{ trade: Trade }>> {
    const response = await this.api.get(`/trades/${id}`);
    return response.data;
  }

  async createTrade(data: TradeCreateData): Promise<ApiResponse<{ trade: Trade; statistics?: any }>> {
    const response = await this.api.post('/trades', data);
    return response.data;
  }

  async updateTrade(id: string, data: TradeUpdateData): Promise<ApiResponse<{ trade: Trade; statistics?: any }>> {
    const response = await this.api.put(`/trades/${id}`, data);
    return response.data;
  }

  async deleteTrade(id: string): Promise<ApiResponse> {
    const response = await this.api.delete(`/trades/${id}`);
    return response.data;
  }

  async analyzeTrade(id: string, immediate = false): Promise<ApiResponse<{ trade?: Trade; jobId?: string }>> {
    const response = await this.api.post(`/trades/${id}/analyze`, { immediate });
    return response.data;
  }

  async getTradingStats(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/trades/stats/summary');
    return response.data;
  }

  // AI Methods
  async getOverallInsight(params?: {
    limit?: number;
    immediate?: boolean;
  }): Promise<ApiResponse<any>> {
    const response = await this.api.get('/ai/overall-insight', { params });
    return response.data;
  }

  async getAnalysisHistory(params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any>> {
    const response = await this.api.get('/ai/analysis-history', { params });
    return response.data;
  }

  async getUsageStats(): Promise<ApiResponse<any>> {
    const response = await this.api.get('/ai/usage-stats');
    return response.data;
  }

  async batchAnalyze(tradeIds: string[], priority = 'normal'): Promise<ApiResponse<any>> {
    const response = await this.api.post('/ai/batch-analyze', { tradeIds, priority });
    return response.data;
  }

  async getPatternInsights(timeframe = '30d'): Promise<ApiResponse<any>> {
    const response = await this.api.get('/ai/insights/patterns', {
      params: { timeframe },
    });
    return response.data;
  }

  // System Methods
  async getHealth(): Promise<ApiResponse> {
    const response = await this.api.get('/health');
    return response.data;
  }

  async getStatus(): Promise<ApiResponse> {
    const response = await this.api.get('/status');
    return response.data;
  }

  // Utility Methods
  isAuthenticated(): boolean {
    return !!this.authToken;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }
}

// Create singleton instance
export const backendApi = new BackendApiClient();

// Export for use in components
export default backendApi;
