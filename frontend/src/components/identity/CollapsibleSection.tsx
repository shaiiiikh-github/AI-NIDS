import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";
import { useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  summary?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({ title, summary, defaultOpen = false, children }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-1 py-2 text-sm font-medium hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-2">
          <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", open && "rotate-180")} />
          <span>{title}</span>
        </div>
        {summary && <span className="text-xs text-slate-400">{summary}</span>}
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-3 pl-6">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}