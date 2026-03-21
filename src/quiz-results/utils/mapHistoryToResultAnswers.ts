import type { ResultAnswer } from "../types/result.types";

/** Minimal question shape so any engine can map without importing app types. */
export interface HistoryQuestionInput {
  question: string;
  type?: string;
  options: Array<{ text: string } | string>;
  correctAnswer: number;
  explanation?: string;
}

export interface HistoryEntryInput {
  questionIndex: number;
  userOptionIndex: number | null;
  correct: boolean;
}

function optionTexts(options: HistoryQuestionInput["options"]): string[] {
  return options?.map((o) => (typeof o === "string" ? o : o?.text));
}

function textAt(opts: string[], idx: number): string {
  if (idx < 0 || idx >= opts?.length) return "—";
  return opts[idx] ?? "—";
}

/**
 * Turns per-question history + the ordered question list into {@link ResultAnswer} rows.
 * Keeps the results package independent from any specific quiz engine.
 */
export function mapHistoryToResultAnswers(
  questions: HistoryQuestionInput[],
  history: HistoryEntryInput[],
  options?: { timeoutAnswerIndex?: number; timeoutLabel?: string },
): ResultAnswer[] {
  const timeoutIdx = options?.timeoutAnswerIndex ?? 9999;
  const timeoutLabel = options?.timeoutLabel ?? "Time's up";

  return history?.map((entry) => {
    const q = questions?.[entry?.questionIndex];
    const opts = q ? optionTexts(q?.options) : [];
    const correctAnswer = q ? textAt(opts, q?.correctAnswer) : "—";
    let userAnswer: string;
    if (entry?.userOptionIndex === null) {
      userAnswer = "—";
    } else if (entry?.userOptionIndex === timeoutIdx) {
      userAnswer = timeoutLabel;
    } else {
      userAnswer = textAt(opts, entry?.userOptionIndex);
    }
    return {
      question: q?.question ?? "",
      questionType: q?.type,
      options: opts,
      correctAnswer,
      userAnswer,
      explanation: q?.explanation,
    };
  });
}
