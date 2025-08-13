/**
 * Backend Trades Hook
 * Manages trade operations with the Trade Master AI backend
 */

import { useState, useEffect, useCallback } from 'react';
import { backendApi } from '@/integrations/backend/client';
import type { 
  Trade, 
  TradeCreateRequest, 
  TradeUpdateRequest, 
  TradeFilters,
  TradingStatistics,
  ApiResponse,
  TradeFormData 
} from '@/integrations/backend/types';
import type { Trade as ClientTrade } from '@/integrations/backend/client';

interface TradesState {
  trades: (Trade | ClientTrade)[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  } | null;
  statistics: TradingStatistics | null;
}

interface UseBackendTradesReturn extends TradesState {
  fetchTrades: (filters?: TradeFilters) => Promise<void>;
  getTrade: (id: string) => Promise<Trade | null>;
  addTrade: (tradeData: TradeFormData | TradeCreateRequest) => Promise<boolean>;
  updateTrade: (id: string, tradeData: TradeFormData | TradeUpdateRequest) => Promise<boolean>;
  deleteTrade: (id: string) => Promise<boolean>;
  analyzeTrade: (id: string, immediate?: boolean) => Promise<any>;
  fetchStatistics: () => Promise<void>;
  clearError: () => void;
  refreshTrades: () => Promise<void>;
}

// Helper function to convert frontend form data to backend format
const convertFormDataToBackend = (formData: TradeFormData): TradeCreateRequest => {
  // Combine date and time for entryTime
  const entryTime = formData.date && formData.time 
    ? new Date(`${formData.date}T${formData.time}`).toISOString()
    : new Date().toISOString();

  return {
    tradePair: formData.asset,
    tradeType: formData.positionType,
    entryPrice: parseFloat(formData.entryPrice),
    exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : undefined,
    stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : undefined,
    takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : undefined,
    positionSize: parseFloat(formData.lotSize),
    timeframe: formData.timeframe,
    entryTime,
    strategy: formData.strategy,
    notes: formData.notes,
    tags: formData.tags,
  };
};

// Helper function to convert backend trade to frontend format (for compatibility)
const convertBackendToForm = (trade: Trade): TradeFormData => {
  const entryDate = new Date(trade.entryTime);
  
  return {
    title: `${trade.tradePair} ${trade.tradeType}`, // Generate title for frontend
    asset: trade.tradePair,
    date: entryDate.toISOString().split('T')[0],
    time: entryDate.toTimeString().split(' ')[0].substring(0, 5),
    entryPrice: trade.entryPrice.toString(),
    exitPrice: trade.exitPrice?.toString(),
    stopLoss: trade.stopLoss?.toString(),
    takeProfit: trade.takeProfit?.toString(),
    positionType: trade.tradeType,
    lotSize: trade.positionSize.toString(),
    timeframe: trade.timeframe,
    notes: trade.notes,
    strategy: trade.strategy,
    tags: trade.tags,
  };
};

export const useBackendTrades = (): UseBackendTradesReturn => {
  const [state, setState] = useState<TradesState>({
    trades: [],
    isLoading: false,
    error: null,
    pagination: null,
    statistics: null,
  });

  const fetchTrades = useCallback(async (filters?: TradeFilters) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await backendApi.getTrades(filters);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          trades: response.data.trades,
          pagination: response.data.pagination,
          isLoading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Failed to fetch trades',
        }));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch trades';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const getTrade = useCallback(async (id: string): Promise<Trade | null> => {
    try {
      const response = await backendApi.getTrade(id);
      
      if (response.success && response.data?.trade) {
        return response.data.trade;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to fetch trade',
        }));
        return null;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch trade';
      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));
      return null;
    }
  }, []);

  const addTrade = useCallback(async (tradeData: TradeFormData | TradeCreateRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Convert form data if needed
      const backendData = 'asset' in tradeData 
        ? convertFormDataToBackend(tradeData as TradeFormData)
        : tradeData as TradeCreateRequest;

      const response = await backendApi.createTrade(backendData);
      
      if (response.success && response.data?.trade) {
        setState(prev => ({
          ...prev,
          trades: [response.data.trade, ...prev.trades],
          statistics: response.data.statistics || prev.statistics,
          isLoading: false,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Failed to create trade',
        }));
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create trade';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  const updateTrade = useCallback(async (id: string, tradeData: TradeFormData | TradeUpdateRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Convert form data if needed
      let backendData: TradeUpdateRequest;
      
      if ('asset' in tradeData) {
        const formData = tradeData as TradeFormData;
        backendData = {
          exitPrice: formData.exitPrice ? parseFloat(formData.exitPrice) : undefined,
          stopLoss: formData.stopLoss ? parseFloat(formData.stopLoss) : undefined,
          takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : undefined,
          notes: formData.notes,
          tags: formData.tags,
        };
        
        // Add exitTime if exitPrice is provided
        if (formData.exitPrice) {
          backendData.exitTime = new Date().toISOString();
          backendData.status = 'closed';
        }
      } else {
        backendData = tradeData as TradeUpdateRequest;
      }

      const response = await backendApi.updateTrade(id, backendData);
      
      if (response.success && response.data?.trade) {
        setState(prev => ({
          ...prev,
          trades: prev.trades.map(trade => 
            trade._id === id ? response.data.trade : trade
          ),
          statistics: response.data.statistics || prev.statistics,
          isLoading: false,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Failed to update trade',
        }));
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update trade';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  const deleteTrade = useCallback(async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await backendApi.deleteTrade(id);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          trades: prev.trades.filter(trade => trade._id !== id),
          isLoading: false,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Failed to delete trade',
        }));
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete trade';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  const analyzeTrade = useCallback(async (id: string, immediate = false) => {
    try {
      const response = await backendApi.analyzeTrade(id, immediate);
      
      if (response.success) {
        // If immediate analysis, update the trade in state
        if (response.data?.trade) {
          setState(prev => ({
            ...prev,
            trades: prev.trades.map(trade => 
              trade._id === id ? response.data.trade : trade
            ),
          }));
        }
        return response.data;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to analyze trade',
        }));
        return null;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to analyze trade';
      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));
      return null;
    }
  }, []);

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await backendApi.getTradingStats();
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          statistics: response.data,
        }));
      }
    } catch (error: any) {
      console.error('Failed to fetch statistics:', error);
    }
  }, []);

  const refreshTrades = useCallback(async () => {
    await fetchTrades();
  }, [fetchTrades]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Fetch trades on mount
  useEffect(() => {
    fetchTrades();
    fetchStatistics();
  }, [fetchTrades, fetchStatistics]);

  return {
    ...state,
    fetchTrades,
    getTrade,
    addTrade,
    updateTrade,
    deleteTrade,
    analyzeTrade,
    fetchStatistics,
    clearError,
    refreshTrades,
  };
};
