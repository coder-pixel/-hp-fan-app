import type { QuizQuestion } from "@/types/quiz";
import type {
  LifelineId,
  LifelineState,
  LifelineEffect,
} from "@/components/quiz/lifelines/lifelineTypes";

export type QuizStatus = "instructions" | "playing" | "finished";

export interface QuizTimerConfig {
  enabled: boolean;
  /** Per-question countdown, clamped to 30–50 seconds. */
  secondsPerQuestion: number;
}

export interface QuizSoundsConfig {
  enabled: boolean;
  correct?: boolean;
  wrong?: boolean;
  timerTickSubtle?: boolean;
  timerPulseLow?: boolean;
  timeout?: boolean;
}

export interface QuizConfig {
  id: string;
  title: string;
  timer?: QuizTimerConfig;
  /** Optional question set; defaults to an empty array. */
  questions?: QuizQuestion[];
  /** Sound effects (timer, correct/wrong, timeout). When enabled, quiz sounds play. */
  sounds?: QuizSoundsConfig;
  /**
   * Registered strategy id (e.g. `multiple-choice`). Defaults via registry when omitted.
   */
  strategyId?: string;
  /**
   * Theme id for UI renderer only; engine ignores this.
   */
  themeId?: string;
}

export interface TimerState {
  remaining: number;
  isRunning: boolean;
  isFrozen: boolean;
  /** Used by UI for a brief timeout shake. */
  didTimeout: boolean;
}

/** One row per question, in play order (shuffled), recorded when leaving the question. */
export interface QuizAnswerHistoryEntry {
  questionIndex: number;
  userOptionIndex: number | null;
  correct: boolean;
  explanation?: string;
}

export interface QuizState {
  status: QuizStatus;
  config: QuizConfig;
  questions: QuizQuestion[];
  /** Frontier index: timer, lifelines, and new answers apply here. */
  questionIndex: number;
  /** Which question the player is viewing (may trail questionIndex while reviewing earlier items). */
  displayQuestionIndex: number;
  score: number;
  streak: number;
  selectedAnswer: number | null;
  timer: TimerState;
  lifelineStates: Record<LifelineId, LifelineState>;
  activeEffect: LifelineEffect | null;
  felixActive: boolean;
  /** True during the 800ms "wrong answer shown → retry reset" window. */
  felixRetryPending: boolean;
  /** True after the retry was consumed — used to trigger "That was close…" microcopy. */
  felixUsed: boolean;
  mapHighlight: number | null;
  hiddenOptions: number[];
  /** Filled as the player advances; used for post-quiz review UIs. */
  answerHistory: QuizAnswerHistoryEntry[];
}

export interface QuizActions {
  startQuiz: () => void;
  answerQuestion: (optionIndex: number) => void;
  advanceQuestion: () => void;
  goToPreviousQuestion: () => void;
  goToNextQuestion: () => void;
  /** Called ~800ms after a felix-retry wrong answer to reset the question. */
  retryQuestion: () => void;
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
  actions: {
    answerQuestion: (optionIndex: number) => void;
    advanceQuestion: () => void;
  };
}

// ── Events ──────────────────────────────────────────────
export type QuizEventName =
  | "onQuizStart"
  | "onQuestionStart"
  | "onAnswerSelected"
  | "onQuestionEnd"
  | "onQuizFinish"
  | "onLifelineUsed"
  | "onFelixRetry"
  | "onRestart";

export interface QuizEventPayloads {
  onQuizStart: { totalQuestions: number };
  onQuestionStart: { index: number; question: QuizQuestion };
  onAnswerSelected: {
    index: number;
    correct: boolean;
    question: QuizQuestion;
  };
  onQuestionEnd: { index: number };
  onQuizFinish: { score: number; total: number };
  onLifelineUsed: { id: LifelineId };
  /** Fired after felixRetryPending window ends and question is reset for a retry. */
  onFelixRetry: { questionIndex: number };
  onRestart: Record<string, never>;
}

export type QuizEventHandler<E extends QuizEventName> = (
  payload: QuizEventPayloads[E],
) => void;
