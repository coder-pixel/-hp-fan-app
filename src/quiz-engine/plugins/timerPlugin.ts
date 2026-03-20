import type { PluginAPI, QuizPlugin } from "../engineTypes";
import { playTimerTickSubtle, playTimerPulse, playTimeout } from "@/lib/quizSounds";
import { QUIZ_TIMEOUT_ANSWER_INDEX } from "../constants";

const TIMEOUT_SENTINEL_ANSWER_INDEX = QUIZ_TIMEOUT_ANSWER_INDEX;
/** Delay (ms) after timeout before auto-advancing to next question; warning stays visible for this duration. */
const TIMEOUT_ADVANCE_DELAY_MS = 1200;
const FREEZE_DURATION_MS = 5000;

function clampSeconds(seconds: number) {
  return Math.max(30, Math.min(50, Math.floor(seconds)));
}

function isTimerEnabled(api: PluginAPI) {
  const cfg = api.getState().config.timer;
  return !!cfg?.enabled;
}

function getSecondsPerQuestion(api: PluginAPI) {
  const cfg = api.getState().config.timer;
  return clampSeconds(cfg?.secondsPerQuestion ?? 40);
}

/**
 * Timer plugin
 * - Starts a per-question countdown when a question begins
 * - Stops countdown when an answer is selected or question ends
 * - On timeout, answers with a sentinel incorrect index and advances
 * - Listens to "freezeTime" lifeline (once per quiz via lifelinePlugin usage tracking)
 */
