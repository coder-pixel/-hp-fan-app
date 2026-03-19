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

export interface QuizConfig {
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

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  //   totalQuestions: number;
  difficulty: QuizDifficulty;
  category: string;
  type: "multiple-choice";
  config?: QuizConfig; // impt, used to configure the quiz engine with custom settings, plugins, lifelines, etc.
  createdAt: string;
  updatedAt: string;
}

export interface QuizOption {
  id: number;
  text: string;
  image?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswer: number;
  explanation?: string;
  hint: string;
  image?: string;
  type: "multiple-choice";
}
