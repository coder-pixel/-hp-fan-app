import type { QuizPlugin, PluginAPI } from "../engineTypes";

/**
 * Tracks consecutive correct answers (streak).
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
