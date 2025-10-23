
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, id, error, icon, ...props }) => {
  const hasError = !!error;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div>}
        <input
          id={id}
          className={`
            block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm 
            focus:border-blue-500 focus:ring-blue-500 
            dark:bg-slate-700 dark:text-white 
            ${hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${icon ? 'pl-10' : 'pl-3'}
            pr-3 py-2
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
