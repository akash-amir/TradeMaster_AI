import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tradeId, tradePair, entryPrice, exitPrice, lotSize, timeframe, tradeType, notes } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create analysis prompt
    const prompt = `As a professional trading analyst AI, analyze this trade and provide detailed insights:

Trade Details:
- Pair: ${tradePair}
- Entry Price: ${entryPrice}
- Exit Price: ${exitPrice || 'Still open'}
- Lot Size: ${lotSize}
- Timeframe: ${timeframe}
- Trade Type: ${tradeType}
- Notes: ${notes || 'None'}

Please provide:
1. Technical analysis of the entry and exit points
2. Risk management assessment
3. Psychology insights based on the trade execution
4. Specific recommendations for improvement
5. Overall trade rating (1-10)

Format your response as a comprehensive analysis that helps the trader improve their strategy.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert trading analyst AI that provides detailed, actionable insights to help traders improve their performance. Be specific, constructive, and educational.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const analysisText = aiResponse.choices[0].message.content;

    // Store analysis in database
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: analysis, error } = await supabaseService
      .from('ai_analysis')
      .insert({
        trade_id: tradeId,
        analysis_text: analysisText,
        insights: {
          technical_analysis: true,
          risk_assessment: true,
          psychology_insights: true,
          recommendations: true
        },
        recommendations: ['Analyze market conditions before entry', 'Implement proper risk management', 'Review trade psychology patterns'],
        confidence_score: 0.85
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to store analysis');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      analysis: analysisText,
      analysisId: analysis.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-trade function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});