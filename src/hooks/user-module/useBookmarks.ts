import { useState, useCallback } from "react";
import type { SavedQuestion, SavedQuiz } from "@/types/user.types";
import { mockSavedQuestions, mockSavedQuizzes } from "@/data/mockUserData";

export function useBookmarks() {
  const [savedQuestions, setSavedQuestions] =
    useState<SavedQuestion[]>(mockSavedQuestions);
  const [savedQuizzes, setSavedQuizzes] =
    useState<SavedQuiz[]>(mockSavedQuizzes);

  const removeQuestion = useCallback((id: string) => {
    setSavedQuestions((q) => q.filter((item) => item.id !== id));
  }, []);

  const removeQuiz = useCallback((id: string) => {
    setSavedQuizzes((q) => q.filter((item) => item.id !== id));
  }, []);

  return { savedQuestions, savedQuizzes, removeQuestion, removeQuiz };
}
