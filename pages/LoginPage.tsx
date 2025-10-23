
import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { UserCircleIcon, LockClosedIcon } from '../components/icons';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid.';
    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (isRegister && password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // In a real app, you would call an API here.
      console.log('Form submitted');
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-2">
            Welcome to FinLink
        </h1>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
            {isRegister ? 'Create your account' : 'Sign in to your account'}
        </p>
        <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                    icon={<UserCircleIcon className="w-5 h-5 text-slate-400" />}
                />
                <Input
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    icon={<LockClosedIcon className="w-5 h-5 text-slate-400" />}
                />
                {isRegister && (
                    <Input
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={errors.confirmPassword}
                        icon={<LockClosedIcon className="w-5 h-5 text-slate-400" />}
                    />
                )}
                <Button type="submit" fullWidth>
                    {isRegister ? 'Register' : 'Login'}
                </Button>
            </form>
            <div className="mt-6 text-center">
                <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                    {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                </button>
            </div>
        </Card>
      </div>
    </div>
  );
};
