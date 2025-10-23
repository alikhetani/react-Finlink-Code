import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { api } from '../services/api';
import { User } from '../types';

const SettingsToggle: React.FC<{ label: string, description: string, enabled: boolean }> = ({ label, description, enabled }) => (
    <div className="flex items-center justify-between py-4">
        <div>
            <p className="font-medium text-slate-800 dark:text-slate-200">{label}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked={enabled} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
        </label>
    </div>
);

const UserProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.getDashboardData().then(data => {
            setUser(data.user);
            setName(data.user.name);
            setEmail(data.user.email);
        });
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');
        try {
            await api.updateUserProfile(name, email);
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Failed to update profile.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return <p>Loading profile...</p>;

    return (
        <Card>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">User Profile</h2>
            <form className="space-y-4" onSubmit={handleSave}>
                <Input id="userName" label="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} />
                <Input id="userEmail" label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
                {message && <p className="text-sm text-green-600 dark:text-green-400 mt-2">{message}</p>}
            </form>
        </Card>
    );
};

export const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Settings</h1>
        <UserProfile />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Security & Notifications</h2>
        <Card>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
                <SettingsToggle label="Push Notifications" description="Receive updates on transactions and offers" enabled={true} />
                <SettingsToggle label="Email Notifications" description="Get summaries and alerts in your inbox" enabled={true} />
                <SettingsToggle label="Biometric Login" description="Use fingerprint or face unlock to sign in" enabled={false} />
                <SettingsToggle label="Biometric for Transactions" description="Require biometrics for high-value transfers" enabled={false} />
            </div>
        </Card>
      </div>
    </div>
  );
};