import type { Quiz } from "@/types/quiz";
import { HpGuessMoment1, hpShortQuiz, hpMediumHard1 } from "./harry-potter";

/** All quizzes grouped for listing / routing; mirrors legacy `@/data/quizzes` export. */
export const quizzes: Quiz[] = [HpGuessMoment1, hpMediumHard1, hpShortQuiz];

export * from "./harry-potter";
