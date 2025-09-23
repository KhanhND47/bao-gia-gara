import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-center mb-6 sm:mb-8 px-4 overflow-x-auto">
      <div className="flex items-center min-w-max">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">
            <div
              className={`
                flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 font-semibold text-xs sm:text-sm
                ${index < currentStep 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : index === currentStep 
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'bg-gray-200 border-gray-300 text-gray-500'
                }
              `}
            >
              {index < currentStep ? (
                <Check size={12} className="sm:w-4 sm:h-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium whitespace-nowrap">
              <span
                className={
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }
              >
                {step}
              </span>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`
                mx-2 sm:mx-4 h-1 w-8 sm:w-16 rounded
                ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}
              `}
            />
          )}
        </React.Fragment>
      ))}
      </div>
    </div>
  );
};