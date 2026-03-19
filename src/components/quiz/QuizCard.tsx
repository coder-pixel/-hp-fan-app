import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizQuestion } from "@/types/quiz";
import QuestionMedia from "./QuestionMedia";
import FloatingScore from "./FloatingScore";
import TimerBadge from "./TimerBadge";
import { playCorrect, playWrong } from "@/lib/quizSounds";
import type { QuizSoundsConfig } from "@/types/quiz";

interface TimerState {
  remaining: number;
  isFrozen: boolean;
  didTimeout: boolean;
}

interface QuizCardProps {
  question: QuizQuestion;
  currentIndex: number;
  total: number;
  streak: number;
  selectedAnswer: number | null;
  onSelect: (index: number) => void;
  mapHighlight?: number | null;
  felixActive?: boolean;
  hiddenOptions?: number[];
  /** Timer shown inside card when provided */
  timer?: TimerState | null;
  /** Sound config from quiz. When omitted, defaults to enabled. */
  sounds?: QuizSoundsConfig;
}

const QuizCard = ({
  question,
  currentIndex,
  total,
  streak,
  selectedAnswer,
  onSelect,
  mapHighlight,
  felixActive,
  hiddenOptions = [],
  timer,
  sounds,
}: QuizCardProps) => {
  const progress = ((currentIndex + 1) / total) * 100;
  const [scoreKey, setScoreKey] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleSelect = (index: number) => {
    onSelect(index);
    const isCorrect = felixActive || index === question?.correctAnswer;
    const soundsEnabled = sounds?.enabled !== false;
    if (isCorrect) {
      if (soundsEnabled && sounds?.correct !== false) playCorrect();
      setScoreKey((k) => k + 1);
      setShowScore(true);
      setTimeout(() => setShowScore(false), 1000);
    } else {
      if (soundsEnabled && sounds?.wrong !== false) playWrong();
    }
  };

  const getOptionState = (index: number): "idle" | "highlighted" | "correct" | "wrong" | "disabled" => {
    if (selectedAnswer === null) {
      return mapHighlight === index ? "highlighted" : "idle";
    }
    if (felixActive && index === selectedAnswer) return "correct";
    if (question?.type === "multiple-choice" && index === question?.correctAnswer) return "correct";
    if (index === selectedAnswer && index !== question?.correctAnswer) return "wrong";
    return "disabled";
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <FloatingScore show={showScore} triggerKey={scoreKey} />
      <AnimatePresence mode="wait">
        <motion.div
          key={question?.id}
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
            <div className="flex items-center gap-2">
              {timer !== undefined && timer !== null && (
                <TimerBadge
                  remaining={timer.remaining}
                  isFrozen={timer.isFrozen}
                  didTimeout={timer.didTimeout}
                />
              )}
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
          <QuestionMedia image={question?.image} />

          {/* Question */}
          <h3 className="font-display text-lg sm:text-xl font-semibold mb-8 text-center leading-snug">
            {question?.question}
          </h3>

          {/* Options */}
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {question?.options?.map((option, index) => {
                const isHidden = hiddenOptions?.includes(index);
                const state = getOptionState(index);
                const isDisabled = selectedAnswer !== null;

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
                      <span className="relative z-10 text-left text-muted-foreground/40">{option?.text}</span>
                    </motion.div>
                  );
                }

                const isCorrect = state === "correct";
                const isWrong = state === "wrong";

                return (
                  <motion.button
                    key={index}
                    layout
                    type="button"
                    onClick={() => handleSelect(index)}
                    disabled={isDisabled}
                    whileHover={!isDisabled ? { scale: 1.02 } : undefined}
                    whileTap={!isDisabled ? { scale: 0.97 } : undefined}
                    animate={
                      isWrong
                        ? { x: [0, -4, 4, -4, 4, 0], transition: { duration: 0.4 } }
                        : {}
                    }
                    className={`relative overflow-hidden rounded-lg border px-5 py-3.5 text-left text-sm font-medium font-body transition-all duration-300 ${
                      state === "idle"
                        ? "border-border/50 bg-muted/20 hover:border-secondary/50 hover:bg-secondary/10 cursor-pointer"
                        : state === "highlighted"
                        ? "border-accent/40 bg-accent/10 ring-1 ring-accent/40 cursor-pointer"
                        : isCorrect
                        ? "border-green-500/60 bg-green-900/20 shadow-[0_0_20px_hsla(142,76%,36%,0.25)] cursor-default"
                        : isWrong
                        ? "border-destructive/60 bg-red-900/20 cursor-default"
                        : "border-border/30 opacity-40 cursor-default pointer-events-none"
                    }`}
                    style={
                      state === "idle" || state === "highlighted"
                        ? undefined
                        : isCorrect
                        ? { boxShadow: "0 0 20px hsla(142, 76%, 36%, 0.3)" }
                        : undefined
                    }
                  >
                    {isCorrect && (
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        aria-hidden
                      />
                    )}
                    <span className="relative z-10 text-left">{option?.text}</span>
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

export default QuizCard;
