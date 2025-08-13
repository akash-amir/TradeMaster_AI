/**
 * Unified Trades Hook
 * Automatically switches between Backend and Supabase APIs based on configuration
 */

import { useBackendAPI } from '@/config/api';
import { useBackendTrades } from './useBackendTrades';
import { useTrades as useSupabaseTrades } from '../dashboard/hooks/useTrades';

// Re-export the appropriate hook based on configuration
export const useTrades = () => {
  if (useBackendAPI) {
    return useBackendTrades();
  } else {
    // Use the existing Supabase trades hook
    return useSupabaseTrades();
  }
};

// Export individual hooks for direct access if needed
export { useBackendTrades } from './useBackendTrades';
export { useTrades as useSupabaseTrades } from '../dashboard/hooks/useTrades';
