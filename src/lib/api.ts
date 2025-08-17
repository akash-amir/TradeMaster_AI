import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/admin'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      // Redirect to the admin login route to match app routing
      window.location.href = '/admin'
    }
    return Promise.reject(error)
  }
)

export const adminApi = {
  // Auth
  login: async (email: string, password: string) => {
    // Use your admin credentials for development
    if (email === 'admin@trademaster.ai' && password === 'Ha369456!') {
      return {
        admin: {
          id: 'admin-1',
          email: 'admin@trademaster.ai',
          name: 'Admin User',
          role: 'super_admin' as 'super_admin'
        },
        token: 'admin-token-' + Date.now()
      }
    }
    throw new Error('Invalid credentials')
  },

  getProfile: async () => {
    return {
      id: 'admin-1',
      email: 'admin@trademaster.ai',
      name: 'Admin User',
      role: 'super_admin' as 'super_admin',
      lastLogin: new Date().toISOString()
    }
  },

  forgotPassword: async (email: string) => {
    return { message: 'Password reset email sent' }
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    return {
      users: {
        total: 2847,
        active: 1923,
        new: 156,
        growth: 12.5
      },
      subscriptions: {
        free: 1591,
        premium: 892,
        professional: 364,
        revenue: 89420,
        growth: 8.3
      },
      payments: {
        total: 1256,
        succeeded: 1198,
        failed: 58,
        revenue: 89420
      },
      apiUsage: {
        totalRequests: 45892,
        activeKeys: 743,
        topUsers: [
          { userId: '1', email: 'john.doe@example.com', requests: 2341 },
          { userId: '2', email: 'jane.smith@example.com', requests: 1876 },
          { userId: '3', email: 'mike.wilson@example.com', requests: 1654 }
        ]
      }
    }
  },

  getUserGrowthData: async (period: '7d' | '30d' | '90d' = '30d') => {
    // Generate mock chart data based on period
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
    const data = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toISOString().split('T')[0],
        users: Math.floor(Math.random() * 50) + 20,
        active: Math.floor(Math.random() * 30) + 15
      })
    }
    return data
  },

  getRevenueData: async (period: '7d' | '30d' | '90d' = '30d') => {
    // Generate mock revenue chart data
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
    const data = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 2000) + 500,
        subscriptions: Math.floor(Math.random() * 20) + 5
      })
    }
    return data
  },

  // Users
  getUsers: async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    plan?: string
  }) => {
    // Mock users data that matches your admin panel structure
    const mockUsers = [
      {
        id: '1',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        status: 'active',
        subscription: {
          plan: 'premium',
          status: 'active',
          currentPeriodEnd: '2024-02-15T00:00:00Z'
        },
        lastLogin: '2024-01-20T14:22:00Z',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T14:22:00Z',
        metadata: {
          totalTrades: 145,
          aiAnalysisCount: 89,
          lastActivity: '2024-01-20T14:22:00Z'
        }
      },
      {
        id: '2',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        displayName: 'Jane Smith',
        status: 'active',
        subscription: {
          plan: 'free',
          status: 'active'
        },
        lastLogin: '2024-01-19T16:45:00Z',
        createdAt: '2024-01-10T09:15:00Z',
        updatedAt: '2024-01-19T16:45:00Z',
        metadata: {
          totalTrades: 23,
          aiAnalysisCount: 15,
          lastActivity: '2024-01-19T16:45:00Z'
        }
      },
      {
        id: '3',
        email: 'mike.wilson@example.com',
        firstName: 'Mike',
        lastName: 'Wilson',
        displayName: 'Mike Wilson',
        status: 'suspended',
        subscription: {
          plan: 'professional',
          status: 'active',
          currentPeriodEnd: '2024-03-01T00:00:00Z'
        },
        lastLogin: '2024-01-18T13:10:00Z',
        createdAt: '2024-01-05T11:20:00Z',
        updatedAt: '2024-01-18T13:10:00Z',
        metadata: {
          totalTrades: 267,
          aiAnalysisCount: 198,
          lastActivity: '2024-01-18T13:10:00Z'
        }
      }
    ]
    
    return {
      users: mockUsers,
      pagination: {
        totalCount: 2847,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(2847 / (params?.limit || 10))
      }
    }
  },

  getUser: async (userId: string) => {
    return {
      id: userId,
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'John Doe',
      status: 'active',
      subscription: {
        plan: 'premium',
        status: 'active',
        currentPeriodEnd: '2024-02-15T00:00:00Z'
      },
      lastLogin: '2024-01-20T14:22:00Z',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:22:00Z',
      metadata: {
        totalTrades: 145,
        aiAnalysisCount: 89,
        lastActivity: '2024-01-20T14:22:00Z'
      }
    }
  },

  updateUser: async (userId: string, data: any) => {
    return { success: true, message: 'User updated successfully' }
  },

  suspendUser: async (userId: string, reason?: string) => {
    return { success: true, message: 'User suspended successfully' }
  },

  activateUser: async (userId: string) => {
    return { success: true, message: 'User activated successfully' }
  },

  resetUserPassword: async (userId: string) => {
    return { success: true, message: 'Password reset email sent' }
  },

  getUserActivity: async (userId: string) => {
    return [
      { action: 'login', timestamp: '2024-01-20T14:22:00Z', ip: '192.168.1.1' },
      { action: 'trade_created', timestamp: '2024-01-20T14:25:00Z', details: 'EURUSD Long' },
      { action: 'ai_analysis', timestamp: '2024-01-20T14:30:00Z', details: 'Trade analysis requested' }
    ]
  },

  // Subscriptions
  getSubscriptions: async (params?: {
    page?: number
    limit?: number
    status?: string
    plan?: string
  }) => {
    const mockSubscriptions = [
      {
        id: 'sub_1',
        userId: '1',
        plan: 'premium',
        status: 'active',
        currentPeriodStart: '2024-01-15T00:00:00Z',
        currentPeriodEnd: '2024-02-15T00:00:00Z',
        cancelAtPeriodEnd: false,
        stripeSubscriptionId: 'sub_1234567890',
        user: {
          email: 'john.doe@example.com',
          displayName: 'John Doe'
        }
      },
      {
        id: 'sub_2',
        userId: '3',
        plan: 'professional',
        status: 'active',
        currentPeriodStart: '2024-01-01T00:00:00Z',
        currentPeriodEnd: '2024-03-01T00:00:00Z',
        cancelAtPeriodEnd: false,
        stripeSubscriptionId: 'sub_0987654321',
        user: {
          email: 'mike.wilson@example.com',
          displayName: 'Mike Wilson'
        }
      }
    ]
    
    return {
      subscriptions: mockSubscriptions,
      pagination: {
        totalCount: 1256,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(1256 / (params?.limit || 10))
      }
    }
  },

  updateSubscription: async (subscriptionId: string, data: {
    plan?: string
    status?: string
  }) => {
    return { success: true, message: 'Subscription updated successfully' }
  },

  cancelSubscription: async (subscriptionId: string, immediate = false) => {
    return { success: true, message: 'Subscription cancelled successfully' }
  },

  // Payments
  getPayments: async (params?: {
    page?: number
    limit?: number
    status?: string
    dateFrom?: string
    dateTo?: string
    userId?: string
  }) => {
    const mockPayments = [
      {
        id: 'pay_1',
        userId: '1',
        amount: 2999,
        currency: 'usd',
        status: 'succeeded',
        description: 'Premium Plan Subscription',
        stripePaymentIntentId: 'pi_1234567890',
        createdAt: '2024-01-15T10:30:00Z',
        user: {
          email: 'john.doe@example.com',
          displayName: 'John Doe'
        }
      },
      {
        id: 'pay_2',
        userId: '3',
        amount: 9999,
        currency: 'usd',
        status: 'succeeded',
        description: 'Professional Plan Subscription',
        stripePaymentIntentId: 'pi_0987654321',
        createdAt: '2024-01-01T11:20:00Z',
        user: {
          email: 'mike.wilson@example.com',
          displayName: 'Mike Wilson'
        }
      },
      {
        id: 'pay_3',
        userId: '2',
        amount: 1999,
        currency: 'usd',
        status: 'failed',
        description: 'Premium Plan Subscription',
        createdAt: '2024-01-18T09:15:00Z',
        user: {
          email: 'jane.smith@example.com',
          displayName: 'Jane Smith'
        }
      }
    ]
    
    return {
      payments: mockPayments,
      pagination: {
        totalCount: 1198,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(1198 / (params?.limit || 10))
      }
    }
  },

  refundPayment: async (paymentId: string, amount?: number, reason?: string) => {
    return { success: true, message: 'Payment refunded successfully' }
  },

  // API Keys
  getAPIKeys: async (params?: {
    page?: number
    limit?: number
    status?: string
    userId?: string
  }) => {
    const mockAPIKeys = [
      {
        id: 'key_1',
        userId: '1',
        keyId: 'tm_1234567890abcdef',
        name: 'Production API Key',
        lastUsed: '2024-01-20T14:22:00Z',
        usageCount: 2341,
        isActive: true,
        createdAt: '2024-01-15T10:30:00Z',
        user: {
          email: 'john.doe@example.com',
          displayName: 'John Doe'
        }
      },
      {
        id: 'key_2',
        userId: '3',
        keyId: 'tm_0987654321fedcba',
        name: 'Development API Key',
        lastUsed: '2024-01-18T13:10:00Z',
        usageCount: 1654,
        isActive: true,
        createdAt: '2024-01-05T11:20:00Z',
        user: {
          email: 'mike.wilson@example.com',
          displayName: 'Mike Wilson'
        }
      }
    ]
    
    return {
      apiKeys: mockAPIKeys,
      pagination: {
        totalCount: 743,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(743 / (params?.limit || 10))
      }
    }
  },

  revokeAPIKey: async (keyId: string) => {
    return { success: true, message: 'API key revoked successfully' }
  },

  getAPIUsageStats: async (keyId: string) => {
    return {
      totalRequests: 2341,
      dailyAverage: 78,
      lastUsed: '2024-01-20T14:22:00Z',
      topEndpoints: [
        { endpoint: '/api/v1/analyze', requests: 1234 },
        { endpoint: '/api/v1/trades', requests: 876 },
        { endpoint: '/api/v1/feedback', requests: 231 }
      ]
    }
  },

  // Feedback & AI Logs
  getFeedbackLogs: async (params?: {
    page?: number
    limit?: number
    type?: string
    status?: string
    userId?: string
  }) => {
    const mockFeedback = [
      {
        id: 'fb_1',
        userId: '1',
        tradeId: 'trade_123',
        type: 'ai_analysis',
        content: 'Strong bullish momentum detected on EURUSD. Technical indicators suggest continuation of upward trend with target at 1.1250.',
        confidence: 0.87,
        status: 'processed',
        createdAt: '2024-01-20T14:30:00Z',
        user: {
          email: 'john.doe@example.com',
          displayName: 'John Doe'
        }
      },
      {
        id: 'fb_2',
        userId: '3',
        tradeId: 'trade_456',
        type: 'trade_feedback',
        content: 'Risk management could be improved. Consider tighter stop loss placement for better risk-reward ratio.',
        confidence: 0.92,
        status: 'processed',
        createdAt: '2024-01-18T13:15:00Z',
        user: {
          email: 'mike.wilson@example.com',
          displayName: 'Mike Wilson'
        }
      }
    ]
    
    return {
      feedback: mockFeedback,
      pagination: {
        totalCount: 892,
        page: params?.page || 1,
        limit: params?.limit || 10,
        totalPages: Math.ceil(892 / (params?.limit || 10))
      }
    }
  },

  flagFeedback: async (feedbackId: string, reason: string) => {
    return { success: true, message: 'Feedback flagged successfully' }
  },

  deleteFeedback: async (feedbackId: string) => {
    return { success: true, message: 'Feedback deleted successfully' }
  },

  // Settings
  getSettings: async () => {
    return {
      allowNewRegistrations: true,
      maintenanceMode: false,
      maxFreeTrialDays: 14,
      emailNotifications: {
        newUsers: true,
        failedPayments: true,
        systemAlerts: true
      },
      apiLimits: {
        free: 100,
        premium: 1000,
        professional: 10000
      }
    }
  },

  updateSettings: async (settings: any) => {
    return { success: true, message: 'Settings updated successfully' }
  },

  // System
  getSystemHealth: async () => {
    return {
      status: 'healthy',
      uptime: '99.9%',
      responseTime: '45ms',
      database: 'connected',
      redis: 'connected',
      lastCheck: new Date().toISOString()
    }
  },

  exportData: async (type: 'users' | 'payments' | 'subscriptions', format: 'csv' | 'json' = 'csv') => {
    // Mock export - return success message
    return new Blob(['mock,data\n1,test'], { type: 'text/csv' })
  },
}