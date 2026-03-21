import { BookOpen, RotateCcw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ActionButtonsProps {
  onPlayAgain: () => void;
  onReviewAnswers: () => void;
  onShareCard: () => void;
  className?: string;
}

export function ActionButtons({
  onPlayAgain,
  onReviewAnswers,
  onShareCard,
  className,
}: ActionButtonsProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center", className)}>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="min-h-12 w-full sm:w-auto gap-2 rounded-xl border-border/60"
        onClick={onPlayAgain}
      >
        <RotateCcw className="h-4 w-4" aria-hidden />
        Play again
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="min-h-12 w-full sm:w-auto gap-2 rounded-xl"
        onClick={onReviewAnswers}
      >
        <BookOpen className="h-4 w-4" aria-hidden />
        Review answers
      </Button>
      <Button
        type="button"
        size="lg"
        className="min-h-12 w-full sm:w-auto gap-2 rounded-xl btn-primary-gold"
        onClick={onShareCard}
      >
        <Share2 className="h-4 w-4" aria-hidden />
        Share card
      </Button>
    </div>
  );
}
