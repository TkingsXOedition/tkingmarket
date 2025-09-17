
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, BarChart3Icon } from 'lucide-react';
import { Stock, formatCurrency, formatPercentage, formatNumber, formatDate } from '@/utils/stocksApi';
import { Sparkline } from '@/components/stocks/Sparkline';
import { cn } from '@/lib/utils';

interface StockCardProps {
  stock: Stock;
  priceHistory?: number[];
  className?: string;
  onClick?: () => void;
}

export function StockCard({ stock, priceHistory, className, onClick }: StockCardProps) {
  const isPositive = stock.change >= 0;
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md bg-card/50 backdrop-blur-sm",
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold leading-none">{stock.symbol}</CardTitle>
          <p className="text-xs text-muted-foreground truncate max-w-[180px]">{stock.name}</p>
        </div>
        <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-2xl font-bold">{formatCurrency(stock.price)}</div>
            <div className="flex items-center text-xs">
              <span className={cn(
                "inline-flex items-center",
                isPositive ? "text-success" : "text-danger"
              )}>
                {isPositive ? 
                  <ArrowUpIcon className="h-3 w-3 mr-1" /> : 
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                }
                {formatCurrency(Math.abs(stock.change))} ({formatPercentage(stock.changePercent)})
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="text-muted-foreground">Volume:</div>
              <div className="text-right">{formatNumber(stock.volume)}</div>
              <div className="text-muted-foreground">Mkt Cap:</div>
              <div className="text-right">{formatNumber(stock.marketCap)}</div>
              <div className="text-muted-foreground">Updated:</div>
              <div className="text-right">{formatDate(stock.lastUpdated)}</div>
            </div>
          </div>
          <div className="h-24">
            {priceHistory && priceHistory.length > 0 && (
              <Sparkline 
                data={priceHistory} 
                color={isPositive ? 'rgb(var(--success))' : 'rgb(var(--danger))'}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
