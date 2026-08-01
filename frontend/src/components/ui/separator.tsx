// src/components/ui/separator.tsx
import React from 'react';
import { cn } from "../../utils/cn";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        orientation === 'horizontal' ? 'w-full h-px' : 'h-full w-px',
        'bg-white/10',
        className
      )}
      {...props}
    />
  );
};