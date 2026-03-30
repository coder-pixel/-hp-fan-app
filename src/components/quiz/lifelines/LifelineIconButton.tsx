import { Map, MessageCircle, FlaskConical, Eye, Sparkles, Hourglass, X, RotateCcw, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import type { LifelineDefinition } from "./lifelineTypes";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Map,
  MessageCircle,
  FlaskConical,
  Eye,
  Sparkles,
  Hourglass,
};

interface LifelineIconButtonProps {
  definition: LifelineDefinition;
  used: boolean;
  disabled: boolean;
  /**
   * Allows clicking the button even when `used` is true.
   * Useful for reopening an effect for the same question.
   */
  allowUsedActivation?: boolean;
  active?: boolean;
  /** Remaining uses for this lifeline (0..maxUsagePerGame) */
  remainingCount: number;
  onActivate: () => void;
}

export default function LifelineIconButton({
  definition,
  used,
  disabled,
  allowUsedActivation = false,
  active = false,
  remainingCount,
  onActivate,
}: LifelineIconButtonProps) {
  const Icon = iconMap[definition?.icon] ?? Map;
  const isDisabled = (used && !allowUsedActivation) || disabled;
  // Reopenable: used on this question, but clickable to view again (no X overlay).
  const isReopenable = used && allowUsedActivation;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          type="button"
          whileHover={isDisabled ? undefined : { scale: 1.04 }}
          whileTap={isDisabled ? undefined : { scale: 0.96 }}
          onClick={() => !isDisabled && onActivate()}
          disabled={isDisabled}
          className={cn(
            "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-all duration-200 sm:h-10 sm:w-10 sm:rounded-lg",
            // Permanently used (spent): muted, no interaction
            used && !isReopenable && "cursor-not-allowed border-border/30 bg-muted/30",
            // Reopenable (used this question): subtle accent tint, still clickable
            isReopenable && "cursor-pointer border-accent/20 bg-accent/5 opacity-60 hover:opacity-90 hover:border-accent/35 hover:bg-accent/10",
            !used && disabled && "cursor-not-allowed border-border/30 bg-muted/30 opacity-70",
            !used && !disabled && "cursor-pointer border-secondary/40 bg-secondary/10 hover:border-accent/50 hover:bg-accent/10",
            active && "ring-1 ring-accent/55 ring-offset-1 ring-offset-background sm:ring-2 sm:ring-offset-2"
          )}
          style={
            isReopenable
              ? { boxShadow: "0 0 10px hsla(43, 72%, 52%, 0.12)" }
              : (used || (!active && isDisabled))
                ? { boxShadow: "0 0 12px hsla(270, 66%, 35%, 0.12)" }
                : active
                  ? { boxShadow: "0 0 20px hsla(43, 72%, 52%, 0.35)" }
                  : undefined
          }
        >
          <span
            className={cn(
              "absolute -top-0.5 -right-0.5 z-10 flex h-3.5 min-w-[14px] items-center justify-center rounded-full border px-0.5 text-[8px] font-body font-semibold backdrop-blur sm:-top-1 sm:-right-1 sm:h-4 sm:min-w-[16px] sm:px-1 sm:text-[9px]",
              remainingCount > 0
                ? "bg-accent/10 border-accent/40 text-accent"
                : "bg-muted/40 border-border/30 text-muted-foreground/70"
            )}
            aria-label={`Lifeline uses remaining: ${remainingCount}`}
          >
            {remainingCount}
          </span>
          {used ? (
            isReopenable ? (
              // Subtle "used on this question, tap to reopen" state
              <>
                <Icon className="h-4 w-4 text-accent/50 sm:h-5 sm:w-5" aria-hidden />
                <RotateCcw
                  className="absolute bottom-0.5 right-0.5 h-2 w-2 text-accent/60 sm:h-2.5 sm:w-2.5"
                  aria-hidden
                />
              </>
            ) : (
              // Permanently spent: X overlay
              <>
                <Icon className="h-4 w-4 text-muted-foreground/60 sm:h-5 sm:w-5" aria-hidden />
                <X
                  className="absolute inset-0 h-full w-full text-destructive/70 stroke-[2.5]"
                  aria-hidden
                />
              </>
            )
          ) : (
            <Icon
              className={cn(
                "h-4 w-4 transition-colors sm:h-5 sm:w-5",
                isDisabled ? "text-muted-foreground/50" : "text-accent"
              )}
              aria-hidden
            />
          )}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="center"
        sideOffset={6}
        className="max-w-[min(220px,calc(100vw-2rem))] border-border/50 bg-popover px-2.5 py-1.5 text-left shadow-md sm:px-3 sm:py-2"
      >
        <p className="font-display text-[11px] font-semibold leading-tight text-foreground sm:text-xs">
          {definition?.displayName}
        </p>
        <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground sm:mt-1 sm:text-[11px]">
          {definition?.description}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
