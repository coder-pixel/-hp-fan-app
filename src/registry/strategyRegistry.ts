import type { QuizQuestion } from "@/types/quiz";
import type { QuizStrategy } from "@/core/quiz/strategyTypes";
import {
  multipleChoiceStrategy,
  MULTIPLE_CHOICE_STRATEGY_ID,
} from "@/quiz-types/multiple-choice";

const strategies: Record<string, QuizStrategy<QuizQuestion, number>> = {
  [MULTIPLE_CHOICE_STRATEGY_ID]: multipleChoiceStrategy,
};

export const DEFAULT_QUIZ_STRATEGY_ID = MULTIPLE_CHOICE_STRATEGY_ID;

/**
 * Register a strategy at runtime (e.g. from a plugin package) without editing this file.
 */
export function registerQuizStrategy(
  strategy: QuizStrategy<QuizQuestion, number>,
): void {
  strategies[strategy.id] = strategy;
}

export function resolveQuizStrategy(
  strategyId: string | undefined,
): QuizStrategy<QuizQuestion, number> {
  if (strategyId && strategies[strategyId]) {
    return strategies[strategyId];
  }
  return strategies[DEFAULT_QUIZ_STRATEGY_ID];
}

export function listRegisteredQuizStrategies(): string[] {
  return Object.keys(strategies);
}
