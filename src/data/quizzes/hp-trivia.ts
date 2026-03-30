import { Quiz, QuizDifficulty } from "@/types/quiz";

export const HpGuessMoment1: Quiz = {
  id: "hp-guess-moment-1",
  title: "Only 1% Can Identify These Harry Potter Moments From One Clue ⚡",
  difficulty: QuizDifficulty.MEDIUM,
  category: "Harry Potter",
  type: "multiple-choice",
  createdAt: "2026-03-28",
  updatedAt: "2026-03-28",
  image:
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  questions: [
    {
      id: "q1",
      type: "multiple-choice",
      question: "A sock changes everything.",
      image: "",
      options: [
        { id: 0, text: "Dobby is freed by Lucius Malfoy" },
        { id: 1, text: "Harry receives socks for Christmas" },
        { id: 2, text: "Ron loses his socks in the Burrow" },
        { id: 3, text: "House-elves get new uniforms" },
      ],
      correctAnswer: 0,
      hint: "Think Chamber of Secrets and a clever trick.",
      explanation:
        "Harry tricks Lucius Malfoy into giving Dobby a sock, which frees him since house-elves are bound by clothing.",
    },
    {
      id: "q2",
      type: "multiple-choice",
      question: "A mirror shows what you desire most.",
      image: "",
      options: [
        { id: 0, text: "Mirror of Erised scene" },
        { id: 1, text: "Pensieve memory sequence" },
        { id: 2, text: "Time-Turner moment" },
        { id: 3, text: "Room of Requirement reveal" },
      ],
      correctAnswer: 0,
      hint: "Harry sees something deeply personal here.",
      explanation:
        "The Mirror of Erised shows one's deepest desires — Harry sees his parents, highlighting his longing for family.",
    },
    {
      id: "q3",
      type: "multiple-choice",
      question: "A diary writes back.",
      image: "",
      options: [
        { id: 0, text: "Rita Skeeter’s notes" },
        { id: 1, text: "Tom Riddle’s diary" },
        { id: 2, text: "Dumbledore’s journal" },
        { id: 3, text: "Hermione’s homework notes" },
      ],
      correctAnswer: 1,
      hint: "This object is more dangerous than it looks.",
      explanation:
        "Tom Riddle’s diary is a Horcrux that communicates with Ginny and eventually manifests a memory of young Voldemort.",
    },
    {
      id: "q4",
      type: "multiple-choice",
      question: "A name appears unexpectedly in a magical cup.",
      image: "",
      options: [
        { id: 0, text: "Sorting Hat ceremony" },
        { id: 1, text: "Goblet of Fire selection" },
        { id: 2, text: "Triwizard scoring system" },
        { id: 3, text: "Potion competition" },
      ],
      correctAnswer: 1,
      hint: "Harry wasn’t supposed to be part of this.",
      explanation:
        "Harry’s name emerges from the Goblet of Fire, forcing him into the dangerous Triwizard Tournament.",
    },
    {
      id: "q5",
      type: "multiple-choice",
      question: "Three brothers meet Death on a lonely road.",
      image: "",
      options: [
        { id: 0, text: "Deathly Hallows tale" },
        { id: 1, text: "Gaunt family story" },
        { id: 2, text: "Founders of Hogwarts legend" },
        { id: 3, text: "Marauders backstory" },
      ],
      correctAnswer: 0,
      hint: "A story Xenophilius would proudly tell.",
      explanation:
        "This is the Tale of the Three Brothers, introducing the Deathly Hallows — Elder Wand, Resurrection Stone, and Invisibility Cloak.",
    },
    {
      id: "q6",
      type: "multiple-choice",
      question: "A stag appears just in time.",
      image: "",
      options: [
        { id: 0, text: "James Potter saving Harry" },
        { id: 1, text: "Harry casting Patronus by the lake" },
        { id: 2, text: "Snape’s Patronus reveal" },
        { id: 3, text: "Dumbledore summoning a Patronus" },
      ],
      correctAnswer: 1,
      hint: "Time travel plays a role here.",
      explanation:
        "Harry realizes he himself cast the stag Patronus to save Sirius and his past self, completing the time loop.",
    },
    {
      id: "q7",
      type: "multiple-choice",
      question: "A pink-clad professor enforces silence.",
      image: "",
      options: [
        { id: 0, text: "McGonagall disciplining students" },
        { id: 1, text: "Umbridge’s detention rules" },
        { id: 2, text: "Trelawney’s class" },
        { id: 3, text: "Snape’s potion lecture" },
      ],
      correctAnswer: 1,
      hint: "“I must not tell lies.”",
      explanation:
        "Dolores Umbridge punishes students using a blood quill, forcing Harry to write lines that carve into his hand.",
    },
    {
      id: "q8",
      type: "multiple-choice",
      question: "A dragon guards a vault deep underground.",
      image: "",
      options: [
        { id: 0, text: "Gringotts escape scene" },
        { id: 1, text: "Triwizard first task" },
        { id: 2, text: "Hagrid’s lesson" },
        { id: 3, text: "Forbidden Forest encounter" },
      ],
      correctAnswer: 0,
      hint: "Break-in, not a tournament.",
      explanation:
        "Harry, Ron, and Hermione escape Gringotts on a dragon after breaking into Bellatrix’s vault.",
    },
    {
      id: "q9",
      type: "multiple-choice",
      question: "A map insults its user before revealing secrets.",
      image: "",
      options: [
        { id: 0, text: "Marauder’s Map activation" },
        { id: 1, text: "Daily Prophet article" },
        { id: 2, text: "Howler message" },
        { id: 3, text: "Weasley twins prank" },
      ],
      correctAnswer: 0,
      hint: "“I solemnly swear…”",
      explanation:
        "The Marauder’s Map initially insults Snape but later reveals all of Hogwarts’ secrets and moving individuals.",
    },
    {
      id: "q10",
      type: "multiple-choice",
      question: "A sword appears to someone in need.",
      image: "",
      options: [
        { id: 0, text: "Godric Gryffindor’s sword in the Sorting Hat" },
        { id: 1, text: "Excalibur reference" },
        { id: 2, text: "Dumbledore’s duel" },
        { id: 3, text: "Knight Bus rescue" },
      ],
      correctAnswer: 0,
      hint: "Only true Gryffindors can pull it out.",
      explanation:
        "The Sword of Gryffindor appears from the Sorting Hat to those who demonstrate bravery, like Harry and Neville.",
    },
    {
      id: "q11",
      type: "multiple-choice",
      question: "A kiss becomes life-threatening.",
      image: "",
      options: [
        { id: 0, text: "Dementor’s Kiss" },
        { id: 1, text: "Ron and Lavender scene" },
        { id: 2, text: "Harry and Cho moment" },
        { id: 3, text: "Bill and Fleur wedding" },
      ],
      correctAnswer: 0,
      hint: "Not romantic at all.",
      explanation:
        "The Dementor’s Kiss removes a person’s soul, leaving them alive but empty — one of the darkest punishments in the series.",
    },
    {
      id: "q12",
      type: "multiple-choice",
      question: "A locket whispers your worst fears.",
      image: "",
      options: [
        { id: 0, text: "Horcrux locket destruction" },
        { id: 1, text: "Amortentia potion" },
        { id: 2, text: "Mirror hallucination" },
        { id: 3, text: "Boggart transformation" },
      ],
      correctAnswer: 0,
      hint: "It affects Ron the most.",
      explanation:
        "The Horcrux locket manipulates emotions, projecting Ron’s fears before he destroys it with the sword.",
    },
    {
      id: "q13",
      type: "multiple-choice",
      question: "A wand chooses its true master without words.",
      image: "",
      options: [
        { id: 0, text: "Elder Wand allegiance shift" },
        { id: 1, text: "Ollivander shop scene" },
        { id: 2, text: "Harry buying his wand" },
        { id: 3, text: "Dumbledore’s duel" },
      ],
      correctAnswer: 0,
      hint: "Power changes hands without killing.",
      explanation:
        "The Elder Wand’s loyalty changes when Draco disarms Dumbledore, and later Harry disarms Draco — making Harry its true master.",
    },
    {
      id: "q14",
      type: "multiple-choice",
      question: "A forest walk feels like a goodbye.",
      image: "",
      options: [
        { id: 0, text: "Harry walks to his death" },
        { id: 1, text: "Forbidden Forest detention" },
        { id: 2, text: "Aragog’s funeral" },
        { id: 3, text: "Triwizard maze entry" },
      ],
      correctAnswer: 0,
      hint: "He isn’t alone, even though he seems to be.",
      explanation:
        "Harry walks into the Forbidden Forest to face Voldemort, using the Resurrection Stone to see loved ones before sacrificing himself.",
    },
    {
      id: "q15",
      type: "multiple-choice",
      question: "A name spoken aloud triggers danger.",
      image: "",
      options: [
        { id: 0, text: "Taboo curse on Voldemort’s name" },
        { id: 1, text: "Parseltongue opening Chamber" },
        { id: 2, text: "Unbreakable Vow" },
        { id: 3, text: "Prophecy activation" },
      ],
      correctAnswer: 0,
      hint: "Saying it breaks protective spells.",
      explanation:
        "During Deathly Hallows, Voldemort’s name is cursed (Taboo), allowing Death Eaters to track anyone who says it.",
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

  // 🔥 SHARE CARD CONFIG (viral growth)
  shareCardConfig: {
    headline: "I scored {{score}}% in this Harry Potter Guess Moment Quiz 🧙‍♂️",
    tagline: "Only 1% can identify these moments from one clue ⚡",
    challengeLine: "I challenge you to beat my score!",
    passMark: 70,
    themes: ["light", "dark", "fun"],
    defaultTheme: "light",
  },
};
