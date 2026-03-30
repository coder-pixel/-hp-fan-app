import { EmotionalBand, ShareCardTheme } from "@/quiz-results";

export enum QuizDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export enum LifelineListEnum {
  MARAUDERS_MAP = "maraudersMap",
  ASK_DUMBLEDORE = "askDumbledore",
  FELIX_FELICIS = "felixFelicis",
  LEGILIMENCY = "legilimency",
  REVELIO = "revelio",
  FREEZE_TIME = "freezeTime",
}

export interface LifelineConfig {
  enabled: boolean;
  maxUsagePerGame: number;
  usageCount: number;
}

export interface QuizPluginsConfig {
  timer?: {
    enabled: boolean;
    secondsPerQuestion: number;
  };
  maraudersMap?: LifelineConfig;
  askDumbledore?: LifelineConfig;
  felixFelicis?: LifelineConfig;
  legilimency?: LifelineConfig;
  revelio?: LifelineConfig;
  freezeTime?: LifelineConfig;
}

/** Per-quiz sound effects toggle. When enabled, timer ticks and answer sounds play. */
export interface QuizSoundsConfig {
  /** Master switch for all quiz sounds. Default true when omitted. */
  enabled: boolean;
  /** Correct-answer sound. Default true when omitted. */
  correct?: boolean;
  /** Wrong-answer sound. Default true when omitted. */
  wrong?: boolean;
  /** Normal timer tick (40s..11s). Default true when omitted. */
  timerTickSubtle?: boolean;
  /** Very-low timer pulse (5s..1s). Default true when omitted. */
  timerPulseLow?: boolean;
  /** Timeout sound when timer hits 0. Default true when omitted. */
  timeout?: boolean;
}

/** Shared fields for all question types (discriminated union base). */
export interface BaseQuestion {
  id: string;
  question: string;
  image?: string;
  hint: string;
  explanation?: string;
}

export interface QuizOption {
  id: number;
  text: string;
  image?: string;
}

/** Multiple-choice: options + single correct answer. Backward compatible with type "multiple-choice". */
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: QuizOption[];
  correctAnswer: number;
}

// /** True/false: two options, one correct. */
// export interface TrueFalseQuestion extends BaseQuestion {
//   type: "true-false";
//   correctAnswer: boolean;
// }

// /** Image guess: image + answer (name/title). */
// export interface ImageGuessQuestion extends BaseQuestion {
//   type: "image-guess";
//   answer: string;
//   /** Optional wrong options for multiple-choice style reveal. */
//   distractors?: string[];
// }

// /** Quote: quote text + who said it / source. */
// export interface QuoteQuestion extends BaseQuestion {
//   type: "quote";
//   quote: string;
//   correctAnswer: string;
//   options?: QuizOption[];
// }

/** Personality: options map to outcomes (e.g. house quiz). */
// export interface PersonalityQuestion extends BaseQuestion {
//   type: "personality";
//   options: QuizOption[];
//   /** Option id -> outcome id for scoring/result. */
//   outcomeMap: Record<number, string>;
// }

/** Order: put items in correct order. */
// export interface OrderQuestion extends BaseQuestion {
//   type: "order";
//   items: string[];
//   /** Correct order: array of indices into items. */
//   correctOrder: number[];
// }

export enum QuizTypesWithCorrectAnswer {
  MULTIPLE_CHOICE = "multiple-choice",
  // TRUE_FALSE = "true-false",
  // QUOTE = "quote",
}

/** Discriminated union of all question types. Add new types here and in the renderer. */
export type QuizQuestion = MultipleChoiceQuestion;
// | TrueFalseQuestion
// | ImageGuessQuestion
// | QuoteQuestion
// | PersonalityQuestion
// | OrderQuestion;

/** Type guard: multiple-choice (backward compatible). */
export function isMultipleChoiceQuestion(
  q: QuizQuestion,
): q is MultipleChoiceQuestion {
  return q.type === "multiple-choice";
}

// export function isTrueFalseQuestion(q: QuizQuestion): q is TrueFalseQuestion {
//   return q.type === "true-false";
// }

// export function isImageGuessQuestion(q: QuizQuestion): q is ImageGuessQuestion {
//   return q.type === "image-guess";
// }

// export function isQuoteQuestion(q: QuizQuestion): q is QuoteQuestion {
//   return q.type === "quote";
// }

// export function isPersonalityQuestion(
//   q: QuizQuestion,
// ): q is PersonalityQuestion {
//   return q.type === "personality";
// }

// export function isOrderQuestion(q: QuizQuestion): q is OrderQuestion {
//   return q.type === "order";
// }

export enum SocialSharePlatform {
  WHATSAPP = "whatsapp",
  TWITTER = "twitter",
  FACEBOOK = "facebook",
}

