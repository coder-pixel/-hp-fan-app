import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizletQuestion } from "@/data/quizletQuestions";
import QuestionMedia from "./QuestionMedia";
import FloatingScore from "./FloatingScore";

interface QuizletCardProps {
  question: QuizletQuestion;
  currentIndex: number;
  total: number;
  streak: number;
  selectedAnswer: number | null;
  onSelect: (index: number) => void;
  mapHighlight?: number | null;
  felixActive?: boolean;
  hiddenOptions?: number[];
}

const QuizletCard = ({
  question,
  currentIndex,
  total,
  streak,
  selectedAnswer,
  onSelect,
  mapHighlight,
  felixActive,
  hiddenOptions = [],
}: QuizletCardProps) => {
  const progress = ((currentIndex + 1) / total) * 100;
  const [scoreKey, setScoreKey] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleSelect = (index: number) => {
    onSelect(index);
    const isCorrect = felixActive || index === question.correctAnswer;
    if (isCorrect) {
      setScoreKey((k) => k + 1);
      setShowScore(true);
      setTimeout(() => setShowScore(false), 1000);
    }
  };

  const getOptionClass = (index: number) => {
    if (selectedAnswer === null) {
      const isHighlighted = mapHighlight === index;
      return `border-border/50 hover:border-secondary/50 hover:bg-secondary/5 cursor-pointer ${
        isHighlighted ? "ring-1 ring-accent/50 bg-accent/5" : ""
      }`;
    }
    // When felix is active, treat selected answer as correct
    if (felixActive && index === selectedAnswer) {
      return "border-green-500/60 bg-green-900/20 glow-gold";
    }
    if (index === question.correctAnswer) {
      return "border-green-500/60 bg-green-900/20 glow-gold";
    }
    if (index === selectedAnswer && index !== question.correctAnswer) {
      return "border-destructive/60 bg-red-900/20";
    }
    return "border-border/30 opacity-40 cursor-default";
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <FloatingScore show={showScore} triggerKey={scoreKey} />
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="glass-card p-7 sm:p-9 w-full"
          style={felixActive ? { boxShadow: "0 0 30px hsla(43, 72%, 52%, 0.2)" } : {}}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-[11px] text-muted-foreground font-body tracking-wide">
              Question {currentIndex + 1} / {total}
            </span>
            {streak > 1 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-[11px] font-semibold text-accent font-body flex items-center gap-1"
              >
                🔥 {streak} streak
              </motion.span>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-muted/50 rounded-full mb-8 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--gradient-purple)" }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Optional image */}
          <QuestionMedia image={question.image} />

          {/* Question */}
          <h3 className="font-display text-lg sm:text-xl font-semibold mb-8 text-center leading-snug">
            {question.question}
          </h3>

          {/* Options */}
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {question.options.map((option, index) => {
                const isHidden = hiddenOptions.includes(index);
                if (isHidden) {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      animate={{ opacity: 0, y: -12, filter: "blur(8px)", scale: 0.95 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="relative overflow-hidden rounded-lg border border-secondary/30 px-5 py-3.5 text-left text-sm font-medium font-body pointer-events-none"
                      style={{ boxShadow: "0 0 20px hsla(270, 66%, 45%, 0.4)" }}
                    >
                      <span className="relative z-10 text-muted-foreground/40">{option}</span>
                    </motion.div>
                  );
                }
                return (
                  <motion.button
                    key={index}
                    layout
                    onClick={() => handleSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`relative overflow-hidden rounded-lg border px-5 py-3.5 text-left text-sm font-medium font-body transition-all duration-300 ${getOptionClass(index)}`}
                  >
                    <span className="relative z-10">{option}</span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizletCard;
