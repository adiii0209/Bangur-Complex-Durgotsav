import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'red' | 'green' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  className,
  ...props
}) => {
  const variantStyles = {
    gold: 'bg-amber-100 text-amber-900 border-amber-300',
    red: 'bg-red-100 text-red-900 border-red-200',
    green: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    neutral: 'bg-stone-100 text-stone-800 border-stone-200',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
};
