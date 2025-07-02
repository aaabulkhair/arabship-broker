import { cn } from '@/lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function ProgressBar({ currentStep, steps }: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-300',
                index < currentStep
                  ? 'bg-ocean-500 text-white shadow-md'
                  : index === currentStep
                  ? 'bg-ocean-500 text-white shadow-md ring-2 ring-ocean-200'
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-12 md:w-24 mx-2 transition-all duration-300',
                  index < currentStep ? 'bg-ocean-500' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-600">
        {steps.map((step, index) => (
          <span
            key={step}
            className={cn(
              'transition-colors duration-300',
              index <= currentStep ? 'text-ocean-500 font-medium' : 'text-gray-500'
            )}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}