
import React from 'react';
import { Transaction } from '../types';

const ChartBar: React.FC<{ label: string; value: number; maxValue: number; color: string }> = ({ label, value, maxValue, color }) => {
    const barHeight = maxValue > 0 ? `${(value / maxValue) * 100}%` : '0%';
    return (
        <div className="flex flex-col items-center h-full w-1/2">
            <div className="w-10 md:w-12 h-full flex items-end justify-center" title={`$${value.toFixed(2)}`}>
                <div style={{ height: barHeight }} className={`w-full rounded-t-md transition-all duration-500 ease-out ${color}`}></div>
            </div>
            <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{label}</p>
        </div>
    );
};


export const SpendChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const data = React.useMemo(() => {
        const income = transactions.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
        const expenses = transactions.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
        return { income, expenses };
    }, [transactions]);
    
    const maxValue = Math.max(data.income, data.expenses, 1); // Avoid division by zero

    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Income vs. Expenses</h3>
            <div className="h-48 flex justify-around items-end space-x-4">
                <ChartBar label={`Income`} value={data.income} maxValue={maxValue} color="bg-green-500" />
                <ChartBar label={`Expenses`} value={data.expenses} maxValue={maxValue} color="bg-red-500" />
            </div>
        </div>
    );
};
