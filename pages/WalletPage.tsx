import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { api } from '../services/api';
import { WalletCurrency } from '../types';
import { WalletIcon } from '../components/icons';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

const MOCK_RATES = {
    'USD': 1.0,
    'EUR': 0.92,
    'GBP': 0.79,
    'INR': 83.31,
};

const CurrencyConverter: React.FC = () => {
    const [amount, setAmount] = useState<number | ''>(100);
    const [from, setFrom] = useState<'USD' | 'EUR' | 'GBP' | 'INR'>('USD');
    const [to, setTo] = useState<'USD' | 'EUR' | 'GBP' | 'INR'>('INR');
    const [result, setResult] = useState<number | null>(null);

    useEffect(() => {
        if(typeof amount === 'number' && amount > 0) {
            const baseAmount = amount / MOCK_RATES[from];
            const convertedAmount = baseAmount * MOCK_RATES[to];
            setResult(convertedAmount);
        } else {
            setResult(null);
        }
    }, [amount, from, to]);
    
    const CurrencySelect: React.FC<{id: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void}> = ({id, value, onChange}) => (
        <select id={id} value={value} onChange={onChange} className="w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
        </select>
    );

    return (
        <Card>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Currency Converter</h3>
            <div className="space-y-4">
                <Input id="convertAmount" label="Amount to Convert" type="number" value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">From</label>
                        <CurrencySelect id="fromCurrency" value={from} onChange={(e) => setFrom(e.target.value as any)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">To</label>
                        <CurrencySelect id="toCurrency" value={to} onChange={(e) => setTo(e.target.value as any)} />
                    </div>
                </div>
                {result !== null && (
                    <div className="text-center bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Converted Amount</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.toFixed(2)} {to}</p>
                    </div>
                )}
                <Button fullWidth variant="secondary">Simulate Conversion</Button>
            </div>
        </Card>
    );
}

export const WalletPage: React.FC = () => {
  const [wallet, setWallet] = useState<WalletCurrency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const data = await api.getWalletData();
        setWallet(data);
      } catch (error) {
        console.error('Failed to fetch wallet data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading wallet...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Multi-Currency Wallet</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {wallet.map((currency) => (
              <Card key={currency.code}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{currency.name} ({currency.code})</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                      {currency.symbol}{currency.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                    <WalletIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </Card>
            ))}
        </div>
        <div className="lg:col-span-1">
            <CurrencyConverter />
        </div>
      </div>
    </div>
  );
};