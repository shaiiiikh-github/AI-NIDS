// src/components/identity/InfoCard.tsx
import React, { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface InfoCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div className={cn('flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10', className)}>
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        <p className="text-xs text-neutral-400 mt-1">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
          className="shrink-0"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};