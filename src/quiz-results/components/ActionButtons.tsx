import { RotateCcw, Share2 } from "lucide-react";
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
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:justify-center", className)}>
      <Button
        type="button"
        size="lg"
        className="min-h-14 w-full sm:w-auto gap-2.5 rounded-xl btn-primary-gold text-base font-semibold px-6"
        onClick={onPlayAgain}
      >
        <RotateCcw className="h-5 w-5" aria-hidden />
        Play Again
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="min-h-14 w-full sm:w-auto gap-2.5 rounded-xl border-border/60 bg-card/50 backdrop-blur-sm text-base font-semibold px-6"
        onClick={onReviewAnswers}
      >
        Review Answers
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="min-h-14 w-full sm:w-auto gap-2.5 rounded-xl border-border/60 bg-card/50 backdrop-blur-sm text-base font-semibold px-6"
        onClick={onShareCard}
      >
        <Share2 className="h-5 w-5" aria-hidden />
        Share
      </Button>
    </div>
  );
}
