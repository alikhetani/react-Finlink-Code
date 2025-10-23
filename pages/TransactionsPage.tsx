import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { TransactionList } from '../components/TransactionList';
import { api } from '../services/api';
import { Transaction, TransactionType } from '../types';
import { Button } from '../components/Button';
import { DocumentTextIcon } from '../components/icons';

export const TransactionsPage: React.FC = () => {
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await api.getAllTransactions();
                setAllTransactions(data);
                setFilteredTransactions(data);
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    useEffect(() => {
        if (filterType === 'All') {
            setFilteredTransactions(allTransactions);
        } else {
            setFilteredTransactions(allTransactions.filter(tx => tx.type === filterType));
        }
    }, [filterType, allTransactions]);

    const handleDownload = () => {
        // This is a simulation. In a real app, this would generate a PDF.
        alert('Downloading your transaction statement...');
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                 <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Transaction History</h1>
                 <div className="flex items-center gap-4">
                    <select
                        id="filterType"
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        className="w-full sm:w-auto rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                        aria-label="Filter transactions by type"
                    >
                        <option value="All">All Types</option>
                        {Object.values(TransactionType).map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <Button variant="secondary" onClick={handleDownload}>
                        <DocumentTextIcon className="w-5 h-5 mr-2" />
                        Download
                    </Button>
                 </div>
            </div>
            <Card>
                {loading ? (
                    <p className="text-center p-8">Loading transactions...</p>
                ) : (
                    <TransactionList transactions={filteredTransactions} />
                )}
            </Card>
        </div>
    );
};