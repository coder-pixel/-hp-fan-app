import type {
  QuizState,
  QuizPlugin,
  PluginAPI,
  QuizEventName,
  QuizEventHandler,
  QuizConfig,
} from "./engineTypes";
import type { LifelineId } from "@/components/quizlet/lifelines/lifelineTypes";
import { lifelineRegistry } from "@/components/quizlet/lifelines/lifelineRegistry";
import { QuizEventBus } from "./engineEvents";
import { quizletQuestions } from "@/data/quizletQuestions";

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
  const timerCfg = config.timer ?? { enabled: false, secondsPerQuestion: 40 };
  const secondsPerQuestion = clampTimerSeconds(
    timerCfg.secondsPerQuestion ?? 40,
  );

  return {
    status: "instructions",
    config: {
      ...config,
      timer: { enabled: !!timerCfg.enabled, secondsPerQuestion },
    },
    questions: shuffle(quizletQuestions),
    questionIndex: 0,
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
    mapHighlight: null,
    hiddenOptions: [],
  };
}

/**
 * Imperative quiz engine. Holds state + event bus + plugins.
 * Used inside the React provider via useRef so plugin closures
 * always read the latest state through getState().
 */
export class QuizEngine {
  state: QuizState;
  private bus = new QuizEventBus();
  private plugins: QuizPlugin[] = [];
  private onStateChange: (s: QuizState) => void;

  constructor(initial: QuizState, onStateChange: (s: QuizState) => void) {
    this.state = initial;
    this.onStateChange = onStateChange;
  }

  // ── State helpers ─────────────────────────────────────
  private setState(updater: (prev: QuizState) => QuizState) {
    this.state = updater(this.state);
    this.onStateChange(this.state);
  }

  // ── Plugin API ────────────────────────────────────────
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
    this.plugins.push(plugin);
    plugin.setup?.(this.createPluginAPI());
  }

  // ── Actions ───────────────────────────────────────────
  startQuiz() {
    this.setState((s) => ({ ...s, status: "playing" }));
    this.bus.emit("onQuizStart", {
      totalQuestions: this.state.questions.length,
    });
    this.bus.emit("onQuestionStart", {
      index: 0,
      question: this.state.questions[0],
    });
  }

  answerQuestion(optionIndex: number) {
    if (this.state.selectedAnswer !== null) return;

    const question = this.state.questions[this.state.questionIndex];
    const correct =
      this.state.felixActive || optionIndex === question.correctAnswer;

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

  advanceQuestion() {
    const nextIndex = this.state.questionIndex + 1;
    if (nextIndex >= this.state.questions.length) {
      this.finishQuiz();
    } else {
      this.setState((s) => ({
        ...s,
        questionIndex: nextIndex,
        selectedAnswer: null,
      }));
      this.bus.emit("onQuestionEnd", { index: this.state.questionIndex - 1 });
      this.bus.emit("onQuestionStart", {
        index: nextIndex,
        question: this.state.questions[nextIndex],
      });
    }
  }

  finishQuiz() {
    this.setState((s) => ({ ...s, status: "finished" }));
    this.bus.emit("onQuizFinish", {
      score: this.state.score,
      total: this.state.questions.length,
    });
  }

  useLifeline(id: LifelineId) {
    if (this.state.selectedAnswer !== null) return;
    const lifeState = this.state.lifelineStates[id];
    const def = lifelineRegistry[id];
    if (lifeState.usedCount >= def.maxUsagePerGame) return;

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
    this.plugins.forEach((p) => p.teardown?.());
    this.bus.clear();
    this.plugins = [];
  }
}
