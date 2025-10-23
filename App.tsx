import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { KycPage } from './pages/KycPage';
import { LoanPage } from './pages/LoanPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { WalletPage } from './pages/WalletPage';
import { QumChatPage } from './pages/QumChatPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { Header } from './components/Header';
import { ThemeProvider } from './contexts/ThemeContext';

const ProtectedLayout: React.FC<{onLogout: () => void, children: React.ReactNode}> = ({ onLogout, children }) => (
    <div className="min-h-screen">
        <Header onLogout={onLogout} />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            {children}
        </main>
    </div>
);

const AppRoutes: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <HashRouter>
      <Routes>
        {!isAuthenticated ? (
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        ) : (
          <Route path="/*" element={
            <ProtectedLayout onLogout={handleLogout}>
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/transactions" element={<TransactionsPage />} />
                    <Route path="/wallet" element={<WalletPage />} />
                    <Route path="/kyc" element={<KycPage />} />
                    <Route path="/loan" element={<LoanPage />} />
                    <Route path="/support" element={<QumChatPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/admin" element={<AdminPanelPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </ProtectedLayout>
          } />
        )}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
};

export default App;