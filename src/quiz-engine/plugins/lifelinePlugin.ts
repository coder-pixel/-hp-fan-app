import type { QuizPlugin, PluginAPI } from "../engineTypes";
import type { LifelineId } from "@/components/quiz/lifelines/lifelineTypes";
import { lifelineRegistry } from "@/components/quiz/lifelines/lifelineRegistry";
import type { QuizOption, QuizQuestion } from "@/types/quiz";

/**
 * Handles all lifeline activation logic.
 * Reads current question from engine state and produces side-effects
 * (activeEffect, mapHighlight, felixActive) back into state.
 */
export const lifelinePlugin: QuizPlugin = {
  id: "lifeline",
  setup(api: PluginAPI) {
    api.on("onLifelineUsed", ({ id }) => {
      const state = api.getState();
      const question = state.questions[state.questionIndex];
      if (!question) return;

      // Mark usage
      api.setState((s) => ({
        ...s,
        lifelineStates: {
          ...s.lifelineStates,
          [id]: {
            ...s.lifelineStates[id],
            usedCount: s.lifelineStates[id].usedCount + 1,
          },
        },
      }));

      applyEffect(api, id, question);
    });

    // Clear felix after a normal (non-retry) answer
    api.on("onAnswerSelected", () => {
      const s = api.getState();
      // When felixRetryPending is true the wrong-answer was the retry trigger;
      // retryQuestion() will clear felixActive itself — don't clear it here.
      if (s.felixActive && !s.felixRetryPending) {
        api.setState((prev) => ({ ...prev, felixActive: false }));
      }
    });

    api.on("onRestart", () => {
      const fresh: Record<
        LifelineId,
        { id: LifelineId; usedCount: number; active: boolean }
      > = {} as Record<
        LifelineId,
        { id: LifelineId; usedCount: number; active: boolean }
      >;
      for (const id of Object.keys(lifelineRegistry) as LifelineId[]) {
        fresh[id] = { id, usedCount: 0, active: false };
      }
      api.setState((s) => ({
        ...s,
        lifelineStates: fresh,
        activeEffect: null,
        felixActive: false,
        felixRetryPending: false,
        felixUsed: false,
        mapHighlight: null,
      }));
    });
  },
};

function applyEffect(api: PluginAPI, id: LifelineId, question: QuizQuestion) {
  switch (id) {
    case "maraudersMap": {
      api.setState((s) => ({ ...s, mapHighlight: question?.correctAnswer }));
      setTimeout(() => {
        api.setState((s) => ({ ...s, mapHighlight: null }));
      }, 3000);
      break;
    }
    case "askDumbledore": {
      const hint =
        question?.hint || "Even Dumbledore does not have a hint for this one…";
      api.setState((s) => ({
        ...s,
        activeEffect: { type: "askDumbledore", hint },
      }));
      break;
    }
    case "felixFelicis": {
      api.setState((s) => ({
        ...s,
        felixActive: true,
        felixRetryPending: false,
        felixUsed: false,
      }));
      break;
    }
    case "legilimency": {
      const correct = question?.correctAnswer;
      // const names = ["Dumbledore", "McGonagall", "Snape", "Hagrid"];
      const names = question?.options?.map(
        (option: QuizOption) => option?.text,
      );
      // Simulate an "audience poll": the correct answer is favored with a higher percentage (65–84%), while other options get smaller random shares (10–44%).
      const percents = question?.options?.map(
        (option: QuizOption, i: number) => {
          if (i === correct) return 65 + Math.floor(Math.random() * 25);
          return 10 + Math.floor(Math.random() * 35);
        },
      );
      const total = percents?.reduce((a: number, b: number) => a + b, 0);
      const pollResults = percents?.map((p: number, i: number) => ({
        name: names?.[i] || `Wizard ${i + 1}`,
        percent: Math.round((p / total) * 100),
      }));
      api.setState((s) => ({
        ...s,
        activeEffect: { type: "legilimency", pollResults },
      }));
      break;
    }
  }
}
