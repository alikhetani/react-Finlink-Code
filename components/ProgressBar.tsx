import React from 'react';

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full">
      <div className="flex">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isCompleted ? 'bg-blue-600 text-white' : 
                    isActive ? 'border-2 border-blue-600 bg-white dark:bg-slate-800 text-blue-600' : 
                    'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <p className={`mt-2 text-xs text-center font-medium ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {step}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 self-start mt-4 ${isCompleted ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};