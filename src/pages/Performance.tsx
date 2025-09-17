
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generatePriceHistory } from '@/utils/stocksApi';

const Performance = () => {
  // Generate mock performance data
  const generatePerformanceData = () => {
    const baseValue = 10000;
    const volatility = 1.5;
    const days = 30;
    const portfolioValues = [baseValue];
    const marketValues = [baseValue];
    
    const dates = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    for (let i = 1; i < days; i++) {
      const portfolioChange = (Math.random() - 0.45) * volatility;
      const marketChange = (Math.random() - 0.5) * (volatility * 0.8);
      
      portfolioValues.push(
        parseFloat((portfolioValues[i-1] * (1 + portfolioChange / 100)).toFixed(2))
      );
      
      marketValues.push(
        parseFloat((marketValues[i-1] * (1 + marketChange / 100)).toFixed(2))
      );
    }
    
    return dates.map((date, i) => ({
      date,
      portfolio: portfolioValues[i],
      market: marketValues[i]
    }));
  };
  
  const performanceData = generatePerformanceData();
  
  // Calculate performance metrics
  const initialPortfolio = performanceData[0].portfolio;
  const currentPortfolio = performanceData[performanceData.length - 1].portfolio;
  const totalReturn = ((currentPortfolio - initialPortfolio) / initialPortfolio) * 100;
  
  // Mock sector allocation data
  const sectorAllocation = [
    { name: 'Technology', value: 45 },
    { name: 'Healthcare', value: 20 },
    { name: 'Financials', value: 15 },
    { name: 'Consumer', value: 10 },
    { name: 'Energy', value: 5 },
    { name: 'Other', value: 5 }
  ];
  
  return (
    <PageLayout title="Performance">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-card rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Portfolio Performance</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 100', 'dataMax + 100']} />
                  <Tooltip formatter={(value) => [`$${typeof value === 'number' ? value.toFixed(2) : value}`, '']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="portfolio" 
                    name="Your Portfolio" 
                    stroke="#8884d8" 
                    strokeWidth={2} 
                    dot={false} 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="market" 
                    name="S&P 500" 
                    stroke="#82ca9d" 
                    strokeWidth={2} 
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Performance Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Return</p>
                <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Initial Investment</p>
                <p className="text-xl font-bold">${initialPortfolio.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Value</p>
                <p className="text-xl font-bold">${currentPortfolio.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Absolute Return</p>
                <p className={`text-xl font-bold ${(currentPortfolio - initialPortfolio) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${(currentPortfolio - initialPortfolio).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Sector Allocation</h2>
            <div className="space-y-4">
              {sectorAllocation.map((sector) => (
                <div key={sector.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{sector.name}</span>
                    <span className="font-medium">{sector.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${sector.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Monthly Returns (%)</h2>
            <div className="grid grid-cols-3 gap-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => {
                const returnValue = (Math.random() * 6) - 2;
                return (
                  <div key={month} className="text-center p-2">
                    <p className="text-xs text-muted-foreground">{month}</p>
                    <p className={`text-sm font-medium ${returnValue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {returnValue >= 0 ? '+' : ''}{returnValue.toFixed(2)}%
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Performance;
