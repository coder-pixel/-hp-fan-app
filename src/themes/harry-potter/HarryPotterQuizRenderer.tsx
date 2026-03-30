import { useEffect, useMemo, useRef, useState } from "react";
import {
  ResultsPage,
  ReviewPage,
  ShareCardPage,
  mapHistoryToResultAnswers,
} from "@/quiz-results";
import { QUIZ_TIMEOUT_ANSWER_INDEX } from "@/core/quiz/constants";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

import QuizInstructions from "@/components/quiz/QuizInstructions";
import QuizCard from "@/components/quiz/QuizCard";
import NextQuizCard from "@/components/quiz/NextQuizCard";
import LifelineEffects from "@/components/quiz/lifelines/LifelineEffects";
import FelixMicrocopy from "@/components/quiz/FelixMicrocopy";
import DumbledoreModal from "@/components/quiz/DumbledoreModal";
import PollModal from "@/components/quiz/PollModal";
import { useFelixFelicis } from "@/hooks/useFelixFelicis";
import type { Quiz, QuizQuestion } from "@/types/quiz";
import { useQuizEngine } from "@/hooks/useQuizEngine";
import { Button } from "@/components/ui/button";
import { setQuizSoundsEnabled } from "@/lib/quizSounds";
import { toast } from "@/hooks/use-toast";
import type { QuizThemeRendererProps } from "@/registry/themeTypes";

function toQuizQuestions(quiz: Quiz): QuizQuestion[] {
  return quiz?.questions
    ?.filter((q) => q?.type === "multiple-choice")
    ?.map((q, idx) => {
      const correctIndex = q?.options?.findIndex((o) => o?.id === q?.correctAnswer);
      return {
        id: q?.id || (idx + 1)?.toString(),
        question: q?.question,
        options: q?.options?.map((o) => ({ id: o?.id, text: o?.text })),
        correctAnswer: correctIndex >= 0 ? correctIndex : 0,
        image: q?.image,
        hint: q?.hint,
        explanation: q?.explanation,
        type: "multiple-choice",
      };
    });
}

/**
 * Harry Potter themed play UI: instructions, question card, lifelines, results.
 * Theme layer only — no scoring rules (handled by engine + strategy).
 */
