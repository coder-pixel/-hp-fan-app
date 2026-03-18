import { motion } from "framer-motion";

interface QuizCardProps {
  title: string;
  description: string;
  questionCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-900/40 text-green-300 border-green-700/40",
  Medium: "bg-accent/15 text-accent border-accent/25",
  Hard: "bg-red-900/40 text-red-300 border-red-700/40",
};

const QuizCard = ({ title, description, questionCount, difficulty }: QuizCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass-card-hover p-7 flex flex-col gap-5 group"
    >
      {/* Top accent line */}
      <div className="h-0.5 w-12 rounded-full bg-accent/40 group-hover:w-20 group-hover:bg-accent/70 transition-all duration-500" />

      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
        <span className="text-[11px] text-muted-foreground font-body">{questionCount} questions</span>
      </div>

      <h3 className="font-display text-lg font-semibold leading-snug">{title}</h3>
      <p className="text-sm text-muted-foreground font-body leading-relaxed flex-1">{description}</p>

      <button className="mt-auto w-full py-3 rounded-lg border font-semibold text-sm font-body transition-all duration-300 border-secondary/25 bg-secondary/10 text-secondary-foreground hover:bg-secondary/25 hover:border-secondary/50 hover:glow-purple">
        Play Quiz
      </button>
    </motion.div>
  );
};

export default QuizCard;
