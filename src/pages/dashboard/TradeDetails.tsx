/**
 * Trade Details Page
 * Full page view for displaying comprehensive trade information
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  FileText,
  Edit,
  Trash2,
  BarChart3,
  Target,
  Image
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfitLossDisplay from '../../dashboard/components/ProfitLossDisplay';
import { useDashboard } from '../../dashboard/context/DashboardContext';
import type { Trade } from '../../dashboard/hooks/useTrades';

export default function TradeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { trades, deleteTrade } = useDashboard();
  const [trade, setTrade] = useState<Trade | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && trades.length > 0) {
      const foundTrade = trades.find(t => (t.id || (t as any)._id) === id);
      setTrade(foundTrade || null);
      setLoading(false);
    } else if (trades.length === 0) {
      // Still loading trades
      setLoading(true);
    } else {
      // Trade not found
      setLoading(false);
    }
  }, [id, trades]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const handleEdit = () => {
    if (trade) {
      navigate(`/dashboard/log-trades?edit=${trade.id || trade._id}`);
    }
  };

  const handleDelete = async () => {
    if (trade && (trade.id || (trade as any)._id)) {
      if (confirm('Are you sure you want to delete this trade? This action cannot be undone.')) {
        try {
          await deleteTrade(trade.id || (trade as any)._id || '');
          navigate('/dashboard/records');
        } catch (error) {
          console.error('Failed to delete trade:', error);
        }
      }
    }
  };

  const handleBack = () => {
    navigate('/dashboard/records');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-foreground font-medium">Loading trade details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!trade) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Trade Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested trade could not be found.</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Records
          </Button>
        </div>
      </div>
    );
  }

  // Normalize trade data
  const tradeId = trade.id || (trade as any)._id || '';
  const tradePair = trade.trade_pair || '';
  const entryPrice = trade.entry_price || 0;
  const exitPrice = trade.exit_price;
  const tradeType = trade.trade_type || 'buy';
  const positionSize = trade.lot_size || 0;
  const timeframe = trade.timeframe || '';
  const status = trade.status || 'open';
  const notes = trade.notes || '';
  const createdAt = trade.created_at || '';
  const updatedAt = trade.updated_at || '';
  const stopLoss = (trade as any).stop_loss;
  const takeProfit = (trade as any).take_profit;
  const title = (trade as any).title || `${tradePair} ${tradeType.toUpperCase()}`;
  const chartScreenshotUrl = trade.chart_screenshot_url;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button onClick={handleBack} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Records
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              {title}
            </h1>
            <p className="text-muted-foreground mt-1">
              Detailed view of your {tradePair} trade
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleEdit} variant="outline" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Trade
          </Button>
          <Button onClick={handleDelete} variant="destructive" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Delete Trade
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Trade Details */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Trade Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="h-5 w-5" />
                Trade Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Asset Pair</p>
                  <p className="text-lg font-semibold">{tradePair}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trade Type</p>
                  <div className="flex items-center gap-2">
                    {tradeType === 'buy' || tradeType === 'long' ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    <span className="font-semibold capitalize">{tradeType}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Position Size</p>
                  <p className="text-lg font-semibold">{positionSize}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entry Price</p>
                  <p className="text-lg font-semibold">${entryPrice.toFixed(5)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Exit Price</p>
                  <p className="text-lg font-semibold">
                    {exitPrice ? `$${exitPrice.toFixed(5)}` : 'Not closed'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Timeframe</p>
                  <p className="font-semibold">{timeframe}</p>
                </div>
              </div>

              {(stopLoss || takeProfit) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Stop Loss</p>
                    <p className="text-lg font-semibold">
                      {stopLoss ? `$${stopLoss.toFixed(5)}` : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Take Profit</p>
                    <p className="text-lg font-semibold">
                      {takeProfit ? `$${takeProfit.toFixed(5)}` : 'Not set'}
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                <Badge 
                  variant={
                    status === 'open' ? 'default' : 
                    status === 'closed' ? 'secondary' : 
                    'outline'
                  }
                  className="capitalize text-sm px-3 py-1"
                >
                  {status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Chart Screenshot */}
          {chartScreenshotUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Chart Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <img
                    src={chartScreenshotUrl}
                    alt="Trade Chart Screenshot"
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="flex items-center justify-center h-32 bg-muted text-muted-foreground"><p>Screenshot not available</p></div>';
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trade Notes */}
          {notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Trade Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Trade Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">Created:</span>
                <span>{formatDate(createdAt)}</span>
              </div>
              {updatedAt && updatedAt !== createdAt && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-medium">Updated:</span>
                  <span>{formatDate(updatedAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - P&L Analysis */}
        <div className="xl:col-span-1">
          <div className="sticky top-8">
            <ProfitLossDisplay trade={trade} showDetailed={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
