// src/components/ui/progress.tsx
import React from 'react';
import { cn } from "../../utils/cn";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  max = 100,
  className,
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn('w-full h-2 bg-white/10 rounded-full overflow-hidden', className)}
      {...props}
    >
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};