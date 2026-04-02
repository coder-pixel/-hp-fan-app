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

/** Mirrors `SocialShareConfig` in quiz types — kept here to avoid circular imports. */
export interface QuizSocialShareUiConfig {
  whatsapp?: { enabled?: boolean; url?: string };
  twitter?: { enabled?: boolean; url?: string };
  facebook?: { enabled?: boolean; url?: string };
}

export interface FeedbackFormConfig {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
}

export interface QuizResultsUiConfig {
  quizTitle?: string;
  shareUrl?: string;
  appName?: string;
  emotionalBands?: EmotionalBand[];
  performanceBands?: PerformanceBand[];
  passMark?: number;
  resultTag?: string;
  socialShare?: QuizSocialShareUiConfig;
  feedbackForm?: FeedbackFormConfig;
  shareCard?: {
    headline?: string;
    challengeLine?: string;
    themes?: ShareCardTheme[];
    defaultTheme?: ShareCardTheme;
  };
}
