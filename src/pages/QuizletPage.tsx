import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import QuizletCard from "@/components/quizlet/QuizletCard";
import QuizletResult from "@/components/quizlet/QuizletResult";
import MagicalParticles from "@/components/quizlet/MagicalParticles";
import LifelineBar from "@/components/quizlet/lifelines/LifelineBar";
import LifelineEffects from "@/components/quizlet/lifelines/LifelineEffects";
import QuizInstructions from "@/components/quizlet/QuizInstructions";
import TimerPill from "@/components/quizlet/TimerPill";
import { QuizProvider, useQuiz } from "@/quiz-engine";

const QuizletInner = () => {
  const { state, actions } = useQuiz();
  const { status, config, timer, questions, questionIndex, score, streak, selectedAnswer, lifelineStates, activeEffect, felixActive, mapHighlight, hiddenOptions } = state;
  const currentQuestion = questions[questionIndex];

  if (status === "instructions") {
    return (
      <div className="relative z-10 container mx-auto max-w-2xl">
        <QuizInstructions
          totalQuestions={questions.length}
          onStart={actions.startQuiz}
        />
      </div>
    );
  }

  return (
    <div className="relative z-10 container mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <span className="block text-xs font-body font-medium tracking-widest uppercase text-accent/70 mb-3">
          Test Your Knowledge
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
          Wizard <span className="text-gradient-gold">Quizlet</span>
        </h1>
        <p className="text-muted-foreground font-body text-sm sm:text-base">
          Quick Harry Potter questions to test your knowledge.
        </p>
      </motion.div>

      {status === "finished" ? (
        <QuizletResult score={score} total={questions.length} onRestart={actions.restartQuiz} />
      ) : (
        <>
          <LifelineEffects effect={activeEffect} onDismiss={actions.dismissEffect} />

          {config.timer?.enabled && (
            <TimerPill remaining={timer.remaining} isFrozen={timer.isFrozen} didTimeout={timer.didTimeout} />
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
            total={questions.length}
            streak={streak}
            selectedAnswer={selectedAnswer}
            onSelect={actions.answerQuestion}
            mapHighlight={mapHighlight}
            felixActive={felixActive}
            hiddenOptions={hiddenOptions}
          />

          <LifelineBar
            lifelineStates={lifelineStates}
            onActivate={actions.useLifeline}
            disabled={selectedAnswer !== null}
          />
        </>
      )}
    </div>
  );
};

const QuizletPage = () => (
  <QuizProvider
    config={{
      id: "hogwarts-trivia",
      title: "Ultimate Harry Potter Trivia",
      timer: { enabled: true, secondsPerQuestion: 40 },
    }}
  >
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="relative flex-1 pt-28 pb-24 px-4">
        <MagicalParticles />
        <QuizletInner />
      </main>
      <Footer />
    </div>
  </QuizProvider>
);

export default QuizletPage;
