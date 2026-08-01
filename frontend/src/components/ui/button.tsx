// src/components/ui/button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        outline: 'border border-white/10 text-white hover:bg-white/10',
        ghost: 'hover:bg-white/10 text-white',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        success: 'bg-emerald-500 text-white hover:bg-emerald-600',
      },
      size: {
        default: 'px-4 py-2',
        sm: 'px-3 py-1.5 text-xs',
        lg: 'px-6 py-3 text-base',
        icon: 'w-9 h-9 p-0', // ← added icon size
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ className, variant, size, ...props }) => {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
};