import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { QuizQuestion } from "@/types/quiz";
import { cn } from "@/lib/utils";
import QuestionMedia from "./QuestionMedia";
import FloatingScore from "./FloatingScore";
import TimerBadge from "./TimerBadge";
import { playCorrect, playWrong } from "@/lib/quizSounds";
import type { QuizSoundsConfig } from "@/types/quiz";
import LifelineDock from "@/components/quiz/lifelines/LifelineDock";
import type { LifelineId, LifelineState } from "@/components/quiz/lifelines/lifelineTypes";
import type { QuizPluginsConfig } from "@/types/quiz";
import { QUIZ_TIMEOUT_ANSWER_INDEX } from "@/quiz-engine/constants";

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
  /** True during the 800ms wrong-answer → reset window. */
  felixRetryPending?: boolean;
  /** True after retry was consumed — used for subtle "lucky glow" on remaining options. */
  felixUsed?: boolean;
  hiddenOptions?: number[];
  /** Timer shown inside card when provided */
  timer?: TimerState | null;
  /** Sound config from quiz. When omitted, defaults to enabled. */
  sounds?: QuizSoundsConfig;
  /** Reviewing an earlier question: no interaction, lifelines should be omitted by parent. */
  readOnly?: boolean;
  /** Optional slot rendered in the header top-right (e.g. sound toggle). */
  headerRightSlot?: ReactNode;
  /** Lifelines rendered inside the question card header area. */
  lifelineDockProps?: {
    quizLifelines: QuizPluginsConfig;
    lifelineStates: Record<LifelineId, LifelineState>;
    onActivate: (id: LifelineId) => void;
    disabled: boolean;
    activeId?: LifelineId | null;
    allowUsedActivation?: (id: LifelineId) => boolean;
    label?: string;
  };
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
  felixRetryPending = false,
  felixUsed = false,
  hiddenOptions = [],
  timer,
  sounds,
  lifelineDockProps,
  readOnly = false,
  headerRightSlot,
}: QuizCardProps) => {
  const progress = ((currentIndex + 1) / total) * 100;
  const [scoreKey, setScoreKey] = useState(0);
  const [showScore, setShowScore] = useState(false);
  /** After reveal: swap between answers grid vs explanation in the same slot. */
  const [postAnswerFace, setPostAnswerFace] = useState<"answers" | "explanation">("answers");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setPostAnswerFace("answers");
  }, [currentIndex, question?.id]);

  const handleSelect = (index: number) => {
    if (readOnly) return;
    onSelect(index);
    const isCorrect = index === question?.correctAnswer;
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

  const getOptionState = (index: number): "idle" | "highlighted" | "correct" | "wrong" | "disabled" | "lucky-idle" => {
    if (selectedAnswer === null) {
      if (mapHighlight === index) return "highlighted";
      // After a felix retry is consumed, remaining idle options get a subtle lucky glow.
      if (felixUsed) return "lucky-idle";
      return "idle";
    }
    // Felix retry window:
    // - user has already answered incorrectly
    // - show only the red "wrong" state for the chosen option
    // - do NOT reveal the correct answer yet
    if (felixActive && felixRetryPending) {
      if (index === selectedAnswer && index !== question?.correctAnswer) return "wrong";
      return "disabled";
    }

    if (question?.type === "multiple-choice" && index === question?.correctAnswer) return "correct";
    if (index === selectedAnswer && index !== question?.correctAnswer) return "wrong";
    return "disabled";
  };

  const isInputLocked =
    readOnly || selectedAnswer !== null || felixRetryPending;

  const answersRevealed = selectedAnswer !== null && !felixRetryPending;
  const isTimeoutAnswer = selectedAnswer === QUIZ_TIMEOUT_ANSWER_INDEX;
  const answeredCorrectly =
    answersRevealed &&
    !isTimeoutAnswer &&
    selectedAnswer === question?.correctAnswer;
  const explanationText = question?.explanation?.trim();
  const showExplanation = answersRevealed && !!explanationText;

  /** Show answers first, then flip to explanation (so the flip animation reveals the explanation). */
  useEffect(() => {
    if (!showExplanation) return;
    if (prefersReducedMotion) {
      setPostAnswerFace("explanation");
      return;
    }
    setPostAnswerFace("answers");
    const t = window.setTimeout(() => {
      setPostAnswerFace("explanation");
    }, 720);
    return () => window.clearTimeout(t);
  }, [showExplanation, prefersReducedMotion, currentIndex, question?.id]);

  const optionCount = question?.options?.length ?? 0;

  /** 3 (or any odd) options: last tile spans both columns, centered. */
  const oddGridSpanClass = (index: number) =>
    optionCount % 2 === 1 && index === optionCount - 1
      ? "col-span-2 max-w-sm w-full justify-self-center"
      : "";

  const quizOptionShadow =
    "4px 4px 0 hsl(var(--obsidian) / 0.45), 6px 10px 18px -4px hsl(var(--obsidian) / 0.55)";

  const renderOptionsGrid = () => (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <AnimatePresence>
        {question?.options?.map((option, index) => {
          const isHidden = hiddenOptions?.includes(index);
          const state = getOptionState(index);
          const isDisabled = isInputLocked;
          const spanClass = oddGridSpanClass(index);

          if (isHidden) {
            return (
              <div
                key={index}
                className={cn(
                  "relative flex min-h-[5.25rem] w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-md border-2 border-dashed border-muted-foreground/30 bg-muted/20 px-2 py-3 text-center pointer-events-none sm:min-h-[5.75rem] sm:px-3 sm:py-4",
                  spanClass,
                )}
                aria-hidden
              >
                <span className="text-[9px] font-body font-semibold uppercase tracking-[0.18em] text-muted-foreground/55">
                  Removed
                </span>
                <span className="line-clamp-2 max-w-[95%] font-display text-[11px] font-medium italic leading-snug text-muted-foreground/35 line-through decoration-muted-foreground/30 sm:text-xs">
                  {option?.text}
                </span>
              </div>
            );
          }

          const isCorrect = state === "correct";
          const isWrong = state === "wrong";

          const tileBase =
            "relative flex min-h-[5.25rem] sm:min-h-[5.75rem] w-full items-center justify-center overflow-hidden rounded-md border px-3 py-4 text-center font-display text-sm sm:text-base font-bold italic text-balance transition-all duration-300";

          const tileStateClass =
            state === "idle"
              ? "border-black/20 bg-gradient-to-br from-primary to-indigo-deep text-primary-foreground hover:border-accent/50 hover:brightness-110 cursor-pointer"
              : state === "lucky-idle"
                ? "border-amber-400/50 bg-gradient-to-br from-primary to-indigo-deep text-primary-foreground ring-1 ring-amber-400/35 hover:brightness-110 cursor-pointer"
                : state === "highlighted"
                  ? "border-accent/60 bg-gradient-to-br from-primary to-secondary text-primary-foreground ring-2 ring-accent/50 cursor-pointer"
                  : isCorrect
                    ? "border-success/70 bg-gradient-to-br from-success/90 to-success text-success-foreground cursor-default"
                    : isWrong
                      ? "border-destructive/70 bg-gradient-to-br from-destructive/85 to-destructive text-destructive-foreground cursor-default"
                      : "border-border/25 bg-primary/25 text-primary-foreground/50 opacity-45 cursor-default pointer-events-none";

          const tileShadow =
            state === "idle" || state === "highlighted" || state === "lucky-idle"
              ? ({ boxShadow: quizOptionShadow } as const)
              : isCorrect
                ? ({
                    boxShadow:
                      "4px 4px 0 hsl(var(--success) / 0.35), 0 0 22px hsl(var(--success) / 0.35)",
                  } as const)
                : isWrong
                  ? ({
                      boxShadow:
                        "4px 4px 0 hsl(var(--destructive) / 0.35), 0 0 18px hsl(var(--destructive) / 0.2)",
                    } as const)
                  : ({ boxShadow: quizOptionShadow } as const);

          return (
            <motion.button
              key={index}
              layout
              type="button"
              onClick={() => handleSelect(index)}
              disabled={isDisabled}
              whileHover={
                !isDisabled && (state === "idle" || state === "highlighted" || state === "lucky-idle")
                  ? { y: -2, boxShadow: "6px 6px 0 hsl(var(--obsidian) / 0.5), 8px 14px 22px -4px hsl(var(--obsidian) / 0.5)" }
                  : undefined
              }
              whileTap={!isDisabled ? { y: 1 } : undefined}
              animate={
                isWrong
                  ? { x: [0, -4, 4, -4, 4, 0], transition: { duration: 0.4 } }
                  : {}
              }
              className={`${tileBase} ${tileStateClass} ${spanClass}`}
              style={tileShadow}
            >
              {isCorrect && (
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  aria-hidden
                />
              )}
              <span className="relative z-10 px-1 leading-snug">{option?.text}</span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="relative w-full sm:max-w-xl sm:mx-auto">
      <FloatingScore show={showScore} triggerKey={scoreKey} />
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentIndex}-${question?.id}`}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className={[
            // Mobile: full-bleed, no border/shadow, tighter padding
            "w-full rounded-none border-0 bg-transparent p-4 shadow-none",
            // Desktop/tablet: keep glass card look
            "sm:glass-card sm:rounded-xl sm:p-9",
            !readOnly && felixActive && !felixRetryPending ? "felix-shimmer" : "",
            !readOnly && felixRetryPending ? "felix-retry-flash" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between sm:mb-5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-muted-foreground font-body tracking-wide">
                Question {currentIndex + 1} / {total}
              </span>
              {readOnly && (
                <span className="rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Review
                </span>
              )}
              {/* Minimal golden indicator — no verbose text */}
              {!readOnly && felixActive && !felixRetryPending && (
                <span
                  className="inline-block h-2 w-2 rounded-full bg-amber-400"
                  title="Felix Felicis active"
                  style={{ boxShadow: "0 0 6px 2px hsla(43, 92%, 52%, 0.6)" }}
                  aria-label="Felix Felicis active"
                />
              )}
            </div>

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
              {headerRightSlot}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-muted/35 sm:mb-8 sm:h-1.5">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, hsla(43, 72%, 52%, 0.95), hsla(270, 66%, 35%, 0.9), hsla(43, 72%, 52%, 0.95))",
                boxShadow: "0 0 14px hsla(43, 72%, 52%, 0.18)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {lifelineDockProps && (
            <div className="mb-3 w-full sm:mb-4">
              <LifelineDock
                quizLifelines={lifelineDockProps.quizLifelines}
                lifelineStates={lifelineDockProps.lifelineStates}
                onActivate={lifelineDockProps.onActivate}
                disabled={lifelineDockProps.disabled}
                activeId={lifelineDockProps.activeId ?? null}
                allowUsedActivation={lifelineDockProps.allowUsedActivation}
                label={lifelineDockProps.label ?? "Lifelines"}
              />
            </div>
          )}

          {/* Optional image */}
          <QuestionMedia image={question?.image} />

          {/* Question */}
          <h3 className="mb-6 text-center font-display text-lg font-semibold leading-snug sm:mb-8 sm:text-xl">
            {question?.question}
          </h3>

          {/* Options / explanation: same slot after reveal; flip-style toggle */}
          {!showExplanation ? (
            <>
              {renderOptionsGrid()}
              {isTimeoutAnswer && answersRevealed && (
                <p className="mt-4 text-center font-body text-sm font-medium text-amber-200/90">
                  Time&apos;s up — this counts as a wrong answer.
                </p>
              )}
            </>
          ) : (
            <div className="relative">
              <div
                className="mb-4 flex justify-center"
                role="tablist"
                aria-label="Answer or explanation"
              >
                <div className="inline-flex max-w-full rounded-full border border-border/40 bg-muted/20 p-1">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={postAnswerFace === "answers"}
                    onClick={() => setPostAnswerFace("answers")}
                    className={cn(
                      "min-h-[44px] min-w-[5.5rem] rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:min-w-[7rem] sm:px-4",
                      postAnswerFace === "answers"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Answers
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={postAnswerFace === "explanation"}
                    onClick={() => setPostAnswerFace("explanation")}
                    className={cn(
                      "min-h-[44px] min-w-[5.5rem] rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:min-w-[7rem] sm:px-4",
                      postAnswerFace === "explanation"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Explanation
                  </button>
                </div>
              </div>

              {/* 3D flip: single rotateY (better on mobile than cross-fade) */}
              <div
                className="relative w-full overflow-hidden"
                style={{
                  perspective: "min(900px, 100vw)",
                  WebkitPerspective: "min(900px, 100vw)",
                }}
              >
                <motion.div
                  className="relative grid w-full origin-center [transform-style:preserve-3d] will-change-transform"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{
                    rotateY: postAnswerFace === "explanation" ? 0 : 180,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.52,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  {/* Front: explanation — grid-stacked with answers so height = max(content), no empty gap */}
                  <div
                    role="tabpanel"
                    aria-hidden={postAnswerFace !== "explanation"}
                    className={cn(
                      "col-start-1 row-start-1 w-full min-w-0 rounded-lg border px-4 py-3 text-left font-body text-sm leading-relaxed sm:py-4 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]",
                      answeredCorrectly
                        ? "border-success/50 bg-success/10 text-foreground"
                        : "border-destructive/45 bg-destructive/10 text-foreground",
                    )}
                    style={{
                      transform: "rotateY(0deg) translateZ(1px)",
                    }}
                  >
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {answeredCorrectly ? "Nice!" : "Why"}
                    </span>
                    <p className="text-balance break-words">{explanationText}</p>
                  </div>

                  {/* Back: answers (pre-rotated 180° so it faces the user after parent flip) */}
                  <div
                    role="tabpanel"
                    aria-hidden={postAnswerFace !== "answers"}
                    className="col-start-1 row-start-1 w-full min-w-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
                    style={{
                      transform: "rotateY(180deg) translateZ(1px)",
                    }}
                  >
                    {renderOptionsGrid()}
                  </div>
                </motion.div>
              </div>

              {isTimeoutAnswer && answersRevealed && (
                <p className="mt-4 text-center font-body text-sm font-medium text-amber-200/90">
                  Time&apos;s up — this counts as a wrong answer.
                </p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizCard;
