import type { TrueFalseQuestion as TrueFalseQuestionType } from "@/types/quiz";
import type { QuizQuestionRendererProps } from "./types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuestionMedia from "@/components/quiz/QuestionMedia";

interface Props extends QuizQuestionRendererProps {
  question: TrueFalseQuestionType;
}

const TrueFalseQuestion = ({
  question,
  selectedAnswer,
  onSelect,
  answered = false,
}: Props) => {
  const selected = selectedAnswer === 1 ? true : selectedAnswer === 0 ? false : null;

  return (
    <Card>
      <CardHeader>
        <QuestionMedia image={question.image} />
        <p className="text-lg font-medium">{question.question}</p>
      </CardHeader>
      <CardContent className="flex gap-3">
        <Button
          variant={selected === true ? "default" : "outline"}
          disabled={answered}
          onClick={() => onSelect(1)}
        >
          True
        </Button>
        <Button
          variant={selected === false ? "default" : "outline"}
          disabled={answered}
          onClick={() => onSelect(0)}
        >
          False
        </Button>
        {answered && question.explanation && (
          <p className="text-sm text-muted-foreground w-full mt-3">{question.explanation}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TrueFalseQuestion;
