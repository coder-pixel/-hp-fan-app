import { useEffect, useMemo, useRef, useState } from "react";
import {
  ResultsPage,
  ReviewPage,
  mapHistoryToResultAnswers,
} from "@/quiz-results";
import { QUIZ_TIMEOUT_ANSWER_INDEX } from "@/quiz-engine/constants";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

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

const QuizPlayInner = ({ quiz }: { quiz: Quiz }) => {
  const { state, actions } = useQuiz();
  const {
    status,
    config,
    timer,
    questions,
    questionIndex,
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
  const currentQuestion = questions?.[questionIndex];
  const soundsAllowed = config?.sounds?.enabled !== false;
  const [audioOn, setAudioOn] = useState<boolean>(soundsAllowed);
  const [askDumbledoreModalOpen, setAskDumbledoreModalOpen] = useState(false);
  const askDumbledoreQuestionIndexRef = useRef<number | null>(null);
  const [pollModalOpen, setPollModalOpen] = useState(false);
  const [finishedPanel, setFinishedPanel] = useState<"results" | "review">("results");
  const legilimencyQuestionIndexRef = useRef<number | null>(null);
  const prevHiddenOptionsLenRef = useRef(0);

  // Felix Felicis microcopy — handles all three message phases.
  const { microcopy: felixMicrocopy } = useFelixFelicis(
    { felixActive, felixRetryPending, felixUsed, selectedAnswer, questionIndex },
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
      askDumbledoreQuestionIndexRef.current = questionIndex;
      setAskDumbledoreModalOpen(true);
    }
  }, [activeEffect?.type, activeEffect?.hint, questionIndex]);

  useEffect(() => {
    if (activeEffect?.type === "legilimency" && activeEffect?.pollResults) {
      legilimencyQuestionIndexRef.current = questionIndex;
      setPollModalOpen(true);
    }
  }, [activeEffect?.type, activeEffect?.pollResults, questionIndex]);

  useEffect(() => {
    if (status !== "finished") setFinishedPanel("results");
  }, [status]);

  useEffect(() => {
    // Moving to another question: reset all per-question modal states.
    setAskDumbledoreModalOpen(false);
    askDumbledoreQuestionIndexRef.current = null;
    setPollModalOpen(false);
    legilimencyQuestionIndexRef.current = null;
  }, [questionIndex]);

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
        {/* <span className="text-xs font-body font-medium tracking-widest uppercase text-accent/70 mb-3">
          {quiz?.category}
        </span> */}
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">{config?.title}</h1>
        {/* <p className="text-muted-foreground font-body text-sm sm:text-base">
          Score: <span className="text-foreground font-semibold">{score}</span>
        </p> */}
      </motion.div>

      {status === "finished" ? (
        <>
          {finishedPanel === "review" ? (
            <ReviewPage data={resultPayload} onBack={() => setFinishedPanel("results")} />
          ) : (
            <>
              <ResultsPage
                data={resultPayload}
                config={{
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
                }}
                onPlayAgain={actions?.restartQuiz}
                onReviewAnswers={() => setFinishedPanel("review")}
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
              askDumbledoreQuestionIndexRef.current === questionIndex
            }
            hint={activeEffect?.type === "askDumbledore" ? activeEffect?.hint ?? "" : ""}
            onClose={() => setAskDumbledoreModalOpen(false)}
          />

          {config?.timer?.enabled && timer?.didTimeout && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 rounded-lg border border-amber-500/40 bg-amber-950/30 px-4 py-3 text-center backdrop-blur-sm"
              style={{ boxShadow: "0 0 20px hsla(38, 92%, 50%, 0.15)" }}
            >
              <p className="text-sm font-semibold font-body text-amber-200">
                ⏱️ Time's up!
              </p>
              <p className="mt-1 text-xs font-body text-amber-200/80">
                Moving to next question...
              </p>
            </motion.div>
          )}

          <div className="relative">
            <FelixMicrocopy message={felixMicrocopy} />
            <QuizCard
              question={currentQuestion}
              currentIndex={questionIndex}
              total={questions?.length}
              streak={streak}
              selectedAnswer={selectedAnswer}
              onSelect={actions?.answerQuestion}
              mapHighlight={mapHighlight}
              felixActive={felixActive}
              felixRetryPending={felixRetryPending}
              felixUsed={felixUsed}
              hiddenOptions={hiddenOptions}
              timer={config?.timer?.enabled ? timer : null}
              sounds={config?.sounds}
              lifelineDockProps={{
                quizLifelines: quiz?.lifelineConfig,
                lifelineStates,
                onActivate: (id) => {
                  if (
                    id === "askDumbledore" &&
                    activeEffect?.type === "askDumbledore" &&
                    !!activeEffect?.hint &&
                    askDumbledoreQuestionIndexRef.current === questionIndex
                  ) {
                    setAskDumbledoreModalOpen(true);
                    return;
                  }
                  if (
                    id === "legilimency" &&
                    activeEffect?.type === "legilimency" &&
                    !!activeEffect?.pollResults &&
                    legilimencyQuestionIndexRef.current === questionIndex
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
                    askDumbledoreQuestionIndexRef.current === questionIndex
                  ) return true;
                  if (
                    id === "legilimency" &&
                    activeEffect?.type === "legilimency" &&
                    !!activeEffect?.pollResults &&
                    legilimencyQuestionIndexRef.current === questionIndex
                  ) return true;
                  return false;
                },
                label: "Lifelines",
              }}
            />
          </div>

          <PollModal
            open={
              pollModalOpen &&
              activeEffect?.type === "legilimency" &&
              !!activeEffect?.pollResults &&
              legilimencyQuestionIndexRef.current === questionIndex
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
            <QuizPlayInner quiz={quiz} />
          </QuizProvider>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default QuizPlayPage;