export type SocialShareConfig = {
  [P in SocialSharePlatform]?: {
    /** Show share button for this platform */
    enabled?: boolean;
    /** Optional override for share URL. If not provided, a default will be used. */
    url?: string;
  };
};

export interface QuizResultsPageConfig {
  emotionalBandsConfig?: EmotionalBand[];
  socialShareConfig?: SocialShareConfig;
}

export interface QuizShareCardConfig {
  headline?: string;
  tagline?: string;
  themes?: ShareCardTheme[];
  defaultTheme?: ShareCardTheme;
  challengeLine?: string;
  passMark?: number; /** Minimum score % to count as “passed” on share card / progress UI. Default 60 when omitted. */
}

export interface Quiz {
  id: string;
  title: string;
  image?: string;
  questions: QuizQuestion[];
  difficulty: QuizDifficulty;
  category: string;
  /** Quiz-level type retained for backward compatibility; questions define their own type. */
  type: "multiple-choice";
  lifelineConfig?: QuizPluginsConfig;
  /** Sound effects (timer, correct/wrong, timeout). Omit or enabled: true to play sounds. */
  sounds?: QuizSoundsConfig;
  resultsPageConfig?: QuizResultsPageConfig; // for quiz results page

  shareCardConfig?: QuizShareCardConfig; // for quiz share card
  createdAt: string;
  updatedAt: string;
}

// export interface Quiz {
//   id: string;
//   title: string;
//   questions: QuizQuestion[];
//   difficulty: QuizDifficulty;
//   category: string;
//   /** Quiz-level type retained for backward compatibility; questions define their own type. */
//   type: "multiple-choice";
//   lifelineConfig?: QuizPluginsConfig;
//   /** Sound effects (timer, correct/wrong, timeout). Omit or enabled: true to play sounds. */
//   sounds?: QuizSoundsConfig;
//   resultsPageConfig?: QuizResultsPageConfig; // for quiz results page

//   shareCardConfig?: QuizShareCardConfig; // for quiz share card
//   createdAt: string;
//   updatedAt: string;
// }

// export interface MultipleChoiceQuestion extends BaseQuestion {
//   type: "multiple-choice";
//   options: QuizOption[];
//   correctAnswer: number;
// }

// export interface QuizOption {
//   id: number;
//   text: string;
//   image?: string;
// }

// export type QuizQuestion = MultipleChoiceQuestion;

// export enum QuizDifficulty {
//   EASY = "easy",
//   MEDIUM = "medium",
//   HARD = "hard",
// }

// export interface QuizPluginsConfig {
//   timer?: {
//     enabled: boolean;
//     secondsPerQuestion: number;
//   };
//   maraudersMap?: LifelineConfig;
//   askDumbledore?: LifelineConfig;
//   felixFelicis?: LifelineConfig;
//   legilimency?: LifelineConfig;
//   revelio?: LifelineConfig;
//   freezeTime?: LifelineConfig;
// }

// export interface LifelineConfig {
//   enabled: boolean;
//   maxUsagePerGame: number;
//   usageCount: number;
// }

// /** Per-quiz sound effects toggle. When enabled, timer ticks and answer sounds play. */
// export interface QuizSoundsConfig {
//   /** Master switch for all quiz sounds. Default true when omitted. */
//   enabled: boolean;
//   /** Correct-answer sound. Default true when omitted. */
//   correct?: boolean;
//   /** Wrong-answer sound. Default true when omitted. */
//   wrong?: boolean;
//   /** Normal timer tick (40s..11s). Default true when omitted. */
//   timerTickSubtle?: boolean;
//   /** Very-low timer pulse (5s..1s). Default true when omitted. */
//   timerPulseLow?: boolean;
//   /** Timeout sound when timer hits 0. Default true when omitted. */
//   timeout?: boolean;
// }

// export interface QuizResultsPageConfig {
//   emotionalBandsConfig?: EmotionalBand[];
//   socialShareConfig?: SocialShareConfig;
// }

// export interface EmotionalBand {
//   /** Inclusive minimum percent (0–100). Higher bands listed first when sorting. */
//   minPercent: number;
//   message: string;
// }

// export type SocialShareConfig = {
//   [P in SocialSharePlatform]?: {
//     /** Show share button for this platform */
//     enabled?: boolean;
//     /** Optional override for share URL. If not provided, a default will be used. */
//     url?: string;
//   };
// };

// export interface QuizShareCardConfig {
//   headline?: string;
//   tagline?: string;
//   themes?: ShareCardTheme[];
//   defaultTheme?: ShareCardTheme;
//   challengeLine?: string;
//   passMark?: number; /** Minimum score % to count as “passed” on share card / progress UI. Default 60 when omitted. */
// }

// export type ShareCardTheme = "light" | "dark" | "fun";
