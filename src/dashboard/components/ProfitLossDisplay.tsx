/**
 * Profit/Loss Display Component
 * Calculates and displays P&L for individual trades with detailed breakdown
 */

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Calculator, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Trade {
  id?: string;
  _id?: string;
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
  status?: 'open' | 'closed' | 'cancelled';
  pnl?: number;
  result?: 'win' | 'loss' | 'breakeven';
}

interface ProfitLossDisplayProps {
  trade: Trade;
  showDetailed?: boolean;
  className?: string;
}

export default function ProfitLossDisplay({ 
  trade, 
  showDetailed = true, 
  className = '' 
}: ProfitLossDisplayProps) {
  
  // Normalize trade data (handle both Supabase and Backend formats)
  const entryPrice = trade.entry_price || trade.entryPrice || 0;
  const exitPrice = trade.exit_price || trade.exitPrice || null;
  const tradeType = trade.trade_type || trade.tradeType || 'buy';
  const positionSize = trade.lot_size || trade.lotSize || trade.position_size || trade.positionSize || 0;
  const tradePair = trade.trade_pair || trade.tradePair || '';
  const status = trade.status || 'open';

  // Format large numbers with proper separators and decimal places
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    } else if (price >= 1000) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(5)}`;
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  // Calculate P&L
  const calculatePnL = () => {
    if (!exitPrice || exitPrice === 0 || status !== 'closed') {
      return {
        pnl: 0,
        pnlPercentage: 0,
        isRealized: false,
        result: 'pending' as const
      };
    }

    let pnl = 0;
    
    // Calculate based on trade type
    if (tradeType === 'buy' || tradeType === 'long') {
      // Long trades: profit when exit > entry
      pnl = (exitPrice - entryPrice) * positionSize;
    } else if (tradeType === 'sell' || tradeType === 'short') {
      // Short trades: profit when entry > exit
      pnl = (entryPrice - exitPrice) * positionSize;
    }

    const pnlPercentage = entryPrice > 0 ? (pnl / (entryPrice * positionSize)) * 100 : 0;
    
    let result: 'win' | 'loss' | 'breakeven' = 'breakeven';
    if (pnl > 0) result = 'win';
    else if (pnl < 0) result = 'loss';

    return {
      pnl: Math.round(pnl * 100) / 100, // Round to 2 decimal places
      pnlPercentage: Math.round(pnlPercentage * 100) / 100,
      isRealized: true,
      result
    };
  };

  const pnlData = calculatePnL();
  
  // Use backend calculated PnL if available, otherwise use our calculation
  const finalPnL = trade.pnl !== undefined ? trade.pnl : pnlData.pnl;
  const finalResult = trade.result || pnlData.result;

  // Determine colors and icons
  const getDisplayData = () => {
    if (!pnlData.isRealized) {
      return {
        color: 'text-muted-foreground',
        bgColor: 'bg-muted/10',
        borderColor: 'border-muted/20',
        icon: Calculator,
        label: 'Unrealized',
        trend: 'neutral' as const
      };
    }

    if (finalPnL > 0) {
      return {
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        icon: TrendingUp,
        label: 'Profit',
        trend: 'up' as const
      };
    } else if (finalPnL < 0) {
      return {
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        icon: TrendingDown,
        label: 'Loss',
        trend: 'down' as const
      };
    } else {
      return {
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        icon: Target,
        label: 'Breakeven',
        trend: 'neutral' as const
      };
    }
  };

  const displayData = getDisplayData();
  const Icon = displayData.icon;

  if (!showDetailed) {
    // Simple inline display
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Icon className={`h-4 w-4 ${displayData.color}`} />
        <span className={`font-semibold ${displayData.color}`}>
          {finalPnL >= 0 ? '+' : ''}${finalPnL.toFixed(2)}
        </span>
        {pnlData.isRealized && (
          <Badge 
            variant="outline" 
            className={`${displayData.color} ${displayData.borderColor} text-xs`}
          >
            {pnlData.pnlPercentage >= 0 ? '+' : ''}{pnlData.pnlPercentage.toFixed(2)}%
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className={`border shadow-sm ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className={`h-5 w-5 ${displayData.color}`} />
          <span className="text-foreground">Profit & Loss Analysis</span>
          <Badge 
            variant={finalResult === 'win' ? 'default' : finalResult === 'loss' ? 'destructive' : 'secondary'}
            className="ml-auto capitalize"
          >
            {pnlData.isRealized ? finalResult : 'Open'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main P&L Display */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Net P&L</p>
            <p className={`text-2xl font-bold ${displayData.color}`}>
              {finalPnL >= 0 ? '+' : ''}${Math.abs(finalPnL).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          {pnlData.isRealized && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Percentage</p>
              <p className={`text-xl font-semibold ${displayData.color}`}>
                {pnlData.pnlPercentage >= 0 ? '+' : ''}{pnlData.pnlPercentage.toFixed(2)}%
              </p>
            </div>
          )}
        </div>

        {/* Trade Details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Entry Price
            </p>
            <p className="font-semibold text-foreground">{formatPrice(entryPrice)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Exit Price
            </p>
            <p className="font-semibold text-foreground">
              {exitPrice ? formatPrice(exitPrice) : 'Not closed'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Position Size</p>
            <p className="font-semibold text-foreground">{formatNumber(positionSize)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Trade Type</p>
            <p className="font-semibold text-foreground capitalize">{tradeType}</p>
          </div>
        </div>

        {/* Calculation Breakdown */}
        {pnlData.isRealized && (
          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
              <Calculator className="h-3 w-3" />
              Calculation Breakdown
            </p>
            <div className="text-xs space-y-1 font-mono bg-muted/30 p-3 rounded">
              <p className="text-foreground">Formula: ({tradeType === 'buy' || tradeType === 'long' ? 'Exit - Entry' : 'Entry - Exit'}) × Position Size</p>
              <p className="text-muted-foreground">
                Calculation: ({tradeType === 'buy' || tradeType === 'long' ? 
                  `${formatPrice(exitPrice || 0).replace('$', '')} - ${formatPrice(entryPrice).replace('$', '')}` : 
                  `${formatPrice(entryPrice).replace('$', '')} - ${formatPrice(exitPrice || 0).replace('$', '')}`
                }) × {formatNumber(positionSize)}
              </p>
              <p className={`font-bold ${displayData.color}`}>
                Result: {finalPnL >= 0 ? '+' : ''}${Math.abs(finalPnL).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        )}

        {/* Status Message for Open Trades */}
        {!pnlData.isRealized && (
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              P&L will be calculated when trade is closed
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
