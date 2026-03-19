import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MagicalParticles from "@/components/quiz/MagicalParticles";
import QuizInstructions from "@/components/quiz/QuizInstructions";
import QuizCard from "@/components/quiz/QuizCard";
import QuizResult from "@/components/quiz/QuizResult";
import LifelineDock from "@/components/quiz/lifelines/LifelineDock";
import LifelineEffects from "@/components/quiz/lifelines/LifelineEffects";
import PollModal from "@/components/quiz/PollModal";
import { quizzes } from "@/data/quizzes";
import type { Quiz, QuizQuestion } from "@/types/quiz";
import { QuizProvider, useQuiz } from "@/quiz-engine";
import { Button } from "@/components/ui/button";

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

  if (status === "instructions") {
    return (
      <div className="relative z-10 mx-auto max-w-3xl flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center mb-8">
          <span className="block text-xs font-body font-medium tracking-widest uppercase text-accent/70 mb-3">
            {quiz?.category}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">{config?.title}</h1>
        </div>

        <QuizInstructions totalQuestions={questions?.length} onStart={actions?.startQuiz} />
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
          <LifelineEffects effect={activeEffect} onDismiss={actions?.dismissEffect} />


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
          />

          <LifelineDock
            lifelineStates={lifelineStates}
            onActivate={actions?.useLifeline}
            disabled={selectedAnswer !== null}
            activeId={activeEffect?.type ?? null}
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
                enabled: !!quiz?.config?.timer?.enabled,
                secondsPerQuestion: quiz?.config?.timer?.secondsPerQuestion ?? 40,
              },
              questions: toQuizQuestions(quiz as Quiz),
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

