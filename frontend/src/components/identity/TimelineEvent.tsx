import { cn } from "../../utils/cn";
import type { LucideIcon } from "lucide-react";

interface TimelineEventProps {
  icon: LucideIcon;
  timestamp: string;
  description: string;
  type: "success" | "warning" | "danger" | "info";
}

const typeStyles = {
  success: "text-benign",
  warning: "text-yellow-400",
  danger: "text-danger",
  info: "text-accent",
};

export function TimelineEvent({ icon: Icon, timestamp, description, type }: TimelineEventProps) {
  return (
    <div className="flex gap-3 px-2 py-2 rounded-md hover:bg-white/5 transition-colors">
      <div className={cn("mt-0.5", typeStyles[type])}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white">{description}</p>
        <p className="text-xs text-slate-400">{timestamp}</p>
      </div>
    </div>
  );
}