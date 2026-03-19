import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TimerPillProps {
  remaining: number;
  isFrozen: boolean;
  didTimeout: boolean;
}

export default function TimerPill({ remaining, isFrozen, didTimeout }: TimerPillProps) {
  const isWarning = remaining <= 10 && remaining > 5;
  const isDanger = remaining <= 5;

  return (
    <motion.div
      className="flex justify-center mb-3"
      animate={didTimeout ? { x: [-2, 2, -2, 2, 0] } : { x: 0 }}
      transition={didTimeout ? { duration: 0.25 } : { duration: 0.2 }}
    >
      <Badge
        variant="outline"
        className={cn(
          "px-3 py-1 text-xs font-body font-semibold tracking-wide border-border/40 bg-background/40 backdrop-blur",
          isFrozen && "border-accent/40 text-accent",
          isDanger && "border-destructive/50 text-destructive animate-pulse",
          isWarning && "border-yellow-500/40 text-yellow-300"
        )}
        style={
          isFrozen
            ? { boxShadow: "0 0 18px hsla(200, 90%, 60%, 0.25), 0 0 28px hsla(270, 66%, 35%, 0.18)" }
            : undefined
        }
      >
        <span className={cn("mr-1.5", isFrozen ? "drop-shadow-[0_0_10px_hsla(200,90%,60%,0.55)]" : "")}>
          {isFrozen ? "❄️" : "⏳"}
        </span>
        {remaining}s
      </Badge>
    </motion.div>
  );
}

