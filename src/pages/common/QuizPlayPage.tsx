import { useEffect, useMemo, useRef, useState } from "react";
import {
  ResultsPage,
  ReviewPage,
  ShareCardPage,
  mapHistoryToResultAnswers,
} from "@/quiz-results";
import { QUIZ_TIMEOUT_ANSWER_INDEX } from "@/quiz-engine/constants";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MagicalParticles from "@/components/quiz/MagicalParticles";
import QuizInstructions from "@/components/quiz/QuizInstructions";
import QuizCard from "@/components/quiz/QuizCard";
import NextQuizCard from "@/components/quiz/NextQuizCard";
import LifelineEffects from "@/components/quiz/lifelines/LifelineEffects";
import FelixMicrocopy from "@/components/quiz/FelixMicrocopy";
import DumbledoreModal from "@/components/quiz/DumbledoreModal";
import PollModal from "@/components/quiz/PollModal";
import { useFelixFelicis } from "@/hooks/useFelixFelicis";
import { quizzes } from "@/data/quizzes";
import type { Quiz, QuizQuestion } from "@/types/quiz";
import { QuizProvider, useQuiz } from "@/quiz-engine";
import { Button } from "@/components/ui/button";
import { setQuizSoundsEnabled } from "@/lib/quizSounds";
import { toast } from "@/hooks/use-toast";


function toQuizQuestions(quiz: Quiz): QuizQuestion[] {
  // Engine + lifelines expect 4-option multiple-choice questions (QuizQuestion).
  // Current quizzes in /data/quizzes are multiple-choice, with correctAnswer referencing option.id (1..4).
  return quiz?.questions
    ?.filter((q) => q?.type === "multiple-choice")
    ?.map((q, idx) => {
      const correctIndex = q?.options?.findIndex((o) => o?.id === q?.correctAnswer);
      return {
        id: q?.id || (idx + 1)?.toString(), // Use question id if available, otherwise use index
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

const QuizPlayInner = ({ quiz, autoStart }: { quiz: Quiz; autoStart?: boolean }) => {
  const { state, actions } = useQuiz();
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
  const hasAutoStartedRef = useRef(false);

  // Felix Felicis microcopy — handles all three message phases.
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
    if (!autoStart) return;
    if (status !== "instructions") return;
    if (hasAutoStartedRef.current) return;
    if (typeof actions?.startQuiz !== "function") return;

    hasAutoStartedRef.current = true;
    actions.startQuiz();
  }, [autoStart, status, actions]);

  useEffect(() => {
    // Changing the viewed question: reset all per-question modal states.
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

  if (status === "instructions" && autoStart) {
    return (
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-1 py-10"
        >
          <h1 className="font-display text-lg font-semibold leading-snug tracking-tight text-balance sm:text-xl md:text-2xl">
            {config?.title}
          </h1>
          <p className="mt-2 text-sm font-body text-muted-foreground">Starting quiz...</p>
        </motion.div>
      </div>
    );
  }

  if (status === "instructions") {
    return (
      <div className="relative z-10 w-full max-w-6xl -mx-4 sm:mx-auto sm:max-w-6xl">
        {/* <div className="mb-8 flex w-full max-w-2xl flex-col items-center px-1">
          {quiz?.category ? (
            <span className="mb-3 block text-xs font-body font-medium uppercase tracking-widest text-accent/70">
              {quiz.category}
            </span>
          ) : null}
          <h1 className="font-display text-2xl font-bold leading-snug tracking-tight text-balance text-foreground sm:text-3xl md:text-4xl">
            {config?.title}
          </h1>
        </div> */}

        <QuizInstructions
          totalQuestions={questions?.length}
          onStart={actions?.startQuiz}
          quizLifelines={quiz?.lifelineConfig}
          quizTitle={quiz?.title}
          quizImage={quiz?.image}
        />
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto max-w-2xl">
      {status !== "playing" && quiz?.category ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 border-b border-border/30 pb-5 text-center sm:mb-6"
        >
          <span className="mb-2 block font-body text-[11px] font-medium uppercase tracking-[0.2em] text-accent/70">
            {quiz?.category}
          </span>
          <h1 className="mx-auto max-w-xl px-1 font-display text-lg font-semibold leading-snug tracking-tight text-balance text-foreground sm:max-w-2xl sm:text-xl sm:font-bold md:text-2xl">
            {config?.title}
          </h1>
        </motion.div>
      ) : null}

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
              headerRightSlot={
                soundsAllowed ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setAudioOn((v) => !v)}
                    aria-label={audioOn ? "Mute quiz sounds" : "Enable quiz sounds"}
                    className="h-8 w-8 rounded-xl border border-border/40 bg-background/50 backdrop-blur-md hover:bg-accent/10"
                  >
                    {audioOn ? (
                      <Volume2 className="h-4 w-4 text-accent" />
                    ) : (
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                ) : null
              }
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

const QuizPlayPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const autoStart = searchParams.get("start") === "1";

  const quiz = useMemo(() => quizzes?.find((q: Quiz) => q?.id === id), [id]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="relative flex-1 pt-28 pb-24 px-4">
        <MagicalParticles />

        {!quiz ? (
          <div className="relative z-10 mx-auto max-w-2xl glass-card p-7 sm:p-9 text-center">
            <h1 className="font-display text-2xl font-bold mb-2">Quiz not found</h1>
            <p className="text-muted-foreground font-body text-sm mb-6">
              The quiz you selected doesn’t exist (or was removed).
            </p>
            <Button asChild>
              <Link to="/quizzes">Back to quizzes</Link>
            </Button>
          </div>
        ) : (
          <QuizProvider
            key={quiz?.id}
            config={{
              id: quiz?.id,
              title: quiz?.title,
              timer: {
                enabled: !!quiz?.lifelineConfig?.timer?.enabled,
                secondsPerQuestion: quiz?.lifelineConfig?.timer?.secondsPerQuestion ?? 40,
              },
              questions: toQuizQuestions(quiz as Quiz),
              sounds: quiz?.sounds ?? { enabled: true },
            }}
          >
            <QuizPlayInner quiz={quiz} autoStart={autoStart} />
          </QuizProvider>
        )}
      </main>
      <Footer />
    </div>
  );
};

// QuizPlayPage.routePath = "/quiz/:id"; // This is used to create the route path for the quiz play page

export default QuizPlayPage;

