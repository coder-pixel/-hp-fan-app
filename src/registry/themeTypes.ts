import type { FC } from "react";
import type { Quiz } from "@/types/quiz";

export interface QuizThemeRendererProps {
  quiz: Quiz;
}

export type QuizThemeRenderer = FC<QuizThemeRendererProps>;
