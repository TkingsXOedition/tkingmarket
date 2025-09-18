import { useState, useEffect } from 'react';
// Using simulated live data - can be upgraded to real APIs later

interface LiveMarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  lastUpdated: string;
}

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

export const useLiveMarketData = (symbols: string[]) => {
  const [marketData, setMarketData] = useState<Record<string, LiveMarketData>>({});
  const [technicalData, setTechnicalData] = useState<Record<string, TechnicalData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(fetchLiveData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [symbols]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([fetchMarketData(), fetchTechnicalData()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLiveData = async () => {
    try {
      await Promise.all([fetchMarketData(), fetchTechnicalData()]);
    } catch (err) {
      console.error('Live data update failed:', err);
    }
  };

  const fetchMarketData = async () => {
    // Simulate live market data updates
    const simulatedData: Record<string, LiveMarketData> = {};
    
    for (const symbol of symbols) {
      const basePrice = getBasePrice(symbol);
      const volatility = getVolatility(symbol);
      const change = (Math.random() - 0.5) * volatility;
      const price = basePrice + change;
      const changePercent = (change / basePrice) * 100;
      
      simulatedData[symbol] = {
        symbol,
        price: Number(price.toFixed(2)),
        change: Number(change.toFixed(2)),
        changePercent: Number(changePercent.toFixed(2)),
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        marketCap: symbol.includes('USD') ? undefined : Math.floor(Math.random() * 1000000000000),
        lastUpdated: new Date().toISOString()
      };
    }
    
    setMarketData(simulatedData);
    
    // Store in localStorage for demo persistence
    try {
      localStorage.setItem('live_market_data', JSON.stringify(simulatedData));
    } catch (error) {
      console.error('Failed to store market data:', error);
    }
  };

  const fetchTechnicalData = async () => {
    const simulatedTechnical: Record<string, TechnicalData> = {};
    
    for (const symbol of symbols) {
      const rsi = Math.random() * 100;
      const macd = (Math.random() - 0.5) * 2;
      const buyerPercent = Math.random() * 100;
      const sellerPercent = 100 - buyerPercent;
      
      let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
      if (rsi > 70 && macd > 0) sentiment = 'bullish';
      else if (rsi < 30 && macd < 0) sentiment = 'bearish';
      
      simulatedTechnical[symbol] = {
        symbol,
        rsi: Number(rsi.toFixed(2)),
        macd: Number(macd.toFixed(4)),
        movingAverage20: getBasePrice(symbol) + (Math.random() - 0.5) * 10,
        volumeRatio: Math.random() * 2 + 0.5,
        sentiment,
        buyerVolumePercent: Number(buyerPercent.toFixed(1)),
        sellerVolumePercent: Number(sellerPercent.toFixed(1)),
        lastUpdated: new Date().toISOString()
      };
    }
    
    setTechnicalData(simulatedTechnical);
    
    // Store in localStorage for demo persistence
    try {
      localStorage.setItem('live_technical_data', JSON.stringify(simulatedTechnical));
    } catch (error) {
      console.error('Failed to store technical data:', error);
    }
  };

  const getBasePrice = (symbol: string): number => {
    const basePrices: Record<string, number> = {
      'XAU/USD': 2650,
      'EUR/USD': 1.0850,
      'GBP/USD': 1.2750,
      'USD/JPY': 149.50,
      'AAPL': 175.50,
      'GOOGL': 135.25,
      'MSFT': 415.75,
      'TSLA': 245.30,
      'NVDA': 875.20,
      'BTC/USD': 67500,
      'ETH/USD': 3850,
    };
    return basePrices[symbol] || 100;
  };

  const getVolatility = (symbol: string): number => {
    const volatilities: Record<string, number> = {
      'XAU/USD': 25,
      'EUR/USD': 0.005,
      'GBP/USD': 0.008,
      'USD/JPY': 0.5,
      'AAPL': 5,
      'GOOGL': 8,
      'MSFT': 6,
      'TSLA': 15,
      'NVDA': 20,
      'BTC/USD': 2500,
      'ETH/USD': 150,
    };
    return volatilities[symbol] || 1;
  };

  return {
    marketData,
    technicalData,
    isLoading,
    error,
    refetch: fetchInitialData
  };
};