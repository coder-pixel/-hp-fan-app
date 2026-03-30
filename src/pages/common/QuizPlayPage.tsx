import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MagicalParticles from "@/components/quiz/MagicalParticles";
import { quizzes } from "@/configs";
import type { Quiz } from "@/types/quiz";
import { QuizProvider } from "@/core/quiz";
import { resolveQuizThemeRenderer } from "@/registry/themeRegistry";
import { DEFAULT_QUIZ_STRATEGY_ID } from "@/registry/strategyRegistry";
import { DEFAULT_QUIZ_THEME_ID } from "@/registry/themeConstants";
import { toQuizQuestions } from "@/themes/harry-potter";
import { Button } from "@/components/ui/button";

const QuizPlayPage = () => {
  const { id } = useParams<{ id: string }>();

  const quiz = useMemo(() => quizzes?.find((q: Quiz) => q?.id === id), [id]);

  const ThemeRenderer = useMemo(
    () => resolveQuizThemeRenderer(quiz?.themeId ?? DEFAULT_QUIZ_THEME_ID),
    [quiz?.themeId],
  );

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
              strategyId: quiz?.strategyId ?? DEFAULT_QUIZ_STRATEGY_ID,
              themeId: quiz?.themeId ?? DEFAULT_QUIZ_THEME_ID,
            }}
          >
            <ThemeRenderer quiz={quiz} />
          </QuizProvider>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default QuizPlayPage;
