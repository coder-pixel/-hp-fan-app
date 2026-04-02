import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Trophy, Star, Sparkles, Zap } from "lucide-react";

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
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 1000;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setDisplayScore(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const getScoreMessage = () => {
    if (percent >= 90) return { text: "Outstanding!", icon: Trophy, color: "text-yellow-400" };
    if (percent >= 70) return { text: "Excellent!", icon: Star, color: "text-amber-400" };
    if (percent >= 50) return { text: "Well Done!", icon: Zap, color: "text-emerald-400" };
    return { text: "Good Try!", icon: Sparkles, color: "text-blue-400" };
  };

  const scoreInfo = getScoreMessage();
  const ScoreIcon = scoreInfo.icon;

  return (
    <div
      className={cn("flex flex-col items-center", className)}
      role="img"
      aria-label={`Score ${score} out of ${total}`}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-purple-500/20 blur-3xl rounded-full" />

        <div className="relative flex flex-col items-center justify-center p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={displayScore}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.span
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-display text-5xl sm:text-6xl font-black text-gradient-gold tracking-tight"
              >
                {displayScore}
              </motion.span>
              <motion.span
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="block text-base sm:text-lg text-muted-foreground font-body mt-0.5"
              >
                out of {total}
              </motion.span>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={cn("mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/60 border border-border/40", scoreInfo?.color)}
          >
            <ScoreIcon className="h-3.5 w-3.5" />
            <span className="font-display font-medium text-xs tracking-wide">{scoreInfo?.text}</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
          className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-accent/50 blur-md rounded-full" />
            <div className="relative p-1.5 sm:p-2 rounded-full bg-gradient-to-br from-accent to-amber-600 shadow-lg">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-white fill-white" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}