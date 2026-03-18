import type { QuizPlugin, PluginAPI } from "../engineTypes";

/**
 * Tracks consecutive correct answers (streak).
 * Already baked into state shape; this plugin keeps the logic
 * isolated from the core engine.
 */
export const streakPlugin: QuizPlugin = {
  id: "streak",
  setup(api: PluginAPI) {
    api.on("onAnswerSelected", ({ correct }) => {
      api.setState((s) => ({
        ...s,
        streak: correct ? s.streak + 1 : 0,
      }));
    });

    api.on("onRestart", () => {
      api.setState((s) => ({ ...s, streak: 0 }));
    });
  },
};
