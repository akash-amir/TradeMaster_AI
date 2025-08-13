/**
 * Backend AI Analysis Hook
 * Manages AI-powered trading analysis with the Trade Master AI backend
 */

import { useState, useCallback } from 'react';
import { backendApi } from '@/integrations/backend/client';
import type { 
  OverallInsight,
  UsageStats,
  PatternInsight,
  AnalysisJob,
  ApiResponse 
} from '@/integrations/backend/types';

interface AIState {
  isLoading: boolean;
  error: string | null;
  overallInsight: OverallInsight | null;
  usageStats: UsageStats | null;
  patternInsights: PatternInsight[] | null;
  analysisHistory: any[] | null;
}

interface UseBackendAIReturn extends AIState {
  generateOverallInsight: (limit?: number, immediate?: boolean) => Promise<OverallInsight | AnalysisJob | null>;
  getAnalysisHistory: (page?: number, limit?: number) => Promise<void>;
  getUsageStats: () => Promise<void>;
  getPatternInsights: (timeframe?: string) => Promise<void>;
  batchAnalyzeTrades: (tradeIds: string[], priority?: string) => Promise<AnalysisJob | null>;
  clearError: () => void;
}

export const useBackendAI = (): UseBackendAIReturn => {
  const [state, setState] = useState<AIState>({
    isLoading: false,
    error: null,
    overallInsight: null,
    usageStats: null,
    patternInsights: null,
    analysisHistory: null,
  });

  const generateOverallInsight = useCallback(async (
    limit = 5, 
    immediate = false
  ): Promise<OverallInsight | AnalysisJob | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await backendApi.getOverallInsight({ limit, immediate });
      
      if (response.success && response.data) {
        if (immediate && response.data.insight) {
          // Immediate analysis returned
          const insight = response.data.insight;
          setState(prev => ({
            ...prev,
            overallInsight: insight,
            isLoading: false,
          }));
          return insight;
        } else if (response.data.jobId) {
          // Analysis queued
          setState(prev => ({ ...prev, isLoading: false }));
          return {
            jobId: response.data.jobId,
            status: 'waiting',
            estimatedTime: response.data.estimatedTime,
          } as AnalysisJob;
        }
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Failed to generate overall insight',
        }));
      }
      return null;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to generate overall insight';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return null;
    }
  }, []);

  const getAnalysisHistory = useCallback(async (page = 1, limit = 10) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await backendApi.getAnalysisHistory({ page, limit });
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          analysisHistory: response.data.analyses,
          isLoading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Failed to fetch analysis history',
        }));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch analysis history';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const getUsageStats = useCallback(async () => {
    try {
      const response = await backendApi.getUsageStats();
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          usageStats: response.data,
        }));
      }
    } catch (error: any) {
      console.error('Failed to fetch usage stats:', error);
    }
  }, []);

  const getPatternInsights = useCallback(async (timeframe = '30d') => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await backendApi.getPatternInsights(timeframe);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          patternInsights: response.data.patterns,
          isLoading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Failed to fetch pattern insights',
        }));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch pattern insights';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const batchAnalyzeTrades = useCallback(async (
    tradeIds: string[], 
    priority = 'normal'
  ): Promise<AnalysisJob | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await backendApi.batchAnalyze(tradeIds, priority);
      
      if (response.success && response.data) {
        setState(prev => ({ ...prev, isLoading: false }));
        return {
          jobId: response.data.jobIds?.[0] || 'batch-job',
          status: 'waiting',
          estimatedTime: response.data.estimatedTime,
        } as AnalysisJob;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Failed to start batch analysis',
        }));
        return null;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to start batch analysis';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    generateOverallInsight,
    getAnalysisHistory,
    getUsageStats,
    getPatternInsights,
    batchAnalyzeTrades,
    clearError,
  };
};
