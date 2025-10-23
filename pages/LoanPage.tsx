import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { api } from '../services/api';
import { Loan } from '../types';

const StatusBadge: React.FC<{ status: Loan['status'] }> = ({ status }) => {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
    const statusClasses = {
        Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
        Approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
        Rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
    };
    return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};


const LoanHistory: React.FC = () => {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const userLoans = await api.getUserLoans();
                setLoans(userLoans);
            } catch (error) {
                console.error("Failed to fetch loans", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLoans();
    }, []);

    if (loading) return <p>Loading loan history...</p>;

    return (
        <Card>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Loan History & Tracker</h3>
            {loans.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400">No loan history found.</p>
            ) : (
                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                    {loans.map(loan => (
                        <li key={loan.id} className="py-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-800 dark:text-slate-200">${loan.amount.toLocaleString()}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{loan.purpose}</p>
                                </div>
                                <StatusBadge status={loan.status} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
};


const EMICalculator: React.FC = () => {
    const [p, setP] = useState(10000);
    const [r, setR] = useState(10);
    const [n, setN] = useState(5);
    const [emi, setEmi] = useState(0);

    useEffect(() => {
        const rate = r / 12 / 100;
        const tenure = n * 12;
        if (rate > 0 && tenure > 0) {
            const emiVal = (p * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
            setEmi(emiVal);
        } else if (tenure > 0) {
            setEmi(p / tenure);
        } else {
            setEmi(0);
        }
    }, [p, r, n]);

    return (
        <Card>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">EMI Calculator</h3>
            <div className="space-y-4">
                 <Input id="emiLoanAmount" label="Loan Amount ($)" type="number" value={p} onChange={e => setP(Number(e.target.value))} />
                 <Input id="emiInterestRate" label="Interest Rate (%)" type="number" value={r} onChange={e => setR(Number(e.target.value))} />
                 <Input id="emiLoanTenure" label="Loan Tenure (Years)" type="number" value={n} onChange={e => setN(Number(e.target.value))} />
                 <div className="text-center bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly EMI</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${emi.toFixed(2)}</p>
                 </div>
            </div>
        </Card>
    );
};

export const LoanPage: React.FC = () => {
  const [amount, setAmount] = useState<number | ''>('');
  const [purpose, setPurpose] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const validate = () => {
    const newErrors: { [key:string]: string } = {};
    if (typeof amount !== 'number' || amount <= 0) {
      newErrors.amount = 'Please enter a valid loan amount.';
    }
    if (!purpose.trim()) {
      newErrors.purpose = 'Loan purpose is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    setStatusMessage('');
    try {
      const response = await api.applyForLoan(amount as number, purpose);
      setStatusMessage(response.message);
      setMessageType('success');
      setAmount('');
      setPurpose('');
      // Note: In a real app, we'd use a state management library to update the history
    } catch (error) {
      setStatusMessage('Failed to submit loan application. Please try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div className="lg:col-span-2 space-y-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Apply for a Loan</h1>
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Fill out the form below to apply for a personal loan. Our team will review your application and get back to you shortly.
                </p>
                <Input
                  id="loanAmount"
                  label="Loan Amount ($)"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  error={errors.amount}
                  placeholder="e.g., 5000"
                />
                <div>
                  <label htmlFor="loanPurpose" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Loan Purpose
                  </label>
                  <textarea
                    id="loanPurpose"
                    rows={4}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g., Home renovation, debt consolidation..."
                    className={`block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white ${errors.purpose ? 'border-red-500' : ''}`}
                  />
                  {errors.purpose && <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>}
                </div>

                {statusMessage && (
                  <div className={`p-3 rounded-md text-sm ${messageType === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'}`}>
                    {statusMessage}
                  </div>
                )}

                <Button type="submit" fullWidth disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </Card>
        </div>
        <LoanHistory />
      </div>
       <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 hidden lg:block">&nbsp;</h2>
          <EMICalculator />
       </div>
    </div>
  );
};