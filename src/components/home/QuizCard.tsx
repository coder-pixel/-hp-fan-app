import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface QuizCardProps {
  quizId: string;
  title: string;
  description: string;
  questionCount: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-500/20 text-green-700 border-green-500/30 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700/40",
  Medium: "bg-accent/15 text-accent border-accent/25",
  Hard: "bg-red-500/20 text-red-700 border-red-500/30 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700/40",
};

const QuizCard = ({ quizId, title, description, questionCount, difficulty }: QuizCardProps) => {
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

      <Link
        to={`/quiz/${quizId}`}
        className="mt-auto w-full py-3 rounded-lg border font-semibold text-sm font-body text-center transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 dark:border-secondary/25 dark:bg-secondary/10 dark:text-secondary-foreground dark:hover:bg-secondary/25 dark:hover:border-secondary/50"
      >
        Play Quiz
      </Link>
    </motion.div>
  );
};

export default QuizCard;
