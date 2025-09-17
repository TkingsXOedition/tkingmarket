
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';
import { generatePriceHistory } from '@/utils/stocksApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const timeRanges = [
  { label: '1D', days: 1, interval: 24 },
  { label: '1W', days: 7, interval: 7 },
  { label: '1M', days: 30, interval: 30 },
  { label: '3M', days: 90, interval: 30 },
  { label: '1Y', days: 365, interval: 52 },
  { label: 'All', days: 1825, interval: 104 },
];

interface StockChartProps {
  symbol: string;
  name: string;
  currentPrice: number;
  volatility?: number;
  className?: string;
}

export function StockChart({ 
  symbol, 
  name,
  currentPrice,
  volatility = 2,
  className
}: StockChartProps) {
  const [selectedRange, setSelectedRange] = useState(timeRanges[2]); // Default to 1M
  
  const chartData = useMemo(() => {
    const prices = generatePriceHistory(selectedRange.days, currentPrice, volatility);
    const data = [];
    
    // Calculate dates going backward from today
    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    
    for (let i = 0; i < prices.length; i++) {
      const date = new Date(now.getTime() - (selectedRange.days - i) * msPerDay);
      data.push({
        date: date.toLocaleDateString('en-US', { 
          month: selectedRange.days > 90 ? 'short' : 'numeric', 
          day: 'numeric',
          year: selectedRange.days > 90 ? '2-digit' : undefined
        }),
        price: prices[i]
      });
    }
    
    return data;
  }, [selectedRange, currentPrice, volatility]);
  
  // Calculate min and max for Y axis with some padding
  const minPrice = Math.min(...chartData.map(d => d.price)) * 0.98;
  const maxPrice = Math.max(...chartData.map(d => d.price)) * 1.02;
  
  const formatYAxis = (value: number) => {
    return `$${value.toFixed(2)}`;
  };
  
  return (
    <Card className={cn("overflow-hidden h-full", className)}>
      <CardHeader className="flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="leading-none">{symbol}</CardTitle>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
        <div className="flex gap-1">
          {timeRanges.map((range) => (
            <Button 
              key={range.label} 
              variant={selectedRange.label === range.label ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedRange(range)}
              className="h-7 px-2 text-xs"
            >
              {range.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        <div className="h-[300px] w-full px-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="hsl(var(--border))" 
              />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                tickMargin={10}
                interval={Math.floor(chartData.length / selectedRange.interval)}
              />
              <YAxis 
                domain={[minPrice, maxPrice]} 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10 }}
                tickMargin={10}
                tickFormatter={formatYAxis}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1}
                fill="url(#colorPrice)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