export const timerPlugin: QuizPlugin = (() => {
  let cleanup: (() => void) | null = null;

  return {
    id: "timer",
    setup(api: PluginAPI) {
      let intervalId: number | null = null;
      let freezeTimeoutId: number | null = null;
      let questionStartMs = 0;
      let frozenAccumulatedMs = 0;
      let frozenSinceMs: number | null = null;
      let lastSecondEmitted: number | null = null;

      const clearTicking = () => {
        if (intervalId !== null) {
          window.clearInterval(intervalId);
          intervalId = null;
        }
      };

      const clearFreezeTimeout = () => {
        if (freezeTimeoutId !== null) {
          window.clearTimeout(freezeTimeoutId);
          freezeTimeoutId = null;
        }
      };

      const resetTimerState = (remaining: number) => {
        api.setState((s) => ({
          ...s,
          timer: {
            remaining,
            isRunning: false,
            isFrozen: false,
            didTimeout: false,
          },
        }));
      };

      const setDidTimeout = () => {
        api.setState((s) => ({ ...s, timer: { ...s.timer, didTimeout: true } }));
        // didTimeout stays true until next question start (so UI can show warning until advance).
      };

      const start = () => {
        if (!isTimerEnabled(api)) return;

        clearTicking();
        clearFreezeTimeout();

        const secondsPerQuestion = getSecondsPerQuestion(api);
        questionStartMs = Date.now();
        frozenAccumulatedMs = 0;
        frozenSinceMs = null;
        lastSecondEmitted = null;

        api.setState((s) => ({
          ...s,
          timer: {
            remaining: secondsPerQuestion,
            isRunning: true,
            isFrozen: false,
            didTimeout: false,
          },
        }));

        intervalId = window.setInterval(() => {
          const state = api.getState();

          // Bail if quiz is not actively playing or already answered
          if (state.status !== "playing" || state.selectedAnswer !== null) {
            clearTicking();
            api.setState((s) => ({ ...s, timer: { ...s.timer, isRunning: false } }));
            return;
          }

          if (state.timer.isFrozen) return;

          const now = Date.now();
          const elapsedMs = now - questionStartMs - frozenAccumulatedMs;
          const remaining = Math.max(0, getSecondsPerQuestion(api) - Math.floor(elapsedMs / 1000));

          if (remaining !== lastSecondEmitted) {
            lastSecondEmitted = remaining;
            const sounds = api.getState().config.sounds;
            const soundsEnabled = sounds?.enabled !== false;
            if (remaining > 0 && soundsEnabled) {
              if (remaining <= 5) {
                if (sounds?.timerPulseLow !== false) playTimerPulse();
              } else {
                if (sounds?.timerTickSubtle !== false) playTimerTickSubtle();
              }
            }
            api.setState((s) => ({
              ...s,
              timer: { ...s.timer, remaining, isRunning: true },
            }));
          }

          if (remaining <= 0) {
            clearTicking();
            clearFreezeTimeout();
            const sounds = api.getState().config.sounds;
            if (sounds?.enabled !== false && sounds?.timeout !== false) playTimeout();
            setDidTimeout();
            api.setState((s) => ({
              ...s,
              timer: { ...s.timer, remaining: 0, isRunning: false, isFrozen: false },
            }));

            // Auto-answer incorrect, then advance after fixed delay (warning stays visible until then).
            api.actions.answerQuestion(TIMEOUT_SENTINEL_ANSWER_INDEX);
            window.setTimeout(() => {
              api.actions.advanceQuestion();
            }, TIMEOUT_ADVANCE_DELAY_MS);
          }
        }, 200);
      };

      const stop = () => {
        clearTicking();
        clearFreezeTimeout();
        frozenSinceMs = null;
        api.setState((s) => ({
          ...s,
          timer: { ...s.timer, isRunning: false, isFrozen: false },
        }));
      };

      const freeze = () => {
        if (!isTimerEnabled(api)) return;
        const s = api.getState();
        if (s.status !== "playing") return;
        if (!s.timer.isRunning) return;
        if (s.timer.isFrozen) return;

        frozenSinceMs = Date.now();
        api.setState((prev) => ({
          ...prev,
          timer: { ...prev.timer, isFrozen: true, isRunning: false },
        }));

        clearFreezeTimeout();
        freezeTimeoutId = window.setTimeout(() => {
          const now = Date.now();
          if (frozenSinceMs !== null) {
            frozenAccumulatedMs += now - frozenSinceMs;
            frozenSinceMs = null;
          }
          api.setState((prev) => ({
            ...prev,
            timer: { ...prev.timer, isFrozen: false, isRunning: true },
          }));
        }, FREEZE_DURATION_MS);
      };

      api.on("onQuestionStart", () => start());
      api.on("onAnswerSelected", () => stop());
      api.on("onQuestionEnd", () => stop());
      api.on("onQuizFinish", () => stop());

      api.on("onQuizStart", () => {
        if (!isTimerEnabled(api)) {
          resetTimerState(getSecondsPerQuestion(api));
        }
      });

      api.on("onRestart", () => {
        stop();
        resetTimerState(getSecondsPerQuestion(api));
      });

      api.on("onLifelineUsed", ({ id }) => {
        if (id === "freezeTime") freeze();
      });

      // After a felix retry the question resets; resume the timer from remaining time.
      api.on("onFelixRetry", () => {
        if (!isTimerEnabled(api)) return;
        const s = api.getState();
        if (s.status !== "playing") return;

        clearTicking();
        clearFreezeTimeout();

        const secondsPerQuestion = getSecondsPerQuestion(api);
        const remainingSeconds = Math.max(1, s.timer.remaining);

        // Rewind the logical start so the remaining time is preserved.
        questionStartMs = Date.now() - (secondsPerQuestion - remainingSeconds) * 1000;
        frozenAccumulatedMs = 0;
        frozenSinceMs = null;
        lastSecondEmitted = null;

        api.setState((prev) => ({
          ...prev,
          timer: { ...prev.timer, isRunning: true, isFrozen: false, didTimeout: false },
        }));

        intervalId = window.setInterval(() => {
          const state = api.getState();
          if (state.status !== "playing" || state.selectedAnswer !== null) {
            clearTicking();
            api.setState((prev2) => ({ ...prev2, timer: { ...prev2.timer, isRunning: false } }));
            return;
          }
          if (state.timer.isFrozen) return;

          const now = Date.now();
          const elapsedMs = now - questionStartMs - frozenAccumulatedMs;
          const remaining = Math.max(0, secondsPerQuestion - Math.floor(elapsedMs / 1000));

          if (remaining !== lastSecondEmitted) {
            lastSecondEmitted = remaining;
            const sounds = api.getState().config.sounds;
            const soundsEnabled = sounds?.enabled !== false;
            if (remaining > 0 && soundsEnabled) {
              if (remaining <= 5) {
                if (sounds?.timerPulseLow !== false) playTimerPulse();
              } else {
                if (sounds?.timerTickSubtle !== false) playTimerTickSubtle();
              }
            }
            api.setState((prev2) => ({
              ...prev2,
              timer: { ...prev2.timer, remaining, isRunning: true },
            }));
          }

          if (remaining <= 0) {
            clearTicking();
            clearFreezeTimeout();
            const sounds = api.getState().config.sounds;
            if (sounds?.enabled !== false && sounds?.timeout !== false) playTimeout();
            setDidTimeout();
            api.setState((prev2) => ({
              ...prev2,
              timer: { ...prev2.timer, remaining: 0, isRunning: false, isFrozen: false },
            }));
            api.actions.answerQuestion(TIMEOUT_SENTINEL_ANSWER_INDEX);
            window.setTimeout(() => api.actions.advanceQuestion(), TIMEOUT_ADVANCE_DELAY_MS);
          }
        }, 200);
      });

      // Initialize timer state so UI can safely read it even before start.
      resetTimerState(getSecondsPerQuestion(api));

      cleanup = () => {
        clearTicking();
        clearFreezeTimeout();
      };
    },
    teardown() {
      cleanup?.();
      cleanup = null;
    },
  };
})();

