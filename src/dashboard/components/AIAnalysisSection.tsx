import { useState } from "react";
import { Brain, TrendingUp, AlertTriangle, Target, Zap, Star, BarChart3, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Trade {
  id: string;
  trade_pair: string;
  entry_price: number;
  exit_price?: number | null;
  trade_type: 'buy' | 'sell';
  lot_size: number;
  status: 'open' | 'closed' | 'cancelled';
  created_at: string;
}

interface AIAnalysis {
  id: string;
  trade_id: string;
  analysis_text: string;
  confidence_score?: number;
  recommendations?: string[];
  insights?: any;
  created_at: string;
}

interface AIAnalysisSectionProps {
  trades: Trade[];
  analyses: AIAnalysis[];
  className?: string;
}

export default function AIAnalysisSection({ trades, analyses, className }: AIAnalysisSectionProps) {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AIAnalysis | null>(null);

  // Sample AI insights for demonstration
  const sampleInsights = [
    {
      id: '1',
      type: 'success' as const,
      title: 'Excellent Risk Management',
      message: 'Your recent EUR/USD trades show consistent 2% risk allocation with proper stop-loss placement. This disciplined approach has contributed to a 73% win rate over the last 30 days.',
      score: 92,
      category: 'Risk Management',
      impact: 'High'
    },
    {
      id: '2',
      type: 'warning' as const,
      title: 'Entry Timing Optimization',
      message: 'Analysis shows you could improve entry timing by waiting for stronger confirmation signals. Consider using RSI divergence alongside your current strategy.',
      score: 68,
      category: 'Entry Strategy',
      impact: 'Medium'
    },
    {
      id: '3',
      type: 'improvement' as const,
      title: 'Market Session Analysis',
      message: 'Your performance is 23% better during London session compared to Asian session. Consider focusing more trades during high-volatility periods.',
      score: 81,
      category: 'Market Timing',
      impact: 'Medium'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <TrendingUp className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'improvement':
        return <Target className="h-5 w-5 text-secondary" />;
      default:
        return <Brain className="h-5 w-5 text-primary" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'default';
      case 'warning':
        return 'destructive';
      case 'improvement':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-secondary';
    return 'text-destructive';
  };

  const overallScore = sampleInsights.reduce((sum, insight) => sum + insight.score, 0) / sampleInsights.length;

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="animate-reveal">
        <h2 className="text-3xl font-bold text-foreground mb-2">AI Analysis & Insights</h2>
        <p className="text-muted-foreground text-lg">
          Advanced AI-powered analysis of your trading performance and strategy recommendations
        </p>
      </div>

      {/* Overall Performance Score */}
      <Card className="glass-card animate-reveal animate-reveal-delay-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Overall Trading Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(overallScore)}`}>
                {overallScore.toFixed(0)}
              </div>
              <div className="text-muted-foreground">Overall Score</div>
              <Progress value={overallScore} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-primary">
                {trades.filter(t => t.status === 'closed').length}
              </div>
              <div className="text-muted-foreground">Analyzed Trades</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2 text-secondary">
                {sampleInsights.length}
              </div>
              <div className="text-muted-foreground">Active Insights</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sampleInsights.map((insight, index) => (
          <Card 
            key={insight.id} 
            className={`glass-card transition-all duration-300 hover:shadow-lg animate-reveal animate-reveal-delay-${index + 2}`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {getIcon(insight.type)}
                  {insight.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={getBadgeVariant(insight.type)} className="text-xs">
                    {insight.category}
                  </Badge>
                  <div className={`text-lg font-bold ${getScoreColor(insight.score)}`}>
                    {insight.score}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {insight.message}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-secondary" />
                  <span className="text-sm text-muted-foreground">
                    Impact: {insight.impact}
                  </span>
                </div>
                <Progress value={insight.score} className="w-24 h-2" />
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Brain className="h-3 w-3" />
                  <span>AI Analysis • Generated recently</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy Recommendations */}
        <Card className="glass-card animate-reveal animate-reveal-delay-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Strategy Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <div className="font-medium text-success mb-1">Maintain Current Approach</div>
                <div className="text-sm text-muted-foreground">
                  Your risk management is excellent. Continue with 2% risk per trade.
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                <div className="font-medium text-secondary mb-1">Optimize Entry Timing</div>
                <div className="text-sm text-muted-foreground">
                  Wait for stronger momentum confirmation before entering positions.
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="font-medium text-primary mb-1">Diversify Timeframes</div>
                <div className="text-sm text-muted-foreground">
                  Consider adding 4H analysis to your 1H strategy for better context.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="glass-card animate-reveal animate-reveal-delay-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-secondary" />
              Key Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Win Rate</span>
                <span className="font-bold text-success">73%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg Risk/Reward</span>
                <span className="font-bold text-primary">1:2.4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Max Drawdown</span>
                <span className="font-bold text-destructive">-5.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Profit Factor</span>
                <span className="font-bold text-success">2.1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sharpe Ratio</span>
                <span className="font-bold text-secondary">1.8</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <Card className="glass-card animate-reveal animate-reveal-delay-7">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="font-medium text-foreground mb-1">Best Trading Sessions</div>
                <div className="text-sm text-muted-foreground">
                  London: 78% win rate • New York: 65% win rate
                </div>
              </div>
              
              <div>
                <div className="font-medium text-foreground mb-1">Top Performing Pairs</div>
                <div className="text-sm text-muted-foreground">
                  EUR/USD: +12.3% • GBP/USD: +8.7% • USD/JPY: +5.2%
                </div>
              </div>
              
              <div>
                <div className="font-medium text-foreground mb-1">Market Conditions</div>
                <div className="text-sm text-muted-foreground">
                  Trending markets: 82% success • Ranging: 58% success
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Center */}
      <Card className="glass-card animate-reveal animate-reveal-delay-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            AI Action Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="btn-premium h-12">
              <Brain className="h-5 w-5 mr-2" />
              Generate New Analysis
            </Button>
            <Button variant="outline" className="h-12">
              <Target className="h-5 w-5 mr-2" />
              Strategy Optimization
            </Button>
            <Button variant="outline" className="h-12">
              <BarChart3 className="h-5 w-5 mr-2" />
              Performance Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}