import { useState } from "react";
import { Plus, Upload, Calendar, DollarSign, TrendingUp, Camera, X, Target, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface TradeEntryFormProps {
  onTradeAdded: (trade: any) => void;
  editingTrade?: any;
  onTradeUpdated?: (tradeId: string, trade: any) => void;
  className?: string;
}

const ASSETS = [
  { value: "EUR/USD", label: "EUR/USD", category: "Forex" },
  { value: "GBP/USD", label: "GBP/USD", category: "Forex" },
  { value: "USD/JPY", label: "USD/JPY", category: "Forex" },
  { value: "AUD/USD", label: "AUD/USD", category: "Forex" },
  { value: "USD/CAD", label: "USD/CAD", category: "Forex" },
  { value: "NZD/USD", label: "NZD/USD", category: "Forex" },
  { value: "USD/CHF", label: "USD/CHF", category: "Forex" },
  { value: "EUR/GBP", label: "EUR/GBP", category: "Forex" },
  { value: "BTC/USD", label: "Bitcoin", category: "Crypto" },
  { value: "ETH/USD", label: "Ethereum", category: "Crypto" },
  { value: "XRP/USD", label: "Ripple", category: "Crypto" },
  { value: "ADA/USD", label: "Cardano", category: "Crypto" },
  { value: "SOL/USD", label: "Solana", category: "Crypto" },
  { value: "US30", label: "Dow Jones", category: "Indices" },
  { value: "SPX500", label: "S&P 500", category: "Indices" },
  { value: "NAS100", label: "NASDAQ 100", category: "Indices" },
  { value: "UK100", label: "FTSE 100", category: "Indices" },
  { value: "GER40", label: "DAX 40", category: "Indices" },
  { value: "GOLD", label: "Gold (XAU/USD)", category: "Commodities" },
  { value: "SILVER", label: "Silver (XAG/USD)", category: "Commodities" },
  { value: "OIL", label: "Crude Oil", category: "Commodities" },
];

const TIMEFRAMES = [
  { value: "1M", label: "1 Minute" },
  { value: "5M", label: "5 Minutes" },
  { value: "15M", label: "15 Minutes" },
  { value: "30M", label: "30 Minutes" },
  { value: "1H", label: "1 Hour" },
  { value: "4H", label: "4 Hours" },
  { value: "1D", label: "Daily" },
  { value: "1W", label: "Weekly" },
];

export default function TradeEntryForm({ onTradeAdded, editingTrade, onTradeUpdated, className }: TradeEntryFormProps) {
  const { toast } = useToast();
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: editingTrade?.title || "",
    asset: editingTrade?.trade_pair || "EUR/USD",
    date: editingTrade?.created_at ? new Date(editingTrade.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    time: editingTrade?.created_at ? new Date(editingTrade.created_at).toTimeString().split(' ')[0].substring(0, 5) : new Date().toTimeString().split(' ')[0].substring(0, 5),
    entryPrice: editingTrade?.entry_price?.toString() || "",
    exitPrice: editingTrade?.exit_price?.toString() || "",
    stopLoss: "",
    takeProfit: "",
    positionType: editingTrade?.trade_type || "buy" as "buy" | "sell",
    lotSize: editingTrade?.lot_size?.toString() || "",
    riskPercent: "",
    timeframe: editingTrade?.timeframe || "1H",
    notes: editingTrade?.notes || ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleScreenshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + screenshots.length > 3) {
      toast({
        title: "Too many files",
        description: "You can upload maximum 3 screenshots per trade.",
        variant: "destructive",
      });
      return;
    }

    const newFiles = files.slice(0, 3 - screenshots.length);
    setScreenshots(prev => [...prev, ...newFiles]);

    // Create preview URLs
    newFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    });
  };

  const removeScreenshot = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setScreenshots(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const calculatePnL = () => {
    const entry = parseFloat(formData.entryPrice);
    const exit = parseFloat(formData.exitPrice);
    const size = parseFloat(formData.lotSize);
    
    if (!entry || !exit || !size) return 0;
    
    const priceDiff = formData.positionType === 'buy' ? exit - entry : entry - exit;
    return Math.round(priceDiff * size * 100) / 100;
  };

  const calculateRiskReward = () => {
    const entry = parseFloat(formData.entryPrice);
    const exit = parseFloat(formData.exitPrice);
    const stopLoss = parseFloat(formData.stopLoss);
    
    if (!entry || !exit || !stopLoss) return 0;
    
    const reward = Math.abs(exit - entry);
    const risk = Math.abs(entry - stopLoss);
    
    return risk > 0 ? (reward / risk) : 0;
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Missing Trade Title",
        description: "Please enter a title for your trade.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.entryPrice || parseFloat(formData.entryPrice) <= 0) {
      toast({
        title: "Invalid Entry Price",
        description: "Please enter a valid entry price.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.lotSize || parseFloat(formData.lotSize) <= 0) {
      toast({
        title: "Invalid Position Size",
        description: "Please enter a valid position size.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Set different max limits based on asset type
    const isCrypto = formData.asset.includes('BTC') || formData.asset.includes('ETH') || 
                     formData.asset.includes('XRP') || formData.asset.includes('ADA') || 
                     formData.asset.includes('SOL') || formData.asset.includes('/USD');
  
    const maxPriceAllowed = isCrypto ? 999999.99 : 99999.99; // 1M for crypto, 100K for others
    const maxLotSizeAllowed = 999999.99; // Keep lot size limit reasonable
  
    if (
      parseFloat(formData.entryPrice) > maxPriceAllowed ||
      (formData.exitPrice && parseFloat(formData.exitPrice) > maxPriceAllowed) ||
      (formData.stopLoss && parseFloat(formData.stopLoss) > maxPriceAllowed) ||
      (formData.takeProfit && parseFloat(formData.takeProfit) > maxPriceAllowed)
    ) {
      toast({
        title: "Price too large",
        description: `Prices must be less than ${isCrypto ? '1,000,000' : '100,000'} for ${isCrypto ? 'cryptocurrencies' : 'this asset type'}.`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
  
    if (parseFloat(formData.lotSize) > maxLotSizeAllowed) {
      toast({
        title: "Position size too large",
        description: "Position size must be less than 1,000,000.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert screenshots to base64 data URLs for storage
      let screenshotUrl = null;
      if (screenshots.length > 0) {
        try {
          // Convert the first screenshot to base64 data URL
          const file = screenshots[0];
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          screenshotUrl = base64;
        } catch (uploadError) {
          console.error('Failed to process screenshot:', uploadError);
          toast({
            title: "Screenshot Upload Warning",
            description: "Failed to process screenshot, but trade will be saved without it.",
            variant: "destructive",
          });
        }
      }

      // Map form data to Supabase schema
      // Combine title and notes since database doesn't have separate title field
      const combinedNotes = formData.title ? 
        (formData.notes ? `${formData.title}\n\n${formData.notes}` : formData.title) : 
        (formData.notes || null);
      
      // WORKAROUND: Scale down large values to fit database precision NUMERIC(10,5)
      // Database can only store values < 100,000, so we scale down by factor of 10 for large values
      const entryPrice = parseFloat(formData.entryPrice);
      const exitPrice = formData.exitPrice ? parseFloat(formData.exitPrice) : null;
      const lotSize = parseFloat(formData.lotSize);
      
      // Check if we need to scale (for values >= 100,000)
      const needsScaling = entryPrice >= 100000 || (exitPrice && exitPrice >= 100000);
      const scaleFactor = needsScaling ? 10 : 1;
      
      // Add scaling info to notes so we can scale back up when reading
      const scalingNote = needsScaling ? `[SCALED_x${scaleFactor}]` : '';
      const finalNotes = scalingNote ? 
        (combinedNotes ? `${scalingNote} ${combinedNotes}` : scalingNote) : 
        combinedNotes;
      
      const mappedTradeData = {
        trade_pair: formData.asset,
        trade_type: formData.positionType,
        entry_price: entryPrice / scaleFactor,
        exit_price: exitPrice ? exitPrice / scaleFactor : null,
        lot_size: lotSize, // Don't scale lot size
        timeframe: formData.timeframe,
        status: exitPrice ? "closed" : "open", // Set status based on whether exit price is provided
        notes: finalNotes,
        chart_screenshot_url: screenshotUrl,
        // user_id will be added in the hook
      };

      console.log('=== TRADE SAVE DEBUG ===');
      console.log('Form data:', formData);
      console.log('Mapped trade data:', mappedTradeData);
      console.log('Screenshots:', screenshots);
      console.log('Is editing:', !!editingTrade);

      if (editingTrade && onTradeUpdated) {
        console.log('Updating existing trade:', editingTrade.id);
        await onTradeUpdated(editingTrade.id, mappedTradeData);
      } else {
        console.log('Adding new trade...');
        await onTradeAdded(mappedTradeData);
      }
      
      console.log('Trade save completed successfully');
      
      toast({
        title: "Success!",
        description: "Trade saved successfully.",
      });
      
      // Reset form if not editing
      if (!editingTrade) {
        setFormData({
          title: "",
          asset: "EUR/USD",
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          entryPrice: "",
          exitPrice: "",
          stopLoss: "",
          takeProfit: "",
          positionType: "buy",
          lotSize: "",
          riskPercent: "",
          timeframe: "1H",
          notes: ""
        });
        
        // Clear screenshots
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setScreenshots([]);
        setPreviewUrls([]);
      }
      
    } catch (error: any) {
      console.error('=== TRADE SAVE ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error?.message);
      console.error('Error details:', error?.details);
      console.error('Error hint:', error?.hint);
      console.error('Error code:', error?.code);
      console.error('Full error JSON:', JSON.stringify(error, null, 2));
      
      // More specific error message
      let errorMessage = "Failed to save trade. Please try again.";
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.details) {
        errorMessage = error.details;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Error Saving Trade",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupedAssets = ASSETS.reduce((acc, asset) => {
    if (!acc[asset.category]) {
      acc[asset.category] = [];
    }
    acc[asset.category].push(asset);
    return acc;
  }, {} as Record<string, typeof ASSETS>);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="animate-reveal">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {editingTrade ? 'Edit Trade' : 'Log New Trade'}
        </h2>
        <p className="text-muted-foreground text-lg">
          {editingTrade ? 'Update your trading activity' : 'Record your trading activity with detailed analysis'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card animate-reveal animate-reveal-delay-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Trade Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trade Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Trade Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., EUR/USD Breakout Strategy"
                  className="bg-input border-border h-10 sm:h-12 text-sm sm:text-base"
                />
              </div>

              {/* Asset Selection */}
              <div className="space-y-2">
                <Label htmlFor="asset">Trading Asset *</Label>
                <select
                  id="asset"
                  value={formData.asset}
                  onChange={(e) => handleInputChange('asset', e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary"
                >
                  {Object.entries(groupedAssets).map(([category, assets]) => (
                    <optgroup key={category} label={category}>
                      {assets.map(asset => (
                        <option key={asset.value} value={asset.value}>
                          {asset.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Trade Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Trade Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              {/* Position Type */}
              <div className="space-y-2">
                <Label>Position Type *</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.positionType === 'buy' ? 'default' : 'outline'}
                    onClick={() => handleInputChange('positionType', 'buy')}
                    className="flex-1"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Buy / Long
                  </Button>
                  <Button
                    type="button"
                    variant={formData.positionType === 'sell' ? 'default' : 'outline'}
                    onClick={() => handleInputChange('positionType', 'sell')}
                    className="flex-1"
                  >
                    <TrendingUp className="h-4 w-4 mr-2 rotate-180" />
                    Sell / Short
                  </Button>
                </div>
              </div>

              {/* Price Levels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entryPrice">Entry Price *</Label>
                  <Input
                    id="entryPrice"
                    type="number"
                    step="0.00001"
                    value={formData.entryPrice}
                    onChange={(e) => handleInputChange('entryPrice', e.target.value)}
                    placeholder="1.08500"
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exitPrice">Exit Price</Label>
                  <Input
                    id="exitPrice"
                    type="number"
                    step="0.00001"
                    value={formData.exitPrice}
                    onChange={(e) => handleInputChange('exitPrice', e.target.value)}
                    placeholder="1.09000"
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stopLoss">Stop Loss</Label>
                  <Input
                    id="stopLoss"
                    type="number"
                    step="0.00001"
                    value={formData.stopLoss}
                    onChange={(e) => handleInputChange('stopLoss', e.target.value)}
                    placeholder="1.08000"
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="takeProfit">Take Profit</Label>
                  <Input
                    id="takeProfit"
                    type="number"
                    step="0.00001"
                    value={formData.takeProfit}
                    onChange={(e) => handleInputChange('takeProfit', e.target.value)}
                    placeholder="1.09500"
                    className="bg-input border-border"
                  />
                </div>
              </div>

              {/* Position Size and Risk */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lotSize">Position Size *</Label>
                  <Input
                    id="lotSize"
                    type="number"
                    step="0.01"
                    value={formData.lotSize}
                    onChange={(e) => handleInputChange('lotSize', e.target.value)}
                    placeholder="1.00"
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskPercent">Risk %</Label>
                  <Input
                    id="riskPercent"
                    type="number"
                    step="0.1"
                    value={formData.riskPercent}
                    onChange={(e) => handleInputChange('riskPercent', e.target.value)}
                    placeholder="2.0"
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <select
                    id="timeframe"
                    value={formData.timeframe}
                    onChange={(e) => handleInputChange('timeframe', e.target.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary"
                  >
                    {TIMEFRAMES.map(tf => (
                      <option key={tf.value} value={tf.value}>
                        {tf.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Trade Notes & Strategy</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Describe your trade setup, analysis, and reasoning..."
                  rows={4}
                  className="bg-input border-border resize-none text-sm sm:text-base min-h-[100px] sm:min-h-[120px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Screenshot Upload */}
          <Card className="glass-card animate-reveal animate-reveal-delay-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Chart Screenshots
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleScreenshotUpload}
                  className="hidden"
                  id="screenshot-upload"
                />
                <label htmlFor="screenshot-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload chart screenshots to document your analysis
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 10MB (max 3 files)
                  </p>
                </label>
              </div>

              {/* Screenshot Previews */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-border"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeScreenshot(index)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trade Summary Sidebar */}
        <div className="space-y-6">
          <Card className="glass-card animate-reveal animate-reveal-delay-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Trade Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Asset:</span>
                  <span className="font-medium text-foreground">{formData.asset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Position:</span>
                  <span className="font-medium text-foreground capitalize">{formData.positionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-medium text-foreground">{formData.lotSize || '0'}</span>
                </div>
                {formData.entryPrice && formData.exitPrice && formData.lotSize && (
                  <>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">P&L:</span>
                        <span className={`font-bold ${calculatePnL() >= 0 ? 'text-success' : 'text-destructive'}`}>
                          ${calculatePnL().toFixed(2)}
                        </span>
                      </div>
                    </div>
                    {formData.stopLoss && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Risk/Reward:</span>
                        <span className="font-medium text-foreground">
                          1:{calculateRiskReward().toFixed(2)}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.title || !formData.entryPrice || !formData.lotSize}
            className="btn-premium w-full h-12"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                {editingTrade ? 'Updating Trade...' : 'Saving Trade...'}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingTrade ? 'Update Trade Log' : 'Save Trade Log'}
              </div>
            )}
          </Button>

          {/* Quick Tips */}
          <Card className="glass-card animate-reveal animate-reveal-delay-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Always set stop loss and take profit levels</p>
              <p>• Document your analysis with screenshots</p>
              <p>• Keep detailed notes for future reference</p>
              <p>• Review your trades regularly for improvement</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}