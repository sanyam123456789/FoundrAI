import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({
  children,
  className,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        clsx(
          'rounded px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50',
          {
            'bg-purple-600 hover:bg-purple-500 text-white': variant === 'primary',
            'border border-gray-800 text-gray-300 hover:bg-gray-900': variant === 'secondary',
            'bg-red-900/20 border border-red-900 text-red-500 hover:bg-red-900 hover:text-white': variant === 'danger',
          }
        ),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
