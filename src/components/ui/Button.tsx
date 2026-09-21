import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'gold' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variantClasses = {
    primary:
      'bg-puja-red text-white hover:bg-puja-red-800 focus:ring-puja-red-600 shadow-md hover:shadow-lg border border-puja-red-800',
    gold:
      'bg-gradient-to-r from-amber-500 via-puja-gold to-yellow-500 text-puja-dark-deep font-semibold hover:brightness-105 focus:ring-puja-gold shadow-md hover:shadow-puja-gold/20 border border-amber-400',
    outline:
      'border-2 border-puja-gold text-puja-gold hover:bg-puja-gold/10 focus:ring-puja-gold backdrop-blur-sm',
    secondary:
      'bg-amber-50 text-puja-red-800 hover:bg-amber-100 focus:ring-amber-200 border border-amber-200',
    ghost:
      'text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <button
      className={twMerge(
        clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          isLoading && 'cursor-wait',
          className
        )
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center space-x-2">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
