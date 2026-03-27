import type { UserProfile, QuizAttempt, LeaderboardEntry, SavedQuestion, SavedQuiz, UserSettings } from "../types/user.types";

export const mockProfile: UserProfile = {
  id: "u1",
  name: "Harry Potter",
  avatarUrl: "",
  joinedAt: "2025-09-01",
};

export const mockAttempts: QuizAttempt[] = [
  { id: "a1", quizTitle: "Spells & Charms", score: 14, total: 15, accuracy: 93, date: "2026-03-25" },
  { id: "a2", quizTitle: "Potions Master", score: 10, total: 15, accuracy: 67, date: "2026-03-22" },
  { id: "a3", quizTitle: "Magical Creatures", score: 12, total: 15, accuracy: 80, date: "2026-03-18" },
  { id: "a4", quizTitle: "History of Magic", score: 8, total: 15, accuracy: 53, date: "2026-03-10" },
  { id: "a5", quizTitle: "Defence Against Dark Arts", score: 15, total: 15, accuracy: 100, date: "2026-03-05" },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Hermione G.", score: 2450, quizzes: 28 },
  { rank: 2, name: "Luna L.", score: 2100, quizzes: 25 },
  { rank: 3, name: "Harry P.", score: 1980, quizzes: 22 },
  { rank: 4, name: "Neville L.", score: 1740, quizzes: 20 },
  { rank: 5, name: "Ron W.", score: 1580, quizzes: 19 },
  { rank: 6, name: "Ginny W.", score: 1450, quizzes: 17 },
  { rank: 7, name: "Draco M.", score: 1320, quizzes: 16 },
];

export const mockSavedQuestions: SavedQuestion[] = [
  { id: "sq1", question: "What is the incantation for the Patronus Charm?", correctAnswer: "Expecto Patronum", quizTitle: "Spells & Charms", savedAt: "2026-03-24" },
  { id: "sq2", question: "Which potion grants liquid luck?", correctAnswer: "Felix Felicis", quizTitle: "Potions Master", savedAt: "2026-03-20" },
  { id: "sq3", question: "What creature guards the Philosopher's Stone?", correctAnswer: "Fluffy (Three-headed dog)", quizTitle: "Magical Creatures", savedAt: "2026-03-15" },
];

export const mockSavedQuizzes: SavedQuiz[] = [
  { id: "sz1", title: "Spells & Charms", questionCount: 15, savedAt: "2026-03-24" },
  { id: "sz2", title: "Potions Master", questionCount: 15, savedAt: "2026-03-18" },
];

export const defaultSettings: UserSettings = {
  darkMode: true,
  soundEnabled: true,
  notifications: false,
};
