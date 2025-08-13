import axios from 'axios'
import type { User, Subscription, Payment, APIKey, FeedbackLog, AdminSettings, DashboardStats } from '@/types'

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
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const adminApi = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  // Dashboard Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/stats/dashboard')
    return response.data
  },

  getUserGrowthData: async (period: '7d' | '30d' | '90d' = '30d') => {
    const response = await api.get(`/stats/user-growth?period=${period}`)
    return response.data
  },

  getRevenueData: async (period: '7d' | '30d' | '90d' = '30d') => {
    const response = await api.get(`/stats/revenue?period=${period}`)
    return response.data
  },

  // Users
  getUsers: async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    plan?: string
  }) => {
    const response = await api.get('/users', { params })
    return response.data
  },

  getUser: async (userId: string): Promise<User> => {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  updateUser: async (userId: string, data: Partial<User>) => {
    const response = await api.put(`/users/${userId}`, data)
    return response.data
  },

  suspendUser: async (userId: string, reason?: string) => {
    const response = await api.post(`/users/${userId}/suspend`, { reason })
    return response.data
  },

  activateUser: async (userId: string) => {
    const response = await api.post(`/users/${userId}/activate`)
    return response.data
  },

  resetUserPassword: async (userId: string) => {
    const response = await api.post(`/users/${userId}/reset-password`)
    return response.data
  },

  getUserActivity: async (userId: string) => {
    const response = await api.get(`/users/${userId}/activity`)
    return response.data
  },

  // Subscriptions
  getSubscriptions: async (params?: {
    page?: number
    limit?: number
    status?: string
    plan?: string
  }) => {
    const response = await api.get('/subscriptions', { params })
    return response.data
  },

  updateSubscription: async (subscriptionId: string, data: {
    plan?: string
    status?: string
  }) => {
    const response = await api.put(`/subscriptions/${subscriptionId}`, data)
    return response.data
  },

  cancelSubscription: async (subscriptionId: string, immediate = false) => {
    const response = await api.post(`/subscriptions/${subscriptionId}/cancel`, { immediate })
    return response.data
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
    const response = await api.get('/payments', { params })
    return response.data
  },

  refundPayment: async (paymentId: string, amount?: number, reason?: string) => {
    const response = await api.post(`/payments/${paymentId}/refund`, { amount, reason })
    return response.data
  },

  // API Keys
  getAPIKeys: async (params?: {
    page?: number
    limit?: number
    status?: string
    userId?: string
  }) => {
    const response = await api.get('/api-keys', { params })
    return response.data
  },

  revokeAPIKey: async (keyId: string) => {
    const response = await api.post(`/api-keys/${keyId}/revoke`)
    return response.data
  },

  getAPIUsageStats: async (keyId: string) => {
    const response = await api.get(`/api-keys/${keyId}/usage`)
    return response.data
  },

  // Feedback & AI Logs
  getFeedbackLogs: async (params?: {
    page?: number
    limit?: number
    type?: string
    status?: string
    userId?: string
  }) => {
    const response = await api.get('/feedback', { params })
    return response.data
  },

  flagFeedback: async (feedbackId: string, reason: string) => {
    const response = await api.post(`/feedback/${feedbackId}/flag`, { reason })
    return response.data
  },

  deleteFeedback: async (feedbackId: string) => {
    const response = await api.delete(`/feedback/${feedbackId}`)
    return response.data
  },

  // Settings
  getSettings: async (): Promise<AdminSettings> => {
    const response = await api.get('/settings')
    return response.data
  },

  updateSettings: async (settings: Partial<AdminSettings>) => {
    const response = await api.put('/settings', settings)
    return response.data
  },

  // System
  getSystemHealth: async () => {
    const response = await api.get('/system/health')
    return response.data
  },

  exportData: async (type: 'users' | 'payments' | 'subscriptions', format: 'csv' | 'json' = 'csv') => {
    const response = await api.get(`/export/${type}?format=${format}`, {
      responseType: 'blob'
    })
    return response.data
  },
}