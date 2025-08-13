/**
 * AI Service - OpenRouter Qwen3 Integration
 * Handles all AI analysis requests for trading data
 */

const axios = require('axios');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseURL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    this.model = 'qwen/qwen-2.5-72b-instruct';
    
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not provided in environment variables');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://trademaster.ai',
        'X-Title': 'TradeMaster AI'
      },
      timeout: 30000 // 30 seconds timeout
    });
  }

  /**
   * Generate AI analysis for a single trade
   */
  async analyzeTrade(trade) {
    try {
      logger.aiRequest('Starting trade analysis', { 
        tradeId: trade._id,
        tradePair: trade.tradePair,
        tradeType: trade.tradeType
      });

      const prompt = this.buildTradeAnalysisPrompt(trade);
      
      const response = await this.client.post('/chat/completions', {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert trading analyst and psychology coach. Analyze trading decisions with focus on technical analysis, risk management, and trading psychology. Provide actionable insights and recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
        top_p: 0.9
      });

      const aiResponse = response.data.choices[0].message.content;
      const analysis = this.parseTradeAnalysis(aiResponse);

      logger.aiResponse('Trade analysis completed', {
        tradeId: trade._id,
        analysisLength: aiResponse.length,
        score: analysis.score
      });

      return analysis;

    } catch (error) {
      logger.aiError('Trade analysis failed', {
        tradeId: trade._id,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  /**
   * Generate dashboard insight for quick overview
   */
  async generateDashboardInsight(trades, user) {
    try {
      logger.aiRequest('Starting dashboard insight generation', {
        userId: user._id,
        tradeCount: trades.length
      });

      const prompt = this.buildDashboardInsightPrompt(trades, user);
      
      const response = await this.client.post('/chat/completions', {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert trading analyst providing concise, actionable insights for a trading dashboard. Focus on recent performance, key patterns, and immediate actionable advice. Keep responses professional yet encouraging.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
        top_p: 0.9
      });

      const aiResponse = response.data.choices[0].message.content;
      const insight = this.parseDashboardInsight(aiResponse);

      logger.aiResponse('Dashboard insight generated', {
        userId: user._id,
        insightLength: aiResponse.length,
        score: insight.score
      });

      return insight;

    } catch (error) {
      logger.aiError('Dashboard insight generation failed', {
        userId: user._id,
        error: error.message,
        status: error.response?.status
      });
      throw new Error(`Dashboard insight generation failed: ${error.message}`);
    }
  }

  /**
   * Generate overall trading insights from multiple trades
   */
  async generateOverallInsight(trades, user) {
    try {
      logger.aiRequest('Starting overall insight generation', {
        userId: user._id,
        tradeCount: trades.length
      });

      const prompt = this.buildOverallInsightPrompt(trades, user);
      
      const response = await this.client.post('/chat/completions', {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a senior trading coach and behavioral analyst. Analyze a trader\'s performance patterns, psychology, and provide comprehensive insights for improvement. Focus on identifying strengths, weaknesses, patterns, and actionable recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.8,
        top_p: 0.9
      });

      const aiResponse = response.data.choices[0].message.content;
      const insight = this.parseOverallInsight(aiResponse);

      logger.aiResponse('Overall insight generated', {
        userId: user._id,
        insightLength: aiResponse.length
      });

      return insight;

    } catch (error) {
      logger.aiError('Overall insight generation failed', {
        userId: user._id,
        error: error.message,
        status: error.response?.status
      });
      throw new Error(`Overall insight generation failed: ${error.message}`);
    }
  }

  /**
   * Build prompt for individual trade analysis
   */
  buildTradeAnalysisPrompt(trade) {
    const tradeData = {
      pair: trade.tradePair,
      type: trade.tradeType,
      entryPrice: trade.entryPrice,
      exitPrice: trade.exitPrice,
      stopLoss: trade.stopLoss,
      takeProfit: trade.takeProfit,
      positionSize: trade.positionSize,
      timeframe: trade.timeframe,
      status: trade.status,
      pnl: trade.pnl,
      riskRewardRatio: trade.riskRewardRatio,
      strategy: trade.strategy,
      notes: trade.notes,
      marketCondition: trade.marketCondition,
      duration: trade.durationHours
    };

    return `
Analyze this trading decision and provide comprehensive insights:

TRADE DETAILS:
- Trading Pair: ${tradeData.pair}
- Trade Type: ${tradeData.type}
- Entry Price: ${tradeData.entryPrice}
- Exit Price: ${tradeData.exitPrice || 'Still Open'}
- Stop Loss: ${tradeData.stopLoss || 'Not Set'}
- Take Profit: ${tradeData.takeProfit || 'Not Set'}
- Position Size: ${tradeData.positionSize}
- Timeframe: ${tradeData.timeframe}
- Status: ${tradeData.status}
- P&L: ${tradeData.pnl || 'N/A'}
- Risk/Reward Ratio: ${tradeData.riskRewardRatio || 'N/A'}
- Strategy: ${tradeData.strategy || 'Not specified'}
- Market Condition: ${tradeData.marketCondition || 'Unknown'}
- Trade Duration: ${tradeData.duration ? tradeData.duration + ' hours' : 'Ongoing'}
- Notes: ${tradeData.notes || 'No additional notes'}

Please provide your analysis in the following JSON format:
{
  "summary": "Brief 2-3 sentence summary of the trade analysis",
  "score": 85,
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "riskAssessment": {
    "level": "medium",
    "factors": ["Risk factor 1", "Risk factor 2"]
  },
  "psychologyInsights": {
    "emotionalState": "confident",
    "biases": ["Bias 1", "Bias 2"],
    "suggestions": ["Psychology suggestion 1", "Psychology suggestion 2"]
  },
  "confidence": 90
}

Focus on:
1. Technical analysis quality
2. Risk management effectiveness
3. Position sizing appropriateness
4. Entry/exit timing
5. Psychological factors and biases
6. Areas for improvement
7. What was done well

Provide actionable, specific feedback that will help improve future trading decisions.
`;
  }

  /**
   * Build prompt for dashboard insights
   */
  buildDashboardInsightPrompt(trades, user) {
    const stats = this.calculateTradingStats(trades);
    const recentPerformance = trades.slice(0, 3); // Last 3 trades
    
    return `
Analyze this trader's recent performance and provide a concise dashboard insight:

**TRADER PROFILE:**
- Experience Level: ${user.tradingExperience || 'Intermediate'}
- Primary Strategy: ${user.tradingStrategy || 'Mixed'}
- Risk Tolerance: ${user.riskTolerance || 'Medium'}

**RECENT TRADES (Last ${trades.length}):**
${trades.map((trade, i) => `
${i + 1}. ${trade.tradePair} ${trade.tradeType?.toUpperCase()}
   Entry: $${trade.entryPrice} | Exit: ${trade.exitPrice ? `$${trade.exitPrice}` : 'Open'}
   Status: ${trade.status} | P&L: ${trade.pnl ? `$${trade.pnl}` : 'Pending'}
   Result: ${trade.result || 'Pending'}`).join('')}

**PERFORMANCE METRICS:**
- Win Rate: ${stats.winRate}%
- Average P&L: $${stats.avgPnL}
- Best Trade: $${stats.bestTrade}
- Worst Trade: $${stats.worstTrade}
- Risk Management: ${stats.stopLossUsage}% stop loss usage

**ANALYSIS REQUEST:**
Provide a JSON response with this exact structure:
{
  "title": "Brief performance title (e.g., 'Strong Performance This Week')",
  "content": "2-3 sentences highlighting key insights, patterns, and one actionable recommendation",
  "score": 0-100 (overall recent performance score),
  "type": "positive" | "neutral" | "negative" | "warning",
  "keyMetric": "Most important metric to highlight",
  "suggestion": "One specific actionable suggestion"
}

Focus on:
1. Recent performance trend
2. Most significant pattern or behavior
3. One specific improvement suggestion
4. Encouraging but realistic tone
`;
  }

  /**
   * Build prompt for overall trading insights
   */
  buildOverallInsightPrompt(trades, user) {
    const tradesSummary = trades.map(trade => ({
      pair: trade.tradePair,
      type: trade.tradeType,
      result: trade.result,
      pnl: trade.pnl,
      riskReward: trade.riskRewardRatio,
      duration: trade.durationHours,
      strategy: trade.strategy,
      hasStopLoss: !!trade.stopLoss,
      hasTakeProfit: !!trade.takeProfit
    }));

    const stats = this.calculateTradingStats(trades);

    return `
Analyze this trader's overall performance and provide comprehensive insights:

TRADER PROFILE:
- Experience Level: ${user.tradingExperience}
- Preferred Markets: ${user.preferredMarkets?.join(', ') || 'Not specified'}
- Risk Tolerance: ${user.preferences?.riskTolerance || 'Not specified'}
- Total Trades Analyzed: ${trades.length}

RECENT TRADING PERFORMANCE:
${JSON.stringify(tradesSummary, null, 2)}

PERFORMANCE STATISTICS:
- Win Rate: ${stats.winRate}%
- Average P&L: ${stats.avgPnL}
- Best Trade: ${stats.bestTrade}
- Worst Trade: ${stats.worstTrade}
- Average Risk/Reward: ${stats.avgRiskReward}
- Stop Loss Usage: ${stats.stopLossUsage}%
- Take Profit Usage: ${stats.takeProfitUsage}%
- Most Traded Pairs: ${stats.mostTradedPairs.join(', ')}
- Average Trade Duration: ${stats.avgDuration} hours

Please provide comprehensive insights in the following JSON format:
{
  "overallScore": 75,
  "tradingStyle": "Description of trading style and approach",
  "strengths": ["Major strength 1", "Major strength 2", "Major strength 3"],
  "weaknesses": ["Major weakness 1", "Major weakness 2", "Major weakness 3"],
  "patterns": {
    "positive": ["Positive pattern 1", "Positive pattern 2"],
    "negative": ["Negative pattern 1", "Negative pattern 2"]
  },
  "psychologyProfile": {
    "dominantTraits": ["Trait 1", "Trait 2"],
    "emotionalTendencies": ["Tendency 1", "Tendency 2"],
    "biases": ["Bias 1", "Bias 2"],
    "mentalStrengths": ["Strength 1", "Strength 2"]
  },
  "riskManagement": {
    "assessment": "good/average/poor",
    "improvements": ["Improvement 1", "Improvement 2"]
  },
  "recommendations": {
    "immediate": ["Immediate action 1", "Immediate action 2"],
    "shortTerm": ["Short-term goal 1", "Short-term goal 2"],
    "longTerm": ["Long-term development 1", "Long-term development 2"]
  },
  "focusAreas": ["Area 1", "Area 2", "Area 3"],
  "confidence": 85
}

Provide deep, actionable insights that will help this trader improve their performance and psychological approach to trading.
`;
  }

  /**
   * Parse AI response for trade analysis
   */
  parseTradeAnalysis(response) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || '',
          score: Math.min(Math.max(parsed.score || 50, 0), 100),
          strengths: parsed.strengths || [],
          weaknesses: parsed.weaknesses || [],
          recommendations: parsed.recommendations || [],
          riskAssessment: {
            level: parsed.riskAssessment?.level || 'medium',
            factors: parsed.riskAssessment?.factors || []
          },
          psychologyInsights: {
            emotionalState: parsed.psychologyInsights?.emotionalState || 'neutral',
            biases: parsed.psychologyInsights?.biases || [],
            suggestions: parsed.psychologyInsights?.suggestions || []
          },
          confidence: Math.min(Math.max(parsed.confidence || 70, 0), 100)
        };
      }
    } catch (error) {
      logger.aiError('Failed to parse trade analysis JSON', { error: error.message });
    }

    // Fallback: create basic analysis from text
    return {
      summary: response.substring(0, 500),
      score: 50,
      strengths: ['Analysis completed'],
      weaknesses: ['Detailed parsing unavailable'],
      recommendations: ['Review trade manually'],
      riskAssessment: { level: 'medium', factors: [] },
      psychologyInsights: { emotionalState: 'neutral', biases: [], suggestions: [] },
      confidence: 50
    };
  }

  /**
   * Parse AI response for dashboard insights
   */
  parseDashboardInsight(response) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          title: parsed.title || 'Trading Insight',
          content: parsed.content || 'Analysis completed successfully.',
          score: Math.min(Math.max(parsed.score || 50, 0), 100),
          type: parsed.type || 'neutral',
          keyMetric: parsed.keyMetric || '',
          suggestion: parsed.suggestion || 'Continue monitoring your trades.',
          generatedAt: new Date()
        };
      }
    } catch (error) {
      logger.aiError('Failed to parse dashboard insight JSON', { error: error.message });
    }

    // Fallback: create basic insight from text
    const content = response.substring(0, 300).replace(/[{}\[\]"]/g, '').trim();
    return {
      title: 'Recent Trading Analysis',
      content: content || 'Your recent trading activity has been analyzed. Continue monitoring your performance.',
      score: 50,
      type: 'neutral',
      keyMetric: 'Performance Review',
      suggestion: 'Keep tracking your trades for better insights.',
      generatedAt: new Date()
    };
  }

  /**
   * Parse AI response for overall insights
   */
  parseOverallInsight(response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      logger.aiError('Failed to parse overall insight JSON', { error: error.message });
    }

    // Fallback
    return {
      overallScore: 50,
      tradingStyle: response.substring(0, 200),
      strengths: ['Analysis completed'],
      weaknesses: ['Detailed parsing unavailable'],
      patterns: { positive: [], negative: [] },
      psychologyProfile: { dominantTraits: [], emotionalTendencies: [], biases: [], mentalStrengths: [] },
      riskManagement: { assessment: 'average', improvements: [] },
      recommendations: { immediate: [], shortTerm: [], longTerm: [] },
      focusAreas: [],
      confidence: 50
    };
  }

  /**
   * Calculate trading statistics
   */
  calculateTradingStats(trades) {
    const closedTrades = trades.filter(t => t.status === 'closed' && t.pnl !== null);
    const winningTrades = closedTrades.filter(t => t.pnl > 0);
    
    return {
      winRate: closedTrades.length > 0 ? Math.round((winningTrades.length / closedTrades.length) * 100) : 0,
      avgPnL: closedTrades.length > 0 ? Math.round(closedTrades.reduce((sum, t) => sum + t.pnl, 0) / closedTrades.length * 100) / 100 : 0,
      bestTrade: closedTrades.length > 0 ? Math.max(...closedTrades.map(t => t.pnl)) : 0,
      worstTrade: closedTrades.length > 0 ? Math.min(...closedTrades.map(t => t.pnl)) : 0,
      avgRiskReward: trades.filter(t => t.riskRewardRatio).length > 0 ? 
        Math.round(trades.filter(t => t.riskRewardRatio).reduce((sum, t) => sum + t.riskRewardRatio, 0) / trades.filter(t => t.riskRewardRatio).length * 100) / 100 : 0,
      stopLossUsage: Math.round((trades.filter(t => t.stopLoss).length / trades.length) * 100),
      takeProfitUsage: Math.round((trades.filter(t => t.takeProfit).length / trades.length) * 100),
      mostTradedPairs: [...new Set(trades.map(t => t.tradePair))].slice(0, 3),
      avgDuration: trades.filter(t => t.durationHours).length > 0 ? 
        Math.round(trades.filter(t => t.durationHours).reduce((sum, t) => sum + t.durationHours, 0) / trades.filter(t => t.durationHours).length * 100) / 100 : 0
    };
  }
}

module.exports = new AIService();
