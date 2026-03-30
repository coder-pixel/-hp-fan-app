import type { QuizQuestion, MultipleChoiceQuestion } from "@/types/quiz";
import type { QuizState } from "@/core/quiz/engineTypes";
import type {
  QuizAnswerContext,
  QuizAnswerEvaluation,
  QuizSessionResult,
  QuizStrategy,
} from "@/core/quiz/strategyTypes";
import { isMultipleChoiceQuestion } from "@/types/quiz";

function asMc(q: QuizQuestion): MultipleChoiceQuestion | null {
  return isMultipleChoiceQuestion(q) ? q : null;
}

export const MULTIPLE_CHOICE_STRATEGY_ID = "multiple-choice";

/**
 * Standard single-answer multiple choice: option index vs `correctAnswer`.
 */
export const multipleChoiceStrategy: QuizStrategy<QuizQuestion, number> = {
  id: MULTIPLE_CHOICE_STRATEGY_ID,

  evaluateAnswer(
    question: QuizQuestion,
    answer: number,
    context: QuizAnswerContext,
  ): QuizAnswerEvaluation {
    if (context.isTimeoutAnswer) return { correct: false };
    const mc = asMc(question);
    if (!mc) return { correct: false };
    return { correct: answer === mc.correctAnswer };
  },

  getNextQuestion(currentIndex: number, totalQuestions: number): number | null {
    const next = currentIndex + 1;
    return next < totalQuestions ? next : null;
  },

  calculateResult(state: QuizState): QuizSessionResult {
    return {
      score: state.score,
      totalQuestions: state.questions.length,
    };
  },
};
