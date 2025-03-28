'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputRangeProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
}

/**
 * A fallback slider component using native HTML input range
 * Used when @radix-ui/react-slider is not available
 */
const InputRange = React.forwardRef<HTMLInputElement, InputRangeProps>(
  ({ className, label, value, min = 0, max = 100, step = 1, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(Number(e.target.value));
      }
    };
    
    return (
      <div className={cn('w-full space-y-2', className)}>
        {label && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <span className="text-sm text-gray-500">{value}</span>
          </div>
        )}
        <div className="relative">
          <input
            type="range"
            ref={ref}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            {...props}
          />
          <div
            className="absolute h-2 bg-blue-500 rounded-lg pointer-events-none"
            style={{
              width: `${((Number(value) - min) / (max - min)) * 100}%`,
              top: 0,
              left: 0
            }}
          />
        </div>
      </div>
    );
  }
);

InputRange.displayName = 'InputRange';

export { InputRange };
