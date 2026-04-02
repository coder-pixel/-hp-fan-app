import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

export interface ResultHeaderProps {
  title?: string;
  emotionalMessage: string;
  resultTag?: string;
  className?: string;
}

export function ResultHeader({
  title = "Quiz complete",
  emotionalMessage,
  resultTag,
  className,
}: ResultHeaderProps) {
  return (
    <header className={cn("text-center space-y-2", className)}>
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
        <Trophy className="h-3 w-3 text-accent" />
        <span className="text-[10px] font-body font-medium tracking-wider uppercase text-accent">
          {title}
        </span>
      </div>
      <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground leading-tight">
        {emotionalMessage}
      </h2>
      {resultTag ? (
        <p className="inline-flex items-center justify-center rounded-full border border-accent/30 bg-accent/5 px-3 py-0.5 text-xs font-medium text-accent">
          {resultTag}
        </p>
      ) : null}
    </header>
  );
}
