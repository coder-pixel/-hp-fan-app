import type { QuizThemeRenderer } from "./themeTypes";
import { HarryPotterQuizRenderer } from "@/themes/harry-potter";
import { DEFAULT_QUIZ_THEME_ID, HARRY_POTTER_THEME_ID } from "./themeConstants";

const themes: Record<string, QuizThemeRenderer> = {
  [HARRY_POTTER_THEME_ID]: HarryPotterQuizRenderer,
};

export function registerQuizTheme(themeId: string, renderer: QuizThemeRenderer): void {
  themes[themeId] = renderer;
}

export function resolveQuizThemeRenderer(themeId: string | undefined): QuizThemeRenderer {
  if (themeId && themes[themeId]) return themes[themeId];
  return themes[DEFAULT_QUIZ_THEME_ID];
}

export function listRegisteredQuizThemes(): string[] {
  return Object.keys(themes);
}
