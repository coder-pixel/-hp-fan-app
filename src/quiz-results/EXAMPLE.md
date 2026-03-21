# Quiz results system — usage

## 1. Minimal props-only flow

```tsx
import { ResultsPage, ReviewPage, type ResultData } from "@/quiz-results";

const data: ResultData = {
  score: 12,
  total: 15,
  answers: [
    {
      question: "What does Obliviate do?",
      options: ["Erases memories", "Freezes a person", "Disarms", "Controls minds"],
      correctAnswer: "Erases memories",
      userAnswer: "Erases memories",
      explanation: "Memory Charm used to erase or modify memories.",
    },
  ],
};

<ResultsPage
  data={data}
  config={{
    quizTitle: "Potter trivia",
    shareUrl: "https://yoursite.com/quiz/hp-1",
    resultTag: "Night Owl Scholar",
    shareCard: {
      headline: "Certified Potterhead 🪄",
      tagline: "I scored 12/15 — can you beat me?",
      challengeLine: "I scored 12/15 — beat that.",
      defaultTheme: "dark",
    },
    socialShare: {
      whatsapp: { enabled: true },
      twitter: { enabled: true },
      facebook: { enabled: true },
    },
  }}
  onPlayAgain={() => {}}
  onReviewAnswers={() => setView("review")}
  onShareCard={() => setView("share")}
/>;
```

## 2. Mapping engine history (this repo)

If you store `answerHistory` when the player leaves each question, map it with `mapHistoryToResultAnswers`:

```tsx
import { mapHistoryToResultAnswers } from "@/quiz-results";
import { QUIZ_TIMEOUT_ANSWER_INDEX } from "@/quiz-engine/constants";

const answers = mapHistoryToResultAnswers(questions, answerHistory, {
  timeoutAnswerIndex: QUIZ_TIMEOUT_ANSWER_INDEX,
  timeoutLabel: "Time's up",
});
```

## 3. Headless helpers

```tsx
import { useResultData, buildViralShareLine } from "@/quiz-results";

const { percent, performanceLabel, emotionalMessage } = useResultData(data, config);
```
