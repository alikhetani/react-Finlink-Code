import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { api } from '../services/api';
import { Notification } from '../types';
import { BellIcon, BanknotesIcon } from '../components/icons';

const NotificationIcon: React.FC<{ title: string }> = ({ title }) => {
    const iconClass = "w-6 h-6 mr-4";
    if (title.toLowerCase().includes('loan')) {
        return <BanknotesIcon className={`${iconClass} text-blue-500`} />;
    }
    return <BellIcon className={`${iconClass} text-slate-500`} />;
};

export const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await api.getUserNotifications();
                setNotifications(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                api.markNotificationsAsRead();
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Notifications</h1>
            <Card>
                {loading ? (
                    <p className="text-center p-8">Loading notifications...</p>
                ) : notifications.length === 0 ? (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-4">You have no notifications.</p>
                ) : (
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {notifications.map(notif => (
                            <li key={notif.id} className={`py-4 px-2 flex items-start ${notif.read ? 'opacity-70' : ''}`}>
                                <NotificationIcon title={notif.title} />
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">{notif.title}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">{notif.message}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{notif.date}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
        </div>
    );
};