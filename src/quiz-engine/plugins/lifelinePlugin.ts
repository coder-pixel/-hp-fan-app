import type { QuizPlugin, PluginAPI } from "../engineTypes";
import type { LifelineId } from "@/components/quizlet/lifelines/lifelineTypes";
import { lifelineRegistry } from "@/components/quizlet/lifelines/lifelineRegistry";

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
          [id]: { ...s.lifelineStates[id], usedCount: s.lifelineStates[id].usedCount + 1 },
        },
      }));

      applyEffect(api, id, question);
    });

    // Clear felix after answer
    api.on("onAnswerSelected", () => {
      const s = api.getState();
      if (s.felixActive) {
        api.setState((prev) => ({ ...prev, felixActive: false }));
      }
    });

    api.on("onRestart", () => {
      const fresh: Record<LifelineId, { id: LifelineId; usedCount: number; active: boolean }> =
        {} as any;
      for (const id of Object.keys(lifelineRegistry) as LifelineId[]) {
        fresh[id] = { id, usedCount: 0, active: false };
      }
      api.setState((s) => ({
        ...s,
        lifelineStates: fresh,
        activeEffect: null,
        felixActive: false,
        mapHighlight: null,
      }));
    });
  },
};

function applyEffect(api: PluginAPI, id: LifelineId, question: any) {
  switch (id) {
    case "maraudersMap": {
      api.setState((s) => ({ ...s, mapHighlight: question.correctAnswer }));
      setTimeout(() => {
        api.setState((s) => ({ ...s, mapHighlight: null }));
      }, 3000);
      break;
    }
    case "askDumbledore": {
      const hint =
        question.hint || "Even Dumbledore does not have a hint for this one…";
      api.setState((s) => ({ ...s, activeEffect: { type: "askDumbledore", hint } }));
      break;
    }
    case "felixFelicis": {
      api.setState((s) => ({ ...s, felixActive: true }));
      break;
    }
    case "legilimency": {
      const correct = question.correctAnswer;
      const names = ["Dumbledore", "McGonagall", "Snape", "Hagrid"];
      const percents = question.options.map((_: string, i: number) => {
        if (i === correct) return 55 + Math.floor(Math.random() * 20);
        return 5 + Math.floor(Math.random() * 15);
      });
      const total = percents.reduce((a: number, b: number) => a + b, 0);
      const pollResults = percents.map((p: number, i: number) => ({
        name: names[i] || `Wizard ${i + 1}`,
        percent: Math.round((p / total) * 100),
      }));
      api.setState((s) => ({ ...s, activeEffect: { type: "legilimency", pollResults } }));
      break;
    }
  }
}
