/** User module types — fully decoupled from quiz engine */

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  joinedAt: string;
}

export interface QuizAttempt {
  id: string;
  quizTitle: string;
  score: number;
  total: number;
  accuracy: number;
  date: string;
}

export interface UserStats {
  totalQuizzes: number;
  averageScore: number;
  bestScore: number;
  accuracy: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatarUrl?: string;
  score: number;
  quizzes: number;
}

export interface SavedQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  quizTitle: string;
  savedAt: string;
}

export interface SavedQuiz {
  id: string;
  title: string;
  questionCount: number;
  savedAt: string;
}

export interface UserSettings {
  darkMode: boolean;
  soundEnabled: boolean;
  notifications: boolean;
}
