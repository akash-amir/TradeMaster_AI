/**
 * Trade Detail Dialog Component
 * Displays comprehensive trade information including P&L analysis
 */

import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
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
import ProfitLossDisplay from './ProfitLossDisplay';

interface Trade {
  id?: string;
  _id?: string;
  title?: string;
  trade_pair?: string;
  tradePair?: string;
  entry_price?: number;
  entryPrice?: number;
  exit_price?: number | null;
  exitPrice?: number | null;
  trade_type?: 'buy' | 'sell' | 'long' | 'short';
  tradeType?: 'buy' | 'sell' | 'long' | 'short';
  lot_size?: number;
  lotSize?: number;
  position_size?: number;
  positionSize?: number;
  timeframe?: string;
  status?: 'open' | 'closed' | 'cancelled';
  notes?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  stop_loss?: number;
  stopLoss?: number;
  take_profit?: number;
  takeProfit?: number;
  pnl?: number;
  result?: 'win' | 'loss' | 'breakeven';
  chart_screenshot_url?: string;
  chartScreenshotUrl?: string;
}

interface TradeDetailDialogProps {
  trade: Trade | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (trade: Trade) => void;
  onDelete?: (tradeId: string) => void;
}

export default function TradeDetailDialog({
  trade,
  isOpen,
  onClose,
  onEdit,
  onDelete
}: TradeDetailDialogProps) {
  if (!trade) return null;

  // Normalize trade data
  const tradeId = trade.id || trade._id || '';
  const tradePair = trade.trade_pair || trade.tradePair || '';
  const entryPrice = trade.entry_price || trade.entryPrice || 0;
  const exitPrice = trade.exit_price || trade.exitPrice;
  const tradeType = trade.trade_type || trade.tradeType || 'buy';
  const positionSize = trade.lot_size || trade.lotSize || trade.position_size || trade.positionSize || 0;
  const timeframe = trade.timeframe || '';
  const status = trade.status || 'open';
  const notes = trade.notes || '';
  const createdAt = trade.created_at || trade.createdAt || '';
  const updatedAt = trade.updated_at || trade.updatedAt || '';
  const stopLoss = trade.stop_loss || trade.stopLoss;
  const takeProfit = trade.take_profit || trade.takeProfit;
  const title = trade.title || `${tradePair} ${tradeType.toUpperCase()}`;
  const chartScreenshotUrl = trade.chart_screenshot_url || trade.chartScreenshotUrl;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(trade);
    }
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && tradeId) {
      if (confirm('Are you sure you want to delete this trade? This action cannot be undone.')) {
        onDelete(tradeId);
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Detailed view of your {tradePair} trade
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Trade Details */}
          <div className="space-y-4">
            {/* Basic Trade Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Trade Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Asset Pair</p>
                    <p className="font-semibold">{tradePair}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trade Type</p>
                    <Badge variant={tradeType === 'buy' || tradeType === 'long' ? 'default' : 'secondary'}>
                      {tradeType === 'buy' || tradeType === 'long' ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {tradeType.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Entry Price</p>
                    <p className="font-semibold">${entryPrice.toFixed(5)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Exit Price</p>
                    <p className="font-semibold">
                      {exitPrice ? `$${exitPrice.toFixed(5)}` : 'Not closed'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Position Size</p>
                    <p className="font-semibold">{positionSize.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Timeframe</p>
                    <p className="font-semibold">{timeframe}</p>
                  </div>
                </div>

                {(stopLoss || takeProfit) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Stop Loss</p>
                      <p className="font-semibold">
                        {stopLoss ? `$${stopLoss.toFixed(5)}` : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Take Profit</p>
                      <p className="font-semibold">
                        {takeProfit ? `$${takeProfit.toFixed(5)}` : 'Not set'}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge 
                    variant={
                      status === 'open' ? 'default' : 
                      status === 'closed' ? 'secondary' : 
                      'destructive'
                    }
                    className="capitalize"
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
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Chart Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <img
                      src={chartScreenshotUrl}
                      alt="Trade Chart Screenshot"
                      className="w-full h-auto max-h-96 object-contain"
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
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Trade Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Trade Timestamps */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(createdAt)}</span>
                </div>
                {updatedAt && updatedAt !== createdAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Updated:</span>
                    <span>{formatDate(updatedAt)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - P&L Analysis */}
          <div className="space-y-4">
            <ProfitLossDisplay trade={trade} showDetailed={true} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <div className="flex gap-2">
            {onEdit && (
              <Button onClick={handleEdit} variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Trade
              </Button>
            )}
            {onDelete && (
              <Button onClick={handleDelete} variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Trade
              </Button>
            )}
          </div>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
