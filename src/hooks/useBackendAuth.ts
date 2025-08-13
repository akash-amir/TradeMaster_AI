/**
 * Backend Authentication Hook
 * Manages authentication with the Trade Master AI backend
 */

import { useState, useEffect, useCallback } from 'react';
import { backendApi } from '@/integrations/backend/client';
import type { User, LoginRequest, RegisterRequest, ApiResponse } from '@/integrations/backend/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface UseBackendAuthReturn extends AuthState {
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

export const useBackendAuth = (): UseBackendAuthReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Check if user is already authenticated on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (!backendApi.isAuthenticated()) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const response = await backendApi.getProfile();
        if (response.success && response.data?.user) {
          setState({
            user: response.data.user,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          // Token might be invalid, clear it
          await backendApi.logout();
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
        }
      } catch (error: any) {
        console.error('Failed to initialize auth:', error);
        await backendApi.logout();
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    };

    initializeAuth();
  }, []);

  // Listen for unauthorized events
  useEffect(() => {
    const handleUnauthorized = () => {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: 'Session expired. Please log in again.',
      });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await backendApi.login(credentials);
      
      if (response.success && response.data?.user) {
        setState({
          user: response.data.user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        return true;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Login failed',
        }));
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await backendApi.register(data);
      
      if (response.success && response.data?.user) {
        setState({
          user: response.data.user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        return true;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Registration failed',
        }));
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await backendApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>): Promise<boolean> => {
    if (!state.user) return false;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await backendApi.updateProfile(data);
      
      if (response.success && response.data?.user) {
        setState(prev => ({
          ...prev,
          user: response.data.user,
          isLoading: false,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Profile update failed',
        }));
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Profile update failed. Please try again.';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, [state.user]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await backendApi.changePassword(currentPassword, newPassword);
      
      if (response.success) {
        setState(prev => ({ ...prev, isLoading: false }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Password change failed',
        }));
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Password change failed. Please try again.';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!backendApi.isAuthenticated()) return;

    try {
      const response = await backendApi.getProfile();
      if (response.success && response.data?.user) {
        setState(prev => ({
          ...prev,
          user: response.data.user,
        }));
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshProfile,
    clearError,
  };
};
