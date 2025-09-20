
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CandlestickChart } from '@/components/trading/CandlestickChart';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';

const Analysis = () => {
  // Sample market data with more realistic prices
  const marketData = [
    {
      symbol: 'BTC/USD',
      title: 'Bitcoin',
      currentPrice: 67834.50,
      change: 2847.23,
      changePercent: 4.38
    },
    {
      symbol: 'ETH/USD', 
      title: 'Ethereum',
      currentPrice: 3456.78,
      change: -89.45,
      changePercent: -2.52
    },
    {
      symbol: 'XAU/USD',
      title: 'Gold',
      currentPrice: 2012.45,
      change: 15.67,
      changePercent: 0.78
    }
  ];

  return (
    <div className="min-h-screen gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold gradient-text mb-3 flex items-center justify-center gap-3">
            <BarChart3 className="h-12 w-12 text-primary" />
            Market Analysis
          </h1>
          <p className="text-muted-foreground text-lg">Advanced Candlestick Charts & Technical Analysis</p>
          <div className="w-24 h-1 gradient-primary mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {marketData.map((market, index) => (
            <Card key={index} className="glass border-primary/30 glow-primary hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center justify-between">
                  <span className="gradient-text">{market.title}</span>
                  <span className="text-sm text-muted-foreground bg-muted/30 px-2 py-1 rounded-lg">{market.symbol}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-primary">${market.currentPrice.toLocaleString()}</div>
                    <div className={`flex items-center gap-2 text-sm font-medium ${market.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                      {market.changePercent >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {market.changePercent >= 0 ? '+' : ''}{market.change.toFixed(2)} ({market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Candlestick Charts */}
        <div className="space-y-8">
          {marketData.map((market, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
              <CandlestickChart
                symbol={market.symbol}
                title={market.title}
                currentPrice={market.currentPrice}
                change={market.change}
                changePercent={market.changePercent}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
};

export default Analysis;
