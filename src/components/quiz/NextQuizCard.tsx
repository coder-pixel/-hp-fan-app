import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { quizzes } from "@/data/quizzes";

type NextQuizCardProps = {
  currentQuizId?: string;
  className?: string;
};

const NextQuizCard = ({ currentQuizId, className }: NextQuizCardProps) => {
  const navigate = useNavigate();

  const nextQuiz = useMemo(() => {
    const list = quizzes ?? [];
    if (!Array.isArray(list) || list?.length === 0) return null;
    if (list?.length === 1) return null;

    const currentIndex = currentQuizId
      ? list?.findIndex((q) => q?.id === currentQuizId)
      : -1;

    const startIndex = currentIndex >= 0 ? currentIndex + 1 : 0;
    for (let offset = 0; offset < list?.length; offset += 1) {
      const candidate = list[(startIndex + offset) % list?.length];
      if (!candidate) continue;
      if (candidate?.id && candidate?.id !== currentQuizId) return candidate;
    }

    return null;
  }, [currentQuizId]);

  if (!nextQuiz) return null;

  const totalQuestions = nextQuiz?.questions?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className={["glass-card-hover p-6 sm:p-8 w-full max-w-xl mx-auto mt-6 text-center", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="text-[11px] font-body font-medium tracking-widest uppercase text-muted-foreground mb-2 block">
        Next Challenge
      </span>
      <h3 className="font-display text-lg sm:text-xl font-semibold mb-1">
        {nextQuiz?.title}
      </h3>
      <p className="text-xs text-muted-foreground font-body mb-5">
        {totalQuestions} questions
      </p>
      <button
        type="button"
        onClick={() => navigate(`/quiz/${nextQuiz.id}?start=1`)}
        className="btn-primary-gold text-sm px-6 py-2.5 inline-flex items-center gap-2"
      >
        Play Next Quiz
        <ArrowRight size={15} />
      </button>
    </motion.div>
  );
};

export default NextQuizCard;
