
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { CurrencyExchange } from '@/components/currencies/CurrencyExchange';
import { useCurrencyPairs, mockCurrencies } from '@/utils/stocksApi';

const Currencies = () => {
  const currencies = useCurrencyPairs(mockCurrencies);
  
  return (
    <PageLayout title="Currency Exchange">
      <div className="grid grid-cols-1 gap-6">
        <CurrencyExchange currencies={currencies} />
        
        <div className="bg-card rounded-lg p-6 shadow mt-6">
          <h2 className="text-xl font-semibold mb-4">Currency Converter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">From</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input 
                  type="number" 
                  defaultValue="1000" 
                  className="w-full px-3 py-2 border rounded-md" 
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">To</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="EUR">EUR - Euro</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Converted Amount</label>
                <div className="w-full px-3 py-2 border rounded-md bg-gray-50">
                  €1,083.40
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Currencies;
