import type { Quiz } from "@/types/quiz";
import { isMultipleChoiceQuestion } from "@/types/quiz";

export interface QuizValidationIssue {
  path: string;
  message: string;
}

/**
 * Structural validation for multiple-choice quizzes (engine + lifelines assume this shape).
 */
export function validateMultipleChoiceQuiz(quiz: Quiz): QuizValidationIssue[] {
  const issues: QuizValidationIssue[] = [];

  if (!quiz?.questions?.length) {
    issues.push({ path: "questions", message: "Quiz must have at least one question." });
    return issues;
  }

  quiz.questions.forEach((q, i) => {
    const base = `questions[${i}]`;
    if (!isMultipleChoiceQuestion(q)) {
      issues.push({
        path: `${base}.type`,
        message: "Expected multiple-choice question.",
      });
      return;
    }
    const mc = q;
    if (!mc.options?.length) {
      issues.push({ path: `${base}.options`, message: "Must have options." });
      return;
    }
    if (
      typeof mc.correctAnswer !== "number" ||
      mc.correctAnswer < 0 ||
      mc.correctAnswer >= mc.options.length
    ) {
      issues.push({
        path: `${base}.correctAnswer`,
        message: "correctAnswer must be a valid option index.",
      });
    }
  });

  return issues;
}
