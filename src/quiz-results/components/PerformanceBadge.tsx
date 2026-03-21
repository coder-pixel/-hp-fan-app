import { cn } from "@/lib/utils";

export interface PerformanceBadgeProps {
  label: string;
  percent: number;
  className?: string;
}

export function PerformanceBadge({ label, percent, className }: PerformanceBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/80 px-5 py-3 backdrop-blur-sm",
        className,
      )}
    >
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        Rank
      </span>
      <span className="font-display text-lg font-semibold text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground tabular-nums">{percent}%</span>
    </div>
  );
}
