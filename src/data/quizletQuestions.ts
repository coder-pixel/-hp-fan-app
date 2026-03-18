export interface QuizletQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  image?: string;
  hint?: string;
}

export const quizletQuestions: QuizletQuestion[] = [
  {
    id: 1,
    question: "Who killed Bellatrix Lestrange?",
    options: ["Harry Potter", "Molly Weasley", "Neville Longbottom", "Ginny Weasley"],
    correctAnswer: 1,
    hint: "A fierce mother's love proved to be the most powerful weapon.",
  },
  {
    id: 2,
    question: "What is the core of Harry's wand?",
    options: ["Dragon Heartstring", "Unicorn Hair", "Phoenix Feather", "Thestral Tail"],
    correctAnswer: 2,
    hint: "This creature is reborn from ashes — and one very famous specimen lives at Hogwarts.",
  },
  {
    id: 3,
    question: "Who is the Half-Blood Prince?",
    options: ["Draco Malfoy", "Tom Riddle", "Severus Snape", "Albus Dumbledore"],
    correctAnswer: 2,
    hint: "This wizard's mother was named Eileen Prince.",
  },
  {
    id: 4,
    question: "What potion grants the drinker luck?",
    options: ["Polyjuice Potion", "Amortentia", "Felix Felicis", "Veritaserum"],
    correctAnswer: 2,
    hint: "Its name comes from Latin words meaning 'lucky' and 'happy'.",
  },
  {
    id: 5,
    question: "What is the name of Hagrid's three-headed dog?",
    options: ["Fang", "Fluffy", "Norbert", "Buckbeak"],
    correctAnswer: 1,
    hint: "An ironic name for such a fearsome beast, wouldn't you say?",
  },
  {
    id: 6,
    question: "Which Horcrux was destroyed first?",
    options: ["The Locket", "The Diary", "The Ring", "The Cup"],
    correctAnswer: 1,
    hint: "Harry encountered this object in his second year at Hogwarts.",
  },
  {
    id: 7,
    question: "What spell disarms an opponent?",
    options: ["Stupefy", "Expelliarmus", "Petrificus Totalus", "Sectumsempra"],
    correctAnswer: 1,
    hint: "Harry's signature spell — it saved him more than once against the Dark Lord.",
  },
  {
    id: 8,
    question: "Who gave Harry the Invisibility Cloak?",
    options: ["Sirius Black", "Hagrid", "Albus Dumbledore", "Remus Lupin"],
    correctAnswer: 2,
    hint: "This wizard guided Harry through much of his Hogwarts journey.",
  },
  {
    id: 9,
    question: "What position does Harry play in Quidditch?",
    options: ["Chaser", "Beater", "Keeper", "Seeker"],
    correctAnswer: 3,
    hint: "This player's sole job is to catch a tiny golden ball.",
  },
  {
    id: 10,
    question: "What is Voldemort's real name?",
    options: ["Marvolo Gaunt", "Tom Riddle", "Salazar Slytherin", "Gellert Grindelwald"],
    correctAnswer: 1,
    hint: "He shares his name with his Muggle father.",
  },
];
