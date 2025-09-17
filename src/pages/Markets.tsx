
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { MarketOverview } from '@/components/markets/MarketOverview';
import { useMarketIndices, mockIndices } from '@/utils/stocksApi';

const Markets = () => {
  const indices = useMarketIndices(mockIndices);
  
  return (
    <PageLayout title="Markets Overview">
      <div className="grid grid-cols-1 gap-6">
        <MarketOverview indices={indices} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {indices.map((index) => (
            <div key={index.symbol} className="bg-card rounded-lg p-6 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{index.name}</h3>
                  <p className="text-muted-foreground text-sm">{index.region}</p>
                </div>
                <div className={`text-lg font-bold ${index.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold">{index.value.toFixed(2)}</span>
                <span className={`ml-2 ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Last updated: {new Date(index.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Markets;
