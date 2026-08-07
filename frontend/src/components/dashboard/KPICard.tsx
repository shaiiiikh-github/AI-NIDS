// src/components/dashboard/KPICard.tsx
import { type FC } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  subtitle?: string;
  color?: 'indigo' | 'red' | 'emerald' | 'amber';
}

const colorMap = {
  indigo: { iconBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400', hover: 'hover:border-indigo-500/40' },
  red: { iconBg: 'bg-red-500/10 border-red-500/20 text-red-400', hover: 'hover:border-red-500/40' },
  emerald: { iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', hover: 'hover:border-emerald-500/40' },
  amber: { iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400', hover: 'hover:border-amber-500/40' },
};

export const KPICard: FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  subtitle,
  color = 'indigo',
}) => {
  const { iconBg, hover } = colorMap[color];
  const isPositive = trend !== undefined && trend >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative overflow-hidden bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 ${hover} transition-all duration-300 shadow-xl`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-current/5 rounded-full blur-xl group-hover:bg-current/10 transition-colors" style={{ color: 'var(--color-accent)' }} />
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{title}</span>
        <div className={`p-2 border rounded-lg ${iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-2xl font-extrabold font-mono text-white tracking-tight">
          {value}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'} bg-current/10 border border-current/20 px-2 py-0.5 rounded-full`}>
            <TrendIcon className="w-3 h-3 mr-1" />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      {subtitle && <p className="mt-2 text-[11px] text-neutral-500">{subtitle}</p>}
      {trendLabel && <p className="text-[10px] text-neutral-600 mt-0.5">{trendLabel}</p>}
    </motion.div>
  );
};