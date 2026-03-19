import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MagicalParticles from "@/components/quizlet/MagicalParticles";
import QuizInstructions from "@/components/quizlet/QuizInstructions";
import QuizletCard from "@/components/quizlet/QuizletCard";
import QuizletResult from "@/components/quizlet/QuizletResult";
import LifelineBar from "@/components/quizlet/lifelines/LifelineBar";
import LifelineEffects from "@/components/quizlet/lifelines/LifelineEffects";
import TimerPill from "@/components/quizlet/TimerPill";
import { quizzes } from "@/data/quizzes";
import type { Quiz } from "@/types/quiz";
import type { QuizletQuestion } from "@/data/quizletQuestions";
import { QuizProvider, useQuiz } from "@/quiz-engine";
import { Button } from "@/components/ui/button";

function toQuizletQuestions(quiz: Quiz): QuizletQuestion[] {
  // Engine + lifelines expect 4-option multiple-choice questions (QuizletQuestion).
  // Current quizzes in /data/quizzes are multiple-choice, with correctAnswer referencing option.id (1..4).
  return quiz.questions
    ?.filter((q) => q?.type === "multiple-choice")
    ?.map((q, idx) => {
      const correctIndex = q?.options?.findIndex((o) => o?.id === q?.correctAnswer);
      return {
        id: idx + 1,
        question: q?.question,
        options: q?.options?.map((o) => o?.text),
        correctAnswer: correctIndex >= 0 ? correctIndex : 0,
        image: q?.image,
        hint: q?.hint,
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
      <div className="relative z-10 mx-auto max-w-2xl">
        <QuizInstructions totalQuestions={questions?.length} onStart={actions?.startQuiz} />
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <span className="block text-xs font-body font-medium tracking-widest uppercase text-accent/70 mb-3">
          {quiz?.category}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">{config?.title}</h1>
        <p className="text-muted-foreground font-body text-sm sm:text-base">
          Score: <span className="text-foreground font-semibold">{score}</span>
        </p>
      </motion.div>

      {status === "finished" ? (
        <QuizletResult score={score} total={questions?.length} onRestart={actions?.restartQuiz} />
      ) : (
        <>
          <LifelineEffects effect={activeEffect} onDismiss={actions?.dismissEffect} />

          {config?.timer?.enabled && (
            <TimerPill remaining={timer?.remaining} isFrozen={timer?.isFrozen} didTimeout={timer?.didTimeout} />
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

          <QuizletCard
            question={currentQuestion}
            currentIndex={questionIndex}
            total={questions?.length}
            streak={streak}
            selectedAnswer={selectedAnswer}
            onSelect={actions?.answerQuestion}
            mapHighlight={mapHighlight}
            felixActive={felixActive}
            hiddenOptions={hiddenOptions}
          />

          <LifelineBar lifelineStates={lifelineStates} onActivate={actions?.useLifeline} disabled={selectedAnswer !== null} />
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
            key={quiz.id}
            config={{
              id: quiz.id,
              title: quiz.title,
              timer: {
                enabled: !!quiz.config?.timer?.enabled,
                secondsPerQuestion: quiz.config?.timer?.secondsPerQuestion ?? 40,
              },
              questions: toQuizletQuestions(quiz),
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

