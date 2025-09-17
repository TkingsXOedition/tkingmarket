
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useMarketIndices, mockIndices } from '@/utils/stocksApi';
import { Globe } from 'lucide-react';

const Global = () => {
  const indices = useMarketIndices(mockIndices);
  
  const regions = [
    { name: 'North America', markets: ['United States', 'Canada'] },
    { name: 'Europe', markets: ['United Kingdom', 'Germany', 'France', 'Switzerland'] },
    { name: 'Asia-Pacific', markets: ['Japan', 'China', 'Hong Kong', 'Australia'] },
  ];
  
  return (
    <PageLayout title="Global Markets">
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-card rounded-lg p-6 shadow">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">World Markets Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {regions.map((region) => (
              <div key={region.name} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{region.name}</h3>
                <ul className="space-y-2">
                  {region.markets.map((market) => {
                    const index = indices.find(i => i.region === market);
                    return (
                      <li key={market} className="flex justify-between items-center">
                        <span>{market}</span>
                        {index ? (
                          <span className={index.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Economic Calendar</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Time</th>
                  <th className="text-left py-2 px-4">Region</th>
                  <th className="text-left py-2 px-4">Event</th>
                  <th className="text-left py-2 px-4">Impact</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4">08:30 AM</td>
                  <td className="py-2 px-4">United States</td>
                  <td className="py-2 px-4">Non-Farm Payrolls</td>
                  <td className="py-2 px-4">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">High</span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">10:00 AM</td>
                  <td className="py-2 px-4">Eurozone</td>
                  <td className="py-2 px-4">ECB Interest Rate Decision</td>
                  <td className="py-2 px-4">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">High</span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">02:00 PM</td>
                  <td className="py-2 px-4">United Kingdom</td>
                  <td className="py-2 px-4">GDP (QoQ)</td>
                  <td className="py-2 px-4">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Medium</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Global;
