import { motion } from "framer-motion";
import type { LeaderboardEntry } from "@/types/user.types";
import { Trophy, Medal } from "lucide-react";

const rankColors: Record<number, string> = {
  1: "text-accent",
  2: "text-muted-foreground",
  3: "text-orange-400",
};

const LeaderboardRow = ({ entry, index }: { entry: LeaderboardEntry; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.06, duration: 0.3 }}
    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/30 transition-colors"
  >
    <span className={`w-7 text-center font-display font-bold text-sm ${rankColors[entry.rank] || "text-muted-foreground"}`}>
      {entry.rank <= 3 ? (
        entry.rank === 1 ? <Trophy className="w-5 h-5 mx-auto text-accent" /> : <Medal className="w-4 h-4 mx-auto" />
      ) : (
        `#${entry.rank}`
      )}
    </span>
    <div className="w-8 h-8 rounded-full bg-secondary/40 flex items-center justify-center text-xs font-bold text-secondary-foreground shrink-0">
      {entry.name.charAt(0)}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground truncate">{entry.name}</p>
      <p className="text-xs text-muted-foreground">{entry.quizzes} quizzes</p>
    </div>
    <span className="font-display font-bold text-accent text-sm">{entry.score.toLocaleString()}</span>
  </motion.div>
);

export default LeaderboardRow;
