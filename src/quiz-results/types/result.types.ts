/**
 * Plug-and-play result models. Pass plain objects from any quiz engine or API.
 */

export interface ResultAnswer {
  question: string;
  questionType?: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string;
  explanation?: string;
}

export interface ResultData {
  score: number;
  total: number;
  answers: ResultAnswer[];
}

export type ShareCardTheme = "light" | "dark" | "fun";

export interface EmotionalBand {
  /** Inclusive minimum percent (0–100). Higher bands listed first when sorting. */
  minPercent: number;
  message: string;
}

export interface PerformanceBand {
  minPercent: number;
  label: string;
}

export interface QuizResultsUiConfig {
  quizTitle?: string;
  shareUrl?: string;
  appName?: string;
  emotionalBands?: EmotionalBand[];
  performanceBands?: PerformanceBand[];
  /** Optional flair under the headline (house, archetype, etc.) */
  resultTag?: string;
  shareCard?: {
    headline?: string;
    tagline?: string;
    brandInitials?: string;
    /** If omitted, all three themes are available in the picker */
    themes?: ShareCardTheme[];
    defaultTheme?: ShareCardTheme;
  };
}
