import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { TransactionList } from '../components/TransactionList';
import { api } from '../services/api';
import { User, Transaction, Bank } from '../types';
import { ArrowUpTrayIcon, ArrowDownTrayIcon, BanknotesIcon, ChatBubbleOvalLeftEllipsisIcon, ShieldCheckIcon } from '../components/icons';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Link } from 'react-router-dom';
import { SpendChart } from '../components/SpendChart';
import { VirtualCard } from '../components/VirtualCard';

const BankSelector: React.FC<{ banks: Bank[], selectedBank: Bank | null, onSelect: (bank: Bank) => void }> = ({ banks, selectedBank, onSelect }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Partner Banks</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {banks.map(bank => (
                    <button key={bank.id} onClick={() => onSelect(bank)} className={`p-3 border-2 rounded-lg text-center transition-colors ${selectedBank?.id === bank.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'}`}>
                        <img src={bank.logoUrl} alt={bank.name} className="w-10 h-10 mx-auto rounded-full mb-2" />
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{bank.name}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}

export const DashboardPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDepositModalOpen, setDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const [amount, setAmount] = useState<number | ''>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashboardData, banksData] = await Promise.all([
                    api.getDashboardData(),
                    api.getPartnerBanks()
                ]);
                setUser(dashboardData.user);
                setRecentTransactions(dashboardData.recentTransactions);
                setBanks(banksData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    
    const handleTransaction = async (type: 'deposit' | 'withdraw') => {
        if (typeof amount !== 'number' || amount <= 0) return;
        try {
            const response = type === 'deposit' ? await api.makeDeposit(amount) : await api.makeWithdrawal(amount);
            if (response.success && user) {
                setUser({ ...user, balance: response.newBalance });
            }
        } catch (error) {
            console.error(`Failed to make ${type}:`, error);
            alert((error as {message: string}).message || 'Transaction failed.');
        } finally {
            setAmount('');
            setDepositModalOpen(false);
            setWithdrawModalOpen(false);
        }
    }
    
    const handleBankSelection = (bank: Bank) => {
        if(user){
            setUser({...user, partnerBank: bank});
        }
    }

    if (loading) {
        return <div className="text-center p-8">Loading dashboard...</div>;
    }

    if (!user) {
        return <div className="text-center p-8 text-red-500">Failed to load user data.</div>;
    }

    return (
        <div className="relative">
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Welcome back, {user.name}!</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                       <VirtualCard user={user} />
                        <Card>
                          <SpendChart transactions={recentTransactions} />
                        </Card>
                    </div>
                    
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                             <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Balance (USD)</p>
                                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                    <Button onClick={() => setDepositModalOpen(true)} fullWidth><ArrowDownTrayIcon className="w-5 h-5 mr-2"/> Deposit</Button>
                                    <Button onClick={() => setWithdrawModalOpen(true)} variant="secondary" fullWidth><ArrowUpTrayIcon className="w-5 h-5 mr-2"/> Withdraw</Button>
                                </div>
                             </div>
                        </Card>
                         <Card>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Quick Actions</h3>
                            <div className="space-y-3">
                               <Link to="/loan" className="block"><Button fullWidth variant="ghost"><BanknotesIcon className="w-5 h-5 mr-2"/> Apply for Loan</Button></Link>
                               <Link to="/kyc" className="block"><Button fullWidth variant="ghost">Complete KYC Verification</Button></Link>
                               <Link to="/transactions" className="block"><Button fullWidth variant="ghost">View All Transactions</Button></Link>
                               <Link to="/admin" className="block"><Button fullWidth variant="ghost"><ShieldCheckIcon className="w-5 h-5 mr-2" />Admin Panel</Button></Link>
                            </div>
                        </Card>
                        <Card>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Recent Transactions</h3>
                            <TransactionList transactions={recentTransactions} limit={3} />
                        </Card>
                    </div>
                </div>

                <Card>
                    <BankSelector banks={banks} selectedBank={user.partnerBank} onSelect={handleBankSelection} />
                </Card>
            </div>

            <Link 
                to="/support"
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 z-30"
                aria-label="Open support chat"
            >
                <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
            </Link>
            
            <Modal isOpen={isDepositModalOpen} onClose={() => setDepositModalOpen(false)} title="Make a Deposit">
                <div className="space-y-4">
                    <Input id="depositAmount" label="Amount" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} placeholder="0.00" />
                    <Button onClick={() => handleTransaction('deposit')} fullWidth>Confirm Deposit</Button>
                </div>
            </Modal>

             <Modal isOpen={isWithdrawModalOpen} onClose={() => setWithdrawModalOpen(false)} title="Make a Withdrawal">
                <div className="space-y-4">
                    <Input id="withdrawAmount" label="Amount" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} placeholder="0.00" />
                    <Button onClick={() => handleTransaction('withdraw')} fullWidth>Confirm Withdrawal</Button>
                </div>
            </Modal>
        </div>
    );
};