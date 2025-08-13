export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  avatar?: string
  status: 'active' | 'suspended' | 'pending'
  subscription: {
    plan: 'free' | 'premium' | 'professional'
    status: 'active' | 'cancelled' | 'past_due'
    currentPeriodEnd?: string
  }
  lastLogin?: string
  createdAt: string
  updatedAt: string
  metadata?: {
    totalTrades: number
    aiAnalysisCount: number
    lastActivity?: string
  }
}

export interface Subscription {
  id: string
  userId: string
  plan: 'free' | 'premium' | 'professional'
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  stripeSubscriptionId?: string
  user: {
    email: string
    displayName: string
  }
}

export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  status: 'succeeded' | 'failed' | 'pending' | 'refunded'
  description: string
  stripePaymentIntentId?: string
  createdAt: string
  user: {
    email: string
    displayName: string
  }
}

export interface APIKey {
  id: string
  userId: string
  keyId: string
  name: string
  lastUsed?: string
  usageCount: number
  isActive: boolean
  createdAt: string
  user: {
    email: string
    displayName: string
  }
}

export interface FeedbackLog {
  id: string
  userId: string
  tradeId: string
  type: 'ai_analysis' | 'trade_feedback' | 'strategy_suggestion'
  content: string
  confidence: number
  status: 'processed' | 'flagged' | 'deleted'
  createdAt: string
  user: {
    email: string
    displayName: string
  }
}

export interface AdminSettings {
  allowNewRegistrations: boolean
  maintenanceMode: boolean
  maxFreeTrialDays: number
  emailNotifications: {
    newUsers: boolean
    failedPayments: boolean
    systemAlerts: boolean
  }
  apiLimits: {
    free: number
    premium: number
    professional: number
  }
}

export interface DashboardStats {
  users: {
    total: number
    active: number
    new: number
    growth: number
  }
  subscriptions: {
    free: number
    premium: number
    professional: number
    revenue: number
    growth: number
  }
  payments: {
    total: number
    succeeded: number
    failed: number
    revenue: number
  }
  apiUsage: {
    totalRequests: number
    activeKeys: number
    topUsers: Array<{
      userId: string
      email: string
      requests: number
    }>
  }
}