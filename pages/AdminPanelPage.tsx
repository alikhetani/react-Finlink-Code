import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { api } from '../services/api';
import { AdminUser, KycRequest, LoanRequest } from '../types';

type AdminTab = 'kyc' | 'loans' | 'users' | 'broadcast';

const TabButton: React.FC<{ active: boolean, onClick: () => void, children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            active
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
    >
        {children}
    </button>
);

const KycRequests: React.FC<{ requests: KycRequest[], onUpdate: (id: string, status: 'Approved' | 'Rejected') => void }> = ({ requests, onUpdate }) => (
    <div className="space-y-4">
        {requests.length === 0 ? <p>No pending KYC requests.</p> : requests.map(req => (
            <div key={req.id} className="p-4 border rounded-lg dark:border-slate-700 flex justify-between items-center">
                <div>
                    <p className="font-semibold">{req.userName}</p>
                    <p className="text-sm text-slate-500">Submitted: {req.submissionDate}</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => onUpdate(req.id, 'Approved')} variant="primary" className="!py-1 !px-2">Approve</Button>
                    <Button onClick={() => onUpdate(req.id, 'Rejected')} variant="secondary" className="!py-1 !px-2">Reject</Button>
                </div>
            </div>
        ))}
    </div>
);

const LoanRequests: React.FC<{ requests: LoanRequest[], onUpdate: (id: string, status: 'Approved' | 'Rejected') => void }> = ({ requests, onUpdate }) => (
     <div className="space-y-4">
        {requests.length === 0 ? <p>No pending loan requests.</p> : requests.map(req => (
            <div key={req.id} className="p-4 border rounded-lg dark:border-slate-700 flex justify-between items-center">
                <div>
                    <p className="font-semibold">{req.userName} - ${req.amount.toLocaleString()}</p>
                    <p className="text-sm text-slate-500">{req.purpose}</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => onUpdate(req.id, 'Approved')} variant="primary" className="!py-1 !px-2">Approve</Button>
                    <Button onClick={() => onUpdate(req.id, 'Rejected')} variant="secondary" className="!py-1 !px-2">Reject</Button>
                </div>
            </div>
        ))}
    </div>
);

const UserList: React.FC<{ users: AdminUser[] }> = ({ users }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Join Date</th>
                </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
                {users.map(user => (
                    <tr key={user.id}>
                        <td className="p-2">{user.name}</td>
                        <td className="p-2">{user.email}</td>
                        <td className="p-2">{user.joinDate}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const BroadcastNotification: React.FC = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Sending...');
        try {
            await api.broadcastNotification(title, message);
            setStatus('Broadcast sent successfully!');
            setTitle('');
            setMessage('');
        } catch (error) {
            setStatus('Failed to send broadcast.');
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleBroadcast}>
            <Input id="notifTitle" label="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <div>
                 <label htmlFor="notifMessage" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                 <textarea id="notifMessage" value={message} onChange={e => setMessage(e.target.value)} rows={4} className="block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"></textarea>
            </div>
            <Button type="submit">Send Broadcast</Button>
            {status && <p className="text-sm">{status}</p>}
        </form>
    );
};


export const AdminPanelPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('kyc');
    const [data, setData] = useState<{users: AdminUser[], kycRequests: KycRequest[], loanRequests: LoanRequest[]}>({users: [], kycRequests: [], loanRequests: []});
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const adminData = await api.getAdminDashboardData();
            setData(adminData);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const handleKycUpdate = async (id: string, status: 'Approved' | 'Rejected') => {
        await api.updateKycRequest(id, status);
        fetchData(); // Refresh data
    };

    const handleLoanUpdate = async (id: string, status: 'Approved' | 'Rejected') => {
        await api.updateLoanRequest(id, status);
        fetchData(); // Refresh data
    };

    const renderContent = () => {
        if(loading) return <p>Loading admin data...</p>;
        switch (activeTab) {
            case 'kyc': return <KycRequests requests={data.kycRequests} onUpdate={handleKycUpdate} />;
            case 'loans': return <LoanRequests requests={data.loanRequests} onUpdate={handleLoanUpdate} />;
            case 'users': return <UserList users={data.users} />;
            case 'broadcast': return <BroadcastNotification />;
            default: return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Admin Panel</h1>
            <Card>
                <div className="mb-6 flex flex-wrap gap-2 border-b dark:border-slate-700 pb-4">
                    <TabButton active={activeTab === 'kyc'} onClick={() => setActiveTab('kyc')}>KYC Requests ({data.kycRequests.length})</TabButton>
                    <TabButton active={activeTab === 'loans'} onClick={() => setActiveTab('loans')}>Loan Requests ({data.loanRequests.length})</TabButton>
                    <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>Users</TabButton>
                    <TabButton active={activeTab === 'broadcast'} onClick={() => setActiveTab('broadcast')}>Broadcast</TabButton>
                </div>
                <div>
                    {renderContent()}
                </div>
            </Card>
        </div>
    );
};