import type {
  QuizState,
  QuizPlugin,
  PluginAPI,
  QuizEventName,
  QuizEventHandler,
  QuizConfig,
} from "./engineTypes";
import type { QuizStrategy } from "./strategyTypes";
import type { LifelineId } from "@/components/quiz/lifelines/lifelineTypes";
import { lifelineRegistry } from "@/components/quiz/lifelines/lifelineRegistry";
import { QuizEventBus } from "./engineEvents";
import { QUIZ_TIMEOUT_ANSWER_INDEX } from "./constants";
import type { QuizQuestion } from "@/types/quiz";

const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const defaultQuizConfig: QuizConfig = {
  id: "hogwarts-trivia",
  title: "Ultimate Harry Potter Trivia",
  timer: { enabled: false, secondsPerQuestion: 40 },
};

const clampTimerSeconds = (seconds: number) =>
  Math.max(30, Math.min(50, Math.floor(seconds)));

function createInitialLifelineStates() {
  const states: QuizState["lifelineStates"] = {} as Record<
    LifelineId,
    { id: LifelineId; usedCount: number; active: boolean }
  >;
  for (const id of Object.keys(lifelineRegistry) as LifelineId[]) {
    states[id] = { id, usedCount: 0, active: false };
  }
  return states;
}

export function createInitialState(
  config: QuizConfig = defaultQuizConfig,
): QuizState {
  const timerCfg = config?.timer ?? { enabled: false, secondsPerQuestion: 40 };
  const secondsPerQuestion = clampTimerSeconds(
    timerCfg?.secondsPerQuestion ?? 40,
  );
  const sourceQuestions = config?.questions ?? [];

  return {
    status: "instructions",
    config: {
      ...config,
      timer: { enabled: !!timerCfg?.enabled, secondsPerQuestion },
    },
    questions: shuffle(sourceQuestions),
    questionIndex: 0,
    displayQuestionIndex: 0,
    score: 0,
    streak: 0,
    selectedAnswer: null,
    timer: {
      remaining: secondsPerQuestion,
      isRunning: false,
      isFrozen: false,
      didTimeout: false,
    },
    lifelineStates: createInitialLifelineStates(),
    activeEffect: null,
    felixActive: false,
    felixRetryPending: false,
    felixUsed: false,
    mapHighlight: null,
    hiddenOptions: [],
    answerHistory: [],
  };
}

/**
 * Imperative quiz engine. Holds state + event bus + plugins.
 * Quiz-type rules are delegated to a {@link QuizStrategy} (strategy pattern).
 */
export class QuizEngine {
  state: QuizState;
  private bus = new QuizEventBus();
  private plugins: QuizPlugin[] = [];
  private onStateChange: (s: QuizState) => void;
  private strategy: QuizStrategy<QuizQuestion, number>;

  constructor(
    initial: QuizState,
    onStateChange: (s: QuizState) => void,
    strategy: QuizStrategy<QuizQuestion, number>,
  ) {
    this.state = initial;
    this.onStateChange = onStateChange;
    this.strategy = strategy;
  }

  setStrategy(strategy: QuizStrategy<QuizQuestion, number>) {
    this.strategy = strategy;
  }

  private setState(updater: (prev: QuizState) => QuizState) {
    this.state = updater(this.state);
    this.onStateChange(this.state);
  }

  private createPluginAPI(): PluginAPI {
    return {
      getState: () => this.state,
      setState: (updater) => this.setState(updater),
      on: <E extends QuizEventName>(e: E, h: QuizEventHandler<E>) =>
        this.bus.on(e, h),
      off: <E extends QuizEventName>(e: E, h: QuizEventHandler<E>) =>
        this.bus.off(e, h),
      actions: {
        answerQuestion: (optionIndex: number) =>
          this.answerQuestion(optionIndex),
        advanceQuestion: () => this.advanceQuestion(),
      },
    };
  }

  registerPlugin(plugin: QuizPlugin) {
    this.plugins?.push(plugin);
    plugin.setup?.(this.createPluginAPI());
  }

  startQuiz() {
    this.setState((s) => ({ ...s, status: "playing" }));
    this.bus.emit("onQuizStart", {
      totalQuestions: this.state.questions?.length,
    });
    this.bus.emit("onQuestionStart", {
      index: 0,
      question: this.state.questions?.[0],
    });
  }

