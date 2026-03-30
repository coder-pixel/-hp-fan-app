export { QuizProvider, useQuiz } from "./QuizContext";
export type {
  QuizState,
  QuizActions,
  QuizContextValue,
  QuizPlugin,
  PluginAPI,
  QuizEventName,
  QuizConfig,
  QuizTimerConfig,
  TimerState,
  QuizAnswerHistoryEntry,
} from "./engineTypes";
export type {
  QuizStrategy,
  QuizAnswerContext,
  QuizAnswerEvaluation,
  QuizSessionResult,
} from "./strategyTypes";

export { QuizEngine, createInitialState } from "./QuizEngine";
export { QUIZ_TIMEOUT_ANSWER_INDEX } from "./constants";
export { QuizEventBus } from "./engineEvents";

export { timerPlugin } from "./plugins/timerPlugin";
export { streakPlugin } from "./plugins/streakPlugin";
export { revelioPlugin } from "./plugins/revelioPlugin";
export { lifelinePlugin } from "./plugins/lifelinePlugin";
