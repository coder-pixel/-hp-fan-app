import { cn } from "@/lib/utils";

export interface ResultHeaderProps {
  /** Main headline, e.g. "Quiz complete" */
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
      <p className="text-[11px] font-body font-medium tracking-[0.2em] uppercase text-muted-foreground">
        {title}
      </p>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
        {emotionalMessage}
      </h2>
      {resultTag ? (
        <p className="inline-flex items-center justify-center rounded-full border border-accent/35 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
          {resultTag}
        </p>
      ) : null}
    </header>
  );
}
