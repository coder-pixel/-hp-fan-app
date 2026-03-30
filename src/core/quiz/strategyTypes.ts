import type { QuizQuestion } from "@/types/quiz";
import type { QuizState } from "./engineTypes";

/** Context passed to strategies when evaluating an answer (no UI). */
export interface QuizAnswerContext {
  /** True when the timer fired and the engine used the timeout sentinel index. */
  isTimeoutAnswer: boolean;
}

export interface QuizAnswerEvaluation {
  correct: boolean;
}

/**
 * Outcome of a finished session (strategy may define score vs personality outcome).
 */
export interface QuizSessionResult {
  score: number;
  totalQuestions: number;
}

/**
 * Strategy pattern: all quiz-type behavior lives here; engine only orchestrates state and events.
 * Add new quiz types by implementing this interface and registering in `strategyRegistry`.
 */
export interface QuizStrategy<
  TQuestion extends QuizQuestion = QuizQuestion,
  TAnswer = number,
> {
  readonly id: string;

  evaluateAnswer(
    question: TQuestion,
    answer: TAnswer,
    context: QuizAnswerContext,
  ): QuizAnswerEvaluation;

  /**
   * Linear default: currentIndex + 1 if in range; else null (quiz complete after advance).
   * Non-linear types can override (branching, pools, adaptive).
   */
  getNextQuestion(currentIndex: number, totalQuestions: number): number | null;

  calculateResult(state: QuizState): QuizSessionResult;
}
