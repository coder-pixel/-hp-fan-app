import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ActionButtons } from "../components/ActionButtons";
import { FeedbackForm } from "../components/FeedbackForm";
import { ResultHeader } from "../components/ResultHeader";
import { ScoreVisualizer } from "../components/ScoreVisualizer";
import { useResultData } from "../hooks/useResultData";
import type { QuizResultsUiConfig, ResultData } from "../types/result.types";

export interface ResultsPageProps {
  data: ResultData;
  config?: QuizResultsUiConfig;
  onPlayAgain: () => void;
  onReviewAnswers: () => void;
  onShareCard: () => void;
  className?: string;
}

export function ResultsPage({
  data,
  config,
  onPlayAgain,
  onReviewAnswers,
  onShareCard,
  className,
}: ResultsPageProps) {
  const { percent, emotionalMessage } = useResultData(data, config);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn("w-full max-w-xl mx-auto space-y-6", className)}
    >
      <div className="p-5 sm:p-6 glass-card">
        <ResultHeader
          emotionalMessage={emotionalMessage}
          resultTag={config?.resultTag}
        />

        <div className="py-5">
          <ScoreVisualizer score={data?.score} total={data?.total} percent={percent} />
        </div>

        <ActionButtons
          onPlayAgain={onPlayAgain}
          onReviewAnswers={onReviewAnswers}
          onShareCard={onShareCard}
        />

        {config?.feedbackForm?.enabled !== false && (
          <div className="mt-4 border-t border-border/40 pt-4">
            <Dialog>
              <p className="text-xs text-muted-foreground text-center">
                Care to leave a feedback/suggestion?{" "}
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="font-medium text-accent underline underline-offset-4 decoration-accent/50 hover:decoration-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                  >
                    Would really appreciate your help here
                  </button>
                </DialogTrigger>
                .
              </p>

              <DialogContent className="p-0 border-0 bg-transparent shadow-none w-[92vw] max-w-lg sm:w-full">
                <FeedbackForm
                  title={config?.feedbackForm?.title}
                  subtitle={config?.feedbackForm?.subtitle}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </motion.div>
  );
}
