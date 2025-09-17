
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Treemap, LineChart, Line } from 'recharts';
import { mockStocks, mockCryptos, generatePriceHistory, formatNumber } from '@/utils/stocksApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bitcoin, TrendingUp, TrendingDown } from 'lucide-react';

const Analysis = () => {
  // Mock data for sector performance
  const sectorPerformance = [
    { name: 'Technology', value: 8.2 },
    { name: 'Healthcare', value: 3.5 },
    { name: 'Financials', value: -1.2 },
    { name: 'Consumer', value: 2.8 },
    { name: 'Energy', value: -2.5 },
    { name: 'Materials', value: 0.9 },
    { name: 'Utilities', value: -0.7 },
  ];
  
  // Mock data for risk assessment
  const riskData = [
    { name: 'Volatility', value: 65 },
    { name: 'Correlation', value: 42 },
    { name: 'Downside Risk', value: 38 },
    { name: 'Sharpe Ratio', value: 78 },
    { name: 'Liquidity', value: 85 },
  ];
  
  // Mock data for portfolio distribution
  const distributionData = [
    { name: 'Large Cap', value: 55 },
    { name: 'Mid Cap', value: 30 },
    { name: 'Small Cap', value: 15 },
  ];
  
  // Format stock data for the heatmap (treemap)
  const stockGrowthData = mockStocks
    .map(stock => ({
      name: stock.symbol,
      value: Math.abs(stock.changePercent),
      changePercent: stock.changePercent
    }))
    .sort((a, b) => b.changePercent - a.changePercent);
  
  // Format cryptocurrency data for analysis
  const cryptoData = mockCryptos
    .map(crypto => ({
      name: crypto.name,
      symbol: crypto.symbol,
      value: crypto.marketCap,
      price: crypto.price,
      change: crypto.changePercent,
      marketCap: crypto.marketCap,
      volume: crypto.volume
    }))
    .sort((a, b) => b.value - a.value);
  
  // Generate price history for Bitcoin and Ethereum
  const [btcHistory, setBtcHistory] = useState(generatePriceHistory(30, 62000, 5));
  const [ethHistory, setEthHistory] = useState(generatePriceHistory(30, 3200, 6));
  
  // Format historical data for charts
  const btcHistoryData = btcHistory.map((price, index) => ({
    day: index + 1,
    price
  }));
  
  const ethHistoryData = ethHistory.map((price, index) => ({
    day: index + 1,
    price
  }));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Custom content for the treemap
  const CustomizedContent = (props: any) => {
    const { root, depth, x, y, width, height, index, name, changePercent, value } = props;
    
    // Color based on change percent (green for positive, red for negative)
    const color = changePercent >= 0 ? "#4ade80" : "#f87171";
    const cellValue = changePercent >= 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: color,
            stroke: '#fff',
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />
        {width > 50 && height > 30 ? (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 6}
              textAnchor="middle"
              fill="#fff"
              fontSize={14}
              fontWeight="bold"
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 12}
              textAnchor="middle"
              fill="#fff"
              fontSize={12}
            >
              {cellValue}
            </text>
          </>
        ) : null}
      </g>
    );
  };
  
  return (
    <PageLayout title="Market Analysis">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Sector Performance (YTD)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sectorPerformance}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
                <Bar 
                  dataKey="value" 
                  name="YTD Performance" 
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                >
                  {sectorPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#4ade80' : '#f87171'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="lg:col-span-2 bg-card rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Stock Performance Heatmap</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={stockGrowthData}
                dataKey="value"
                aspectRatio={4/3}
                stroke="#fff"
                fill="#8884d8"
                content={<CustomizedContent />}
              />
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Showing performance by percentage change. Green indicates positive growth, red indicates decline.</p>
          </div>
        </div>
        
        {/* Cryptocurrency Analysis Section */}
        <div className="lg:col-span-2 mt-4">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Bitcoin className="text-orange-500" />
            Cryptocurrency Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cryptoData.slice(0, 4).map((crypto) => (
              <Card key={crypto.symbol} className="bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex justify-between">
                    <span className="flex items-center gap-1">
                      <span className="font-bold">{crypto.symbol}</span>
                      <span className="text-muted-foreground text-sm">{crypto.name}</span>
                    </span>
                    {crypto.change >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${crypto.price < 1 ? crypto.price.toFixed(4) : crypto.price.toFixed(2)}</div>
                  <div className={`text-sm ${crypto.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Volume:</span>
                      <span>{formatNumber(crypto.volume)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Market Cap:</span>
                      <span>{formatNumber(crypto.marketCap)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bitcoin className="h-5 w-5 text-orange-500" />
                  Bitcoin Price History (30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={btcHistoryData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <XAxis dataKey="day" />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']} />
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#f7931a" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">Ξ</div>
                  Ethereum Price History (30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ethHistoryData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <XAxis dataKey="day" />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']} />
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3c3c3d" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6 bg-card shadow">
            <CardHeader>
              <CardTitle>Top Cryptocurrencies by Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">#</th>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-right py-3 px-4">Price</th>
                      <th className="text-right py-3 px-4">24h %</th>
                      <th className="text-right py-3 px-4">Market Cap</th>
                      <th className="text-right py-3 px-4">Volume (24h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cryptoData.map((crypto, index) => (
                      <tr key={crypto.symbol} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4 font-medium">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{crypto.symbol}</span>
                            <span className="text-muted-foreground">{crypto.name}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">
                          ${crypto.price < 1 ? crypto.price.toFixed(4) : crypto.price.toFixed(2)}
                        </td>
                        <td className={`text-right py-3 px-4 ${crypto.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                        </td>
                        <td className="text-right py-3 px-4">{formatNumber(crypto.marketCap)}</td>
                        <td className="text-right py-3 px-4">{formatNumber(crypto.volume)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Risk Assessment</h2>
          <div className="space-y-4">
            {riskData.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.name}</span>
                  <span className="font-medium">{item.value}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      item.value >= 70 ? 'bg-green-500' : item.value >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Market Capitalization Distribution</h2>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Technical Indicators</h2>
          <div className="space-y-4">
            <div className="flex justify-between p-3 border rounded-md">
              <div>
                <h3 className="font-medium">S&P 500</h3>
                <p className="text-sm text-muted-foreground">Moving Averages</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-500">BUY</p>
                <p className="text-sm">12 of 15 indicators</p>
              </div>
            </div>
            <div className="flex justify-between p-3 border rounded-md">
              <div>
                <h3 className="font-medium">Nasdaq</h3>
                <p className="text-sm text-muted-foreground">Moving Averages</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-500">BUY</p>
                <p className="text-sm">10 of 15 indicators</p>
              </div>
            </div>
            <div className="flex justify-between p-3 border rounded-md">
              <div>
                <h3 className="font-medium">Dow Jones</h3>
                <p className="text-sm text-muted-foreground">Moving Averages</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-yellow-500">NEUTRAL</p>
                <p className="text-sm">8 of 15 indicators</p>
              </div>
            </div>
            <div className="flex justify-between p-3 border rounded-md">
              <div>
                <h3 className="font-medium">Russell 2000</h3>
                <p className="text-sm text-muted-foreground">Moving Averages</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-red-500">SELL</p>
                <p className="text-sm">4 of 15 indicators</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Analysis;
