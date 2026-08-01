// src/components/common/StatCard.tsx
import React, { type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  className,
}) => {
  return (
    <div className={cn('bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-400 uppercase tracking-wider">{label}</span>
        {icon && <span className="text-neutral-400">{icon}</span>}
      </div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
      {trend && <div className="text-xs text-emerald-400">{trend}</div>}
    </div>
  );
};