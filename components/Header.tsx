import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from './Button';
import { useTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon, Cog6ToothIcon, ChatBubbleLeftRightIcon, BellIcon, ShieldCheckIcon } from './icons';
import { api } from '../services/api';

interface HeaderProps {
    onLogout: () => void;
}

const ThemeToggle: React.FC = () => {
    const { theme, setTheme } = useTheme();
    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
    );
};

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    const linkClasses = "px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors";
    const activeLinkClasses = "bg-slate-900/80 text-white";
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            const notifs = await api.getUserNotifications();
            setUnreadNotifications(notifs.filter(n => !n.read).length);
        };
        fetchNotifications();
        // Simple polling for demo purposes
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="bg-slate-800/80 backdrop-blur-sm sticky top-0 z-40 shadow-md">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <span className="font-bold text-xl text-white">FinLink Global</span>
                        <div className="hidden md:block ml-10">
                            <div className="flex items-baseline space-x-4">
                                <NavLink to="/" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`} end>Dashboard</NavLink>
                                <NavLink to="/transactions" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Transactions</NavLink>
                                <NavLink to="/wallet" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Wallet</NavLink>
                                <NavLink to="/loan" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Loan</NavLink>
                                <NavLink to="/kyc" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>KYC</NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <NavLink to="/support" className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors" aria-label="Support"><ChatBubbleLeftRightIcon className="w-5 h-5" /></NavLink>
                        <NavLink to="/notifications" className="relative p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors" aria-label="Notifications">
                            <BellIcon className="w-5 h-5" />
                            {unreadNotifications > 0 && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-800"></span>}
                        </NavLink>
                        <NavLink to="/settings" className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors" aria-label="Settings"><Cog6ToothIcon className="w-5 h-5" /></NavLink>
                        <NavLink to="/admin" className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors" aria-label="Admin Panel"><ShieldCheckIcon className="w-5 h-5" /></NavLink>
                        <ThemeToggle />
                        <Button variant="secondary" onClick={onLogout}>Logout</Button>
                    </div>
                </div>
            </nav>
        </header>
    );
};