import type { QuizPlugin, PluginAPI } from "../engineTypes";

/**
 * Revelio Spell — removes two incorrect options from the current question.
 */
export const revelioPlugin: QuizPlugin = {
  id: "revelio",
  setup(api: PluginAPI) {
    api.on("onLifelineUsed", ({ id }) => {
      if (id !== "revelio") return;

      const state = api.getState();
      const question = state.questions[state.questionIndex];
      if (!question || question.options.length !== 4) return;

      api.setState((s) => ({
        ...s,
        lifelineStates: {
          ...s.lifelineStates,
          revelio: { ...s.lifelineStates.revelio, usedCount: s.lifelineStates.revelio.usedCount + 1 },
        },
      }));

      const incorrectIndices = question.options
        .map((_, i) => i)
        .filter((i) => i !== question.correctAnswer);

      const shuffled = incorrectIndices.sort(() => Math.random() - 0.5);
      const toHide = shuffled.slice(0, 2);

      api.setState((s) => ({ ...s, hiddenOptions: toHide }));
    });

    api.on("onQuestionStart", () => {
      api.setState((s) => (s.hiddenOptions.length > 0 ? { ...s, hiddenOptions: [] } : s));
    });

    api.on("onRestart", () => {
      api.setState((s) => ({ ...s, hiddenOptions: [] }));
    });
  },
};
