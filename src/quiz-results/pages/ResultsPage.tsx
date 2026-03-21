import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ActionButtons } from "../components/ActionButtons";
import { PerformanceBadge } from "../components/PerformanceBadge";
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
  const { percent, emotionalMessage, performanceLabel } = useResultData(data, config);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn("w-full max-w-xl mx-auto space-y-8", className)}
    >
      <div className="p-6 space-y-8 sm:p-10 sm:glass-card">
        <ResultHeader
          emotionalMessage={emotionalMessage}
          resultTag={config?.resultTag}
        />

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center sm:gap-10">
          <ScoreVisualizer score={data?.score} total={data?.total} percent={percent} />
          <PerformanceBadge label={performanceLabel ?? ""} percent={percent} className="sm:mt-4" />
        </div>

        <ActionButtons
          onPlayAgain={onPlayAgain}
          onReviewAnswers={onReviewAnswers}
          onShareCard={onShareCard}
        />
      </div>
    </motion.div>
  );
}