const HarryPotterQuizRenderer = ({ quiz }: QuizThemeRendererProps) => {
  const { state, actions } = useQuizEngine();
  const {
    status,
    config,
    timer,
    questions,
    questionIndex,
    displayQuestionIndex,
    score,
    answerHistory,
    streak,
    selectedAnswer,
    lifelineStates,
    activeEffect,
    felixActive,
    felixRetryPending,
    felixUsed,
    mapHighlight,
    hiddenOptions,
  } = state;
  const isReviewingPast = displayQuestionIndex < questionIndex;
  const historyForDisplay = answerHistory.find(
    (h) => h.questionIndex === displayQuestionIndex,
  );
  const displayedSelectedAnswer = isReviewingPast
    ? (historyForDisplay?.userOptionIndex ?? null)
    : selectedAnswer;

  const currentQuestion = questions?.[displayQuestionIndex];

  const totalQuestions = questions?.length ?? 0;
  const canGoPrevious = displayQuestionIndex > 0;
  const canGoNext =
    !felixRetryPending &&
    (displayQuestionIndex < questionIndex ||
      (displayQuestionIndex === questionIndex && selectedAnswer !== null));
  const nextButtonLabel =
    displayQuestionIndex < questionIndex
      ? "Next"
      : displayQuestionIndex === totalQuestions - 1 &&
          questionIndex === displayQuestionIndex &&
          selectedAnswer !== null
        ? "Finish"
        : "Next";
  const soundsAllowed = config?.sounds?.enabled !== false;
  const [audioOn, setAudioOn] = useState<boolean>(soundsAllowed);
  const [askDumbledoreModalOpen, setAskDumbledoreModalOpen] = useState(false);
  const askDumbledoreQuestionIndexRef = useRef<number | null>(null);
  const [pollModalOpen, setPollModalOpen] = useState(false);
  const [finishedPanel, setFinishedPanel] = useState<"results" | "review" | "share">("results");
  const legilimencyQuestionIndexRef = useRef<number | null>(null);
  const prevHiddenOptionsLenRef = useRef(0);

  const { microcopy: felixMicrocopy } = useFelixFelicis(
    {
      felixActive: isReviewingPast ? false : felixActive,
      felixRetryPending: isReviewingPast ? false : felixRetryPending,
      felixUsed: isReviewingPast ? false : felixUsed,
      selectedAnswer: isReviewingPast ? null : selectedAnswer,
      questionIndex: isReviewingPast ? displayQuestionIndex : questionIndex,
    },
    currentQuestion ?? null,
  );

  useEffect(() => {
    setQuizSoundsEnabled(soundsAllowed && audioOn);
  }, [soundsAllowed, audioOn]);

  useEffect(() => {
    const hiddenOptionsLen = hiddenOptions?.length ?? 0;
    if (hiddenOptionsLen === 2 && prevHiddenOptionsLenRef.current !== 2) {
      toast({ title: "2 incorrect options have been removed" });
    }
    prevHiddenOptionsLenRef.current = hiddenOptionsLen;
  }, [hiddenOptions]);

  useEffect(() => {
    if (activeEffect?.type === "askDumbledore" && activeEffect?.hint) {
      askDumbledoreQuestionIndexRef.current = displayQuestionIndex;
      setAskDumbledoreModalOpen(true);
    }
  }, [activeEffect?.type, activeEffect?.hint, displayQuestionIndex]);

  useEffect(() => {
    if (activeEffect?.type === "legilimency" && activeEffect?.pollResults) {
      legilimencyQuestionIndexRef.current = displayQuestionIndex;
      setPollModalOpen(true);
    }
  }, [activeEffect?.type, activeEffect?.pollResults, displayQuestionIndex]);

  useEffect(() => {
    if (status !== "finished") setFinishedPanel("results");
  }, [status]);

  useEffect(() => {
    setAskDumbledoreModalOpen(false);
    askDumbledoreQuestionIndexRef.current = null;
    setPollModalOpen(false);
    legilimencyQuestionIndexRef.current = null;
  }, [displayQuestionIndex]);

  const resultPayload = useMemo(() => {
    const total = questions?.length ?? 0;
    const answers =
      status === "finished"
        ? mapHistoryToResultAnswers(questions ?? [], answerHistory ?? [], {
            timeoutAnswerIndex: QUIZ_TIMEOUT_ANSWER_INDEX,
          })
        : [];
    return { score, total, answers };
  }, [status, score, questions, answerHistory]);

  const quizResultsUiConfig = useMemo(
    () => ({
      quizTitle: config?.title,
      shareUrl: typeof window !== "undefined" ? window.location.href : undefined,
      emotionalBands: quiz?.resultsPageConfig?.emotionalBandsConfig,
      socialShare: quiz?.resultsPageConfig?.socialShareConfig,
      passMark: quiz?.shareCardConfig?.passMark,
      shareCard: {
        headline: quiz?.shareCardConfig?.headline ?? "Certified Potterhead 🪄",
        tagline: quiz?.shareCardConfig?.tagline,
        challengeLine: quiz?.shareCardConfig?.challengeLine,
        themes: quiz?.shareCardConfig?.themes,
        defaultTheme: quiz?.shareCardConfig?.defaultTheme,
      },
    }),
    [config?.title, quiz],
  );

  if (status === "instructions") {
    return (
      <div className="relative z-10 mx-auto max-w-3xl flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center mb-8">
          <span className="block text-xs font-body font-medium tracking-widest uppercase text-accent/70 mb-3">
            {quiz?.category}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">{config?.title}</h1>
        </div>

        <QuizInstructions totalQuestions={questions?.length} onStart={actions?.startQuiz} quizLifelines={quiz?.lifelineConfig} />
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">{config?.title}</h1>
      </motion.div>

      {status === "finished" ? (
        <>
          {finishedPanel === "review" ? (
            <ReviewPage data={resultPayload} onBack={() => setFinishedPanel("results")} />
          ) : finishedPanel === "share" ? (
            <ShareCardPage
              data={resultPayload}
              config={quizResultsUiConfig}
              onBack={() => setFinishedPanel("results")}
            />
          ) : (
            <>
              <ResultsPage
                data={resultPayload}
                config={quizResultsUiConfig}
                onPlayAgain={actions?.restartQuiz}
                onReviewAnswers={() => setFinishedPanel("review")}
                onShareCard={() => setFinishedPanel("share")}
              />
              <NextQuizCard />
            </>
          )}
        </>
      ) : (
        <>
          {soundsAllowed && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setAudioOn((v) => !v)}
              aria-label={audioOn ? "Mute quiz sounds" : "Enable quiz sounds"}
              className="absolute top-[-14px] right-2 z-[60] h-9 w-9 rounded-xl border border-border/40 bg-background/50 backdrop-blur-md hover:bg-accent/10"
            >
              {audioOn ? <Volume2 className="h-4 w-4 text-accent" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
            </Button>
          )}
          <LifelineEffects effect={activeEffect} />
          <DumbledoreModal
            open={
              askDumbledoreModalOpen &&
              activeEffect?.type === "askDumbledore" &&
              !!activeEffect?.hint &&
              askDumbledoreQuestionIndexRef.current === displayQuestionIndex
            }
            hint={activeEffect?.type === "askDumbledore" ? activeEffect?.hint ?? "" : ""}
            onClose={() => setAskDumbledoreModalOpen(false)}
          />

          {config?.timer?.enabled &&
            timer?.didTimeout &&
            displayQuestionIndex === questionIndex && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 rounded-lg border border-amber-500/40 bg-amber-950/30 px-4 py-3 text-center backdrop-blur-sm"
              style={{ boxShadow: "0 0 20px hsla(38, 92%, 50%, 0.15)" }}
            >
              <p className="text-sm font-semibold font-body text-amber-200">
                ⏱️ Time&apos;s up!
              </p>
              <p className="mt-1 text-xs font-body text-amber-200/80">
                Your answer was marked wrong. Use Next when you&apos;re ready to continue.
              </p>
            </motion.div>
          )}

          <div className="relative">
            <FelixMicrocopy message={felixMicrocopy} />
            <QuizCard
              question={currentQuestion}
              currentIndex={displayQuestionIndex}
              total={questions?.length}
              streak={streak}
              selectedAnswer={displayedSelectedAnswer}
              readOnly={isReviewingPast}
              onSelect={actions?.answerQuestion}
              mapHighlight={isReviewingPast ? null : mapHighlight}
              felixActive={isReviewingPast ? false : felixActive}
              felixRetryPending={isReviewingPast ? false : felixRetryPending}
              felixUsed={isReviewingPast ? false : felixUsed}
              hiddenOptions={isReviewingPast ? [] : hiddenOptions}
              timer={
                config?.timer?.enabled && !isReviewingPast && displayQuestionIndex === questionIndex
                  ? timer
                  : null
              }
              sounds={config?.sounds}
              lifelineDockProps={
                !isReviewingPast
                  ? {
                      quizLifelines: quiz?.lifelineConfig,
                      lifelineStates,
                      onActivate: (id) => {
                        if (
                          id === "askDumbledore" &&
                          activeEffect?.type === "askDumbledore" &&
                          !!activeEffect?.hint &&
                          askDumbledoreQuestionIndexRef.current === displayQuestionIndex
                        ) {
                          setAskDumbledoreModalOpen(true);
                          return;
                        }
                        if (
                          id === "legilimency" &&
                          activeEffect?.type === "legilimency" &&
                          !!activeEffect?.pollResults &&
                          legilimencyQuestionIndexRef.current === displayQuestionIndex
                        ) {
                          setPollModalOpen(true);
                          return;
                        }

                        if (id === "felixFelicis") {
                          toast({
                            title: "Felix Felicis",
                            description: "A sip of liquid luck. If you falter, you get one more try this round.",
                          });
                        }
                        actions?.useLifeline(id);
                      },
                      disabled: selectedAnswer !== null || felixRetryPending,
                      activeId: activeEffect?.type ?? null,
                      allowUsedActivation: (id) => {
                        if (
                          id === "askDumbledore" &&
                          activeEffect?.type === "askDumbledore" &&
                          !!activeEffect?.hint &&
                          askDumbledoreQuestionIndexRef.current === displayQuestionIndex
                        )
                          return true;
                        if (
                          id === "legilimency" &&
                          activeEffect?.type === "legilimency" &&
                          !!activeEffect?.pollResults &&
                          legilimencyQuestionIndexRef.current === displayQuestionIndex
                        )
                          return true;
                        return false;
                      },
                      label: "Lifelines",
                    }
                  : undefined
              }
            />
          </div>

          <div className="relative z-10 mx-auto mt-8 flex max-w-xl items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              className="min-w-[8.5rem] font-body"
              disabled={!canGoPrevious}
              onClick={() => actions?.goToPreviousQuestion()}
            >
              <ChevronLeft className="mr-1 h-4 w-4" aria-hidden />
              Previous
            </Button>
            <Button
              type="button"
              className="min-w-[8.5rem] font-body"
              disabled={!canGoNext}
              onClick={() => actions?.goToNextQuestion()}
            >
              {nextButtonLabel}
              <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
            </Button>
          </div>

          <PollModal
            open={
              pollModalOpen &&
              activeEffect?.type === "legilimency" &&
              !!activeEffect?.pollResults &&
              legilimencyQuestionIndexRef.current === displayQuestionIndex
            }
            onClose={() => setPollModalOpen(false)}
            pollResults={activeEffect?.type === "legilimency" && activeEffect?.pollResults ? activeEffect.pollResults : []}
          />
        </>
      )}
    </div>
  );
};

export { toQuizQuestions };
export default HarryPotterQuizRenderer;
