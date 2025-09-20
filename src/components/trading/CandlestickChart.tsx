import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Activity, Volume2, Play, Pause } from 'lucide-react';

interface CandleData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  rsi: number;
  macd: number;
  signal: number;
  buyVolume: number;
  sellVolume: number;
}

interface CandlestickChartProps {
  symbol: string;
  title: string;
  currentPrice: number;
  change: number;
  changePercent: number;
}

// Custom Candlestick Component
const CandlestickBar = (props: any) => {
  const { payload, x, y, width, height } = props;
  if (!payload) return null;

  const { open, high, low, close } = payload;
  const isGreen = close >= open;
  const color = isGreen ? '#22c55e' : '#ef4444';
  
  const bodyHeight = Math.abs(close - open) * height / (payload.high - payload.low);
  const bodyY = y + (Math.max(close, open) - payload.high) * height / (payload.high - payload.low);
  
  const wickTop = y;
  const wickBottom = y + height;
  const wickX = x + width / 2;

  return (
    <g>
      {/* Wick lines */}
      <line
        x1={wickX}
        y1={wickTop}
        x2={wickX}
        y2={wickBottom}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body rectangle */}
      <rect
        x={x + width * 0.2}
        y={bodyY}
        width={width * 0.6}
        height={Math.max(bodyHeight, 2)}
        fill={isGreen ? color : color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};

export function CandlestickChart({ symbol, title, currentPrice, change, changePercent }: CandlestickChartProps) {
  const [activeTab, setActiveTab] = useState<'candlestick' | 'rsi' | 'macd' | 'volume'>('candlestick');
  const [data, setData] = useState<CandleData[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Generate realistic candlestick data
  const generateCandlestickData = () => {
    const candleData: CandleData[] = [];
    let price = currentPrice;
    let prevRSI = 50;
    let prevMACD = 0;
    let prevSignal = 0;
    
    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(Date.now() - (49 - i) * 900000).toISOString(); // 15-minute intervals
      
      // Open price (previous close or start price)
      const open = i === 0 ? price : candleData[i - 1].close;
      
      // Simulate realistic price movement
      const volatility = 0.008;
      const trend = Math.sin(i * 0.2) * 0.003;
      const randomFactor = (Math.random() - 0.5) * volatility;
      
      // High and low with realistic spread
      const priceChange = trend + randomFactor;
      const midPrice = open * (1 + priceChange);
      const spread = Math.abs(priceChange) * 2 + 0.002;
      
      const high = midPrice * (1 + spread * Math.random());
      const low = midPrice * (1 - spread * Math.random());
      const close = low + (high - low) * Math.random();
      
      // RSI calculation (simplified)
      const rsiChange = (Math.random() - 0.5) * 8;
      prevRSI = Math.max(15, Math.min(85, prevRSI + rsiChange));
      
      // MACD calculation (simplified)
      const ema12 = close * 0.15 + (candleData[i - 1]?.close || close) * 0.85;
      const ema26 = close * 0.07 + (candleData[i - 1]?.close || close) * 0.93;
      const macd = (ema12 - ema26) * 1000; // Scaled for visibility
      const signal = prevSignal * 0.9 + macd * 0.1;
      
      // Volume simulation
      const baseVolume = 800000 + Math.random() * 400000;
      const buyRatio = 0.35 + Math.random() * 0.3;

      candleData.push({
        timestamp: timestamp.substring(11, 16), // HH:MM format
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        volume: Math.round(baseVolume),
        rsi: Math.round(prevRSI * 100) / 100,
        macd: Math.round(macd * 1000) / 1000,
        signal: Math.round(signal * 1000) / 1000,
        buyVolume: Math.round(baseVolume * buyRatio),
        sellVolume: Math.round(baseVolume * (1 - buyRatio))
      });

      prevMACD = macd;
      prevSignal = signal;
      price = close;
    }
    
    return candleData;
  };

  useEffect(() => {
    setData(generateCandlestickData());
  }, [currentPrice]);

  // Live update every 45 seconds
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev];
        const lastCandle = newData[newData.length - 1];
        
        // Update current candle or add new one
        const volatility = 0.003;
        const priceChange = (Math.random() - 0.5) * volatility;
        const newClose = lastCandle.close * (1 + priceChange);
        
        // Update the last candle
        newData[newData.length - 1] = {
          ...lastCandle,
          close: Math.round(newClose * 100) / 100,
          high: Math.max(lastCandle.high, newClose),
          low: Math.min(lastCandle.low, newClose),
        };
        
        return newData;
      });
    }, 45000); // Update every 45 seconds
    
    return () => clearInterval(interval);
  }, [isLive]);

  const getRSIColor = (rsi: number) => {
    if (rsi > 70) return '#ef4444';
    if (rsi < 30) return '#22c55e';
    return '#8b5cf6';
  };

  const currentData = data[data.length - 1];
  const currentRSI = currentData?.rsi || 50;
  const currentMACD = currentData?.macd || 0;
  const currentSignal = currentData?.signal || 0;
  const buyVolumePercent = currentData ? 
    (currentData.buyVolume / currentData.volume * 100) : 50;

  const renderChart = () => {
    switch (activeTab) {
      case 'candlestick':
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
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}
              formatter={(value, name, props) => {
                if (name === 'high' || name === 'low' || name === 'open' || name === 'close') {
                  return [`$${Number(value).toFixed(2)}`, name.toUpperCase()];
                }
                return [value, name];
              }}
            />
            <Bar
              dataKey={(entry) => [entry.low, entry.high - entry.low]}
              fill="transparent"
              shape={<CandlestickBar />}
            />
          </ComposedChart>
        );
      case 'rsi':
        return (
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
            <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px'
              }}
              formatter={(value) => [`${Number(value).toFixed(1)}`, 'RSI']}
            />
            <Line type="monotone" dataKey="rsi" stroke="#8b5cf6" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey={() => 70} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey={() => 30} stroke="#22c55e" strokeDasharray="5 5" strokeWidth={2} dot={false} />
          </ComposedChart>
        );
      case 'macd':
        return (
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
            <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px'
              }}
            />
            <Legend />
            <Bar 
              dataKey={(entry) => entry.macd - entry.signal} 
              fill="hsl(var(--muted))"
              name="Histogram"
            />
            <Line type="monotone" dataKey="macd" stroke="#22c55e" strokeWidth={2} dot={false} name="MACD" />
            <Line type="monotone" dataKey="signal" stroke="#ef4444" strokeWidth={2} dot={false} name="Signal" />
          </ComposedChart>
        );
      case 'volume':
        return (
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" strokeOpacity={0.2} />
            <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px'
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
    <Card className="w-full glass border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <span className="gradient-text">{title}</span>
              <span className="text-lg text-muted-foreground">({symbol})</span>
            </CardTitle>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-3xl font-bold gradient-text">${currentPrice.toFixed(2)}</span>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${changePercent >= 0 ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                {changePercent >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-bold">
                  {changePercent >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={isLive ? "default" : "outline"}
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className="gradient-primary text-white"
            >
              {isLive ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isLive ? 'LIVE' : 'PAUSED'}
            </Button>
          </div>
        </div>
        
        {/* Technical Indicators Summary */}
        <div className="grid grid-cols-3 gap-4 mt-6 p-4 glass rounded-xl">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">RSI (14)</div>
            <div className="text-2xl font-bold" style={{ color: getRSIColor(currentRSI) }}>
              {currentRSI.toFixed(1)}
            </div>
            <div className="text-xs font-medium">
              {currentRSI > 70 ? '🔴 Overbought' : currentRSI < 30 ? '🟢 Oversold' : '🟡 Neutral'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">MACD</div>
            <div className="text-2xl font-bold text-primary">
              {currentMACD > 0 ? '+' : ''}{currentMACD.toFixed(3)}
            </div>
            <div className="text-xs font-medium">
              {currentMACD > currentSignal ? '🟢 Bullish' : '🔴 Bearish'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Volume Bias</div>
            <div className="text-xl font-bold">
              <span className="text-success">{buyVolumePercent.toFixed(0)}%</span>
              <span className="text-muted-foreground mx-1">/</span>
              <span className="text-danger">{(100 - buyVolumePercent).toFixed(0)}%</span>
            </div>
            <div className="text-xs font-medium">
              {buyVolumePercent > 60 ? '🟢 Buying Pressure' : buyVolumePercent < 40 ? '🔴 Selling Pressure' : '⚪ Balanced'}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6 p-1 glass rounded-lg">
          {[
            { key: 'candlestick', label: 'Candlestick', icon: TrendingUp },
            { key: 'rsi', label: 'RSI', icon: Activity },
            { key: 'macd', label: 'MACD', icon: Activity },
            { key: 'volume', label: 'Volume', icon: Volume2 }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activeTab === key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(key as any)}
              className={activeTab === key ? "gradient-primary text-white" : ""}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        {/* Charts */}
        <div className="h-96 p-4 glass rounded-xl">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}