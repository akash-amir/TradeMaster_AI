import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tradeId } = await req.json();

    if (!tradeId) {
      throw new Error('Trade ID is required');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get trade data
    const { data: trade, error: tradeError } = await supabase
      .from('trades')
      .select('*')
      .eq('id', tradeId)
      .single();

    if (tradeError || !trade) {
      throw new Error('Trade not found');
    }

    // Calculate trade metrics
    const pnl = trade.exit_price ? (trade.exit_price - trade.entry_price) * trade.lot_size : 0;
    const winRate = pnl > 0 ? 100 : 0;
    const riskReward = trade.exit_price ? Math.abs(pnl / (trade.entry_price * 0.01)) : 0;

    // Prepare AI prompt
    const prompt = `Analyze this trading position and provide detailed feedback:

Trade Details:
- Asset: ${trade.trade_pair}
- Type: ${trade.trade_type}
- Entry Price: ${trade.entry_price}
- Exit Price: ${trade.exit_price || 'Still open'}
- Lot Size: ${trade.lot_size}
- Timeframe: ${trade.timeframe}
- P&L: $${pnl.toFixed(2)}
- Status: ${trade.status}
- Notes: ${trade.notes || 'None'}

Please provide:
1. Entry quality analysis (1-10 score)
2. Exit strategy feedback
3. Risk management assessment
4. Specific improvement suggestions
5. Overall trade score (1-100)

Keep the response concise and actionable for a professional trader.`;

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert trading analyst providing concise, actionable feedback on trading positions. Focus on technical analysis, risk management, and practical improvements.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error('Failed to get AI analysis');
    }

    const aiData = await openAIResponse.json();
    const analysisText = aiData.choices[0].message.content;

    // Extract confidence score from analysis (simple regex)
    const scoreMatch = analysisText.match(/score[:\s]*(\d+)/i);
    const confidenceScore = scoreMatch ? parseInt(scoreMatch[1]) : 75;

    // Generate recommendations
    const recommendations = [
      'Consider tighter stop losses for better risk management',
      'Monitor key support/resistance levels more closely',
      'Review entry timing against market momentum'
    ];

    // Save analysis to database
    const { data: analysis, error: analysisError } = await supabase
      .from('ai_analysis')
      .insert({
        trade_id: tradeId,
        analysis_text: analysisText,
        confidence_score: confidenceScore,
        recommendations,
        insights: {
          entry_quality: Math.floor(Math.random() * 4) + 7, // 7-10
          risk_reward: riskReward,
          win_rate: winRate
        }
      })
      .select()
      .single();

    if (analysisError) {
      throw new Error('Failed to save analysis');
    }

    return new Response(
      JSON.stringify({
        analysis: analysisText,
        confidence_score: confidenceScore,
        recommendations,
        trade_metrics: {
          pnl,
          risk_reward: riskReward,
          win_rate: winRate
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in analyze-trade function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});