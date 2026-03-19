import type { OrderQuestion as OrderQuestionType } from "@/types/quiz";
import type { QuizQuestionRendererProps } from "./types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuestionMedia from "@/components/quizlet/QuestionMedia";

interface Props extends QuizQuestionRendererProps {
  question: OrderQuestionType;
}

const OrderQuestion = ({
  question,
  selectedAnswer,
  onSelect,
  answered = false,
}: Props) => {
  const order = (selectedAnswer as number[] | null) ?? question.correctOrder.map((_, i) => i);

  const move = (from: number, to: number) => {
    const next = [...order];
    const [removed] = next.splice(from, 1);
    next.splice(to, 0, removed);
    onSelect(next);
  };

  return (
    <Card>
      <CardHeader>
        <QuestionMedia image={question.image} />
        <p className="text-lg font-medium">{question.question}</p>
        <p className="text-sm text-muted-foreground">Arrange in the correct order.</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {order.map((itemIndex, position) => (
          <div key={itemIndex} className="flex items-center gap-2">
            <span className="text-muted-foreground w-6">{position + 1}.</span>
            <span className="flex-1 rounded border bg-muted/30 px-3 py-2 text-sm">
              {question.items[itemIndex]}
            </span>
            {!answered && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={position === 0}
                  onClick={() => move(position, position - 1)}
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={position === order.length - 1}
                  onClick={() => move(position, position + 1)}
                >
                  ↓
                </Button>
              </>
            )}
          </div>
        ))}
        {answered && question.explanation && (
          <p className="text-sm text-muted-foreground mt-3">{question.explanation}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderQuestion;
