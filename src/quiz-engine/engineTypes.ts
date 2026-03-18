import type { QuizletQuestion } from "@/data/quizletQuestions";
import type { LifelineId, LifelineState, LifelineEffect } from "@/components/quizlet/lifelines/lifelineTypes";

export type QuizStatus = "instructions" | "playing" | "finished";

export interface QuizState {
  status: QuizStatus;
  questions: QuizletQuestion[];
  questionIndex: number;
  score: number;
  streak: number;
  selectedAnswer: number | null;
  lifelineStates: Record<LifelineId, LifelineState>;
  activeEffect: LifelineEffect | null;
  felixActive: boolean;
  mapHighlight: number | null;
  hiddenOptions: number[];
}

export interface QuizActions {
  startQuiz: () => void;
  answerQuestion: (optionIndex: number) => void;
  advanceQuestion: () => void;
  useLifeline: (id: LifelineId) => void;
  dismissEffect: () => void;
  restartQuiz: () => void;
}

export interface QuizContextValue {
  state: QuizState;
  actions: QuizActions;
}

/** Plugin interface — plugins register event listeners on the engine */
export interface QuizPlugin {
  id: string;
  /** Called once when the plugin is registered */
  setup?: (api: PluginAPI) => void;
  /** Called when the plugin is removed */
  teardown?: () => void;
}

export interface PluginAPI {
  getState: () => QuizState;
  setState: (updater: (prev: QuizState) => QuizState) => void;
  on: <E extends QuizEventName>(event: E, handler: QuizEventHandler<E>) => void;
  off: <E extends QuizEventName>(event: E, handler: QuizEventHandler<E>) => void;
}

// ── Events ──────────────────────────────────────────────
export type QuizEventName =
  | "onQuizStart"
  | "onQuestionStart"
  | "onAnswerSelected"
  | "onQuestionEnd"
  | "onQuizFinish"
  | "onLifelineUsed"
  | "onRestart";

export interface QuizEventPayloads {
  onQuizStart: { totalQuestions: number };
  onQuestionStart: { index: number; question: QuizletQuestion };
  onAnswerSelected: { index: number; correct: boolean; question: QuizletQuestion };
  onQuestionEnd: { index: number };
  onQuizFinish: { score: number; total: number };
  onLifelineUsed: { id: LifelineId };
  onRestart: Record<string, never>;
}

export type QuizEventHandler<E extends QuizEventName> = (
  payload: QuizEventPayloads[E]
) => void;
