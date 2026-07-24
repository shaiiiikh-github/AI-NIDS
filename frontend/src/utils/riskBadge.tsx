// src/utils/riskBadge.tsx
import type { RiskLevel } from '@/types/nids';

export const getRiskBadge = (level: RiskLevel) => {
  const config = {
    CRITICAL: 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.15)]',
    HIGH: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
    MEDIUM: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    LOW: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    SAFE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-mono font-semibold rounded-md border ${config[level]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {level}
    </span>
  );
};