import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-800 mb-1.5"
          >
            {label}
            {required && <span className="text-puja-red ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          required={required}
          className={twMerge(
            clsx(
              'w-full px-4 py-2.5 rounded-xl border transition-colors duration-150',
              'text-gray-900 bg-white placeholder-gray-400 text-sm shadow-sm',
              'focus:outline-none focus:ring-2 focus:ring-puja-gold/60 focus:border-puja-gold',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-amber-200 hover:border-amber-300',
              className
            )
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
