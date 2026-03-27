import { motion } from "framer-motion";
import type { QuizAttempt } from "@/types/user.types";
import { ChevronRight, Sparkles } from "lucide-react";

const HistoryItem = ({ attempt, index }: { attempt: QuizAttempt; index: number }) => {
  const isPerfect = attempt.accuracy === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="glass-card rounded-xl p-4 flex items-center gap-3 group cursor-pointer hover:border-accent/30 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">{attempt.quizTitle}</p>
          {isPerfect && <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{attempt.date}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold font-display text-accent">
          {attempt.score}/{attempt.total}
        </p>
        <p className="text-xs text-muted-foreground">{attempt.accuracy}%</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
    </motion.div>
  );
};

export default HistoryItem;
