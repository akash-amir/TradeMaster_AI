import React, { useEffect, useRef, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface TradingViewWidgetProps {
  className?: string;
  symbol?: string;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ className, symbol = "FX:EURUSD" }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      allow_symbol_change: true,
      calendar: false,
      details: false,
      hide_side_toolbar: false,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval: "60",
      locale: "en",
      save_image: true,
      style: "1",
      symbol: symbol,
      theme: "dark",
      timezone: "Etc/UTC",
      backgroundColor: "#0C0C0F",
      gridColor: "rgba(255, 255, 255, 0.06)",
      watchlist: [],
      withdateranges: false,
      compareSymbols: [],
      show_popup_button: true,
      popup_height: "650",
      popup_width: "1000",
      studies: [],
      autosize: true,
      overrides: {
        "paneProperties.background": "#0C0C0F",
        "paneProperties.vertGridProperties.color": "rgba(255, 255, 255, 0.06)",
        "paneProperties.horzGridProperties.color": "rgba(255, 255, 255, 0.06)",
        "symbolWatermarkProperties.transparency": 90,
        "scalesProperties.textColor": "#CCCCCC",
        "mainSeriesProperties.candleStyle.upColor": "#00C896",
        "mainSeriesProperties.candleStyle.downColor": "#FF4757",
        "mainSeriesProperties.candleStyle.borderUpColor": "#00C896",
        "mainSeriesProperties.candleStyle.borderDownColor": "#FF4757",
        "mainSeriesProperties.candleStyle.wickUpColor": "#00C896",
        "mainSeriesProperties.candleStyle.wickDownColor": "#FF4757"
      }
    });

    if (container.current) {
        container.current.innerHTML = '';
        container.current.appendChild(script);
    }

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <Card className={`glass-card ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Live Chart Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={container}
          className="h-[500px] w-full rounded-b-lg overflow-hidden"
        />
      </CardContent>
    </Card>
  );
}

export default memo(TradingViewWidget);