import { Quiz, QuizDifficulty } from "@/types/quiz";

export const hpMediumHard1: Quiz = {
  id: "hp-medium-hard-1",
  title: "Only True Potterheads Can Score 80%+ in This Quiz ⚡",
  difficulty: QuizDifficulty.MEDIUM,
  category: "Harry Potter",
  type: "multiple-choice",
  createdAt: "2026-03-28",
  updatedAt: "2026-03-28",

  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "What form does Hermione Granger's Patronus take?",
      image: "",
      options: [
        { id: 0, text: "Doe" },
        { id: 1, text: "Otter" },
        { id: 2, text: "Cat" },
        { id: 3, text: "Hare" },
      ],
      correctAnswer: 1,
      hint: "It’s a small, playful animal — and reflects Hermione’s personality.",
      explanation:
        "Hermione’s Patronus is an otter, which symbolizes intelligence, curiosity, and playfulness — traits she consistently shows throughout the series.",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question: "Which Horcrux was destroyed by Ron Weasley?",
      image: "",
      options: [
        { id: 0, text: "Nagini" },
        { id: 1, text: "Tom Riddle's Diary" },
        { id: 2, text: "Slytherin's Locket" },
        { id: 3, text: "Hufflepuff's Cup" },
      ],
      correctAnswer: 2,
      hint: "Think of the Horcrux they retrieved from Umbridge.",
      explanation:
        "Ron destroys Slytherin’s locket using the Sword of Gryffindor after overcoming the Horcrux’s psychological attack on his insecurities.",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "What is the core of Harry Potter’s wand?",
      image: "",
      options: [
        { id: 0, text: "Dragon heartstring" },
        { id: 1, text: "Phoenix feather" },
        { id: 2, text: "Unicorn hair" },
        { id: 3, text: "Thestral hair" },
      ],
      correctAnswer: 1,
      hint: "It connects him directly to Dumbledore’s companion.",
      explanation:
        "Harry’s wand contains a phoenix feather from Fawkes, the same phoenix that provided the core for Voldemort’s wand — linking their destinies.",
    },
    {
      id: "q4",
      type: "multiple-choice",
      question: "Who was the Half-Blood Prince?",
      image: "",
      options: [
        { id: 0, text: "James Potter" },
        { id: 1, text: "Tom Riddle" },
        { id: 2, text: "Severus Snape" },
        { id: 3, text: "Sirius Black" },
      ],
      correctAnswer: 2,
      hint: "The name comes from his mother’s lineage.",
      explanation:
        "Severus Snape called himself the Half-Blood Prince because his mother was Eileen Prince, and he was a half-blood wizard.",
    },
    {
      id: "q5",
      type: "multiple-choice",
      question: "Which spell is used to erase memories?",
      image: "",
      options: [
        { id: 0, text: "Obliviate" },
        { id: 1, text: "Expelliarmus" },
        { id: 2, text: "Confundo" },
        { id: 3, text: "Legilimens" },
      ],
      correctAnswer: 0,
      hint: "Gilderoy Lockhart used it… unsuccessfully.",
      explanation:
        "Obliviate is the Memory Charm used to erase memories, famously backfiring on Lockhart when Ron’s broken wand caused it to hit him instead.",
    },
    {
      id: "q6",
      type: "multiple-choice",
      question: "What position does Harry play in Quidditch?",
      image: "",
      options: [
        { id: 0, text: "Chaser" },
        { id: 1, text: "Beater" },
        { id: 2, text: "Seeker" },
        { id: 3, text: "Keeper" },
      ],
      correctAnswer: 2,
      hint: "He chases something much smaller than a Quaffle.",
      explanation:
        "Harry is the Seeker, responsible for catching the Golden Snitch — often deciding the outcome of the match.",
    },
    {
      id: "q7",
      type: "multiple-choice",
      question: "Who killed Bellatrix Lestrange?",
      image: "",
      options: [
        { id: 0, text: "Ginny Weasley" },
        { id: 1, text: "Molly Weasley" },
        { id: 2, text: "Hermione Granger" },
        { id: 3, text: "Luna Lovegood" },
      ],
      correctAnswer: 1,
      hint: "A protective mother stepped in.",
      explanation:
        "Molly Weasley kills Bellatrix during the Battle of Hogwarts after Bellatrix threatens Ginny, delivering one of the most iconic moments in the series.",
    },
    {
      id: "q8",
      type: "multiple-choice",
      question: "What is the name of Hagrid’s half-brother?",
      image: "",
      options: [
        { id: 0, text: "Grawp" },
        { id: 1, text: "Aragog" },
        { id: 2, text: "Fang" },
        { id: 3, text: "Norbert" },
      ],
      correctAnswer: 0,
      hint: "He’s a giant — literally.",
      explanation:
        "Grawp is Hagrid’s giant half-brother, introduced in Order of the Phoenix and later helps during the Battle of Hogwarts.",
    },
    {
      id: "q9",
      type: "multiple-choice",
      question: "Which potion gives the drinker extreme luck?",
      image: "",
      options: [
        { id: 0, text: "Polyjuice Potion" },
        { id: 1, text: "Felix Felicis" },
        { id: 2, text: "Amortentia" },
        { id: 3, text: "Draught of Peace" },
      ],
      correctAnswer: 1,
      hint: "Also known as ‘liquid luck’.",
      explanation:
        "Felix Felicis grants the drinker unusually good luck for a limited time, helping Harry retrieve Slughorn’s memory.",
    },
    {
      id: "q10",
      type: "multiple-choice",
      question: "Who destroyed Nagini?",
      image: "",
      options: [
        { id: 0, text: "Harry Potter" },
        { id: 1, text: "Neville Longbottom" },
        { id: 2, text: "Ron Weasley" },
        { id: 3, text: "Snape" },
      ],
      correctAnswer: 1,
      hint: "A character who showed massive growth by the end.",
      explanation:
        "Neville Longbottom kills Nagini with the Sword of Gryffindor, destroying the final Horcrux and proving his bravery.",
    },
    {
      id: "q11",
      type: "multiple-choice",
      question: "What does the Marauder’s Map reveal?",
      image: "",
      options: [
        { id: 0, text: "Future events" },
        { id: 1, text: "Hidden horcruxes" },
        { id: 2, text: "All people's real-time locations" },
        { id: 3, text: "Spell weaknesses" },
      ],
      correctAnswer: 2,
      hint: "It shows more than just secret passages.",
      explanation:
        "The Marauder’s Map reveals every person’s real-time location within Hogwarts, making it one of the most powerful tracking tools in the wizarding world.",
    },
    {
      id: "q12",
      type: "multiple-choice",
      question: "Which house was Luna Lovegood in?",
      image: "",
      options: [
        { id: 0, text: "Hufflepuff" },
        { id: 1, text: "Ravenclaw" },
        { id: 2, text: "Slytherin" },
        { id: 3, text: "Gryffindor" },
      ],
      correctAnswer: 1,
      hint: "Known for wit, creativity, and individuality.",
      explanation:
        "Luna belongs to Ravenclaw, a house that values intelligence and originality — perfectly matching her unique personality.",
    },
    {
      id: "q13",
      type: "multiple-choice",
      question: "What magical object stores memories?",
      image: "",
      options: [
        { id: 0, text: "Pensieve" },
        { id: 1, text: "Mirror of Erised" },
        { id: 2, text: "Time Turner" },
        { id: 3, text: "Deluminator" },
      ],
      correctAnswer: 0,
      hint: "Dumbledore uses it frequently.",
      explanation:
        "A Pensieve allows witches and wizards to store and revisit memories, playing a crucial role in uncovering Voldemort’s past.",
    },
    {
      id: "q14",
      type: "multiple-choice",
      question: "What is Voldemort’s snake called?",
      image: "",
      options: [
        { id: 0, text: "Basilisk" },
        { id: 1, text: "Nagini" },
        { id: 2, text: "Serpens" },
        { id: 3, text: "Naga" },
      ],
      correctAnswer: 1,
      hint: "Also one of his Horcruxes.",
      explanation:
        "Nagini is Voldemort’s loyal snake and one of his Horcruxes, making her essential to his immortality.",
    },
    {
      id: "q15",
      type: "multiple-choice",
      question: "Which creature can only be seen by those who have seen death?",
      image: "",
      options: [
        { id: 0, text: "Hippogriff" },
        { id: 1, text: "Dementor" },
        { id: 2, text: "Thestral" },
        { id: 3, text: "Boggart" },
      ],
      correctAnswer: 2,
      hint: "They pull the Hogwarts carriages.",
      explanation:
        "Thestrals are invisible to those who haven’t witnessed death, symbolizing a deep understanding of loss and mortality.",
    },
  ],

  // 🔥 LIFELINES CONFIG (HP themed)
  lifelineConfig: {
    timer: {
      enabled: true,
      secondsPerQuestion: 30,
    },
    maraudersMap: {
      enabled: false,
      maxUsagePerGame: 2,
      usageCount: 0,
    },
    askDumbledore: {
      enabled: true,
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
      maxUsagePerGame: 2,
      usageCount: 0,
    },
    freezeTime: {
      enabled: false,
      maxUsagePerGame: 1,
      usageCount: 0,
    },
  },

  // 🔊 SOUND CONFIG
  sounds: {
    enabled: true,
    correct: true,
    wrong: true,
    timerTickSubtle: true,
    timerPulseLow: true,
    timeout: true,
  },

  // 📊 RESULTS PAGE CONFIG (engagement heavy)
  // resultsPageConfig: {
  //   emotionalBandsConfig: [
  //     {
  //       minPercent: 90,
  //       message:
  //         "🧙‍♂️ You are basically Albus Dumbledore. Are you hiding a Horcrux we should know about?",
  //     },
  //     {
  //       minPercent: 75,
  //       message:
  //         "⚡ Certified Potterhead! You could survive Hogwarts without dying in the first movie.",
  //     },
  //     {
  //       minPercent: 50,
  //       message: "📚 Not bad! But Hermione would still judge you silently.",
  //     },
  //     {
  //       minPercent: 30,
  //       message:
  //         "🪄 You tried… but even a first-year knows more spells than this.",
  //     },
  //     {
  //       minPercent: 0,
  //       message: "💀 You belong in the Muggle Studies class… permanently.",
  //     },
  //   ],
  //   socialShareConfig: {
  //     whatsapp: { enabled: true },
  //     twitter: { enabled: true },
  //     facebook: { enabled: true },
  //   },
  // },

  // 🔥 SHARE CARD CONFIG (viral growth)
  shareCardConfig: {
    headline: "I scored {{score}}% in this Harry Potter Quiz 🧙‍♂️",
    tagline: "Only true Potterheads can score 80%+ ⚡",
    challengeLine: "Can you beat my score?",
    passMark: 70,
    themes: ["light", "dark", "fun"],
    defaultTheme: "dark",
  },
};