  answerQuestion(optionIndex: number) {
    if (this.state.selectedAnswer !== null) return;

    const question = this.state.questions?.[this.state.questionIndex];
    const isTimeout = optionIndex === QUIZ_TIMEOUT_ANSWER_INDEX;
    const evaluation = question
      ? this.strategy.evaluateAnswer(question, optionIndex, {
          isTimeoutAnswer: isTimeout,
        })
      : { correct: false };
    const isActuallyCorrect = evaluation.correct;

    if (isTimeout) {
      this.setState((s) => ({
        ...s,
        selectedAnswer: optionIndex,
        activeEffect: null,
        mapHighlight: null,
      }));
      this.bus.emit("onAnswerSelected", {
        index: optionIndex,
        correct: false,
        question,
      });
      return;
    }

    if (
      this.state?.felixActive &&
      !this.state?.felixRetryPending &&
      !isActuallyCorrect
    ) {
      this.setState((s) => ({
        ...s,
        selectedAnswer: optionIndex,
        felixRetryPending: true,
        activeEffect: null,
        mapHighlight: null,
      }));
      this.bus.emit("onAnswerSelected", {
        index: optionIndex,
        correct: false,
        question,
      });
      return;
    }

    const correct = isActuallyCorrect;

    this.setState((s) => ({
      ...s,
      selectedAnswer: optionIndex,
      score: correct ? s.score + 1 : s.score,
      activeEffect: null,
      mapHighlight: null,
    }));

    this.bus.emit("onAnswerSelected", {
      index: optionIndex,
      correct,
      question,
    });
  }

  retryQuestion() {
    const questionIndex = this.state.questionIndex;
    this.setState((s) => ({
      ...s,
      selectedAnswer: null,
      felixActive: false,
      felixRetryPending: false,
      felixUsed: true,
      activeEffect: null,
    }));
    this.bus.emit("onFelixRetry", { questionIndex });
  }

  advanceQuestion() {
    const endedIndex = this.state.questionIndex;
    const q = this.state.questions?.[endedIndex];
    const userOptionIndex = this.state.selectedAnswer;
    const correct =
      q != null && userOptionIndex !== null
        ? this.strategy.evaluateAnswer(q, userOptionIndex, {
            isTimeoutAnswer: userOptionIndex === QUIZ_TIMEOUT_ANSWER_INDEX,
          }).correct
        : false;
    const historyEntry = {
      questionIndex: endedIndex,
      userOptionIndex,
      correct,
      explanation: q?.explanation ?? "",
    };

    const nextIndex = this.strategy.getNextQuestion(
      endedIndex,
      this.state.questions?.length ?? 0,
    );
    if (nextIndex === null) {
      this.setState((s) => ({
        ...s,
        answerHistory: [...s.answerHistory, historyEntry],
        status: "finished",
        displayQuestionIndex: endedIndex,
      }));
      this.bus.emit("onQuestionEnd", { index: endedIndex });
      const result = this.strategy.calculateResult({
        ...this.state,
        answerHistory: [...this.state.answerHistory, historyEntry],
        status: "finished",
      });
      this.bus.emit("onQuizFinish", {
        score: result.score,
        total: result.totalQuestions,
      });
      return;
    }

    this.setState((s) => ({
      ...s,
      answerHistory: [...s.answerHistory, historyEntry],
      questionIndex: nextIndex,
      displayQuestionIndex: nextIndex,
      selectedAnswer: null,
      felixUsed: false,
      hiddenOptions: [],
    }));
    this.bus.emit("onQuestionEnd", { index: endedIndex });
    this.bus.emit("onQuestionStart", {
      index: nextIndex,
      question: this.state.questions?.[nextIndex],
    });
  }

  goToPreviousQuestion() {
    if (this.state.status !== "playing") return;
    if (this.state.displayQuestionIndex <= 0) return;
    this.setState((s) => ({
      ...s,
      displayQuestionIndex: s.displayQuestionIndex - 1,
    }));
  }

  goToNextQuestion() {
    if (this.state.status !== "playing") return;
    if (this.state.felixRetryPending) return;

    const { displayQuestionIndex, questionIndex, selectedAnswer } = this.state;

    if (displayQuestionIndex < questionIndex) {
      this.setState((s) => ({
        ...s,
        displayQuestionIndex: s.displayQuestionIndex + 1,
      }));
      return;
    }

    if (displayQuestionIndex === questionIndex && selectedAnswer !== null) {
      this.advanceQuestion();
    }
  }

  useLifeline(id: LifelineId) {
    if (this.state.selectedAnswer !== null || this.state.felixRetryPending)
      return;
    const lifeState = this.state.lifelineStates?.[id];
    const def = lifelineRegistry?.[id];
    if (lifeState?.usedCount >= def?.maxUsagePerGame) return;

    this.bus.emit("onLifelineUsed", { id });
  }

  dismissEffect() {
    this.setState((s) => ({ ...s, activeEffect: null }));
  }

  restart() {
    this.setState(() => ({ ...createInitialState(), status: "instructions" }));
    this.bus.emit("onRestart", {} as never);
  }

  destroy() {
    this.plugins?.forEach((p) => p?.teardown?.());
    this.bus.clear();
    this.plugins = [];
  }
}
