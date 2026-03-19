import type { MultipleChoiceQuestion as MultipleChoiceQuestionType } from "@/types/quiz";
import type { QuizQuestionRendererProps } from "./types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuestionMedia from "@/components/quizlet/QuestionMedia";

interface Props extends QuizQuestionRendererProps {
  question: MultipleChoiceQuestionType;
}

const MultipleChoiceQuestion = ({
  question,
  selectedAnswer,
  onSelect,
  answered = false,
  mapHighlight,
  felixActive,
  hiddenOptions = [],
}: Props) => {
  const getOptionClass = (index: number) => {
    if (selectedAnswer === null) {
      const isHighlighted = mapHighlight === index;
      return isHighlighted ? "ring-2 ring-primary bg-primary/10" : "";
    }
    if (felixActive && index === selectedAnswer) return "border-green-500 bg-green-500/10";
    if (index === question.correctAnswer) return "border-green-500 bg-green-500/10";
    if (index === selectedAnswer) return "border-destructive bg-destructive/10";
    return "opacity-60";
  };

  return (
    <Card>
      <CardHeader>
        <QuestionMedia image={question.image} />
        <p className="text-lg font-medium">{question.question}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {question.options.map((opt, index) => {
          const isHidden = hiddenOptions.includes(index);
          if (isHidden) return null;
          return (
            <Button
              key={opt.id}
              variant="outline"
              className={`justify-start text-left h-auto py-3 ${getOptionClass(index)}`}
              disabled={answered}
              onClick={() => onSelect(index)}
            >
              {opt.text}
            </Button>
          );
        })}
        {answered && question.explanation && (
          <p className="text-sm text-muted-foreground mt-3">{question.explanation}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MultipleChoiceQuestion;
