import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const nextQuizzes = [
  { title: "Ultimate Harry Potter Trivia", questions: 15 },
  { title: "Which Hogwarts House Are You?", questions: 10 },
  { title: "Guess the Spell", questions: 12 },
];

const NextQuizCard = () => {
  const quiz = nextQuizzes[Math.floor(Math.random() * nextQuizzes.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card-hover p-6 sm:p-8 w-full max-w-xl mx-auto mt-6 text-center"
    >
      <span className="text-[11px] font-body font-medium tracking-widest uppercase text-muted-foreground mb-2 block">
        Next Challenge
      </span>
      <h3 className="font-display text-lg sm:text-xl font-semibold mb-1">
        {quiz.title}
      </h3>
      <p className="text-xs text-muted-foreground font-body mb-5">
        {quiz.questions} questions
      </p>
      <button className="btn-primary-gold text-sm px-6 py-2.5 inline-flex items-center gap-2">
        Play Next Quiz
        <ArrowRight size={15} />
      </button>
    </motion.div>
  );
};

export default NextQuizCard;
