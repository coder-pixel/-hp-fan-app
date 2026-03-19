import { QuizDifficulty, type Quiz } from "@/types/quiz";

export const hermioneTrivia: Quiz = {
  id: "hermione-trivia",
  title: "Hermione Granger Trivia, How Well Do You Know Her?",
  questions: [
    {
      id: "question-1",
      question: "What is Hermione's favorite subject?",
      options: [
        { id: 1, text: "Transfiguration" },
        { id: 2, text: "History of Magic" },
        { id: 3, text: "Charms" },
        { id: 4, text: "Potions" },
      ],
      correctAnswer: 4,
      explanation:
        "Hermione is a natural at potions and has a knack for creating them.",
      hint: "Hermione is a natural at potions and has a knack for creating them.",
      type: "multiple-choice",
    },
    {
      id: "question-2",
      question: "What is Hermione's favorite book?",
      options: [
        { id: 1, text: "Harry Potter and the Philosopher's Stone" },
        { id: 2, text: "Harry Potter and the Chamber of Secrets" },
        { id: 3, text: "Harry Potter and the Prisoner of Azkaban" },
        { id: 4, text: "Harry Potter and the Goblet of Fire" },
      ],
      correctAnswer: 1,
      explanation:
        "Hermione is a big fan of Harry Potter and has read all the books.",
      hint: "Hermione is a big fan of Harry Potter and has read all the books.",
      type: "multiple-choice",
    },
    {
      id: "question-3",
      question: "What is Hermione's favorite house?",
      options: [
        { id: 1, text: "Gryffindor" },
        { id: 2, text: "Hufflepuff" },
        { id: 3, text: "Ravenclaw" },
        { id: 4, text: "Slytherin" },
      ],
      correctAnswer: 2,
      explanation:
        "Hermione is a big fan of Hufflepuff and has always been a good friend of the house.",
      hint: "Hermione is a big fan of Hufflepuff and has always been a good friend of the house.",
      type: "multiple-choice",
    },
    {
      id: "question-4",
      question: "What is Hermione's favorite pet?",
      options: [
        { id: 1, text: "Hedwig" },
        { id: 2, text: "Owl" },
        { id: 3, text: "Cat" },
        { id: 4, text: "Rat" },
      ],
      correctAnswer: 2,
      explanation:
        "Hermione is a big fan of owls and has always been a good friend of the house.",
      hint: "Hermione is a big fan of owls and has always been a good friend of the house.",
      type: "multiple-choice",
    },
    {
      id: "question-5",
      question: "What is Hermione's favorite color?",
      options: [
        { id: 1, text: "Green" },
        { id: 2, text: "Red" },
        { id: 3, text: "Yellow" },
        { id: 4, text: "Blue" },
      ],
      correctAnswer: 1,
      explanation:
        "Hermione is a big fan of green and has always been a good friend of the house.",
      hint: "Hermione is a big fan of green and has always been a good friend of the house.",
      type: "multiple-choice",
    },
    {
      id: "question-6",
      question: "What is Hermione's favorite food?",
      options: [
        { id: 1, text: "Chocolate" },
        { id: 2, text: "Pizza" },
        { id: 3, text: "Ice Cream" },
        { id: 4, text: "Chocolate" },
      ],
      correctAnswer: 1,
      explanation:
        "Hermione is a big fan of chocolate and has always been a good friend of the house.",
      hint: "Hermione is a big fan of chocolate and has always been a good friend of the house.",
      type: "multiple-choice",
    },
    {
      id: "question-7",
      question: "What is Hermione's favorite subject?",
      options: [
        { id: 1, text: "Transfiguration" },
        { id: 2, text: "History of Magic" },
        { id: 3, text: "Charms" },
        { id: 4, text: "Potions" },
      ],
      correctAnswer: 4,
      explanation:
        "Hermione is a big fan of potions and has a knack for creating them.",
      hint: "Hermione is a big fan of potions and has a knack for creating them.",
      type: "multiple-choice",
    },
    {
      id: "question-8",
      question: "What is Hermione's favorite subject?",
      options: [
        { id: 1, text: "Transfiguration" },
        { id: 2, text: "History of Magic" },
        { id: 3, text: "Charms" },
        { id: 4, text: "Potions" },
      ],
      correctAnswer: 4,
      explanation:
        "Hermione is a big fan of potions and has a knack for creating them.",
      hint: "Hermione is a big fan of potions and has a knack for creating them.",
      type: "multiple-choice",
    },
    {
      id: "question-9",
      question: "What is Hermione's favorite subject?",
      options: [
        { id: 1, text: "Transfiguration" },
        { id: 2, text: "History of Magic" },
        { id: 3, text: "Charms" },
        { id: 4, text: "Potions" },
      ],
      correctAnswer: 2,
      explanation:
        "Hermione is a big fan of history and has always been a good friend of the house.",
      hint: "Hermione is a big fan of history and has always been a good friend of the house.",
      type: "multiple-choice",
    },
    {
      id: "question-10",
      question: "What is Hermione's favorite subject?",
      options: [
        { id: 1, text: "Transfiguration" },
        { id: 2, text: "History of Magic" },
        { id: 3, text: "Charms" },
        { id: 4, text: "Potions" },
      ],
      correctAnswer: 2,
      explanation:
        "Hermione is a big fan of history and has always been a good friend of the house.",
      hint: "Hermione is a big fan of history and has always been a good friend of the house.",
      type: "multiple-choice",
    },
  ],
  //   totalQuestions: 10,
  difficulty: QuizDifficulty.EASY,
  category: "Hermione Granger",
  type: "multiple-choice",
  lifelineConfig: {
    timer: { enabled: false, secondsPerQuestion: 40 },
    maraudersMap: {
      enabled: false,
      maxUsagePerGame: 1,
      usageCount: 0,
    },
    askDumbledore: {
      enabled: true,
      maxUsagePerGame: 1,
      usageCount: 0,
    },
    felixFelicis: {
      enabled: false,
      maxUsagePerGame: 1,
      usageCount: 0,
    },
    legilimency: {
      enabled: true,
      maxUsagePerGame: 1,
      usageCount: 0,
    },
    revelio: {
      enabled: true,
      maxUsagePerGame: 1,
      usageCount: 0,
    },
    freezeTime: {
      enabled: true,
      maxUsagePerGame: 1,
      usageCount: 0,
    },
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
