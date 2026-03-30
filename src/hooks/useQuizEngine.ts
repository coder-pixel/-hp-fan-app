import { useMemo } from "react";
import { useQuiz } from "@/core/quiz/QuizContext";
import {
  resolveQuizStrategy,
  DEFAULT_QUIZ_STRATEGY_ID,
} from "@/registry/strategyRegistry";
import { DEFAULT_QUIZ_THEME_ID } from "@/registry/themeConstants";
import type { QuizStrategy } from "@/core/quiz/strategyTypes";
import type { QuizQuestion } from "@/types/quiz";
import type { QuizContextValue } from "@/core/quiz/engineTypes";

export interface UseQuizEngineResult extends QuizContextValue {
  strategy: QuizStrategy<QuizQuestion, number>;
  strategyId: string;
  themeId: string;
}

/**
 * Context value plus resolved strategy and theme id from config.
 * Use inside `<QuizProvider>` (typically from a theme renderer).
 */
export function useQuizEngine(): UseQuizEngineResult {
  const ctx = useQuiz();
  const strategyId =
    ctx.state.config.strategyId ?? DEFAULT_QUIZ_STRATEGY_ID;
  const themeId = ctx.state.config.themeId ?? DEFAULT_QUIZ_THEME_ID;

  const strategy = useMemo(
    () => resolveQuizStrategy(strategyId),
    [strategyId],
  );

  return useMemo(
    () => ({
      ...ctx,
      strategy,
      strategyId,
      themeId,
    }),
    [ctx, strategy, strategyId, themeId],
  );
}
