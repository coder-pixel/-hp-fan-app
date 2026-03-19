import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MagicalParticles from "@/components/quiz/MagicalParticles";
import QuizInstructions from "@/components/quiz/QuizInstructions";
import QuizCard from "@/components/quiz/QuizCard";
import QuizResult from "@/components/quiz/QuizResult";
import LifelineEffects from "@/components/quiz/lifelines/LifelineEffects";
import PollModal from "@/components/quiz/PollModal";
import { quizzes } from "@/data/quizzes";
import type { Quiz, QuizQuestion } from "@/types/quiz";
import { QuizProvider, useQuiz } from "@/quiz-engine";
import { Button } from "@/components/ui/button";
import { setQuizSoundsEnabled } from "@/lib/quizSounds";

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
    streak,
    selectedAnswer,
    lifelineStates,
    activeEffect,
    felixActive,
    mapHighlight,
    hiddenOptions,
  } = state;
  const currentQuestion = questions?.[questionIndex];
  const soundsAllowed = config?.sounds?.enabled !== false;
  const [audioOn, setAudioOn] = useState<boolean>(soundsAllowed);

  useEffect(() => {
    setQuizSoundsEnabled(soundsAllowed && audioOn);
  }, [soundsAllowed, audioOn]);

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
      {/* <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <span className="block text-xs font-body font-medium tracking-widest uppercase text-accent/70 mb-3">
          {quiz?.category}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">{config?.title}</h1>
        <p className="text-muted-foreground font-body text-sm sm:text-base">
          Score: <span className="text-foreground font-semibold">{score}</span>
        </p>
      </motion.div> */}

      {status === "finished" ? (
        <QuizResult quizTitle={config?.title} quizLink={window.location.href} score={score} total={questions?.length} onRestart={actions?.restartQuiz} />
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
          <LifelineEffects effect={activeEffect} onDismiss={actions?.dismissEffect} />

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

          {felixActive && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-3">
              <span
                className="inline-block text-xs font-body font-semibold px-3 py-1 rounded-full border border-accent/40 text-accent"
                style={{ boxShadow: "0 0 16px hsla(43, 72%, 52%, 0.3)" }}
              >
                ✨ Felix Felicis Active — Next answer guaranteed correct!
              </span>
            </motion.div>
          )}

          <QuizCard
            question={currentQuestion}
            currentIndex={questionIndex}
            total={questions?.length}
            streak={streak}
            selectedAnswer={selectedAnswer}
            onSelect={actions?.answerQuestion}
            mapHighlight={mapHighlight}
            felixActive={felixActive}
            hiddenOptions={hiddenOptions}
            timer={config?.timer?.enabled ? timer : null}
            sounds={config?.sounds}
            lifelineDockProps={{
              quizLifelines: quiz?.lifelineConfig,
              lifelineStates,
              onActivate: actions?.useLifeline,
              disabled: selectedAnswer !== null,
              activeId: activeEffect?.type ?? null,
              label: "Lifelines",
            }}
          />


          <PollModal
            open={activeEffect?.type === "legilimency" && !!activeEffect?.pollResults}
            onClose={actions?.dismissEffect}
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

