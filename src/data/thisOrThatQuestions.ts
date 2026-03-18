export interface ThisOrThatQuestion {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  votesA: number;
  votesB: number;
  emojiA: string;
  emojiB: string;
}

export const thisOrThatQuestions: ThisOrThatQuestion[] = [
  {
    id: 1,
    question: "Best Hogwarts House?",
    optionA: "Gryffindor",
    optionB: "Slytherin",
    votesA: 63,
    votesB: 37,
    emojiA: "🦁",
    emojiB: "🐍",
  },
  {
    id: 2,
    question: "Who would win?",
    optionA: "Harry",
    optionB: "Voldemort",
    votesA: 72,
    votesB: 28,
    emojiA: "⚡",
    emojiB: "💀",
  },
  {
    id: 3,
    question: "Preferred drink?",
    optionA: "Butterbeer",
    optionB: "Pumpkin Juice",
    votesA: 81,
    votesB: 19,
    emojiA: "🍺",
    emojiB: "🎃",
  },
  {
    id: 4,
    question: "Which school?",
    optionA: "Hogwarts",
    optionB: "Durmstrang",
    votesA: 88,
    votesB: 12,
    emojiA: "🏰",
    emojiB: "⛵",
  },
  {
    id: 5,
    question: "Favourite spell?",
    optionA: "Lumos",
    optionB: "Expecto Patronum",
    votesA: 34,
    votesB: 66,
    emojiA: "💡",
    emojiB: "🦌",
  },
  {
    id: 6,
    question: "Better pet?",
    optionA: "Owl",
    optionB: "Cat",
    votesA: 58,
    votesB: 42,
    emojiA: "🦉",
    emojiB: "🐱",
  },
  {
    id: 7,
    question: "Which broom?",
    optionA: "Firebolt",
    optionB: "Nimbus 2000",
    votesA: 74,
    votesB: 26,
    emojiA: "🔥",
    emojiB: "✨",
  },
  {
    id: 8,
    question: "Best mentor?",
    optionA: "Dumbledore",
    optionB: "Snape",
    votesA: 55,
    votesB: 45,
    emojiA: "🧙",
    emojiB: "🖤",
  },
];
