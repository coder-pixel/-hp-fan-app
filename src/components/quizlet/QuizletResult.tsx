import { motion } from "framer-motion";
import { RotateCcw, Share2 } from "lucide-react";
import NextQuizCard from "./NextQuizCard";

interface QuizletResultProps {
  score: number;
  total: number;
  onRestart: () => void;
}

const QuizletResult = ({ score, total, onRestart }: QuizletResultProps) => {
  const percentage = Math.round((score / total) * 100);

  const handleShare = () => {
    const text = `⚡ I scored ${score}/${total} (${percentage}%) on the WizardVerse Quizlet! Can you beat me?`;
    if (navigator.share) {
      navigator.share({ title: "WizardVerse Quizlet", text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const getMessage = () => {
    if (percentage === 100) return "You are a true wizard! 🧙‍♂️";
    if (percentage >= 70) return "Impressive magical knowledge! ✨";
    if (percentage >= 40) return "Not bad, but keep studying! 📚";
    return "You might be a Muggle… 😅";
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 sm:p-12 w-full max-w-xl mx-auto text-center"
      >
        <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">Quiz Complete!</h2>
        <p className="text-muted-foreground font-body mb-10">{getMessage()}</p>

        {/* Score circle */}
        <div className="relative w-40 h-40 mx-auto mb-10">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" className="stroke-muted/40" strokeWidth="6" />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={339.29}
              initial={{ strokeDashoffset: 339.29 }}
              animate={{ strokeDashoffset: 339.29 - (339.29 * percentage) / 100 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(43, 72%, 52%)" />
                <stop offset="100%" stopColor="hsl(35, 80%, 45%)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold font-display text-gradient-gold">{score}</span>
            <span className="text-xs text-muted-foreground font-body">/ {total}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground font-body mb-10">
          You answered <span className="text-foreground font-semibold">{score}</span> out of{" "}
          <span className="text-foreground font-semibold">{total}</span> questions correctly.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 btn-secondary-outline text-sm px-6 py-3"
          >
            <RotateCcw size={16} />
            Restart Quiz
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 btn-primary-gold text-sm px-6 py-3"
          >
            <Share2 size={16} />
            Share Result
          </button>
        </div>
      </motion.div>

      <NextQuizCard />
    </>
  );
};

export default QuizletResult;
