/**
 * TradeMaster AI Admin Panel Types
 * TypeScript definitions for admin panel components and API responses
 */

// Base Types
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

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

// User Types
export interface UserSubscription {
  plan: 'free' | 'premium' | 'professional';
  isActive: boolean;
  expiresAt?: string;
  features: string[];
}

export interface UserMetadata {
  totalTrades?: number;
  lastActivity?: string;
  [key: string]: any;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  status: 'active' | 'suspended' | 'pending';
  subscription: UserSubscription;
  metadata?: UserMetadata;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Admin User Types
export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'super_admin';
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
}

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  user: {
    displayName: string;
    email: string;
    avatar?: string;
  };
  plan: 'free' | 'premium' | 'professional';
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export interface Payment {
  id: string;
  userId: string;
  user: {
    displayName: string;
    email: string;
  };
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending' | 'refunded';
  description: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface AnalyticsMetric {
  label: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  format?: 'number' | 'currency' | 'percentage';
}

export interface ChartDataPoint {
  date: string;
  value: number;
  [key: string]: any;
}

// API Response Types
export interface UsersResponse {
  users: User[];
  pagination: PaginationInfo;
}

export interface SubscriptionsResponse {
  subscriptions: Subscription[];
  pagination: PaginationInfo;
}

export interface PaymentsResponse {
  payments: Payment[];
  pagination: PaginationInfo;
}

export interface AnalyticsResponse {
  metrics: AnalyticsMetric[];
  chartData: ChartDataPoint[];
  timeframe: string;
}

// Filter Types
export interface UserFilters {
  search?: string;
  status?: string;
  plan?: string;
  page?: number;
  limit?: number;
}

export interface SubscriptionFilters {
  status?: string;
  plan?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface PaymentFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: AdminUser;
}
