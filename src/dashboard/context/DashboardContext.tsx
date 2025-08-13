import { createContext, useContext, ReactNode } from 'react';
import { useTrades, Trade } from '../hooks/useTrades';
import { useAIAnalysis, AIAnalysis } from '../hooks/useAIAnalysis';

interface DashboardContextType {
  trades: Trade[];
  loading: boolean;
  addTrade: (tradeData: any) => Promise<any>;
  updateTrade: (tradeId: string, tradeData: any) => Promise<any>;
  deleteTrade: (tradeId: string) => Promise<void>;
  analyzeTradeWithAI: (tradeId: string) => Promise<any>;
  refetch: () => void;
  analyses: AIAnalysis[];
  getAnalysisForTrade: (tradeId: string) => AIAnalysis | undefined;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const tradesState = useTrades();
  const aiAnalysisState = useAIAnalysis();

  const value = {
    ...tradesState,
    ...aiAnalysisState,
    loading: tradesState.loading || aiAnalysisState.loading,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}; 