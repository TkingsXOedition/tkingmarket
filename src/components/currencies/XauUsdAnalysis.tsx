import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity, Volume2, Users, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechnicalData {
  symbol: string;
  rsi: number;
  macd: number;
  movingAverage20: number;
  volumeRatio: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  buyerVolumePercent: number;
  sellerVolumePercent: number;
  lastUpdated: string;
}

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  lastUpdated: string;
}

interface XauUsdAnalysisProps {
  className?: string;
  technicalData?: TechnicalData;
  marketData?: MarketData;
}

export function XauUsdAnalysis({ 
  className, 
  technicalData, 
  marketData 
}: XauUsdAnalysisProps) {
  // Fallback data if live data isn't available
  const defaultTechnical: TechnicalData = {
    symbol: 'XAU/USD',
    rsi: 68.45,
    macd: 0.0245,
    movingAverage20: 2648.75,
    volumeRatio: 1.35,
    sentiment: 'bullish',
    buyerVolumePercent: 62.3,
    sellerVolumePercent: 37.7,
    lastUpdated: new Date().toISOString()
  };

  const defaultMarket: MarketData = {
    symbol: 'XAU/USD',
    price: 2651.20,
    change: 12.45,
    changePercent: 0.47,
    volume: 125000,
    lastUpdated: new Date().toISOString()
  };

  const technical = technicalData || defaultTechnical;
  const market = marketData || defaultMarket;

  const isPositive = market.change >= 0;
  const sentimentColor = {
    bullish: 'text-success',
    bearish: 'text-destructive',
    neutral: 'text-muted-foreground'
  };

  const getRSIInterpretation = (rsi: number) => {
    if (rsi > 70) return { text: 'Overbought', color: 'text-warning' };
    if (rsi < 30) return { text: 'Oversold', color: 'text-success' };
    return { text: 'Neutral', color: 'text-muted-foreground' };
  };

  const getMACDInterpretation = (macd: number) => {
    if (macd > 0) return { text: 'Bullish Signal', color: 'text-success' };
    if (macd < -0.01) return { text: 'Bearish Signal', color: 'text-destructive' };
    return { text: 'Neutral', color: 'text-muted-foreground' };
  };

  const rsiInterpretation = getRSIInterpretation(technical.rsi);
  const macdInterpretation = getMACDInterpretation(technical.macd);

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <CardTitle className="text-xl font-bold">XAU/USD Live Analysis</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            LIVE
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Price Section */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">${market.price.toFixed(2)}</span>
            <div className={cn("flex items-center gap-1", isPositive ? "text-success" : "text-destructive")}>
              {isPositive ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              <span className="text-lg font-semibold">
                {isPositive ? '+' : ''}{market.change.toFixed(2)} ({market.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Market Sentiment */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Market Sentiment</span>
            <Badge 
              variant={technical.sentiment === 'bullish' ? 'default' : technical.sentiment === 'bearish' ? 'destructive' : 'secondary'}
              className="capitalize"
            >
              {technical.sentiment}
            </Badge>
          </div>
        </div>

        {/* Volume Analysis */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Volume Analysis</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-success">Buyers</span>
              <span className="font-medium">{technical.buyerVolumePercent}%</span>
            </div>
            <Progress value={technical.buyerVolumePercent} className="h-2" />
            
            <div className="flex justify-between text-sm">
              <span className="text-destructive">Sellers</span>
              <span className="font-medium">{technical.sellerVolumePercent}%</span>
            </div>
            <Progress value={technical.sellerVolumePercent} className="h-2 [&>div]:bg-destructive" />
          </div>
        </div>

        {/* Technical Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">RSI</span>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold">{technical.rsi.toFixed(2)}</div>
              <div className={cn("text-xs", rsiInterpretation.color)}>
                {rsiInterpretation.text}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">MACD</span>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold">{technical.macd.toFixed(4)}</div>
              <div className={cn("text-xs", macdInterpretation.color)}>
                {macdInterpretation.text}
              </div>
            </div>
          </div>
        </div>

        {/* Moving Average Comparison */}
        <div className="space-y-2">
          <span className="text-sm font-medium">vs 20-Day MA</span>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              MA: ${technical.movingAverage20.toFixed(2)}
            </span>
            <div className={cn(
              "text-sm font-medium",
              market.price > technical.movingAverage20 ? "text-success" : "text-destructive"
            )}>
              {market.price > technical.movingAverage20 ? "Above" : "Below"} MA
            </div>
          </div>
        </div>

        {/* Last Update */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last updated</span>
            <span>{new Date(market.lastUpdated).toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}