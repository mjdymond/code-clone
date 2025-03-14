import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, showValue = false, size = 'md', variant = 'default', ...props }, ref) => {
    const percentage = Math.min(Math.max(0, (value / max) * 100), 100);
    
    const sizeClasses = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };
    
    const variantClasses = {
      default: 'bg-primary',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
    };

    return (
      <div className="w-full">
        <div
          ref={ref}
          className={cn('relative w-full overflow-hidden rounded-full bg-gray-200', sizeClasses[size], className)}
          {...props}
        >
          <div
            className={cn('h-full w-full flex-1 transition-all', variantClasses[variant])}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showValue && (
          <div className="mt-1 text-right text-xs text-gray-500">{Math.round(percentage)}%</div>
        )}
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
