import { QuizDifficulty, type Quiz } from "@/types/quiz";

export const hpTrivia: Quiz = {
  id: "hp-trivia",
  title: "Harry Potter Trivia, Are You a True Fan?",
  questions: [
    {
      id: "question-1",
      question: "Who killed Bellatrix Lestrange?",
      options: [
        { id: 1, text: "Harry Potter" },
        { id: 2, text: "Molly Weasley" },
        { id: 3, text: "Neville Longbottom" },
        { id: 4, text: "Ginny Weasley" },
      ],
      correctAnswer: 2,
      explanation:
        "A fierce mother's love proved to be the most powerful weapon.",
      hint: "A fierce mother's love proved to be the most powerful weapon.",
      type: "multiple-choice",
    },
    {
      id: "question-2",
      question: "What is the core of Harry's wand?",
      options: [
        { id: 1, text: "Dragon Heartstring" },
        { id: 2, text: "Unicorn Hair" },
        { id: 3, text: "Phoenix Feather" },
        { id: 4, text: "Thestral Tail" },
      ],
      correctAnswer: 3,
      explanation:
        "This creature is reborn from ashes — and one very famous specimen lives at Hogwarts.",
      hint: "This creature is reborn from ashes — and one very famous specimen lives at Hogwarts.",
      type: "multiple-choice",
    },
    {
      id: "question-3",
      question: "Who is the Half-Blood Prince?",
      options: [
        { id: 1, text: "Draco Malfoy" },
        { id: 2, text: "Tom Riddle" },
        { id: 3, text: "Severus Snape" },
        { id: 4, text: "Albus Dumbledore" },
      ],
      correctAnswer: 3,
      explanation: "This wizard's mother was named Eileen Prince.",
      hint: "This wizard's mother was named Eileen Prince.",
      type: "multiple-choice",
    },
    {
      id: "question-4",
      question: "What potion grants the drinker luck?",
      options: [
        { id: 1, text: "Polyjuice Potion" },
        { id: 2, text: "Amortentia" },
        { id: 3, text: "Felix Felicis" },
        { id: 4, text: "Veritaserum" },
      ],
      correctAnswer: 3,
      explanation:
        "Its name comes from Latin words meaning 'lucky' and 'happy'.",
      hint: "Its name comes from Latin words meaning 'lucky' and 'happy'.",
      type: "multiple-choice",
    },
    {
      id: "question-5",
      question: "What is the name of Hagrid's three-headed dog?",
      options: [
        { id: 1, text: "Fang" },
        { id: 2, text: "Fluffy" },
        { id: 3, text: "Norbert" },
        { id: 4, text: "Buckbeak" },
      ],
      correctAnswer: 2,
      explanation:
        "An ironic name for such a fearsome beast, wouldn't you say?",
      hint: "An ironic name for such a fearsome beast, wouldn't you say?",
      type: "multiple-choice",
    },
    {
      id: "question-6",
      question: "Which Horcrux was destroyed first?",
      options: [
        { id: 1, text: "The Locket" },
        { id: 2, text: "The Diary" },
        { id: 3, text: "The Ring" },
        { id: 4, text: "The Cup" },
      ],
      correctAnswer: 2,
      explanation:
        "Harry encountered this object in his second year at Hogwarts.",
      hint: "Harry encountered this object in his second year at Hogwarts.",
      type: "multiple-choice",
    },
    {
      id: "question-7",
      question: "What spell disarms an opponent?",
      options: [
        { id: 1, text: "Stupefy" },
        { id: 2, text: "Expelliarmus" },
        { id: 3, text: "Petrificus Totalus" },
        { id: 4, text: "Sectumsempra" },
      ],
      correctAnswer: 2,
      explanation:
        "Harry's signature spell — it saved him more than once against the Dark Lord.",
      hint: "Harry's signature spell — it saved him more than once against the Dark Lord.",
      type: "multiple-choice",
    },
    {
      id: "question-8",
      question: "Who gave Harry the Invisibility Cloak?",
      options: [
        { id: 1, text: "Sirius Black" },
        { id: 2, text: "Hagrid" },
        { id: 3, text: "Albus Dumbledore" },
        { id: 4, text: "Remus Lupin" },
      ],
      correctAnswer: 3,
      explanation:
        "This wizard guided Harry through much of his Hogwarts journey.",
      hint: "This wizard guided Harry through much of his Hogwarts journey.",
      type: "multiple-choice",
    },
    {
      id: "question-9",
      question: "What position does Harry play in Quidditch?",
      options: [
        { id: 1, text: "Chaser" },
        { id: 2, text: "Beater" },
        { id: 3, text: "Keeper" },
        { id: 4, text: "Seeker" },
      ],
      correctAnswer: 4,
      explanation: "This player's sole job is to catch a tiny golden ball.",
      hint: "This player's sole job is to catch a tiny golden ball.",
      type: "multiple-choice",
    },
    {
      id: "question-10",
      question: "What is Voldemort's real name?",
      options: [
        { id: 1, text: "Marvolo Gaunt" },
        { id: 2, text: "Tom Riddle" },
        { id: 3, text: "Salazar Slytherin" },
        { id: 4, text: "Gellert Grindelwald" },
      ],
      correctAnswer: 2,
      explanation: "He shares his name with his Muggle father.",
      hint: "He shares his name with his Muggle father.",
      type: "multiple-choice",
    },
    {
      id: "question-11",
      question: "What is the name of Harry's first pet?",
      options: [
        { id: 1, text: "Hedwig" },
        { id: 2, text: "Scabbers" },
        { id: 3, text: "Crookshanks" },
        { id: 4, text: "Dobby" },
      ],
      correctAnswer: 1,
      explanation: "This owl was Harry's companion from the start.",
      hint: "This owl was Harry's companion from the start.",
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
      enabled: false,
      maxUsagePerGame: 1,
      usageCount: 0,
    },
    felixFelicis: {
      enabled: true,
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
