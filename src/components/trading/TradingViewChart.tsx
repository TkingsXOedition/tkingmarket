import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Activity, Volume2 } from 'lucide-react';

interface TradingData {
  timestamp: string;
  price: number;
  rsi: number;
  macd: number;
  signal: number;
  volume: number;
  buyVolume: number;
  sellVolume: number;
  sma20: number;
  sma50: number;
}

interface TradingViewChartProps {
  symbol: string;
  title: string;
  currentPrice: number;
  change: number;
  changePercent: number;
}

export function TradingViewChart({ symbol, title, currentPrice, change, changePercent }: TradingViewChartProps) {
  const [activeTab, setActiveTab] = useState<'price' | 'rsi' | 'macd' | 'volume'>('price');
  const [data, setData] = useState<TradingData[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Generate realistic trading data
  const generateTradingData = () => {
    const baseData: TradingData[] = [];
    let price = currentPrice;
    let prevRSI = 50;
    let prevMACD = 0;
    let prevSignal = 0;
    
    for (let i = 0; i < 100; i++) {
      const timestamp = new Date(Date.now() - (99 - i) * 300000).toISOString(); // 5-minute intervals
      
      // Price simulation with more realistic movement
      const volatility = 0.002;
      const trend = Math.sin(i * 0.1) * 0.001;
      const randomFactor = (Math.random() - 0.5) * volatility;
      price = price * (1 + trend + randomFactor);
      
      // RSI calculation (simplified)
      const rsiChange = (Math.random() - 0.5) * 10;
      prevRSI = Math.max(10, Math.min(90, prevRSI + rsiChange));
      
      // MACD calculation (simplified)
      const ema12 = price * 0.8 + (baseData[i - 1]?.price || price) * 0.2;
      const ema26 = price * 0.4 + (baseData[i - 1]?.price || price) * 0.6;
      const macd = ema12 - ema26;
      const signal = prevSignal * 0.8 + macd * 0.2;
      
      // Volume simulation
      const baseVolume = 1000000 + Math.random() * 500000;
      const buyRatio = 0.3 + Math.random() * 0.4; // 30-70% buy volume
      
      // Simple moving averages
      const recentPrices = baseData.slice(-19).map(d => d.price);
      const sma20 = recentPrices.length > 0 ? 
        (recentPrices.reduce((sum, p) => sum + p, 0) + price) / (recentPrices.length + 1) : price;
      
      const longerPrices = baseData.slice(-49).map(d => d.price);
      const sma50 = longerPrices.length > 0 ? 
        (longerPrices.reduce((sum, p) => sum + p, 0) + price) / (longerPrices.length + 1) : price;

      baseData.push({
        timestamp: timestamp.substring(11, 16), // HH:MM format
        price: Math.round(price * 100) / 100,
        rsi: Math.round(prevRSI * 100) / 100,
        macd: Math.round(macd * 10000) / 10000,
        signal: Math.round(signal * 10000) / 10000,
        volume: Math.round(baseVolume),
        buyVolume: Math.round(baseVolume * buyRatio),
        sellVolume: Math.round(baseVolume * (1 - buyRatio)),
        sma20: Math.round(sma20 * 100) / 100,
        sma50: Math.round(sma50 * 100) / 100
      });

      prevMACD = macd;
      prevSignal = signal;
    }
    
    return baseData;
  };

  useEffect(() => {
    setData(generateTradingData());
  }, [currentPrice]);

  // Slow update interval - every 30 seconds instead of fast updates
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev];
        const lastPoint = newData[newData.length - 1];
        
        // Small price movement
        const priceChange = (Math.random() - 0.5) * 0.001 * currentPrice;
        const newPrice = lastPoint.price + priceChange;
        
        // Update RSI slightly
        const rsiChange = (Math.random() - 0.5) * 2;
        const newRSI = Math.max(10, Math.min(90, lastPoint.rsi + rsiChange));
        
        // Update last point instead of adding new ones
        newData[newData.length - 1] = {
          ...lastPoint,
          price: Math.round(newPrice * 100) / 100,
          rsi: Math.round(newRSI * 100) / 100,
        };
        
        return newData;
      });
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [isLive, currentPrice]);

  const getRSIColor = (rsi: number) => {
    if (rsi > 70) return '#ef4444';      // Red - Overbought
    if (rsi < 30) return '#22c55e';      // Green - Oversold
    return '#3b82f6';                    // Blue - Neutral
  };

  const getMACDColor = (macd: number, signal: number) => {
    return macd > signal ? '#22c55e' : '#ef4444';
  };

  const currentRSI = data[data.length - 1]?.rsi || 50;
  const currentMACD = data[data.length - 1]?.macd || 0;
  const currentSignal = data[data.length - 1]?.signal || 0;
  const buyVolumePercent = data[data.length - 1] ? 
    (data[data.length - 1].buyVolume / data[data.length - 1].volume * 100) : 50;

  const renderChart = () => {
    switch (activeTab) {
      case 'price':
        return (
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
            <XAxis 
              dataKey="timestamp" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              domain={['dataMin - 1', 'dataMax + 1']}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value, name) => [
                `$${Number(value).toFixed(2)}`,
                name === 'price' ? 'Price' : name === 'sma20' ? 'SMA 20' : 'SMA 50'
              ]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={false}
              name="Price"
            />
            <Line 
              type="monotone" 
              dataKey="sma20" 
              stroke="#f59e0b" 
              strokeWidth={1}
              dot={false}
              strokeDasharray="5 5"
              name="SMA 20"
            />
            <Line 
              type="monotone" 
              dataKey="sma50" 
              stroke="#8b5cf6" 
              strokeWidth={1}
              dot={false}
              strokeDasharray="10 5"
              name="SMA 50"
            />
          </ComposedChart>
        );
      case 'rsi':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
            <XAxis 
              dataKey="timestamp" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              domain={[0, 100]}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value) => [`${Number(value).toFixed(1)}`, 'RSI']}
            />
            <Line 
              type="monotone" 
              dataKey="rsi" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={false}
            />
            <Line type="monotone" dataKey={() => 70} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1} dot={false} />
            <Line type="monotone" dataKey={() => 30} stroke="#22c55e" strokeDasharray="5 5" strokeWidth={1} dot={false} />
          </LineChart>
        );
      case 'macd':
        return (
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
            <XAxis 
              dataKey="timestamp" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value, name) => [
                Number(value).toFixed(4),
                name === 'macd' ? 'MACD' : 'Signal'
              ]}
            />
            <Legend />
            <Bar 
              dataKey={(entry) => entry.macd - entry.signal} 
              fill="hsl(var(--muted))"
              name="Histogram"
            />
            <Line 
              type="monotone" 
              dataKey="macd" 
              stroke="#22c55e" 
              strokeWidth={2}
              dot={false}
              name="MACD"
            />
            <Line 
              type="monotone" 
              dataKey="signal" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={false}
              name="Signal"
            />
          </ComposedChart>
        );
      case 'volume':
        return (
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
            <XAxis 
              dataKey="timestamp" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value, name) => [
                Number(value).toLocaleString(),
                name === 'buyVolume' ? 'Buy Volume' : 'Sell Volume'
              ]}
            />
            <Legend />
            <Bar dataKey="buyVolume" stackId="volume" fill="#22c55e" name="Buy Volume" />
            <Bar dataKey="sellVolume" stackId="volume" fill="#ef4444" name="Sell Volume" />
          </ComposedChart>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              {title}
              <span className="text-lg text-muted-foreground">({symbol})</span>
            </CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-3xl font-bold">${currentPrice.toFixed(2)}</span>
              <div className={`flex items-center gap-1 ${changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {changePercent >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-semibold">
                  {changePercent >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isLive ? "default" : "outline"}
              size="sm"
              onClick={() => setIsLive(!isLive)}
            >
              <Activity className="h-4 w-4 mr-1" />
              {isLive ? 'LIVE' : 'PAUSED'}
            </Button>
          </div>
        </div>
        
        {/* Technical Indicators Summary */}
        <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">RSI (14)</div>
            <div className="text-lg font-bold" style={{ color: getRSIColor(currentRSI) }}>
              {currentRSI.toFixed(1)}
            </div>
            <div className="text-xs">
              {currentRSI > 70 ? 'Overbought' : currentRSI < 30 ? 'Oversold' : 'Neutral'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">MACD</div>
            <div className="text-lg font-bold" style={{ color: getMACDColor(currentMACD, currentSignal) }}>
              {currentMACD > 0 ? '+' : ''}{currentMACD.toFixed(4)}
            </div>
            <div className="text-xs">
              {currentMACD > currentSignal ? 'Bullish' : 'Bearish'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Buy/Sell Volume</div>
            <div className="text-lg font-bold">
              <span className="text-green-500">{buyVolumePercent.toFixed(0)}%</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-red-500">{(100 - buyVolumePercent).toFixed(0)}%</span>
            </div>
            <div className="text-xs">
              {buyVolumePercent > 60 ? 'Buyer Pressure' : buyVolumePercent < 40 ? 'Seller Pressure' : 'Balanced'}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6 border-b">
          {[
            { key: 'price', label: 'Price Chart', icon: TrendingUp },
            { key: 'rsi', label: 'RSI', icon: Activity },
            { key: 'macd', label: 'MACD', icon: Activity },
            { key: 'volume', label: 'Volume', icon: Volume2 }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeTab === key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(key as any)}
              className="mb-2"
            >
              <Icon className="h-4 w-4 mr-1" />
              {label}
            </Button>
          ))}
        </div>

        {/* Charts */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}