import { motion } from "framer-motion";
import { Clock, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerBadgeProps {
  remaining: number;
  isFrozen: boolean;
  didTimeout: boolean;
}

export default function TimerBadge({ remaining, isFrozen, didTimeout }: TimerBadgeProps) {
  const isWarning = remaining <= 10 && remaining > 5;
  const isDanger = remaining <= 5;

  return (
    <motion.div
      animate={
        didTimeout
          ? { x: [-2, 2, -2, 2, 0], transition: { duration: 0.25 } }
          : { x: 0 }
      }
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-body font-semibold tracking-wide backdrop-blur",
        "border-border/40 bg-background/60",
        isFrozen && "border-accent/40 text-accent",
        isDanger && !isFrozen && "border-destructive/50 text-destructive",
        isWarning && !isFrozen && !isDanger && "border-amber-500/40 text-amber-400"
      )}
      style={
        isFrozen
          ? {
              boxShadow:
                "0 0 14px hsla(200, 90%, 60%, 0.2), 0 0 22px hsla(270, 66%, 35%, 0.15)",
            }
          : isDanger && !isFrozen
          ? { boxShadow: "0 0 12px hsla(0, 84%, 60%, 0.25)" }
          : undefined
      }
    >
      {isFrozen ? (
        <Snowflake
          className={cn("h-3.5 w-3.5", "drop-shadow-[0_0_8px_hsla(200,90%,60%,0.5)]")}
          aria-hidden
        />
      ) : (
        <Clock className="h-3.5 w-3.5 text-current opacity-90" aria-hidden />
      )}
      <span
        className={cn(
          isDanger && !isFrozen && "animate-pulse"
        )}
      >
        {remaining}s
      </span>
    </motion.div>
  );
}
