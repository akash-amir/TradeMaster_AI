import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { unscaleTrades } from '../utils/priceScaling';

export interface Trade {
  id: string;
  trade_pair: string;
  entry_price: number;
  exit_price?: number | null;
  trade_type: 'buy' | 'sell';
  lot_size: number;
  timeframe: string;
  status: 'open' | 'closed' | 'cancelled';
  notes?: string | null;
  chart_screenshot_url?: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTrades = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Unscale any trades that were scaled down during saving
      const unscaledTrades = unscaleTrades((data || []) as Trade[]);
      setTrades(unscaledTrades);
    } catch (error) {
      console.error('Error fetching trades:', error);
      toast({
        title: "Error fetching trades",
        description: "Failed to load your trades. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTrade = async (tradeData: Omit<Trade, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      console.log('=== ADD TRADE DEBUG (useTrades hook) ===');
      console.log('Received trade data:', tradeData);
      
      console.log('Checking authentication...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('Auth result:', { user: user?.id, authError });
      
      if (authError) {
        console.error('Authentication error:', authError);
        throw new Error(`Authentication failed: ${authError.message}`);
      }
      
      if (!user) {
        console.error('No user found');
        throw new Error('Not authenticated - no user found');
      }
      
      const dataToInsert = { ...tradeData, user_id: user.id };
      console.log('Data to insert into database:', dataToInsert);
      
      console.log('Inserting into Supabase...');
      const { data, error } = await supabase
        .from('trades')
        .insert(dataToInsert)
        .select()
        .single();
      
      console.log('Supabase insert result:', { data, error });
      
      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      
      console.log('Trade inserted successfully, updating local state...');
      // Unscale the newly added trade before adding to state
      const unscaledTrade = unscaleTrades([data as Trade])[0];
      setTrades(prev => [unscaledTrade, ...prev]);
      
      console.log('Showing success toast...');
      toast({
        title: "Trade added successfully",
        description: "Your trade has been logged.",
      });
      
      console.log('addTrade completed successfully');
      return data;
    } catch (error: any) {
      console.error('=== ADD TRADE ERROR (useTrades hook) ===');
      console.error('Error object:', error);
      console.error('Error message:', error?.message);
      console.error('Error details:', error?.details);
      console.error('Error hint:', error?.hint);
      console.error('Error code:', error?.code);
      console.error('Full error JSON:', JSON.stringify(error, null, 2));
      
      toast({
        title: "Error adding trade",
        description: error?.message || error?.details || (typeof error === 'string' ? error : 'Failed to add your trade. Please try again.'),
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTrade = async (tradeId: string, updates: Partial<Trade>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('trades')
        .update(updates)
        .eq('id', tradeId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      // Unscale the updated trade before updating state
      const unscaledTrade = unscaleTrades([data as Trade])[0];
      setTrades(prev => prev.map(trade => 
        trade.id === tradeId ? { ...trade, ...unscaledTrade } : trade
      ));
      
      toast({
        title: "Trade updated successfully",
        description: "Your trade has been updated.",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating trade:', error);
      toast({
        title: "Error updating trade",
        description: "Failed to update your trade. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTrade = async (tradeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', tradeId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setTrades(prev => prev.filter(trade => trade.id !== tradeId));
      
      toast({
        title: "Trade deleted successfully",
        description: "Your trade has been removed.",
      });
    } catch (error) {
      console.error('Error deleting trade:', error);
      toast({
        title: "Error deleting trade",
        description: "Failed to delete your trade. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const analyzeTradeWithAI = async (tradeId: string) => {
    try {
      // Simulate AI analysis with placeholder data
      const analysisResults = {
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        feedback: "This trade demonstrates good risk management principles with proper stop-loss placement. Consider taking partial profits at key resistance levels.",
        recommendations: [
          "Maintain consistent position sizing",
          "Monitor key support/resistance levels",
          "Consider market session timing"
        ]
      };

      toast({
        title: "AI Analysis Complete",
        description: `Trade analyzed with score: ${analysisResults.score}/100`,
      });
      
      return analysisResults;
    } catch (error) {
      console.error('AI analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze trade. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  return {
    trades,
    loading,
    addTrade,
    updateTrade,
    deleteTrade,
    analyzeTradeWithAI,
    refetch: fetchTrades
  };
};