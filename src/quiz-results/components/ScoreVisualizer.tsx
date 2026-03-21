import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const R = 54;
const CIRC = 2 * Math.PI * R;

export interface ScoreVisualizerProps {
  score: number;
  total: number;
  percent: number;
  className?: string;
}

export function ScoreVisualizer({
  score,
  total,
  percent,
  className,
}: ScoreVisualizerProps) {
  const gid = useId();
  const gradId = `score-ring-${gid.replace(/:/g, "")}`;
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 780;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 2;
      setDisplayScore(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const offset = CIRC - (CIRC * percent) / 100;

  return (
    <div
      className={cn("flex flex-col items-center", className)}
      role="img"
      aria-label={`Score ${score} out of ${total}`}
    >
      <div className="relative h-40 w-40">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden>
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            className="stroke-muted/45"
            strokeWidth="6"
          />
          <motion.circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            initial={{ strokeDashoffset: CIRC }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(43, 72%, 52%)" />
              <stop offset="100%" stopColor="hsl(35, 80%, 45%)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-bold text-gradient-gold tabular-nums">
            {displayScore}
          </span>
          <span className="text-xs text-muted-foreground font-body tabular-nums">
            / {total}
          </span>
        </div>
      </div>
      {/* <p className="mt-3 max-w-xs text-center text-sm text-muted-foreground font-body">
        You answered{" "}
        <span className="font-semibold text-foreground tabular-nums">{score}</span> of{" "}
        <span className="font-semibold text-foreground tabular-nums">{total}</span>{" "}
        correctly.
      </p> */}
    </div>
  );
}
