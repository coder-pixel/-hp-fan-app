import type { QuizQuestion } from "@/types/quiz";

/** Props passed to the quiz question renderer. Engine-agnostic; parent handles scoring. */
export interface QuizQuestionRendererProps {
  question: QuizQuestion;
  /** Current selected answer (index, indices, or string depending on question type). */
  selectedAnswer: number | number[] | string | null;
  /** Called when user submits/selects an answer. */
  onSelect: (value: number | number[] | string) => void;
  /** Whether the question has been answered (show result/explanation). */
  answered?: boolean;
  /** Optional: highlight for lifelines (e.g. map highlight index). */
  mapHighlight?: number | null;
  /** Optional: felix active - selection is treated as correct. */
  felixActive?: boolean;
  /** Optional: hidden option indices (e.g. revelio). */
  hiddenOptions?: number[];
}
