import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechnicalData {
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  buyerVolume: number;
  sellerVolume: number;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  rsi: number;
  macd: number;
  movingAverage: number;
}

interface XauUsdAnalysisProps {
  className?: string;
}

export function XauUsdAnalysis({ className }: XauUsdAnalysisProps) {
  // Mock real-time XAU/USD data
  const technicalData: TechnicalData = {
    price: 2685.45,
    change: 8.75,
    changePercent: 0.33,
    volume: 89430000,
    buyerVolume: 54200000,
    sellerVolume: 35230000,
    marketSentiment: 'bullish',
    rsi: 67.8,
    macd: 12.4,
    movingAverage: 2678.20
  };

  const buyerPercentage = (technicalData.buyerVolume / technicalData.volume) * 100;
  const sellerPercentage = (technicalData.sellerVolume / technicalData.volume) * 100;

  return (
    <Card className={cn("overflow-hidden bg-gradient-to-br from-card/50 to-primary/5 border-primary/20", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">XAU/USD Live</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${technicalData.price.toFixed(2)}</div>
            <div className={cn(
              "flex items-center text-sm font-medium",
              technicalData.change >= 0 ? "text-success" : "text-danger"
            )}>
              {technicalData.change >= 0 ? 
                <TrendingUp className="h-4 w-4 mr-1" /> : 
                <TrendingDown className="h-4 w-4 mr-1" />
              }
              {technicalData.change >= 0 ? '+' : ''}{technicalData.change.toFixed(2)} ({technicalData.changePercent.toFixed(2)}%)
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Market Sentiment */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="font-medium">Market Sentiment</span>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            technicalData.marketSentiment === 'bullish' ? "bg-success/20 text-success" :
            technicalData.marketSentiment === 'bearish' ? "bg-danger/20 text-danger" :
            "bg-warning/20 text-warning"
          )}>
            {technicalData.marketSentiment.toUpperCase()}
          </div>
        </div>

        {/* Volume Analysis */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Volume Analysis</h3>
          
          {/* Buyer Volume */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-success">Buyers</span>
              </div>
              <span className="text-sm font-mono">{(technicalData.buyerVolume / 1000000).toFixed(1)}M</span>
            </div>
            <Progress value={buyerPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground text-right">{buyerPercentage.toFixed(1)}%</div>
          </div>

          {/* Seller Volume */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowDown className="h-4 w-4 text-danger" />
                <span className="text-sm font-medium text-danger">Sellers</span>
              </div>
              <span className="text-sm font-mono">{(technicalData.sellerVolume / 1000000).toFixed(1)}M</span>
            </div>
            <Progress value={sellerPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground text-right">{sellerPercentage.toFixed(1)}%</div>
          </div>
        </div>

        {/* Technical Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">RSI (14)</div>
            <div className="text-lg font-bold text-secondary">{technicalData.rsi.toFixed(1)}</div>
            <div className="text-xs">
              {technicalData.rsi > 70 ? 'Overbought' : 
               technicalData.rsi < 30 ? 'Oversold' : 'Neutral'}
            </div>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">MACD</div>
            <div className="text-lg font-bold text-accent">{technicalData.macd.toFixed(1)}</div>
            <div className="text-xs">
              {technicalData.macd > 0 ? 'Bullish' : 'Bearish'}
            </div>
          </div>
        </div>

        {/* Moving Average */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
          <span className="text-sm font-medium">20-Day MA</span>
          <div className="text-right">
            <div className="font-mono font-bold">${technicalData.movingAverage.toFixed(2)}</div>
            <div className={cn(
              "text-xs",
              technicalData.price > technicalData.movingAverage ? "text-success" : "text-danger"
            )}>
              {technicalData.price > technicalData.movingAverage ? 'Above' : 'Below'} MA
            </div>
          </div>
        </div>

        {/* Live Update Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
          Live Market Data
        </div>
      </CardContent>
    </Card>
  );
}