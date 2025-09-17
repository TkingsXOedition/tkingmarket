
import React, { useState } from 'react';
import { 
  useStockData, useMarketIndices, useCurrencyPairs, 
  mockStocks, mockIndices, mockCurrencies, mockNews,
  generatePriceHistory 
} from '@/utils/stocksApi';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { StockCard } from '@/components/stocks/StockCard';
import { StockChart } from '@/components/stocks/StockChart';
import { MarketOverview } from '@/components/markets/MarketOverview';
import { CurrencyExchange } from '@/components/currencies/CurrencyExchange';
import { XauUsdAnalysis } from '@/components/currencies/XauUsdAnalysis';
import { NewsCard } from '@/components/news/NewsCard';
import { StatsCard } from '@/components/ui/StatsCard';
import { BarChart3, TrendingDown, TrendingUp, Wallet2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedStock, setSelectedStock] = useState(mockStocks[0]);
  
  // Use our hooks to get real-time mock data
  const stocks = useStockData(mockStocks);
  const indices = useMarketIndices(mockIndices);
  const currencies = useCurrencyPairs(mockCurrencies);
  
  // Generate chart data for the selected stock
  const selectedStockHistory = generatePriceHistory(30, selectedStock.price, 2);
  
  // Generate chart data for stock cards
  const stocksWithHistory = stocks.map(stock => {
    return {
      ...stock,
      priceHistory: generatePriceHistory(30, stock.price, 2)
    };
  });
  
  // Calculate market statistics
  const gainers = stocks.filter(stock => stock.changePercent > 0);
  const losers = stocks.filter(stock => stock.changePercent < 0);
  
  const topGainer = [...stocks].sort((a, b) => b.changePercent - a.changePercent)[0];
  const topLoser = [...stocks].sort((a, b) => a.changePercent - b.changePercent)[0];
  
  const totalMarketCap = stocks.reduce((sum, stock) => sum + stock.marketCap, 0);
  const totalVolume = stocks.reduce((sum, stock) => sum + stock.volume, 0);
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        
        <main className="flex-1 transition-all duration-300">
          <div className="container max-w-full p-4 lg:p-6 animate-fade-in">
            <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">TKINGBEAST Trading Platform</h1>
            
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-slide-up" style={{ '--delay': '100ms' } as React.CSSProperties}>
              <StatsCard 
                title="XAU/USD Gold" 
                value="$2,685.45"
                trend={0.33}
                trendLabel="+$8.75"
                icon={<Wallet2 />}
                className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20"
              />
              <StatsCard 
                title="Gold Volume" 
                value="89.4M"
                description="XAU/USD Daily"
                icon={<BarChart3 />}
                className="bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20"
              />
              <StatsCard 
                title="Top Gainer" 
                value={topGainer.symbol}
                trend={topGainer.changePercent}
                trendLabel={topGainer.name}
                icon={<TrendingUp />}
                className="bg-gradient-to-br from-success/10 to-success/5 border-success/20"
              />
              <StatsCard 
                title="Top Loser" 
                value={topLoser.symbol}
                trend={topLoser.changePercent}
                trendLabel={topLoser.name}
                icon={<TrendingDown />}
                className="bg-gradient-to-br from-danger/10 to-danger/5 border-danger/20"
              />
            </div>
            
            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left column - XAU/USD Analysis (Featured) */}
              <div className="lg:col-span-1 space-y-4 animate-slide-up" style={{ '--delay': '200ms' } as React.CSSProperties}>
                <XauUsdAnalysis className="mb-4" />
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Quick Watchlist</h2>
                  {stocksWithHistory.slice(0, 3).map((stock) => (
                    <StockCard 
                      key={stock.symbol} 
                      stock={stock} 
                      priceHistory={stock.priceHistory}
                      onClick={() => setSelectedStock(stock)}
                      className={cn(
                        "transition-all duration-300",
                        selectedStock.symbol === stock.symbol ? "ring-2 ring-primary shadow-lg shadow-primary/20" : ""
                      )}
                    />
                  ))}
                </div>
              </div>
              
              {/* Middle column - Chart and news */}
              <div className="lg:col-span-3 space-y-4 animate-slide-up" style={{ '--delay': '300ms' } as React.CSSProperties}>
                <StockChart 
                  symbol={selectedStock.symbol} 
                  name={selectedStock.name} 
                  currentPrice={selectedStock.price}
                  volatility={2.5}
                />
                <NewsCard news={mockNews} className="mt-6" />
              </div>
              
              {/* Right column - Markets and currencies */}
              <div className="lg:col-span-1 space-y-4 animate-slide-up" style={{ '--delay': '400ms' } as React.CSSProperties}>
                <MarketOverview indices={indices} />
                <CurrencyExchange currencies={currencies} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
