import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AIAnalysis {
  id: string;
  trade_id: string;
  analysis_text: string;
  confidence_score?: number;
  recommendations?: string[];
  insights?: any;
  created_at: string;
}

export const useAIAnalysis = () => {
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_analysis')
        .select(`
          *,
          trades:trade_id (
            trade_pair,
            entry_price,
            exit_price,
            trade_type
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error('Error fetching AI analyses:', error);
      toast({
        title: "Error fetching analyses",
        description: "Failed to load AI analyses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAnalysisForTrade = (tradeId: string) => {
    return analyses.find(analysis => analysis.trade_id === tradeId);
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  return {
    analyses,
    loading,
    getAnalysisForTrade,
    refetch: fetchAnalyses
  };
};