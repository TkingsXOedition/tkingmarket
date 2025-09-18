
import React from 'react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold gradient-text mb-8">TKINGBEAST Trading Platform</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border border-border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-2">Market Overview</h2>
          <p className="text-muted-foreground">XAU/USD: $2,685.45</p>
          <p className="text-success">+0.33% (+$8.75)</p>
        </div>
        <div className="p-6 border border-border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-2">Portfolio</h2>
          <p className="text-muted-foreground">Total Value: $125,890</p>
          <p className="text-success">+2.4% Today</p>
        </div>
        <div className="p-6 border border-border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-2">Market Status</h2>
          <p className="text-muted-foreground">Markets Open</p>
          <p className="text-warning">Closes in 3h 45m</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
