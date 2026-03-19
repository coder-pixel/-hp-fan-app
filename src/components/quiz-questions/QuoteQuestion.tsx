import type { QuoteQuestion as QuoteQuestionType } from "@/types/quiz";
import type { QuizQuestionRendererProps } from "./types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuestionMedia from "@/components/quizlet/QuestionMedia";

interface Props extends QuizQuestionRendererProps {
  question: QuoteQuestionType;
}

const QuoteQuestion = ({
  question,
  selectedAnswer,
  onSelect,
  answered = false,
}: Props) => {
  const options = question.options ?? [
    { id: 0, text: question.correctAnswer },
  ];

  return (
    <Card>
      <CardHeader>
        <QuestionMedia image={question.image} />
        <blockquote className="text-lg italic border-l-4 border-primary pl-4 my-2">
          &ldquo;{question.quote}&rdquo;
        </blockquote>
        <p className="text-base font-medium">Who said it?</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {options.map((opt) => (
          <Button
            key={opt.id}
            variant="outline"
            className={`justify-start text-left ${selectedAnswer === opt.id ? "ring-2 ring-primary" : ""}`}
            disabled={answered}
            onClick={() => onSelect(opt.id)}
          >
            {opt.text}
          </Button>
        ))}
        {answered && question.explanation && (
          <p className="text-sm text-muted-foreground mt-3">{question.explanation}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default QuoteQuestion;
