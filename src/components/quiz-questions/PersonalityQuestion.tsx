import type { PersonalityQuestion as PersonalityQuestionType } from "@/types/quiz";
import type { QuizQuestionRendererProps } from "./types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuestionMedia from "@/components/quizlet/QuestionMedia";

interface Props extends QuizQuestionRendererProps {
  question: PersonalityQuestionType;
}

const PersonalityQuestion = ({
  question,
  selectedAnswer,
  onSelect,
  answered = false,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <QuestionMedia image={question?.image} />
        <p className="text-lg font-medium">{question?.question}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {question?.options?.map((opt) => (
          <Button
            key={opt?.id}
            variant="outline"
            className={`justify-start text-left h-auto py-3 ${selectedAnswer === opt?.id ? "ring-2 ring-primary" : ""}`}
            disabled={answered}
            onClick={() => onSelect(opt?.id)}
          >
            {opt?.text}
          </Button>
        ))}
        {answered && question.explanation && (
          <p className="text-sm text-muted-foreground mt-3">{question?.explanation}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalityQuestion;
