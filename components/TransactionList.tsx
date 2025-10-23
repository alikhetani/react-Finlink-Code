
import React from 'react';
import { Transaction } from '../types';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, BanknotesIcon } from './icons';

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

const TransactionIcon: React.FC<{ type: Transaction['type'] }> = ({ type }) => {
    const iconClass = "w-6 h-6 mr-4";
    switch (type) {
        case 'Deposit':
            return <ArrowDownTrayIcon className={`${iconClass} text-green-500`} />;
        case 'Withdrawal':
            return <ArrowUpTrayIcon className={`${iconClass} text-red-500`} />;
        case 'Loan Disbursement':
             return <BanknotesIcon className={`${iconClass} text-blue-500`} />;
        default:
            return <BanknotesIcon className={`${iconClass} text-slate-500`} />;
    }
};

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, limit }) => {
  const items = limit ? transactions.slice(0, limit) : transactions;

  if (items.length === 0) {
    return <p className="text-center text-slate-500 dark:text-slate-400 py-4">No transactions yet.</p>;
  }

  return (
    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
      {items.map(tx => (
        <li key={tx.id} className="py-4 flex items-center justify-between">
          <div className="flex items-center">
            <TransactionIcon type={tx.type} />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{tx.description}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{tx.date}</p>
            </div>
          </div>
          <p className={`text-sm font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
          </p>
        </li>
      ))}
    </ul>
  );
};
