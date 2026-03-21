import type { ImageGuessQuestion as ImageGuessQuestionType } from "@/types/quiz";
import type { QuizQuestionRendererProps } from "./types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props extends QuizQuestionRendererProps {
  question: ImageGuessQuestionType;
}

const ImageGuessQuestion = ({
  question,
  selectedAnswer,
  onSelect,
  answered = false,
}: Props) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim()) onSelect(input.trim());
  };

  return (
    <Card>
      <CardHeader>
        {question.image && (
          <div className="flex justify-center mb-3">
            <img
              src={question.image}
              alt="Guess who or what"
              className="max-h-48 rounded-lg object-contain border"
            />
          </div>
        )}
        <p className="text-lg font-medium">{question.question}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {!answered ? (
          <>
            <Input
              placeholder="Your answer..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <Button onClick={handleSubmit} disabled={!input.trim()}>
              Submit
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Answer: {question.answer}
            {question.explanation && ` — ${question.explanation}`}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageGuessQuestion;
