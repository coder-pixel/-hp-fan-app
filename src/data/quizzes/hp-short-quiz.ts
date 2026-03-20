import { QuizDifficulty, type Quiz } from "@/types/quiz";

export const hpShortQuiz: Quiz = {
  id: "hp-short-quiz",
  title: "Harry Potter Short Quiz, How Well Do You Know Harry Potter?",
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
  ],
  //   totalQuestions: 10,
  difficulty: QuizDifficulty.EASY,
  category: "Harry Potter",
  type: "multiple-choice",
  lifelineConfig: {
    timer: { enabled: true, secondsPerQuestion: 40 },
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
  sounds: {
    enabled: true,
    correct: true,
    wrong: true,
    timerTickSubtle: true,
    timerPulseLow: true,
    timeout: true,
  },
  emotionalBands: [
    {
      minPercent: 70,
      message: "Dumbledore would be proud of your magical knowledge! 🧙‍♂️✨",
    },
    {
      minPercent: 40,
      message:
        "You're on your way to becoming a true wizard! Keep studying those spells. 🪄",
    },
    {
      minPercent: 0,
      message:
        "Even Filch expected a bit more—but every great wizard starts somewhere! 📚",
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
