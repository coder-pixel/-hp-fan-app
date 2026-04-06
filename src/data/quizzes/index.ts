import { HpGuessMoment1 } from "./hp-trivia";
import { hpShortQuiz } from "./hp-short-quiz";
import { hpMediumHard1 } from "./hp-medium-hard-1";
import { philosophersStoneBookQuiz1 } from "./book quizzes/philosphers-stone-1";
import { chamberOfSecretsBookQuiz1 } from "./book quizzes/chamber-of-secrets-1";
import { prisonerOfAzkabaBookQuiz1 } from "./book quizzes/prisoner-of-azkaban-1";
import { gobletOfFireBookQuiz1 } from "./book quizzes/goblet-of-fire-1";
import { orderOfPhoenixBookQuiz1 } from "./book quizzes/order-of-phoenix-1";
import { halfBloodPrinceBookQuiz1 } from "./book quizzes/half-blood-prince-1";
import { deathlyHallowsBookQuiz1 } from "./book quizzes/deathly-hallows-1";

export const quizzes = [
  HpGuessMoment1,
  hpMediumHard1,
  ...(process.env.NODE_ENV === "development" ? [hpShortQuiz] : []),
  philosophersStoneBookQuiz1,
  chamberOfSecretsBookQuiz1,
  prisonerOfAzkabaBookQuiz1,
  gobletOfFireBookQuiz1,
  orderOfPhoenixBookQuiz1,
  halfBloodPrinceBookQuiz1,
  deathlyHallowsBookQuiz1,
];
