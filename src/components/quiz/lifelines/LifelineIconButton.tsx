import { Map, MessageCircle, FlaskConical, Eye, Sparkles, Hourglass, X, type LucideIcon } from "lucide-react";
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
  active?: boolean;
  onActivate: () => void;
}

export default function LifelineIconButton({
  definition,
  used,
  disabled,
  active = false,
  onActivate,
}: LifelineIconButtonProps) {
  const Icon = iconMap[definition?.icon] ?? Map;
  const isDisabled = used || disabled;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          type="button"
          whileHover={isDisabled ? undefined : { scale: 1.05 }}
          whileTap={isDisabled ? undefined : { scale: 0.95 }}
          onClick={() => !isDisabled && onActivate()}
          disabled={isDisabled}
          className={cn(
            "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-all duration-200",
            used &&
            "cursor-not-allowed border-border/30 bg-muted/30",
            !used &&
            disabled &&
            "cursor-not-allowed border-border/30 bg-muted/30 opacity-70",
            !used &&
            !disabled &&
            "cursor-pointer border-secondary/40 bg-secondary/10 hover:border-accent/50 hover:bg-accent/10",
            active && "ring-2 ring-accent/60 ring-offset-2 ring-offset-background"
          )}
          style={
            (used || (!active && isDisabled))
              ? { boxShadow: "0 0 12px hsla(270, 66%, 35%, 0.12)" }
              : active
                ? { boxShadow: "0 0 20px hsla(43, 72%, 52%, 0.35)" }
                : undefined
          }
        >
          {used ? (
            <>
              <Icon className="h-5 w-5 text-muted-foreground/60" aria-hidden />
              <X
                className="absolute inset-0 h-full w-full text-destructive/70 stroke-[2.5]"
                aria-hidden
              />
            </>
          ) : (
            <Icon
              className={cn(
                "h-5 w-5 transition-colors",
                isDisabled ? "text-muted-foreground/50" : "text-accent"
              )}
              aria-hidden
            />
          )}
        </motion.button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        className="max-w-[220px] border-border/50 bg-popover px-3 py-2 text-left shadow-lg"
      >
        <p className="font-display text-xs font-semibold text-foreground">
          {definition?.displayName}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
          {definition?.description}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
