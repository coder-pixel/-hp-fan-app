export {
  registerQuizStrategy,
  resolveQuizStrategy,
  listRegisteredQuizStrategies,
  DEFAULT_QUIZ_STRATEGY_ID,
} from "./strategyRegistry";
export {
  registerQuizTheme,
  resolveQuizThemeRenderer,
  listRegisteredQuizThemes,
} from "./themeRegistry";
export { DEFAULT_QUIZ_THEME_ID, HARRY_POTTER_THEME_ID } from "./themeConstants";
export type { QuizThemeRenderer, QuizThemeRendererProps } from "./themeTypes";
