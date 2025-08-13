/**
 * API Configuration
 * Centralized configuration for switching between Supabase and Backend APIs
 */

// API Backend Selection
export const API_CONFIG = {
  // Set to 'backend' to use the new Node.js backend, 'supabase' for existing Supabase
  provider: (import.meta.env.VITE_API_PROVIDER as 'backend' | 'supabase') || 'backend',
  
  // Backend API Configuration
  backend: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 30000,
  },
  
  // Supabase Configuration (fallback)
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://tndgcypaguwxeizryfoj.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuZGdjeXBhZ3V3eGVpenJ5Zm9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzYwMDMsImV4cCI6MjA2NTk1MjAwM30.bcaJXkjYtXJefotEf-k4hmdDa3IKGsdMFswHA8wzLHs',
  },
};

// Feature flags based on API provider
export const FEATURES = {
  // AI Analysis features (only available with backend)
  aiAnalysis: API_CONFIG.provider === 'backend',
  batchAnalysis: API_CONFIG.provider === 'backend',
  overallInsights: API_CONFIG.provider === 'backend',
  patternInsights: API_CONFIG.provider === 'backend',
  
  // Advanced features
  subscriptionPlans: API_CONFIG.provider === 'backend',
  usageTracking: API_CONFIG.provider === 'backend',
  queuedProcessing: API_CONFIG.provider === 'backend',
  
  // Legacy features (Supabase)
  priceScaling: API_CONFIG.provider === 'supabase', // Only needed for Supabase numeric limitations
};

// Export current provider for conditional imports
export const useBackendAPI = API_CONFIG.provider === 'backend';
export const useSupabaseAPI = API_CONFIG.provider === 'supabase';

// Environment validation
export const validateApiConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (API_CONFIG.provider === 'backend') {
    if (!API_CONFIG.backend.baseUrl) {
      errors.push('VITE_API_URL is required when using backend provider');
    }
  } else if (API_CONFIG.provider === 'supabase') {
    if (!API_CONFIG.supabase.url) {
      errors.push('VITE_SUPABASE_URL is required when using supabase provider');
    }
    if (!API_CONFIG.supabase.anonKey) {
      errors.push('VITE_SUPABASE_ANON_KEY is required when using supabase provider');
    }
  } else {
    errors.push('Invalid API provider. Must be either "backend" or "supabase"');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
