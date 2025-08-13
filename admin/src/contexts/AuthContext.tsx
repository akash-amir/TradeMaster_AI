import React, { createContext, useContext, useState, useEffect } from 'react'
import { adminApi } from '@/lib/api'

interface Admin {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin'
  lastLogin?: string
}

interface AuthContextType {
  admin: Admin | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      // Verify token and get admin info
      adminApi.getProfile()
        .then(setAdmin)
        .catch(() => {
          localStorage.removeItem('admin_token')
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { admin, token } = await adminApi.login(email, password)
    localStorage.setItem('admin_token', token)
    setAdmin(admin)
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setAdmin(null)
  }

  const forgotPassword = async (email: string) => {
    await adminApi.forgotPassword(email)
  }

  const value = {
    admin,
    isLoading,
    login,
    logout,
    forgotPassword,
    isAuthenticated: !!admin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}