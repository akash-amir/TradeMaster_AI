import React, { useState, useEffect } from 'react';
import { Brain, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, Info, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface AIInsight {
  title: string;
  content: string;
  score: number | null;
  type: 'positive' | 'neutral' | 'negative' | 'warning' | 'welcome' | 'error';
  keyMetric?: string;
  suggestion?: string;
  generatedAt: string;
}

interface AIInsightResponse {
  success: boolean;
  data: {
    insight: AIInsight;
    tradesAnalyzed: number;
    generatedAt: string;
  };
  message?: string;
}

interface AIInsightCardProps {
  className?: string;
}

export default function AIInsightCard({ className = '' }: AIInsightCardProps) {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInsight = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Get the base URL for API calls
      const baseUrl = process.env.NODE_ENV === 'production' 
        ? window.location.origin 
        : 'http://localhost:5000';
      
      // First, test if the API is reachable
      try {
        const testResponse = await fetch(`${baseUrl}/api/test`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!testResponse.ok) {
          throw new Error(`API server not reachable (${testResponse.status})`);
        }
      } catch (testErr) {
        console.error('API test failed:', testErr);
        throw new Error('Backend server is not running or not accessible');
      }
      
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');
      
      if (!token) {
        // For development, provide a fallback insight without authentication
        if (process.env.NODE_ENV === 'development') {
          setInsight({
            title: 'Demo AI Insight',
            content: 'This is a demo insight. Please log in to get personalized AI analysis of your trading performance.',
            score: null,
            type: 'welcome',
            generatedAt: new Date().toISOString()
          });
          return;
        }
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log('Fetching AI insight from:', `${baseUrl}/api/ai/dashboard-insight?refresh=${refresh}`);
      
      const response = await fetch(`${baseUrl}/api/ai/dashboard-insight?refresh=${refresh}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data: AIInsightResponse = await response.json();
      console.log('AI Insight Response:', data);

      if (data.success) {
        setInsight(data.data.insight);
      } else {
        setError(data.message || 'Failed to generate insight');
        // Set fallback insight for error state
        if (data.data?.insight) {
          setInsight(data.data.insight);
        }
      }
    } catch (err: any) {
      console.error('Error fetching AI insight:', err);
      
      let errorMessage = 'Unable to connect to AI service';
      let fallbackContent = 'Unable to generate AI insights at the moment. Please check your connection and try again.';
      
      if (err.message?.includes('authentication') || err.message?.includes('token')) {
        errorMessage = 'Authentication required';
        fallbackContent = 'Please log in to access AI insights.';
      } else if (err.message?.includes('Network') || err.message?.includes('fetch')) {
        errorMessage = 'Network connection error';
        fallbackContent = 'Please check your internet connection and try again.';
      } else if (err.message?.includes('Backend server')) {
        errorMessage = 'Backend server offline';
        fallbackContent = 'The backend server is not running. Please start the server and try again.';
      } else if (err.message?.includes('API request failed')) {
        errorMessage = 'API request failed';
        fallbackContent = `Server responded with an error: ${err.message}`;
      }
      
      setError(errorMessage);
      // Set fallback insight
      setInsight({
        title: 'Connection Error',
        content: fallbackContent,
        score: null,
        type: 'error',
        generatedAt: new Date().toISOString()
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInsight();
  }, []);

  const handleRefresh = () => {
    fetchInsight(true);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'welcome':
        return <Sparkles className="h-5 w-5 text-blue-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getScoreBadgeVariant = (score: number | null) => {
    if (score === null) return 'secondary';
    if (score >= 80) return 'default'; // Green
    if (score >= 60) return 'secondary'; // Blue
    if (score >= 40) return 'outline'; // Yellow
    return 'destructive'; // Red
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-muted-foreground';
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading) {
    return (
      <Card className={`border shadow-sm ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border shadow-sm ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <span>AI Insights</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {insight && (
          <>
            {/* Insight Header */}
            <div className="flex items-start gap-3">
              {getInsightIcon(insight.type)}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground leading-tight">
                  {insight.title}
                </h3>
                {insight.score !== null && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">Score:</span>
                    <Badge 
                      variant={getScoreBadgeVariant(insight.score)}
                      className="text-xs"
                    >
                      {insight.score}/100
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Insight Content */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight.content}
              </p>

              {/* Key Metric */}
              {insight.keyMetric && (
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Key Metric</p>
                  <p className="text-sm font-medium text-foreground">
                    {insight.keyMetric}
                  </p>
                </div>
              )}

              {/* Suggestion */}
              {insight.suggestion && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">💡 Suggestion</p>
                  <p className="text-sm text-foreground">
                    {insight.suggestion}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Generated {new Date(insight.generatedAt).toLocaleString()}
              </p>
              <div className="flex gap-2">
                {error && (
                  <Badge variant="destructive" className="text-xs">
                    Limited Mode
                  </Badge>
                )}
                {process.env.NODE_ENV === 'development' && (
                  <Badge variant="outline" className="text-xs">
                    Dev Mode
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
