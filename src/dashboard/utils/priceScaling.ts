// Utility functions for handling price scaling workaround
// This is needed because the database NUMERIC(10,5) precision can't store values >= 100,000

export interface ScaledTrade {
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

/**
 * Detects if a trade was scaled down during saving
 */
export function isScaledTrade(notes: string | null): { isScaled: boolean; scaleFactor: number } {
  if (!notes) return { isScaled: false, scaleFactor: 1 };
  
  const scaleMatch = notes.match(/\[SCALED_x(\d+)\]/);
  if (scaleMatch) {
    return { isScaled: true, scaleFactor: parseInt(scaleMatch[1]) };
  }
  
  return { isScaled: false, scaleFactor: 1 };
}

/**
 * Scales up trade prices if they were scaled down during saving
 */
export function unscaleTrade(trade: ScaledTrade): ScaledTrade {
  const { isScaled, scaleFactor } = isScaledTrade(trade.notes);
  
  if (!isScaled) return trade;
  
  // Scale up the prices
  const unscaledTrade = {
    ...trade,
    entry_price: trade.entry_price * scaleFactor,
    exit_price: trade.exit_price ? trade.exit_price * scaleFactor : trade.exit_price,
    // Remove the scaling marker from notes
    notes: trade.notes ? trade.notes.replace(/\[SCALED_x\d+\]\s*/, '') : trade.notes
  };
  
  return unscaledTrade;
}

/**
 * Scales up an array of trades
 */
export function unscaleTrades(trades: ScaledTrade[]): ScaledTrade[] {
  return trades.map(unscaleTrade);
}

/**
 * Gets the display price (scaled up if needed)
 */
export function getDisplayPrice(price: number, notes: string | null): number {
  const { scaleFactor } = isScaledTrade(notes);
  return price * scaleFactor;
}
